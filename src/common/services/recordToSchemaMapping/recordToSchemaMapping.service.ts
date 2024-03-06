import { cloneDeep } from 'lodash';
import {
  AdvancedFieldType as AdvancedFieldTypeEnum,
  UI_CONTROLS_LIST,
  UI_DROPDOWNS_LIST,
} from '@common/constants/uiControls.constants';
import { BFLITE_URIS, NEW_BF2_TO_BFLITE_MAPPING } from '@common/constants/bibframeMapping.constants';
import { RECORD_BLOCKS } from '@common/constants/record.constants';
import { StatusType } from '@common/constants/status.constants';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';
import { IUserValues } from '../userValues/userValues.interface';
import { SchemaWithDuplicatesService } from '../schema';

// TODO: take into account a selected Profile
export class RecordToSchemaMappingService {
  private updatedSchema: Schema;
  private schemaArray: SchemaEntry[];
  private currentBlockUri?: string;
  private currentRecordGroupKey?: string;
  private recordMap?: BF2BFLiteMapEntry;

  constructor(
    schema: Schema,
    private record: RecordEntry,
    private selectedEntriesService: ISelectedEntries,
    private repeatableFieldsService: SchemaWithDuplicatesService,
    private userValuesService: IUserValues,
    private commonStatusService: ICommonStatus,
  ) {
    this.updatedSchema = cloneDeep(schema);
    this.record = record;

    this.schemaArray = schema ? Array.from(this.updatedSchema?.values()) : [];
  }

  async init() {
    await this.traverseBlocks();
  }

  getUpdatedSchema() {
    return this.updatedSchema;
  }

  private async traverseBlocks() {
    for await (const blockUri of RECORD_BLOCKS.values()) {
      this.currentBlockUri = blockUri;
      await this.traverseBlock();
    }
  }

