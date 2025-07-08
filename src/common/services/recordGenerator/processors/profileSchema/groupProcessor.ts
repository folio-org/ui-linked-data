import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { IProfileSchemaManager } from '../../profileSchemaManager.interface';
import { ChildEntryWithValues, GeneratedValue, SchemaPropertyValue } from '../../types/value.types';
import { ProcessorResult } from '../../types/profileSchemaProcessor.types';
import { ProcessContext } from '../../types/common.types';
import { BaseFieldProcessor } from './baseFieldProcessor';
import { GroupValueFormatter } from './formatters';

export class GroupProcessor extends BaseFieldProcessor {
  constructor(profileSchemaManager: IProfileSchemaManager) {
    super(profileSchemaManager, new GroupValueFormatter());
  }

  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return this.isValidGroupEntry(profileSchemaEntry) && this.isValidRecordSchema(recordSchemaEntry);
  }

  private isValidGroupEntry(entry: SchemaEntry) {
    return entry.type === AdvancedFieldType.group && Array.isArray(entry.children);
  }

  private isValidRecordSchema(entry: RecordSchemaEntry) {
    return entry.value === RecordSchemaEntryType.object;
  }

  process(data: ProcessContext) {
    this.initializeProcessor(data);

    return this.processGroupWithChildren();
  }

  private processGroupWithChildren() {
    if (!this.canProcessChildren()) {
      return [];
    }

    const childEntriesWithValues = this.getValidChildEntries();

    if (childEntriesWithValues.length === 0) {
      return [];
    }

    const groupObject = this.buildGroupObject(childEntriesWithValues);

    return this.wrapGroupObjectInArray(groupObject);
  }

  private canProcessChildren() {
    return !!(this.profileSchemaEntry?.children && this.recordSchemaEntry?.properties);
  }

  private getValidChildEntries() {
    if (!this.profileSchemaEntry?.children) {
      return [];
    }

    return this.profileSchemaEntry.children
      .map(childUuid => this.createChildEntryWithValues(childUuid, this.profileSchemaEntry?.children))
      .filter((entry): entry is ChildEntryWithValues => entry !== null);
  }

  private createChildEntryWithValues(childUuid: string, allChildren?: string[]) {
    const childEntry = this.profileSchemaManager.getSchemaEntry(childUuid);

    if (!this.isValidChildEntry(childEntry)) {
      return null;
    }

    const childValues = this.getUserValues(childEntry.uuid);

    return childValues.length > 0 ? { childEntry, childValues } : this.handleDefaultValue(childEntry, allChildren);
  }

  private getUserValues(entryUuid: string) {
    return this.userValues[entryUuid]?.contents || [];
  }

  private handleDefaultValue(childEntry: SchemaEntry, allChildren?: string[]) {
    if (!childEntry.uriBFLite) {
      return null;
    }

    const recordSchemaProperty = this.getRecordSchemaProperty(childEntry.uriBFLite);
    const { defaultValue, linkedProperty } = recordSchemaProperty?.options || {};

    if (!defaultValue || !linkedProperty) {
      return null;
    }

    return this.createEntryWithDefaultValue(childEntry, defaultValue, linkedProperty, allChildren);
  }

  private getRecordSchemaProperty(uriBFLite: string) {
    return this.recordSchemaEntry?.properties?.[uriBFLite];
  }

  private createEntryWithDefaultValue(
    childEntry: SchemaEntry,
    defaultValue: string,
    linkedProperty: string,
    allChildren?: string[],
  ) {
    const linkedEntry = this.findLinkedEntry(linkedProperty, allChildren);
    const linkedEntryValues = linkedEntry ? this.getUserValues(linkedEntry) : [];

    return linkedEntryValues.length > 0
      ? {
          childEntry,
          childValues: [{ label: '', meta: { uri: defaultValue } }],
        }
      : null;
  }

  private findLinkedEntry(linkedProperty: string, allChildren?: string[]) {
    return allChildren?.find(child => {
      const entry = this.profileSchemaManager.getSchemaEntry(child);

      return entry?.uriBFLite === linkedProperty;
    });
  }

  private isValidChildEntry(entry: SchemaEntry | undefined | null): entry is SchemaEntry {
    return !!entry?.type && !!entry.uriBFLite;
  }

  private buildGroupObject(childEntriesWithValues: ChildEntryWithValues[]) {
    const groupObject: ProcessorResult = {};

    for (const { childEntry, childValues } of childEntriesWithValues) {
      this.processChildEntry(childEntry, childValues, groupObject);
    }

    return groupObject;
  }

  private processChildEntry(childEntry: SchemaEntry, childValues: UserValueContents[], groupObject: GeneratedValue) {
    const entryType = this.validateEntryType(childEntry.type);

    if (!entryType || !childEntry.uriBFLite) return;

    const recordSchemaProperty = this.recordSchemaEntry?.properties?.[childEntry.uriBFLite];
    const matchingEntry = this.findMatchingSchemaEntry(childEntry.uriBFLite, this.recordSchemaEntry?.properties || {});

    if (!matchingEntry || !recordSchemaProperty) return;

    this.processEntryByType(entryType, childEntry.uriBFLite, childValues, recordSchemaProperty, groupObject);
  }

  private processEntryByType(
    entryType: AdvancedFieldType,
    uriBFLite: string,
    values: UserValueContents[],
    recordSchemaProperty: RecordSchemaEntry,
    groupObject: GeneratedValue,
  ) {
    if (entryType === AdvancedFieldType.complex) {
      this.processComplexEntry(values, recordSchemaProperty, groupObject);
    } else {
      this.processSimpleEntry(uriBFLite, entryType, values, recordSchemaProperty, groupObject);
    }
  }

  private processComplexEntry(
    values: UserValueContents[],
    recordSchemaProperty: RecordSchemaEntry,
    groupObject: GeneratedValue,
  ) {
    const valueWithId = values.find(value => value.meta?.srsId ?? value.id);

    if (!valueWithId) return;

    const key = valueWithId.meta?.srsId ? 'srsId' : 'id';
    const processedValue = this.processValueByType(AdvancedFieldType.complex, valueWithId, recordSchemaProperty);

    if (processedValue) {
      groupObject[key] = processedValue;
    }
  }

  private processSimpleEntry(
    uriBFLite: string,
    entryType: AdvancedFieldType,
    values: UserValueContents[],
    recordSchemaProperty: RecordSchemaEntry,
    groupObject: GeneratedValue,
  ) {
    const processedValues = this.processSimpleValues(entryType, values, recordSchemaProperty);

    if (processedValues.length > 0) {
      groupObject[uriBFLite] = Array.isArray(processedValues) ? processedValues : [processedValues];
    }
  }

  private processSimpleValues(
    entryType: AdvancedFieldType,
    values: UserValueContents[],
    recordSchemaProperty: RecordSchemaEntry,
  ) {
    return values
      .map(value => this.processValueByType(entryType, value, recordSchemaProperty))
      .filter((value: SchemaPropertyValue) => value !== null)
      .flat();
  }

  private wrapGroupObjectInArray(groupObject: ProcessorResult) {
    return Object.keys(groupObject).length > 0 ? [groupObject] : [];
  }

  private findMatchingSchemaEntry(uriBFLite: string, recordSchemaEntries: Record<string, RecordSchemaEntry>) {
    return recordSchemaEntries[uriBFLite];
  }

  private validateEntryType(type?: string) {
    return Object.values(AdvancedFieldType).includes(type as AdvancedFieldType) ? (type as AdvancedFieldType) : null;
  }
}
