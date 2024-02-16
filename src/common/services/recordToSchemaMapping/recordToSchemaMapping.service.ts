import { cloneDeep } from 'lodash';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { NEW_BF2_TO_BFLITE_MAPPING } from '@common/constants/bibframeMapping.constants';
import { ISelectedEntries } from '../selectedEntries/selectedEntries.interface';
import { SchemaWithDuplicatesService } from '../schema';

// TODO: move to constants
const uiControlsList = [AdvancedFieldType.literal, AdvancedFieldType.simple, AdvancedFieldType.complex];
const uiDropdowns = [AdvancedFieldType.dropdown, AdvancedFieldType.dropdownOption];
const recordBlocks = ['http://bibfra.me/vocab/lite/Instance', 'http://bibfra.me/vocab/lite/instantiates'];

// TODO: take into account a selected Profile
export class RecordToSchemaMappingService {
  // TODO: create a service for user values
  private userValues: UserValues;
  private updatedSchema: Schema;
  private schemaArray: SchemaEntry[];
  private currentBlockUri: string | undefined;

  constructor(
    schema: Schema,
    private record: any,
    private selectedEntriesService: ISelectedEntries,
    private repeatableFieldsService: SchemaWithDuplicatesService,
  ) {
    this.updatedSchema = cloneDeep(schema);
    this.record = record;

    this.schemaArray = schema ? Array.from(this.updatedSchema?.values()) : [];
    this.userValues = {};
  }

  async init() {
    await this.traverseBlocks();
  }

  getUpdatedSchema() {
    return this.updatedSchema;
  }

  getUserValues() {
    return this.userValues;
  }

  private async traverseBlocks() {
    for await (const blockUri of recordBlocks.values()) {
      this.currentBlockUri = blockUri;
      await this.traverseBlock(blockUri);
    }
  }

  private async traverseBlock(blockUri: string) {
    try {
      for await (const [recordKey, recordEntry] of Object.entries(this.record[blockUri])) {
        const recordMap = NEW_BF2_TO_BFLITE_MAPPING[recordKey];

        if (recordMap) {
          const containerBf2Uri = recordMap.container.bf2Uri;
          const schemaEntry = this.getSchemaEntry(containerBf2Uri);

          // Traverce throug the record elements within the group (potentially for the Repeatable fields)
          for await (const [recordGroupIndex, recordGroup] of Object.entries(recordEntry)) {
            if (schemaEntry) {
              const dropdownOptionsMap = recordMap.options;

              // generate repeatable fields
              if (recordEntry?.length > 1 && parseInt(recordGroupIndex) !== 0) {
                const newEntryUuid = this.repeatableFieldsService?.duplicateEntry(schemaEntry);
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
      // TODO: pass an error handler as a property of the constructor and use it here
      console.error('Cannot apply a record to the schema:', error);
    }
  }

  private async traverseEntries({ dropdownOptionsMap, recordGroup, schemaEntry }) {
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
                schemaEntry: dropdownOptionEntry,
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
      if (schemaEntry?.type === AdvancedFieldType.simple) {
        // TODO: check if simple lookup values should be mapped.
        // And make requests for the lookup options list, then map the values.

        console.log('============SIMPLE in TRAVERSE===============');
        console.log('schemaEntry', schemaEntry, 'recordGroup', recordGroup);
        console.log('============END SIMPLE in TRAVERSE=============');
      } else if (schemaEntry?.type === AdvancedFieldType.literal) {
        this.userValues[schemaEntry.uuid] = this.generateValueForLiteral(schemaEntry.uuid, recordGroup);
      } else {
        // Used for complex groups, which contains a number of subfields
        if (recordGroup && typeof recordGroup === 'object') {
          // traverse within the selected record element (find dropdown options and elements ouside dropdown)
          for await (const [idx, groupElem] of Object.entries(recordGroup)) {
            await this.mapRecordValueToSchemaEntry({
              schemaEntry,
              recordKey: idx,
              recordEntryValue: groupElem,
            });
          }
        }
      }
    }
  }

  private getSchemaEntry = (containerBf2Uri?: string) => {
    return this.schemaArray.find((entry: SchemaEntry) => {
      const hasTheSameUri = entry.uri === containerBf2Uri;
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
      if (this.updatedSchema?.get(entry.path[entry.path.length - 2])?.type === AdvancedFieldType.block) {
        hasBlockParent = true;
      }

      return hasTheSameUri && hasProperBlock && hasBlockParent;
    });
  };

  private findSchemaDropdownOption(schemaEntry: SchemaEntry, recordKey: string) {
    let selectedSchemaEntryUUID: string | null = null;

    if (schemaEntry.children) {
      schemaEntry.children?.forEach(entryKey => {
        const entry = this.updatedSchema?.get(entryKey);

        if (!entry) return;

        if (entry?.type === AdvancedFieldType.dropdownOption) {
          this.selectedEntriesService.remove(entry.uuid);

          // TODO: use the mapped values instead of 'uriBFLite'
          if (entry.uriBFLite === recordKey) {
            selectedSchemaEntryUUID = entry.uuid;
            this.selectedEntriesService.addNew(undefined, entry.uuid);
          }
        } else {
          this.findSchemaDropdownOption(entry, recordKey);
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
      schemaEntry.children?.forEach(choldEntryKey => {
        if (selectedSchemaEntryUUID) return;

        const childEntry = this.updatedSchema?.get(choldEntryKey);

        if (!childEntry) return;

        // Ignore dropdown and options
        if (childEntry.type && uiDropdowns.includes(childEntry.type as AdvancedFieldType)) {
          return;
        }

        // TODO: DRY
        if (
          childEntry.type &&
          uiControlsList.includes(childEntry.type as AdvancedFieldType) &&
          childEntry.uriBFLite === recordKey // TODO: use the mapped values instead of 'uriBFLite'
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
        uiControlsList.includes(schemaEntry.type as AdvancedFieldType) &&
        schemaEntry.uriBFLite === recordKey // TODO: use the mapped values instead of 'uriBFLite'
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
    recordEntryValue: string | string[];
  }) {
    const schemaElemUUID = this.findSchemaUIControl({
      schemaEntry,
      recordKey,
    });

    if (!schemaElemUUID) return;

    const schemaUiElem = this.updatedSchema?.get(schemaElemUUID);

    if (schemaUiElem?.type === AdvancedFieldType.simple) {
      const contents = [];
      for await (const simpleLookupRecordValue of recordEntryValue) {
        // TODO: make a request for a lookup data and select a correct value
        // TODO: use normalized record instead of BFLite URIs
        const contentEntry = this.generateValueForSimpleLookup(
          simpleLookupRecordValue['http://bibfra.me/vocab/lite/label'],
          simpleLookupRecordValue['http://bibfra.me/vocab/lite/link'],
          schemaUiElem?.type,
        );

        contents.push(contentEntry);
      }
      this.userValues[schemaUiElem.uuid] = { uuid: schemaUiElem.uuid, contents };
    } else if (schemaUiElem?.type === AdvancedFieldType.literal) {
      this.userValues[schemaUiElem.uuid] = this.generateValueForLiteral(schemaUiElem.uuid, recordEntryValue[0]);
    }
  }

  private generateValueForLiteral(uuid: string, label: string) {
    return { uuid, contents: [{ label }] };
  }

  private generateValueForSimpleLookup(label: string, uri: string, type: AdvancedFieldType) {
    return {
      label,
      meta: {
        parentURI: uri,
        uri,
        type,
      },
    };
  }
}
