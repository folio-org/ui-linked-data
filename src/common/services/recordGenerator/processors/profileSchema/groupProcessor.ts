import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { ensureArray } from '@/common/helpers/common.helper';

import { IProfileSchemaManager } from '../../profileSchemaManager.interface';
import { LinkedPropertyInfo, ProcessContext } from '../../types/common.types';
import { ProcessorResult } from '../../types/profileSchemaProcessor.types';
import { ChildEntryWithValues, GeneratedValue } from '../../types/value.types';
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
    const valueToProcess = values.find(value => value.meta?.srsId ?? value.id) ?? values[0];

    if (!valueToProcess) return;

    const effectiveSchemaProperty = this.applyConditionalProperties(recordSchemaProperty, valueToProcess);
    const processedValue = this.processValueByType(AdvancedFieldType.complex, valueToProcess, effectiveSchemaProperty);

    if (!processedValue) return;

    const selectedKey = this.determinePropertyKey(effectiveSchemaProperty, valueToProcess);

    if (!selectedKey) return;

    groupObject[selectedKey] = processedValue;
  }

  private applyConditionalProperties(
    recordSchemaProperty: RecordSchemaEntry,
    value: UserValueContents,
  ): RecordSchemaEntry {
    const { conditionalProperties, defaultSourceType, alwaysIncludeIfPresent } = recordSchemaProperty.options || {};

    if (!conditionalProperties || !recordSchemaProperty.properties) {
      return recordSchemaProperty;
    }

    const sourceType = value.meta?.sourceType ?? defaultSourceType;

    if (!sourceType) {
      return recordSchemaProperty;
    }

    const activePropertyKeys = conditionalProperties[sourceType];

    if (!activePropertyKeys) {
      console.warn(`Unknown sourceType: ${sourceType}, using all properties`);

      return recordSchemaProperty;
    }

    // Build final property keys: start with active ones from conditionalProperties
    const finalPropertyKeys = this.buildFinalPropertyKeys(
      activePropertyKeys,
      alwaysIncludeIfPresent,
      value,
      recordSchemaProperty.properties,
    );

    // Filter properties to only include final ones
    const filteredProperties = Object.fromEntries(
      Object.entries(recordSchemaProperty.properties).filter(([key]) => finalPropertyKeys.includes(key)),
    );

    return {
      ...recordSchemaProperty,
      properties: filteredProperties,
    };
  }

  private buildFinalPropertyKeys(
    activePropertyKeys: string[],
    alwaysIncludeIfPresent: string[] | undefined,
    value: UserValueContents,
    properties: Record<string, RecordSchemaEntry>,
  ): string[] {
    if (!alwaysIncludeIfPresent || alwaysIncludeIfPresent.length === 0) {
      return activePropertyKeys;
    }

    const additionalKeys = alwaysIncludeIfPresent.filter(propKey => {
      // Skip if already in activePropertyKeys
      if (activePropertyKeys.includes(propKey)) {
        return false;
      }

      // Check if property exists in schema and has a value
      const propSchema = properties[propKey];

      if (!propSchema) {
        return false;
      }

      // Check if the value has data for this property using valueSource
      const valueSource = propSchema.options?.valueSource;
      if (valueSource) {
        const resolvedValue = this.resolveValuePath(value, valueSource);

        return resolvedValue !== null && resolvedValue !== undefined && resolvedValue !== '';
      }

      return false;
    });

    return [...activePropertyKeys, ...additionalKeys];
  }

  private resolveValuePath(value: UserValueContents, path: string): unknown {
    const parts = path.split('.');
    let current: unknown = value;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return null;
      }

      current = (current as Record<string, unknown>)[part];
    }

    return current;
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
      const valuesArray = ensureArray(processedValues);

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

  private determinePropertyKey(
    recordSchemaProperty: RecordSchemaEntry,
    valueToProcess: UserValueContents,
  ): string | undefined {
    if (recordSchemaProperty.options?.propertyKey) {
      return recordSchemaProperty.options.propertyKey;
    }

    if (valueToProcess.meta?.srsId) return 'srsId';
    if (valueToProcess.id) return 'id';

    return undefined;
  }
}
