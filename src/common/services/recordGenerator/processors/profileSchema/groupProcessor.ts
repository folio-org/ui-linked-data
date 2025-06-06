import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { ChildEntryWithValues, GroupedValue, GeneratedValue, SchemaPropertyValue } from '../../types/value.types';
import { ProcessorResult } from '../../types/profileSchemaProcessor.types';
import { BaseFieldProcessor } from './baseFieldProcessor';
import { GroupValueFormatter } from './formatters';

export class GroupProcessor extends BaseFieldProcessor {
  constructor(profileSchemaManager: ProfileSchemaManager) {
    super(profileSchemaManager, new GroupValueFormatter());
  }

  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      profileSchemaEntry.type === AdvancedFieldType.group &&
      !!profileSchemaEntry.children &&
      recordSchemaEntry.value === RecordSchemaEntryType.object
    );
  }

  process(profileSchemaEntry: SchemaEntry, userValues: UserValues, recordSchemaEntry: RecordSchemaEntry) {
    this.initializeProcessor(profileSchemaEntry, userValues, recordSchemaEntry);

    return this.processGroupWithChildren();
  }

  private processGroupWithChildren() {
    if (!this.profileSchemaEntry?.children || !this.recordSchemaEntry?.properties) {
      return [];
    }

    const childEntriesWithValues = this.getChildEntriesWithValues(this.profileSchemaEntry.children);

    if (childEntriesWithValues.length === 0) {
      return [];
    }

    const groupedValues = this.groupValuesByIndex(childEntriesWithValues);

    return this.createStructuredObjects(groupedValues, this.recordSchemaEntry.properties);
  }

  private getChildEntriesWithValues(children: string[]) {
    return children
      .map(childUuid => {
        const childEntry = this.profileSchemaManager.getSchemaEntry(childUuid);

        if (!childEntry?.type || !childEntry.uriBFLite) return null;

        const childValues = this.userValues[childEntry.uuid]?.contents || [];

        if (childValues.length === 0) return null;

        return { childEntry, childValues };
      })
      .filter((entry): entry is ChildEntryWithValues => entry !== null);
  }

  private createStructuredObjects(
    groupedValues: GroupedValue[],
    recordSchemaEntries: Record<string, RecordSchemaEntry>,
  ) {
    return groupedValues
      .map(indexGroup => this.createGroupObject(indexGroup, recordSchemaEntries))
      .filter(obj => Object.keys(obj).length > 0);
  }

  private createGroupObject(indexGroup: GroupedValue, recordSchemaEntries: Record<string, RecordSchemaEntry>) {
    const groupObject: ProcessorResult = {};

    for (const { childEntry, valueAtIndex } of indexGroup) {
      if (!childEntry.uriBFLite || !valueAtIndex) continue;

      this.mapValueToRecordSchemaEntry(childEntry, valueAtIndex, recordSchemaEntries, groupObject);
    }

    return groupObject;
  }

  private mapValueToRecordSchemaEntry(
    childEntry: SchemaEntry,
    valueAtIndex: UserValueContents,
    recordSchemaEntries: Record<string, RecordSchemaEntry>,
    groupObject: GeneratedValue,
  ) {
    const { uriBFLite, type } = childEntry;

    if (!this.isValidEntry(uriBFLite, type)) return;

    const entryType = this.validateEntryType(type);

    if (entryType === null || !uriBFLite) return;

    const matchingEntry = this.findMatchingSchemaEntry(uriBFLite, recordSchemaEntries);

    if (!matchingEntry) return;

    this.setValueInGroupObject(uriBFLite, entryType, valueAtIndex, groupObject);
  }

  private isValidEntry(uriBFLite: string | undefined, type: string | undefined) {
    return uriBFLite !== undefined && type !== undefined;
  }

  private findMatchingSchemaEntry(uriBFLite: string, recordSchemaEntries: Record<string, RecordSchemaEntry>) {
    return recordSchemaEntries[uriBFLite];
  }

  private setValueInGroupObject(
    uriBFLite: string,
    entryType: AdvancedFieldType,
    valueAtIndex: UserValueContents,
    groupObject: GeneratedValue,
  ) {
    const recordSchemaProperty = this.recordSchemaEntry?.properties?.[uriBFLite];
    const value = this.processValueByType(entryType, valueAtIndex, recordSchemaProperty);

    if (!value || (Array.isArray(value) && value.length === 0)) return;

    if (this.isComplexNonArrayValue(entryType, value)) {
      this.setComplexValue(valueAtIndex, groupObject, value);
    } else {
      this.setRegularValue(uriBFLite, value, groupObject);
    }
  }

  private isComplexNonArrayValue(entryType: AdvancedFieldType, value: unknown) {
    return entryType === AdvancedFieldType.complex && !Array.isArray(value);
  }

  private setComplexValue(
    valueAtIndex: UserValueContents,
    groupObject: GeneratedValue,
    value: SchemaPropertyValue | null,
  ) {
    const key = valueAtIndex.meta?.srsId ? 'srsId' : 'id';

    groupObject[key] = value;
  }

  private setRegularValue(uriBFLite: string, value: unknown, groupObject: GeneratedValue) {
    groupObject[uriBFLite] = Array.isArray(value) ? value : [value];
  }

  private validateEntryType(type?: string) {
    return Object.values(AdvancedFieldType).includes(type as AdvancedFieldType) ? (type as AdvancedFieldType) : null;
  }

  private groupValuesByIndex(childEntriesWithValues: ChildEntryWithValues[]) {
    const maxValueCount = this.getMaxValueCount(childEntriesWithValues);

    return Array.from({ length: maxValueCount }, (_, index) =>
      this.createValueGroup(childEntriesWithValues, index),
    ).filter(group => group.length > 0);
  }

  private getMaxValueCount(childEntriesWithValues: ChildEntryWithValues[]) {
    return Math.max(...childEntriesWithValues.map(({ childValues }) => childValues.length), 0);
  }

  private createValueGroup(childEntriesWithValues: ChildEntryWithValues[], index: number) {
    return childEntriesWithValues
      .map(({ childEntry, childValues }) => ({
        childEntry,
        valueAtIndex: childValues[index] || null,
      }))
      .filter(({ valueAtIndex }) => valueAtIndex !== null);
  }
}
