import { cloneDeep } from 'lodash';

import { GRANDPARENT_ENTRY_PATH_INDEX } from '@/common/constants/bibframe.constants';
import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { StatusType } from '@/common/constants/status.constants';
import { AdvancedFieldType as AdvancedFieldTypeEnum, UI_CONTROLS_LIST } from '@/common/constants/uiControls.constants';
import { getParentEntryUuid } from '@/common/helpers/schema.helper';
import { ISelectedEntries } from '@/common/services/selectedEntries/selectedEntries.interface';
import { IUserValues } from '@/common/services/userValues/userValues.interface';

import { IRecordToSchemaMapping, IRecordToSchemaMappingInit } from './recordToSchemaMapping.interface';

export class RecordToSchemaMappingService implements IRecordToSchemaMapping {
  private updatedSchema: Schema;
  private schemaArray: SchemaEntry[];
  private record: RecordEntry;
  private recordBlocks: RecordBlocksList;
  private currentBlockUri?: string;
  private currentRecordGroupKey?: string;
  private templateMetadata?: ResourceTemplateMetadata[];

  constructor(
    private readonly selectedEntriesService: ISelectedEntries,
    private readonly repeatableFieldsService: ISchemaWithDuplicatesService,
    private readonly userValuesService: IUserValues,
    private readonly commonStatusService: ICommonStatus,
  ) {
    this.updatedSchema = new Map();
    this.schemaArray = [];
    this.record = {};
    this.recordBlocks = [];
  }

  async init({ schema, record, recordBlocks, templateMetadata }: IRecordToSchemaMappingInit) {
    this.updatedSchema = cloneDeep(schema);
    this.schemaArray = schema ? Array.from(this.updatedSchema?.values()) : [];
    this.record = record;
    this.recordBlocks = recordBlocks;
    this.templateMetadata = templateMetadata;

    await this.traverseBlocks();
  }

  get() {
    return this.updatedSchema;
  }

  private processSequentially<T>(items: Iterable<T>, callback: (item: T, index: number) => Promise<void>) {
    return Array.from(items).reduce<Promise<void>>(
      (promise, item, index) => promise.then(() => callback(item, index)),
      Promise.resolve(),
    );
  }

  private async traverseBlocks() {
    await this.processSequentially(this.recordBlocks.values(), async blockUri => {
      this.currentBlockUri = blockUri;
      await this.traverseBlock();
    });
  }

  private async traverseBlock() {
    if (!this.currentBlockUri) return;

    try {
      if (!this.record[this.currentBlockUri]) return;

      await this.processSequentially(
        Object.entries(this.record[this.currentBlockUri]),
        async ([recordKey, recordEntry]) => {
          if (!recordEntry) return;

          await this.processRecordEntry(recordKey, recordEntry as Record<string, unknown>);
        },
      );
    } catch (error) {
      console.error('Cannot apply a record to the schema:', error);
      this.commonStatusService.set('ld.recordMappingToSchema', StatusType.error);
    }
  }

  private async processRecordEntry(recordKey: string, recordEntry: Record<string, unknown>) {
    this.currentRecordGroupKey = recordKey;

    const schemaEntries = this.getSchemaEntries(recordKey);

    await this.processSequentially(Object.entries(recordEntry), async ([recordGroupIndex, recordGroup]) => {
      await this.processRecordGroup(recordGroupIndex, recordEntry, recordGroup, schemaEntries, recordKey);
    });
  }

  private async processRecordGroup(
    recordGroupIndex: string,
    recordEntry: unknown,
    recordGroup: unknown,
    schemaEntries: SchemaEntry[],
    recordKey?: string,
  ) {
    if (!schemaEntries?.length) return;

    // generate repeatable fields
    if (Array.isArray(recordEntry) && recordEntry?.length > 1 && Number.parseInt(recordGroupIndex) !== 0) {
      const schemaEntry = this.getSchemaEntries(recordKey)[Number.parseInt(recordGroupIndex) - 1];
      const newEntryUuid = (await this.repeatableFieldsService?.duplicateEntry(schemaEntry, true)) ?? '';
      this.updatedSchema = this.repeatableFieldsService?.get();
      this.schemaArray = Array.from(this.updatedSchema?.values() || []);

      await this.traverseEntries({
        recordGroup,
        schemaEntry: this.updatedSchema?.get(newEntryUuid),
      });
    } else {
      await this.traverseEntries({
        recordGroup,
        schemaEntry: schemaEntries[0],
      });
    }
  }

