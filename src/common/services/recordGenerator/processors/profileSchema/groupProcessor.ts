import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { IProfileSchemaManager } from '../../profileSchemaManager.interface';
import { ChildEntryWithValues, GeneratedValue, SchemaPropertyValue } from '../../types/value.types';
import { ProcessorResult } from '../../types/profileSchemaProcessor.types';
import { BaseFieldProcessor } from './baseFieldProcessor';
import { GroupValueFormatter } from './formatters';

export class GroupProcessor extends BaseFieldProcessor {
  constructor(profileSchemaManager: IProfileSchemaManager) {
    super(profileSchemaManager, new GroupValueFormatter());
  }

  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry): boolean {
    return this.isValidGroupEntry(profileSchemaEntry) && this.isValidRecordSchema(recordSchemaEntry);
  }

  private isValidGroupEntry(entry: SchemaEntry): boolean {
    return entry.type === AdvancedFieldType.group && Array.isArray(entry.children);
  }

  private isValidRecordSchema(entry: RecordSchemaEntry): boolean {
    return entry.value === RecordSchemaEntryType.object;
  }

  process(
    profileSchemaEntry: SchemaEntry,
    userValues: UserValues,
    recordSchemaEntry: RecordSchemaEntry,
  ): ProcessorResult[] {
    this.initializeProcessor(profileSchemaEntry, userValues, recordSchemaEntry);

    return this.processGroupWithChildren();
  }

  private processGroupWithChildren(): ProcessorResult[] {
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

  private canProcessChildren(): boolean {
    return !!(this.profileSchemaEntry?.children && this.recordSchemaEntry?.properties);
  }

  private getValidChildEntries(): ChildEntryWithValues[] {
    if (!this.profileSchemaEntry?.children) {
      return [];
    }

    return this.profileSchemaEntry.children
      .map(childUuid => this.createChildEntryWithValues(childUuid))
      .filter((entry): entry is ChildEntryWithValues => entry !== null);
  }

  private createChildEntryWithValues(childUuid: string): ChildEntryWithValues | null {
    const childEntry = this.profileSchemaManager.getSchemaEntry(childUuid);

    if (!this.isValidChildEntry(childEntry)) {
      return null;
    }

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0) {
      return null;
    }

    return { childEntry, childValues };
  }

  private isValidChildEntry(entry: SchemaEntry | undefined | null): entry is SchemaEntry {
    return !!entry?.type && !!entry.uriBFLite;
  }

  private buildGroupObject(childEntriesWithValues: ChildEntryWithValues[]): ProcessorResult {
    const groupObject: ProcessorResult = {};

    for (const { childEntry, childValues } of childEntriesWithValues) {
      this.processChildEntry(childEntry, childValues, groupObject);
    }

    return groupObject;
  }

  private processChildEntry(
    childEntry: SchemaEntry,
    childValues: UserValueContents[],
    groupObject: GeneratedValue,
  ): void {
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
  ): void {
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
  ): void {
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
  ): void {
    const processedValues = this.processSimpleValues(entryType, values, recordSchemaProperty);

    if (processedValues.length > 0) {
      groupObject[uriBFLite] = Array.isArray(processedValues) ? processedValues : [processedValues];
    }
  }

  private processSimpleValues(
    entryType: AdvancedFieldType,
    values: UserValueContents[],
    recordSchemaProperty: RecordSchemaEntry,
  ): SchemaPropertyValue[] {
    return values
      .map(value => this.processValueByType(entryType, value, recordSchemaProperty))
      .filter((value: SchemaPropertyValue) => value !== null)
      .flat();
  }

  private wrapGroupObjectInArray(groupObject: ProcessorResult): ProcessorResult[] {
    return Object.keys(groupObject).length > 0 ? [groupObject] : [];
  }

  private findMatchingSchemaEntry(
    uriBFLite: string,
    recordSchemaEntries: Record<string, RecordSchemaEntry>,
  ): RecordSchemaEntry | undefined {
    return recordSchemaEntries[uriBFLite];
  }

  private validateEntryType(type?: string): AdvancedFieldType | null {
    return Object.values(AdvancedFieldType).includes(type as AdvancedFieldType) ? (type as AdvancedFieldType) : null;
  }
}