  private async traverseBlock() {
    if (!this.currentBlockUri) return;

    try {
      for await (const [recordKey, recordEntry] of Object.entries(this.record[this.currentBlockUri])) {
        this.recordMap = (NEW_BF2_TO_BFLITE_MAPPING as BF2BFLiteMap)?.[this.currentBlockUri]?.[
          recordKey
        ] as BF2BFLiteMapEntry;

        this.currentRecordGroupKey = recordKey;

        if (!this.recordMap) continue;

        const containerBf2Uri = this.recordMap.container.bf2Uri;
        const containerDataTypeUri = this.recordMap.container.dataTypeUri;
        const schemaEntry = this.getSchemaEntry(containerBf2Uri, containerDataTypeUri);

        // Traverse throug the record elements within the group (for the Repeatable fields)
        for await (const [recordGroupIndex, recordGroup] of Object.entries(recordEntry)) {
          if (!schemaEntry) continue;

          const dropdownOptionsMap = this.recordMap.options;

          // generate repeatable fields
          if (Array.isArray(recordEntry) && recordEntry?.length > 1 && parseInt(recordGroupIndex) !== 0) {
            const newEntryUuid = this.repeatableFieldsService?.duplicateEntry(schemaEntry, false) || '';
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
              schemaEntry,
            });
          }
        }
      }
    } catch (error) {
      console.error('Cannot apply a record to the schema:', error);
      this.commonStatusService.set('marva.recordMappingToSchema', StatusType.error);
    }
  }

  private async traverseEntries({
    dropdownOptionsMap,
    recordGroup,
    schemaEntry,
  }: {
    dropdownOptionsMap?: BF2BFLiteMapOptions;
    recordGroup: any;
    schemaEntry?: SchemaEntry;
  }) {
    if (!schemaEntry) return;

    if (dropdownOptionsMap) {
      if (recordGroup && typeof recordGroup === 'object') {
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
    } else {
      if (UI_CONTROLS_LIST.includes(schemaEntry?.type as AdvancedFieldTypeEnum)) {
        await this.mapRecordValueToSchemaEntry({
          schemaEntry,
          recordKey: this.currentRecordGroupKey as string,
          recordEntryValue: recordGroup,
        });
      } else {
        // Used for complex groups, which contains a number of subfields
        if (recordGroup && typeof recordGroup === 'object') {
          // traverse within the selected record element (find dropdown options and elements ouside dropdown)
          await this.mapRecordListToSchemaEntry(recordGroup, schemaEntry);
        }
      }
    }
  }

  private getSchemaEntry = (containerBf2Uri?: string, containerDataTypeUri?: string) => {
    return this.schemaArray.find((entry: SchemaEntry) => {
      const hasTheSameUri = entry.uri === containerBf2Uri;
      const hasTheSameDataTypeUri = containerDataTypeUri
        ? entry.constraints?.valueDataType.dataTypeURI === containerDataTypeUri
        : true;
      let hasBlockParent = false;
      let hasProperBlock = false;

      entry.path.forEach(parentElemKey => {
        const parentElem = this.updatedSchema?.get(parentElemKey) as SchemaEntry;

        // TODO: select a correct block
        // TODO: use the mapped values instead of 'uriBFLite'
        if (parentElem.uriBFLite === this.currentBlockUri) {
          hasProperBlock = true;
        }
      });

      // Parent schema entry has "block" type
      if (this.updatedSchema?.get(entry.path[entry.path.length - 2])?.type === AdvancedFieldTypeEnum.block) {
        hasBlockParent = true;
      }

      return hasTheSameUri && hasTheSameDataTypeUri && hasProperBlock && hasBlockParent;
    });
  };

  private findSchemaDropdownOption(schemaEntry: SchemaEntry, recordKey: string, selectedEntryId?: string) {
    let selectedSchemaEntryUuid = selectedEntryId || undefined;

    if (selectedSchemaEntryUuid) return selectedSchemaEntryUuid;

    if (schemaEntry.children) {
      schemaEntry.children?.forEach(entryKey => {
        const entry = this.updatedSchema?.get(entryKey);

        if (!entry) return;

        if (entry?.type === AdvancedFieldTypeEnum.dropdownOption) {
          this.selectedEntriesService.remove(entry.uuid);

          // TODO: use the mapped values instead of 'uriBFLite'
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
    let selectedSchemaEntryUuid = selectedEntryId || undefined;

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
    } else {
      if (this.hasCorrectUuid(schemaEntry, recordKey)) {
        selectedSchemaEntryUuid = schemaEntry.uuid;
      }
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
      await this.mapRecordValueToSchemaEntry({
        schemaEntry,
        recordKey: key,
        recordEntryValue: value,
      });
    }
  }

  private async mapRecordValueToSchemaEntry({
    schemaEntry,
    recordKey,
    recordEntryValue,
  }: {
    schemaEntry: SchemaEntry;
    recordKey: string;
    recordEntryValue: string | string[] | RecordBasic[];
  }) {
    let schemaElemUuid = this.findSchemaUIControl({
      schemaEntry,
      recordKey,
    });

    if (!schemaElemUuid) {
      schemaElemUuid = this.findSchemaUIControl({
        schemaEntry: this.updatedSchema?.get(schemaEntry.path[schemaEntry.path.length - 3]) as SchemaEntry,
        recordKey,
      });
    }

    if (!schemaElemUuid) return;

    const schemaUiElem = this.updatedSchema?.get(schemaElemUuid);
    const labelSelector = this.recordMap?.fields?.[recordKey]?.label as string;

    await this.userValuesService.setValue({
      type: schemaUiElem?.type as AdvancedFieldType,
      key: schemaElemUuid,
      value: {
        data: recordEntryValue,
        uri: schemaUiElem?.constraints?.useValuesFrom?.[0],
        labelSelector,
        uriSelector: BFLITE_URIS.LINK,
        propertyUri: schemaUiElem?.uri,
        blockUri: this.currentBlockUri,
        groupUri: this.currentRecordGroupKey,
        fieldUri: recordKey,
      },
    });
  }
}
