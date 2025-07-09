import { cloneDeep } from 'lodash';
import { AdvancedFieldType as AdvancedFieldTypeEnum, UI_CONTROLS_LIST } from '@common/constants/uiControls.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { StatusType } from '@common/constants/status.constants';
import { GRANDPARENT_ENTRY_PATH_INDEX } from '@common/constants/bibframe.constants';
import { ISelectedEntries } from '@common/services/selectedEntries/selectedEntries.interface';
import { IUserValues } from '@common/services/userValues/userValues.interface';
import { getParentEntryUuid } from '@common/helpers/schema.helper';
import { IRecordToSchemaMappingInit, IRecordToSchemaMapping } from './recordToSchemaMapping.interface';

// TODO: UILD-438 - take into account a selected Profile
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

  private async traverseBlocks() {
    for await (const blockUri of this.recordBlocks.values()) {
      this.currentBlockUri = blockUri;
      await this.traverseBlock();
    }
  }

  private async traverseBlock() {
    if (!this.currentBlockUri) return;

    try {
      if (!this.record[this.currentBlockUri]) return;

      for await (const [recordKey, recordEntry] of Object.entries(this.record[this.currentBlockUri])) {
        if (!recordEntry) continue;

        await this.processRecordEntry(recordKey, recordEntry);
      }
    } catch (error) {
      console.error('Cannot apply a record to the schema:', error);
      this.commonStatusService.set('ld.recordMappingToSchema', StatusType.error);
    }
  }

  private async processRecordEntry(recordKey: string, recordEntry: any) {
    this.currentRecordGroupKey = recordKey;

    const schemaEntries = this.getSchemaEntries(recordKey);

    for await (const [recordGroupIndex, recordGroup] of Object.entries(recordEntry)) {
      await this.processRecordGroup(recordGroupIndex, recordEntry, recordGroup, schemaEntries, recordKey);
    }
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
    if (Array.isArray(recordEntry) && recordEntry?.length > 1 && parseInt(recordGroupIndex) !== 0) {
      const schemaEntry = this.getSchemaEntries(recordKey)[parseInt(recordGroupIndex) - 1];
      const newEntryUuid = this.repeatableFieldsService?.duplicateEntry(schemaEntry, true) ?? '';
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

    const isDropdown = schemaEntry.type === AdvancedFieldTypeEnum.dropdown;

    if (isDropdown) {
      await this.traverseDropdownOptions(recordGroup, schemaEntry);
    } else {
      await this.traverseGroupsAndUIControls(recordGroup, schemaEntry);
    }
  }

  private async traverseDropdownOptions(recordGroup: any, schemaEntry: SchemaEntry) {
    // traverse within the selected record element (find dropdown options and elements ouside dropdown)
    for await (const [idx, groupElem] of Object.entries(recordGroup)) {
      const dropdownOptionUUID = this.findSchemaDropdownOption(schemaEntry, idx);
      const typedGroupElem = groupElem as Record<string, string[] | RecordBasic[]>;

      if (dropdownOptionUUID) {
        const dropdownOptionEntry = this.updatedSchema?.get(dropdownOptionUUID);
        // iterate within the elements inside the selectedDropdown option
        await this.mapRecordListToSchemaEntry(typedGroupElem, dropdownOptionEntry as SchemaEntry);
      } else {
        await this.mapRecordListToSchemaEntry(typedGroupElem, schemaEntry);
      }
    }
  }

  private async traverseGroupsAndUIControls(recordGroup: any, schemaEntry: SchemaEntry) {
    if (UI_CONTROLS_LIST.includes(schemaEntry?.type as AdvancedFieldTypeEnum)) {
      await this.mapRecordValueToSchemaEntry({
        schemaEntry,
        recordKey: this.currentRecordGroupKey as string,
        recordEntryValue: recordGroup,
      });
    } else if (recordGroup && typeof recordGroup === 'object') {
      // Used for complex groups, which contains a number of subfields
      // traverse within the selected record element (find dropdown options and elements ouside dropdown)
      await this.mapRecordListToSchemaEntry(recordGroup, schemaEntry);
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
    for await (const [key, value] of Object.entries(recordGroupEntry)) {
      if (key === 'id') continue;

      await this.mapRecordValueToSchemaEntry({
        schemaEntry,
        recordKey: key,
        recordEntryValue: value,
        id: recordGroupEntry?.id as unknown as string,
      });
    }
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
      for await (const [key, value] of Object.entries(recordEntryValue)) {
        if (this.shouldDuplicateEntry(recordEntryValue, key)) {
          const { newEntryUuid } = this.createDuplicateEntry(schemaUiElem);
          newValueKey = newEntryUuid;
          updatedData = value;
        }

        await this.setUserValue({
          valueKey: newValueKey,
          data: updatedData,
          fieldUri: recordKey,
          schemaUiElem,
          id,
        });
      }
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
    return recordEntryValue.length > 1 && parseInt(key) !== 0;
  }

  private createDuplicateEntry(schemaUiElem: SchemaEntry): {
    newEntryUuid: string;
  } {
    const newEntryUuid = this.repeatableFieldsService?.duplicateEntry(schemaUiElem, true) ?? '';
    this.updatedSchema = this.repeatableFieldsService?.get();

    this.schemaArray = Array.from(this.updatedSchema?.values() || []);

    return { newEntryUuid };
  }

  private async setUserValue({
    valueKey,
    data,
    fieldUri,
    schemaUiElem,
    id,
  }: {
    valueKey: string;
    data: RecordEntryValue;
    fieldUri: string;
    schemaUiElem: SchemaEntry;
    id?: string;
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

    const entryPathAsUris = schemaEntry.path.map(id => this.updatedSchema.get(id)?.uriBFLite).filter(uri => uri);
    const matchedTemplates = templates.filter(
      ({ path }) => path.length === entryPathAsUris.length && String(path) === String(entryPathAsUris),
    );

    if (!matchedTemplates.length) return value;

    const prefixValueList = matchedTemplates.map(({ template }) => template.prefix);

    return [...prefixValueList, ...(isValueArray ? value : [value])].join(' ');
  }
}
