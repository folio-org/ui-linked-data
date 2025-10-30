import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { IProfileSchemaManager } from '../../profileSchemaManager.interface';
import { ChildEntryWithValues, GeneratedValue } from '../../types/value.types';
import { ProcessorResult } from '../../types/profileSchemaProcessor.types';
import { LinkedPropertyInfo, ProcessContext } from '../../types/common.types';
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

    const childValues = this.getUserValues({ entryUuid: childEntry.uuid, childEntry, allChildren });

    return childValues.length > 0 ? { childEntry, childValues } : this.handleDefaultValue(childEntry, allChildren);
  }

  private getUserValues({
    entryUuid,
    childEntry,
    allChildren,
  }: {
    entryUuid: string;
    childEntry?: SchemaEntry;
    allChildren?: string[];
  }) {
    const { hasLink, linkedProperty } = this.getLinkedPropertyDependency(childEntry);

    // If no linked property, return values directly
    if (!hasLink || !linkedProperty) {
      return this.userValues[entryUuid]?.contents || [];
    }

    // Only return values if the linked property has values
    const linkedEntryValues = this.getLinkedEntryValues(linkedProperty, allChildren);

    return linkedEntryValues.length > 0 ? this.userValues[entryUuid]?.contents || [] : [];
  }

  private handleDefaultValue(childEntry: SchemaEntry, allChildren?: string[]): ChildEntryWithValues | null {
    const { hasLink, linkedProperty, recordSchemaProperty } = this.getLinkedPropertyDependency(childEntry);

    // Early returns for invalid states
    if (!hasLink || !linkedProperty || !recordSchemaProperty?.options?.defaultValue) {
      return null;
    }

    const defaultValue = recordSchemaProperty.options.defaultValue;
    const linkedEntryValues = this.getLinkedEntryValues(linkedProperty, allChildren);

    // Only create default value entry if linked property has values
    return linkedEntryValues.length > 0
      ? {
          childEntry,
          childValues: [{ label: '', meta: { uri: defaultValue } }],
        }
      : null;
  }

  private getRecordSchemaProperty(uriBFLite: string) {
    return this.recordSchemaEntry?.properties?.[uriBFLite];
  }

  private getLinkedPropertyDependency(childEntry?: SchemaEntry): LinkedPropertyInfo {
    if (!childEntry?.uriBFLite) {
      return { hasLink: false };
    }

    const recordSchemaProperty = this.getRecordSchemaProperty(childEntry.uriBFLite);
    const linkedProperty = recordSchemaProperty?.options?.linkedProperty;

    return {
      hasLink: !!linkedProperty,
      linkedProperty,
      recordSchemaProperty,
    };
  }

  private getLinkedEntryValues(linkedProperty: string, allChildren?: string[]): UserValueContents[] {
    const linkedEntryUuid = this.findLinkedEntryUuid(linkedProperty, allChildren);

    return linkedEntryUuid ? this.userValues[linkedEntryUuid]?.contents || [] : [];
  }

  private findLinkedEntryUuid(linkedProperty: string, allChildren?: string[]) {
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

    this.processEntryByType({
      entryType,
      uriBFLite: childEntry.uriBFLite,
      values: childValues,
      recordSchemaProperty,
      groupObject,
      repeatable: !!childEntry?.constraints?.repeatable,
    });
  }

  private processEntryByType({
    entryType,
    uriBFLite,
    values,
    recordSchemaProperty,
    groupObject,
    repeatable,
  }: {
    entryType: AdvancedFieldType;
    uriBFLite: string;
    values: UserValueContents[];
    recordSchemaProperty: RecordSchemaEntry;
    groupObject: GeneratedValue;
    repeatable: boolean;
  }) {
    if (entryType === AdvancedFieldType.complex) {
      this.processComplexEntry(values, recordSchemaProperty, groupObject);
    } else {
      this.processSimpleEntry(uriBFLite, entryType, values, recordSchemaProperty, groupObject, repeatable);
    }
  }

  private processComplexEntry(
    values: UserValueContents[],
    recordSchemaProperty: RecordSchemaEntry,
    groupObject: GeneratedValue,
  ) {
    const valueWithId = values.find(value => value.meta?.srsId ?? value.id);

    if (!valueWithId) return;

    const processedValue = this.processValueByType(AdvancedFieldType.complex, valueWithId, recordSchemaProperty);

    if (processedValue) {
      const idKey = valueWithId.meta?.srsId ? 'srsId' : 'id';
      const selectedKey = recordSchemaProperty.options?.propertyKey ?? idKey;

      groupObject[selectedKey] = processedValue;
    }
  }

  private processSimpleEntry(
    uriBFLite: string,
    entryType: AdvancedFieldType,
    values: UserValueContents[],
    recordSchemaProperty: RecordSchemaEntry,
    groupObject: GeneratedValue,
    repeatable: boolean,
  ) {
    const processedValues = this.processSimpleValues(entryType, values, recordSchemaProperty);

    if (processedValues.length > 0) {
      const valuesArray = Array.isArray(processedValues) ? processedValues : [processedValues];

      if (repeatable && groupObject[uriBFLite]) {
        if (Array.isArray(groupObject[uriBFLite])) {
          groupObject[uriBFLite].push(...valuesArray);
        } else {
          groupObject[uriBFLite] = [groupObject[uriBFLite], ...valuesArray];
        }
      } else {
        groupObject[uriBFLite] =
          recordSchemaProperty.type === RecordSchemaEntryType.array ? valuesArray : valuesArray[0];
      }
    }
  }

  private processSimpleValues(
    entryType: AdvancedFieldType,
    values: UserValueContents[],
    recordSchemaProperty: RecordSchemaEntry,
  ) {
    return values
      .map(value => this.processValueByType(entryType, value, recordSchemaProperty))
      .filter(value => value !== null)
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
