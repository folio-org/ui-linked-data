import { RecordModelType } from '@common/constants/recordModel.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ISchemaProcessor } from './schemaProcessor.interface';
import { SchemaManager } from '../../schemaManager';
import { ChildEntryWithValues, GroupedValue, GeneratedValue, UserValueContent } from '../../types/valueTypes';

export class GroupProcessor implements ISchemaProcessor {
  private userValues: UserValues = {};

  constructor(private readonly schemaManager: SchemaManager) {}

  canProcess(schemaEntry: SchemaEntry, modelField: RecordModelField): boolean {
    return (
      schemaEntry.type === AdvancedFieldType.group &&
      !!schemaEntry.children &&
      modelField.value === RecordModelType.object
    );
  }

  process(schemaEntry: SchemaEntry, userValues: UserValues, modelField: RecordModelField): Record<string, any> {
    this.userValues = userValues;

    return this.processGroupWithChildren(schemaEntry, modelField);
  }

  private processGroupWithChildren(schemaEntry: SchemaEntry, modelField: RecordModelField) {
    if (!schemaEntry.children || !modelField.fields) {
      return [];
    }

    const childEntriesWithValues = this.getChildEntriesWithValues(schemaEntry.children);

    if (childEntriesWithValues.length === 0) {
      return [];
    }

    const groupedValues = this.groupValuesByIndex(childEntriesWithValues);

    return this.createStructuredObjects(groupedValues, modelField.fields);
  }

  private getChildEntriesWithValues(children: string[]) {
    return children
      .map(childUuid => {
        const childEntry = this.schemaManager.getSchemaEntry(childUuid);

        if (!childEntry?.type || !childEntry.uriBFLite) return null;

        const childValues = this.userValues[childEntry.uuid]?.contents || [];

        if (childValues.length === 0) return null;

        return { childEntry, childValues };
      })
      .filter((entry): entry is ChildEntryWithValues => entry !== null);
  }

  private createStructuredObjects(groupedValues: GroupedValue[], modelFields: Record<string, RecordModelField>) {
    return groupedValues
      .map(indexGroup => this.createGroupObject(indexGroup, modelFields))
      .filter(obj => Object.keys(obj).length > 0);
  }

  private createGroupObject(indexGroup: GroupedValue, modelFields: Record<string, RecordModelField>): GeneratedValue {
    const groupObject: GeneratedValue = {};

    for (const { childEntry, valueAtIndex } of indexGroup) {
      if (!childEntry.uriBFLite || !valueAtIndex) continue;

      this.mapValueToModelField(childEntry, valueAtIndex, modelFields, groupObject);
    }

    return groupObject;
  }

  private mapValueToModelField(
    childEntry: SchemaEntry,
    valueAtIndex: UserValueContent,
    modelFields: Record<string, RecordModelField>,
    groupObject: GeneratedValue,
  ) {
    const { uriBFLite, type } = childEntry;

    if (!uriBFLite || type === undefined) return;

    const fieldType = this.validateFieldType(type);

    if (fieldType === null) return;

    for (const key of Object.keys(modelFields)) {
      if (key === uriBFLite) {
        groupObject[key] = this.getValueForType(fieldType, valueAtIndex);
      }
    }
  }

  private validateFieldType(type: string) {
    return Object.values(AdvancedFieldType).includes(type as AdvancedFieldType) ? (type as AdvancedFieldType) : null;
  }

  private getValueForType(type: AdvancedFieldType, value: UserValueContent) {
    switch (type) {
      case AdvancedFieldType.literal:
        return [value.label];
      case AdvancedFieldType.simple:
        return [value.meta?.uri ?? value.label];
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
