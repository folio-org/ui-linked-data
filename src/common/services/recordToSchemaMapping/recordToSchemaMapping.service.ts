import { cloneDeep } from 'lodash';
import {
  AdvancedFieldType as AdvancedFieldTypeEnum,
  UI_CONTROLS_LIST,
  UI_DROPDOWNS_LIST,
} from '@common/constants/uiControls.constants';
import { BFLITE_URIS, NEW_BF2_TO_BFLITE_MAPPING } from '@common/constants/bibframeMapping.constants';
import { StatusType } from '@common/constants/status.constants';
import { GRANDPARENT_ENTRY_PATH_INDEX } from '@common/constants/bibframe.constants';
import { ISelectedEntries } from '@common/services/selectedEntries/selectedEntries.interface';
import { IUserValues } from '@common/services/userValues/userValues.interface';
import { getParentEntryUuid } from '@common/helpers/schema.helper';
import { IRecordToSchemaMappingInit, IRecordToSchemaMapping } from './recordToSchemaMapping.interface';

// TODO: take into account a selected Profile
export class RecordToSchemaMappingService implements IRecordToSchemaMapping {
  private updatedSchema: Schema;
  private schemaArray: SchemaEntry[];
  private record: RecordEntry;
  private recordBlocks: RecordBlocksList;
  private currentBlockUri?: string;
  private currentRecordGroupKey?: string;
  private recordMap?: BF2BFLiteMapEntry;
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
        await this.processRecordEntry(recordKey, recordEntry);
      }
    } catch (error) {
      console.error('Cannot apply a record to the schema:', error);
      this.commonStatusService.set('ld.recordMappingToSchema', StatusType.error);
    }
  }

  private async processRecordEntry(recordKey: string, recordEntry: any) {
    this.recordMap = (NEW_BF2_TO_BFLITE_MAPPING as BF2BFLiteMap)?.[this.currentBlockUri as string]?.[recordKey];
    this.currentRecordGroupKey = recordKey;

    if (!this.recordMap) return;

    const containerBf2Uri = this.recordMap.container.bf2Uri;
    const containerDataTypeUri = this.recordMap.container.dataTypeUri as string;
    const schemaEntries = this.getSchemaEntries(containerBf2Uri, containerDataTypeUri);

    for await (const [recordGroupIndex, recordGroup] of Object.entries(recordEntry)) {
      await this.processRecordGroup(
        recordGroupIndex,
        recordEntry,
        recordGroup,
        schemaEntries,
        containerBf2Uri,
        containerDataTypeUri,
      );
    }
  }

  private async processRecordGroup(
    recordGroupIndex: string,
    recordEntry: unknown,
    recordGroup: unknown,
    schemaEntries: SchemaEntry[],
    containerBf2Uri: string,
    containerDataTypeUri: string,
  ) {
    if (!schemaEntries?.length) return;

    const dropdownOptionsMap = this.recordMap?.options;

    // generate repeatable fields
    if (Array.isArray(recordEntry) && recordEntry?.length > 1 && parseInt(recordGroupIndex) !== 0) {
      const schemaEntry = this.getSchemaEntries(containerBf2Uri, containerDataTypeUri)[parseInt(recordGroupIndex) - 1];
      const newEntryUuid = this.repeatableFieldsService?.duplicateEntry(schemaEntry, false) ?? '';
      this.updatedSchema = this.repeatableFieldsService?.get();
      this.schemaArray = Array.from(this.updatedSchema?.values() || []);

      await this.traverseEntries({
        dropdownOptionsMap,
        recordGroup,
        schemaEntry: this.updatedSchema?.get(newEntryUuid),
      });
    } else {
      await this.traverseEntries({
        dropdownOptionsMap,
        recordGroup,
        schemaEntry: schemaEntries[0],
      });
    }
  }

  private async traverseEntries({
    dropdownOptionsMap,
    recordGroup,
    schemaEntry,
  }: {
    dropdownOptionsMap?: BF2BFLiteMapOptions;
    recordGroup: unknown;
    schemaEntry?: SchemaEntry;
  }) {
    if (!schemaEntry) return;

    if (dropdownOptionsMap) {
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

  private readonly getSchemaEntries = (containerBf2Uri?: string, containerDataTypeUri?: string) => {
    return this.schemaArray.filter((entry: SchemaEntry) => {
      const hasTheSameUri = entry.uri === containerBf2Uri;
      const hasTheSameDataTypeUri = containerDataTypeUri
        ? entry.constraints?.valueDataType?.dataTypeURI === containerDataTypeUri
        : true;
      let hasBlockParent = false;
      let hasProperBlock = false;

      entry.path.forEach(parentElemKey => {
        const parentElem = this.updatedSchema?.get(parentElemKey) as SchemaEntry;

        if (parentElem.uriBFLite === this.currentBlockUri) {
          hasProperBlock = true;
        }
      });

      // Parent schema entry has "block" type
      if (this.updatedSchema?.get(getParentEntryUuid(entry.path))?.type === AdvancedFieldTypeEnum.block) {
        hasBlockParent = true;
      }

      return hasTheSameUri && hasTheSameDataTypeUri && hasProperBlock && hasBlockParent;
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

    if (
      UI_CONTROLS_LIST.includes(schemaEntry.type as AdvancedFieldTypeEnum) &&
      this.hasCorrectUuid(schemaEntry, recordKey)
    ) {
      return schemaEntry.uuid;
    }

    if (selectedSchemaEntryUuid) return selectedSchemaEntryUuid;

    if (schemaEntry.children) {
      schemaEntry.children?.forEach(childEntryKey => {
        if (selectedSchemaEntryUuid) return;

        const childEntry = this.updatedSchema?.get(childEntryKey);

        if (!childEntry) return;

        // Ignore dropdown and options
        if (childEntry.type && UI_DROPDOWNS_LIST.includes(childEntry.type as AdvancedFieldTypeEnum)) {
          return;
        }

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
    const typedMap = NEW_BF2_TO_BFLITE_MAPPING as BF2BFLiteMap;
    const mappedRecordGroupFields = this.currentBlockUri
      ? typedMap?.[this.currentBlockUri]?.[this.currentRecordGroupKey as string]?.fields
      : undefined;
    const mappedFieldUri = mappedRecordGroupFields?.[recordKey]?.bf2Uri;
    const hasTheMappedFieldUri = entry.uri === mappedFieldUri;

    return isUIControl && (hasTheRecordUri || hasTheMappedFieldUri);
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

    if (!schemaElemUuid) {
      schemaElemUuid = this.findSchemaUIControl({
        schemaEntry: this.updatedSchema?.get(
          schemaEntry.path[schemaEntry.path.length - GRANDPARENT_ENTRY_PATH_INDEX],
        ) as SchemaEntry,
        recordKey,
      });
    }

    if (!schemaElemUuid) return;

    const schemaUiElem = this.updatedSchema?.get(schemaElemUuid);
    const labelSelector = this.recordMap?.fields?.[recordKey]?.label as string;

    if (!schemaUiElem) return;

    const { type, constraints } = schemaUiElem;
    const newValueKey = schemaElemUuid;
    const data = recordEntryValue;

    if (type === AdvancedFieldTypeEnum.literal && constraints?.repeatable) {
      await this.handleRepeatableSubcomponents({
        schemaUiElem,
        recordEntryValue,
        id,
        recordKey,
        labelSelector,
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
        labelSelector,
      });
    }
  }

  private async handleRepeatableSubcomponents({
    schemaUiElem,
    recordEntryValue,
    id,
    recordKey,
    labelSelector,
    valueKey,
    data,
  }: {
    schemaUiElem: SchemaEntry;
    recordEntryValue: RecordEntryValue;
    id: string | undefined;
    recordKey: string;
    labelSelector: string;
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
          labelSelector,
        });
      }
    } else {
      await this.setUserValue({
        valueKey: newValueKey,
        data: updatedData,
        fieldUri: recordKey,
        schemaUiElem,
        id,
        labelSelector,
      });
    }
  }

  private shouldDuplicateEntry(recordEntryValue: string[] | RecordBasic[], key: string): boolean {
    return recordEntryValue.length > 1 && parseInt(key) !== 0;
  }

  private createDuplicateEntry(schemaUiElem: SchemaEntry): {
    newEntryUuid: string;
  } {
    const newEntryUuid = this.repeatableFieldsService?.duplicateEntry(schemaUiElem, false) ?? '';
    this.updatedSchema = this.repeatableFieldsService?.get();

    // Parameters are defined for further proper duplication of repeatable subcomponents
    const duplicatedElem = this.updatedSchema.get(newEntryUuid);

    if (duplicatedElem) {
      duplicatedElem.cloneOf = schemaUiElem.uuid;
      duplicatedElem.clonedBy = [];
      schemaUiElem.clonedBy = Array.isArray(schemaUiElem.clonedBy)
        ? [...schemaUiElem.clonedBy, newEntryUuid]
        : [newEntryUuid];
    }

    this.schemaArray = Array.from(this.updatedSchema?.values() || []);

    return { newEntryUuid };
  }

  private async setUserValue({
    valueKey,
    data,
    fieldUri,
    schemaUiElem,
    id,
    labelSelector,
  }: {
    valueKey: string;
    data: RecordEntryValue;
    fieldUri: string;
    schemaUiElem: SchemaEntry;
    id?: string;
    labelSelector?: string;
  }) {
    const { type, constraints, uri } = schemaUiElem;
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
        labelSelector,
        uriSelector: BFLITE_URIS.LINK,
        propertyUri: uri,
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

    // TODO: add support for RecordBasic[] value type if needed
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
