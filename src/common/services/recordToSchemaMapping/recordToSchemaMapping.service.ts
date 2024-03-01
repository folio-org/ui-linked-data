import { cloneDeep } from 'lodash';
import {
  AdvancedFieldType as AdvancedFieldTypeEnum,
  UI_CONTROLS_LIST,
  UI_DROPDOWNS_LIST,
} from '@common/constants/uiControls.constants';
import { BFLITE_URIS, NEW_BF2_TO_BFLITE_MAPPING } from '@common/constants/bibframeMapping.constants';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';
import { IUserValues } from '../userValues/userValues.interface';
import { RECORD_BLOCKS } from '@common/constants/record.constants';
import { SchemaWithDuplicatesService } from '../schema';

// TODO: take into account a selected Profile
export class RecordToSchemaMappingService {
  private updatedSchema: Schema;
  private schemaArray: SchemaEntry[];
  private currentBlockUri: string | undefined;
  private currentRecordGroupKey?: string;
  private recordMap?: BF2BFLiteMapEntry;

  constructor(
    schema: Schema,
    private record: RecordEntry,
    private selectedEntriesService: ISelectedEntries,
    private repeatableFieldsService: SchemaWithDuplicatesService,
    private userValuesService: IUserValues,
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

        if (this.recordMap) {
          const containerBf2Uri = this.recordMap.container.bf2Uri;
          const containerDataTypeUri = this.recordMap.container.dataTypeUri;
          const schemaEntry = this.getSchemaEntry(containerBf2Uri, containerDataTypeUri);

          // Traverse throug the record elements within the group (for the Repeatable fields)
          for await (const [recordGroupIndex, recordGroup] of Object.entries(recordEntry)) {
            if (schemaEntry) {
              const dropdownOptionsMap = this.recordMap.options;

              // generate repeatable fields
              if (Array.isArray(recordEntry) && recordEntry?.length > 1 && parseInt(recordGroupIndex) !== 0) {
                const newEntryUuid = this.repeatableFieldsService?.duplicateEntry(schemaEntry) || '';
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
        }
      }
    } catch (error) {
      // TODO: use DI for the error handler and use it here
      console.error('Cannot apply a record to the schema:', error);
    }
  }

  private async traverseEntries({
    dropdownOptionsMap,
    recordGroup,
    schemaEntry,
  }: {
    dropdownOptionsMap: any;
    recordGroup: any;
    schemaEntry?: SchemaEntry;
  }) {
    if (!schemaEntry) return;

    if (dropdownOptionsMap) {
      if (recordGroup && typeof recordGroup === 'object') {
        // traverse within the selected record element (find dropdown options and elements ouside dropdown)
        for await (const [idx, groupElem] of Object.entries(recordGroup)) {
          const dropdownOptionUUID = this.findSchemaDropdownOption(schemaEntry, idx);

          if (dropdownOptionUUID) {
            const dropdownOptionEntry = this.updatedSchema?.get(dropdownOptionUUID);

            // iterate within the elements inside the selectedDropdown option
            // TODO: DRY
            for await (const [key, value] of Object.entries(groupElem)) {
              await this.mapRecordValueToSchemaEntry({
                schemaEntry: dropdownOptionEntry as SchemaEntry,
                recordKey: key,
                recordEntryValue: value,
              });
            }
          } else {
            for await (const [key, value] of Object.entries(groupElem)) {
              await this.mapRecordValueToSchemaEntry({
                schemaEntry,
                recordKey: key,
                recordEntryValue: value,
              });
            }
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
          for await (const [key, groupElem] of Object.entries(recordGroup)) {
            await this.mapRecordValueToSchemaEntry({
              schemaEntry,
              recordKey: key,
              recordEntryValue: groupElem,
            });
          }
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
    let selectedSchemaEntryUUID = selectedEntryId || undefined;

    if (selectedSchemaEntryUUID) return selectedSchemaEntryUUID;

    if (schemaEntry.children) {
      schemaEntry.children?.forEach(entryKey => {
        const entry = this.updatedSchema?.get(entryKey);

        if (!entry) return;

        if (entry?.type === AdvancedFieldTypeEnum.dropdownOption) {
          this.selectedEntriesService.remove(entry.uuid);

          // TODO: use the mapped values instead of 'uriBFLite'
          if (entry.uriBFLite === recordKey) {
            selectedSchemaEntryUUID = entry.uuid;
            this.selectedEntriesService.addNew(undefined, entry.uuid);
          }
        } else {
          selectedSchemaEntryUUID = this.findSchemaDropdownOption(entry, recordKey, selectedSchemaEntryUUID);
        }
      });
    }

    return selectedSchemaEntryUUID;
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
    let selectedSchemaEntryUUID = selectedEntryId || undefined;

    if (selectedSchemaEntryUUID) return selectedSchemaEntryUUID;

    if (schemaEntry.children) {
      schemaEntry.children?.forEach(childEntryKey => {
        if (selectedSchemaEntryUUID) return;

        const childEntry = this.updatedSchema?.get(childEntryKey);

        if (!childEntry) return;

        // Ignore dropdown and options
        if (childEntry.type && UI_DROPDOWNS_LIST.includes(childEntry.type as AdvancedFieldTypeEnum)) {
          return;
        }

        // TODO: DRY
        if (
          childEntry.type &&
          UI_CONTROLS_LIST.includes(childEntry.type as AdvancedFieldTypeEnum) &&
          (childEntry.uriBFLite === recordKey ||
            childEntry.uri ===
              NEW_BF2_TO_BFLITE_MAPPING?.[this.currentBlockUri]?.[this.currentRecordGroupKey as string]?.fields[
                recordKey as string
              ]?.bf2Uri) // TODO: use the mapped values instead of 'uriBFLite'
        ) {
          selectedSchemaEntryUUID = childEntry.uuid;
        } else if (childEntry?.children?.length) {
          selectedSchemaEntryUUID = this.findSchemaUIControl({
            schemaEntry: childEntry,
            recordKey,
            selectedEntryId: selectedSchemaEntryUUID,
          });
        }
      });
    } else {
      if (
        schemaEntry.type &&
        UI_CONTROLS_LIST.includes(schemaEntry.type as AdvancedFieldTypeEnum) &&
        (schemaEntry.uriBFLite === recordKey ||
          schemaEntry.uri ===
            NEW_BF2_TO_BFLITE_MAPPING?.[this.currentBlockUri]?.[this.currentRecordGroupKey as string]?.fields[
              recordKey as string
            ]?.bf2Uri) // TODO: use the mapped values instead of 'uriBFLite'
      ) {
        selectedSchemaEntryUUID = schemaEntry.uuid;
      }
    }

    return selectedSchemaEntryUUID;
  }

  private async mapRecordValueToSchemaEntry({
    schemaEntry,
    recordKey,
    recordEntryValue,
  }: {
    schemaEntry: SchemaEntry;
    recordKey: string;
    recordEntryValue: string | string[] | Record<string, string[]>[];
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
