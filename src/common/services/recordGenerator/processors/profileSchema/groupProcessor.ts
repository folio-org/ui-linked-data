import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { ChildEntryWithValues, GroupedValue, GeneratedValue } from '../../types/valueTypes';

export class GroupProcessor implements IProfileSchemaProcessor {
  private userValues: UserValues = {};

  constructor(private readonly profileSchemaManager: ProfileSchemaManager) {}

  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      profileSchemaEntry.type === AdvancedFieldType.group &&
      !!profileSchemaEntry.children &&
      recordSchemaEntry.value === RecordSchemaEntryType.object
    );
  }

  process(profileSchemaEntry: SchemaEntry, userValues: UserValues, recordSchemaEntry: RecordSchemaEntry) {
    this.userValues = userValues;

    return this.processGroupWithChildren(profileSchemaEntry, recordSchemaEntry);
  }

  private processGroupWithChildren(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    if (!profileSchemaEntry.children || !recordSchemaEntry.fields) {
      return [];
    }

    const childEntriesWithValues = this.getChildEntriesWithValues(profileSchemaEntry.children);

    if (childEntriesWithValues.length === 0) {
      return [];
    }

    const groupedValues = this.groupValuesByIndex(childEntriesWithValues);

    return this.createStructuredObjects(groupedValues, recordSchemaEntry.fields);
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

  private createStructuredObjects(groupedValues: GroupedValue[], recordSchemaEntries: Record<string, RecordSchemaEntry>) {
    return groupedValues
      .map(indexGroup => this.createGroupObject(indexGroup, recordSchemaEntries))
      .filter(obj => Object.keys(obj).length > 0);
  }

  private createGroupObject(indexGroup: GroupedValue, recordSchemaEntries: Record<string, RecordSchemaEntry>): GeneratedValue {
    const groupObject: GeneratedValue = {};

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

    if (!uriBFLite || type === undefined) return;

    const entryType = this.validateEntryType(type);

    if (entryType === null) return;

    for (const key of Object.keys(recordSchemaEntries)) {
      if (key === uriBFLite) {
        const value = this.getValueForType(entryType, valueAtIndex);

        if (value.length === 0) continue;

        groupObject[key] = value;
      }
    }
  }

  private validateEntryType(type: string) {
    return Object.values(AdvancedFieldType).includes(type as AdvancedFieldType) ? (type as AdvancedFieldType) : null;
  }

  private getValueForType(type: AdvancedFieldType, value: UserValueContents) {
    switch (type) {
      case AdvancedFieldType.literal:
        return value.label ? [value.label] : [];
      case AdvancedFieldType.simple: {
        const label = value.meta?.basicLabel ?? value.label;

        return label ? [label] : [];
      }
      default:
        return [];
    }
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