  private async traverseEntries({ recordGroup, schemaEntry }: { recordGroup: unknown; schemaEntry?: SchemaEntry }) {
    if (!schemaEntry) return;

    const isDropdown =
      schemaEntry.type === AdvancedFieldTypeEnum.dropdown || schemaEntry.type === AdvancedFieldTypeEnum.enumerated;

    if (isDropdown) {
      if (recordGroup && typeof recordGroup === 'object' && !Array.isArray(recordGroup)) {
        await this.traverseDropdownOptions(recordGroup as Record<string, unknown>, schemaEntry);
      }
    } else {
      await this.traverseGroupsAndUIControls(recordGroup, schemaEntry);
    }
  }

  private async traverseDropdownOptions(recordGroup: Record<string, unknown>, schemaEntry: SchemaEntry) {
    // traverse within the selected record element (find dropdown options and elements ouside dropdown)
    await this.processSequentially(Object.entries(recordGroup), async ([idx, groupElem]) => {
      const dropdownOptionUUID = this.findSchemaDropdownOption(schemaEntry, idx);
      const typedGroupElem = groupElem as Record<string, string[] | RecordBasic[]>;

      if (dropdownOptionUUID) {
        const dropdownOptionEntry = this.updatedSchema?.get(dropdownOptionUUID);
        // iterate within the elements inside the selectedDropdown option
        await this.mapRecordListToSchemaEntry(typedGroupElem, dropdownOptionEntry as SchemaEntry);
      } else {
        await this.mapRecordListToSchemaEntry(typedGroupElem, schemaEntry);
      }
    });
  }

  private async traverseGroupsAndUIControls(recordGroup: unknown, schemaEntry: SchemaEntry) {
    if (UI_CONTROLS_LIST.includes(schemaEntry?.type as AdvancedFieldTypeEnum)) {
      await this.mapRecordValueToSchemaEntry({
        schemaEntry,
        recordKey: this.currentRecordGroupKey as string,
        recordEntryValue: recordGroup as RecordEntryValue,
      });
    } else if (recordGroup && typeof recordGroup === 'object' && !Array.isArray(recordGroup)) {
      // Used for complex groups, which contains a number of subfields
      // traverse within the selected record element (find dropdown options and elements ouside dropdown)
      await this.mapRecordListToSchemaEntry(recordGroup as Record<string, string[] | RecordBasic[]>, schemaEntry);
    }
  }

  private readonly getSchemaEntries = (recordKey?: string) => {
    return this.schemaArray.filter((entry: SchemaEntry) => {
      const isOfSameUri = entry.uriBFLite === recordKey;
      let hasBlockParent = false;
      let hasProperBlock = false;

      entry.path.forEach(parentElemKey => {
        const parentElem = this.updatedSchema?.get(parentElemKey) as SchemaEntry;

        if (parentElem?.uriBFLite === this.currentBlockUri) {
          hasProperBlock = true;
        }
      });

      // Parent schema entry has "block" type
      if (this.updatedSchema?.get(getParentEntryUuid(entry.path))?.type === AdvancedFieldTypeEnum.block) {
        hasBlockParent = true;
      }

      return isOfSameUri && hasProperBlock && hasBlockParent;
    });
  };

  private findSchemaDropdownOption(schemaEntry: SchemaEntry, recordKey: string, selectedEntryId?: string) {
    let selectedSchemaEntryUuid = selectedEntryId;

    if (selectedSchemaEntryUuid) return selectedSchemaEntryUuid;

    if (schemaEntry.children) {
      schemaEntry.children?.forEach(entryKey => {
        const entry = this.updatedSchema?.get(entryKey);

        if (!entry) return;

        if (entry?.type === AdvancedFieldTypeEnum.dropdownOption) {
          this.selectedEntriesService.remove(entry.uuid);

          if (entry.uriBFLite === recordKey) {
            selectedSchemaEntryUuid = entry.uuid;
            this.selectedEntriesService.addNew(undefined, entry.uuid);
          }
        } else {
          selectedSchemaEntryUuid = this.findSchemaDropdownOption(entry, recordKey, selectedSchemaEntryUuid);
        }
      });
    }

    return selectedSchemaEntryUuid;
  }

