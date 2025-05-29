import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { ChildEntryWithValues, GroupedValue, GeneratedValue } from '../../types/valueTypes';

export class GroupProcessor implements IProfileSchemaProcessor {
  private userValues: UserValues = {};
  private profileSchemaEntry: SchemaEntry | null = null;
  private recordSchemaEntry: RecordSchemaEntry | null = null;

  constructor(private readonly profileSchemaManager: ProfileSchemaManager) {}

  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      profileSchemaEntry.type === AdvancedFieldType.group &&
      !!profileSchemaEntry.children &&
      recordSchemaEntry.value === RecordSchemaEntryType.object
    );
  }

  process(profileSchemaEntry: SchemaEntry, userValues: UserValues, recordSchemaEntry: RecordSchemaEntry) {
    this.profileSchemaEntry = profileSchemaEntry;
    this.userValues = userValues;
    this.recordSchemaEntry = recordSchemaEntry;

    return this.processGroupWithChildren();
  }

  private processGroupWithChildren() {
    if (!this.profileSchemaEntry?.children || !this.recordSchemaEntry?.fields) {
      return [];
    }

    const childEntriesWithValues = this.getChildEntriesWithValues(this.profileSchemaEntry.children);

    if (childEntriesWithValues.length === 0) {
      return [];
    }

    const groupedValues = this.groupValuesByIndex(childEntriesWithValues);

    return this.createStructuredObjects(groupedValues, this.recordSchemaEntry.fields);
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

  private createGroupObject(
    indexGroup: GroupedValue,
    recordSchemaEntries: Record<string, RecordSchemaEntry>,
  ): GeneratedValue {
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

    if (!this.isValidEntry(uriBFLite, type)) return;

    const entryType = this.validateEntryType(type);

    if (entryType === null || !uriBFLite) return;

    const matchingEntry = this.findMatchingSchemaEntry(uriBFLite, recordSchemaEntries);

    if (!matchingEntry) return;

    this.setValueInGroupObject(uriBFLite, entryType, valueAtIndex, groupObject);
  }

  private isValidEntry(uriBFLite: string | undefined, type: string | undefined): boolean {
    return uriBFLite !== undefined && type !== undefined;
  }

  private findMatchingSchemaEntry(
    uriBFLite: string,
    recordSchemaEntries: Record<string, RecordSchemaEntry>,
  ): RecordSchemaEntry | undefined {
    return recordSchemaEntries[uriBFLite];
  }

  private setValueInGroupObject(
    uriBFLite: string,
    entryType: AdvancedFieldType,
    valueAtIndex: UserValueContents,
    groupObject: GeneratedValue,
  ) {
    const value = this.getValueForType(entryType, valueAtIndex);

    if (value.length === 0) return;

    if (entryType === AdvancedFieldType.complex) {
      const key = this.selectComplexTypeKey(valueAtIndex);

      groupObject[key] = value;
    } else {
      groupObject[uriBFLite] = value;
    }
  }

  private selectComplexTypeKey(valueAtIndex: UserValueContents): string {
    return valueAtIndex.meta?.srsId ? 'srsId' : 'id';
  }

  private validateEntryType(type?: string) {
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
      case AdvancedFieldType.complex: {
        const selectedId = value.meta?.srsId ?? value.id;

        return Array.isArray(selectedId) ? selectedId[0] : selectedId;
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