  private findSchemaUIControl({
    schemaEntry,
    recordKey,
    selectedEntryId,
  }: {
    schemaEntry: SchemaEntry;
    recordKey: string;
    selectedEntryId?: string;
  }) {
    let selectedSchemaEntryUuid = selectedEntryId;

    if (this.hasCorrectUuid(schemaEntry, recordKey)) {
      return schemaEntry.uuid;
    }

    if (selectedSchemaEntryUuid) return selectedSchemaEntryUuid;

    if (schemaEntry.children) {
      schemaEntry.children?.forEach(childEntryKey => {
        if (selectedSchemaEntryUuid) return;

        const childEntry = this.updatedSchema?.get(childEntryKey);

        if (!childEntry) return;

        if (this.hasCorrectUuid(childEntry, recordKey)) {
          selectedSchemaEntryUuid = childEntry.uuid;
        } else if (childEntry?.children?.length) {
          selectedSchemaEntryUuid = this.findSchemaUIControl({
            schemaEntry: childEntry,
            recordKey,
            selectedEntryId: selectedSchemaEntryUuid,
          });
        }
      });
    } else if (this.hasCorrectUuid(schemaEntry, recordKey)) {
      selectedSchemaEntryUuid = schemaEntry.uuid;
    }

    return selectedSchemaEntryUuid;
  }

  private hasCorrectUuid(entry: SchemaEntry, recordKey: string) {
    const isUIControl = UI_CONTROLS_LIST.includes(entry.type as AdvancedFieldTypeEnum);
    const hasTheRecordUri = entry.uriBFLite === recordKey;

    return isUIControl && hasTheRecordUri;
  }

  private async mapRecordListToSchemaEntry(
    recordGroupEntry: Record<string, string[] | RecordBasic[]>,
    schemaEntry: SchemaEntry,
  ) {
    await this.processSequentially(Object.entries(recordGroupEntry), async ([key, value]) => {
      if (key === 'id') return;

      await this.mapRecordValueToSchemaEntry({
        schemaEntry,
        recordKey: key,
        recordEntryValue: value,
        id: recordGroupEntry?.id as unknown as string,
      });
    });
  }

  private async mapRecordValueToSchemaEntry({
    schemaEntry,
    recordKey,
    recordEntryValue,
    id,
  }: {
    schemaEntry: SchemaEntry;
    recordKey: string;
    recordEntryValue: RecordEntryValue;
    id?: string;
  }) {
    let schemaElemUuid = this.findSchemaUIControl({
      schemaEntry,
      recordKey,
    });

    schemaElemUuid ??= this.findSchemaUIControl({
      schemaEntry: this.updatedSchema?.get(
        schemaEntry.path[schemaEntry.path.length - GRANDPARENT_ENTRY_PATH_INDEX],
      ) as SchemaEntry,
      recordKey,
    });

    if (!schemaElemUuid) return;

    const schemaUiElem = this.updatedSchema?.get(schemaElemUuid);

    if (!schemaUiElem) return;

    const { type, constraints } = schemaUiElem;
    const newValueKey = schemaElemUuid;
    const data = recordEntryValue;

    if (type === AdvancedFieldTypeEnum.dropdown) {
      this.handleDropdownOptions(schemaUiElem, recordEntryValue as string);

      // no need to set the value if the dropdown option is selected
      return;
    }

    if (type === AdvancedFieldTypeEnum.enumerated) {
      this.handleDropdownOptions(schemaUiElem, recordEntryValue as string);

      const labelMap = this.buildEnumeratedLabelMap(schemaUiElem);

      await this.setUserValue({
        valueKey: newValueKey,
        data,
        fieldUri: recordKey,
        schemaUiElem,
        id,
        labelMap,
      });

      return;
    }

    if (type === AdvancedFieldTypeEnum.literal && constraints?.repeatable) {
      await this.handleRepeatableSubcomponents({
        schemaUiElem,
        recordEntryValue,
        id,
        recordKey,
        valueKey: newValueKey,
        data,
      });
    } else {
      await this.setUserValue({
        valueKey: newValueKey,
        data,
        fieldUri: recordKey,
        schemaUiElem,
        id,
      });
    }
  }

  private async handleDropdownOptions(schemaUiElem: SchemaEntry, recordEntryValue?: string) {
    const dropdownOptionUUID = this.findSchemaDropdownOption(schemaUiElem, recordEntryValue as string);

    if (dropdownOptionUUID) {
      const dropdownOptionEntry = this.updatedSchema?.get(dropdownOptionUUID);

      if (dropdownOptionEntry) {
        this.selectedEntriesService.addNew(undefined, dropdownOptionEntry.uuid);
      }
    }
  }

  private buildEnumeratedLabelMap(schemaUiElem: SchemaEntry): Record<string, string> {
    const labelMap: Record<string, string> = {};

    schemaUiElem.children?.forEach(childUuid => {
      const child = this.updatedSchema?.get(childUuid);

      if (child?.uriBFLite && child?.displayName) {
        labelMap[child.uriBFLite] = child.displayName;
      }
    });

    return labelMap;
  }

  private async handleRepeatableSubcomponents({
    schemaUiElem,
    recordEntryValue,
    id,
    recordKey,
    valueKey,
    data,
  }: {
    schemaUiElem: SchemaEntry;
    recordEntryValue: RecordEntryValue;
    id: string | undefined;
    recordKey: string;
    valueKey: string;
    data: RecordEntryValue;
  }) {
    let newValueKey = valueKey;
    let updatedData = data;

    if (Array.isArray(recordEntryValue)) {
      await this.processSequentially(Object.entries(recordEntryValue), async ([key, value]) => {
        if (this.shouldDuplicateEntry(recordEntryValue, key)) {
          newValueKey = await this.createDuplicateEntry(schemaUiElem);
          updatedData = value;
        }

        await this.setUserValue({
          valueKey: newValueKey,
          data: updatedData,
          fieldUri: recordKey,
          schemaUiElem,
          id,
        });
      });
    } else {
      await this.setUserValue({
        valueKey: newValueKey,
        data: updatedData,
        fieldUri: recordKey,
        schemaUiElem,
        id,
      });
    }
  }

  private shouldDuplicateEntry(recordEntryValue: string[] | RecordBasic[], key: string): boolean {
    return recordEntryValue.length > 1 && Number.parseInt(key) !== 0;
  }

  private async createDuplicateEntry(schemaUiElem: SchemaEntry) {
    const newEntryUuid = (await this.repeatableFieldsService?.duplicateEntry(schemaUiElem, true)) ?? '';
    this.updatedSchema = this.repeatableFieldsService?.get();

    this.schemaArray = Array.from(this.updatedSchema?.values() || []);

    return newEntryUuid;
  }

  private async setUserValue({
    valueKey,
    data,
    fieldUri,
    schemaUiElem,
    id,
    labelMap,
  }: {
    valueKey: string;
    data: RecordEntryValue;
    fieldUri: string;
    schemaUiElem: SchemaEntry;
    id?: string;
    labelMap?: Record<string, string>;
  }) {
    const { type, constraints, uriBFLite } = schemaUiElem;
    const partialTemplateMatch = this.templateMetadata?.filter(({ path }) => path.at(-1) === fieldUri);
    let updatedData = data;

    if (partialTemplateMatch?.length) {
      updatedData = this.checkAndApplyTemplateToValue({
        schemaEntry: schemaUiElem,
        templates: partialTemplateMatch,
        value: data,
      });
    }

    await this.userValuesService.setValue({
      type: type as AdvancedFieldType,
      key: valueKey,
      value: {
        id,
        data: updatedData,
        uri: constraints?.useValuesFrom?.[0],
        uriSelector: BFLITE_URIS.LINK,
        propertyUri: uriBFLite,
        blockUri: this.currentBlockUri,
        groupUri: this.currentRecordGroupKey,
        fieldUri,
        labelMap,
      },
    });
  }

  private checkAndApplyTemplateToValue({
    schemaEntry,
    templates,
    value,
  }: {
    schemaEntry: SchemaEntry;
    templates: ResourceTemplateMetadata[];
    value: RecordEntryValue;
  }) {
    const isValueArray = Array.isArray(value);

    // add support for RecordBasic[] value type if needed
    if (typeof value === 'object' && !isValueArray) return value;

    const entryPathAsUris = schemaEntry.path.map(id => this.updatedSchema.get(id)?.uriBFLite).filter(Boolean);
    const matchedTemplates = templates.filter(
      ({ path }) => path.length === entryPathAsUris.length && String(path) === String(entryPathAsUris),
    );

    if (!matchedTemplates.length) return value;

    if (isValueArray && value.some(item => typeof item !== 'string')) {
      return value;
    }

    const prefixValueList = matchedTemplates.map(({ template }) => template.prefix);

    const valueList: string[] = (isValueArray ? value : [value]) as string[];

    return [...prefixValueList, ...valueList].join(' ');
  }
}
