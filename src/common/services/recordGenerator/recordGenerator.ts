import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { RecordModelType } from '@common/constants/recordModel.constants';
import { IRecordGenerator } from './recordGenerator.interface';
import { SchemaManager } from './schemaManager';

interface UserValueContent {
  id?: string;
  label: string;
  meta?: {
    uri?: string;
    basicLabel?: string;
  };
}

interface ChildEntryWithValues {
  childEntry: SchemaEntry;
  childValues: UserValueContent[];
}

type GroupedValue = Array<{
  childEntry: SchemaEntry;
  valueAtIndex: UserValueContent | null;
}>;
export class RecordGenerator implements IRecordGenerator {
  private readonly schemaManager: SchemaManager;
  private model: RecordModel;
  private userValues: UserValues;

  constructor() {
    this.schemaManager = new SchemaManager();
    this.model = {};
    this.userValues = {};
  }

  generate(data: { schema: Schema; model: RecordModel; userValues: UserValues }) {
    this.init(data);

    const result: Record<string, any> = {
      resource: {},
    };

    for (const [rootKey, rootField] of Object.entries(this.model)) {
      const rootEntries = this.schemaManager.findSchemaEntriesByUriBFLite(rootKey);

      for (const entry of rootEntries) {
        const { value } = this.generateValueFromModel(rootField, entry);

        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          result.resource[rootKey] = value;
        }
      }
    }

    return result;
  }

  private init({ schema, model, userValues }: { schema: Schema; model: RecordModel; userValues: UserValues }) {
    this.schemaManager.init(schema);
    this.model = model;
    this.userValues = userValues;
  }

  private processDropdown(dropdownEntry: SchemaEntry) {
    const results: Array<Record<string, any>> = [];

    if (!dropdownEntry.children) return results;

    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.schemaManager.getSchemaEntry(optionUuid);

      if (!optionEntry?.children) continue;

      if (!this.schemaManager.hasOptionValues(optionEntry, this.userValues)) continue;

      const result = this.processDropdownOptionEntry(optionEntry);

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  private processDropdownOptionEntry(optionEntry: SchemaEntry) {
    if (!optionEntry.uriBFLite) return null;

    const structureResult = this.buildDropdownOptionValue(optionEntry);

    if (Object.keys(structureResult).length === 0) return null;

    const result: Record<string, any> = {};
    result[optionEntry.uriBFLite] = structureResult;

    return result;
  }

  private buildDropdownOptionValue(optionEntry: SchemaEntry) {
    const structureResult: Record<string, any> = {};

    if (!optionEntry.children) {
      return structureResult;
    }

    for (const optionChildUuid of optionEntry.children) {
      this.processDropdownOptionChild(optionChildUuid, structureResult);
    }

    return structureResult;
  }

  private processDropdownOptionChild(childUuid: string, structureResult: Record<string, any>) {
    const childEntry = this.schemaManager.getSchemaEntry(childUuid);

    if (!childEntry) return;

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0 || !childEntry.uriBFLite) return;

    if (childEntry.type === AdvancedFieldType.literal) {
      structureResult[childEntry.uriBFLite] = childValues.map(({ label }) => label);
    } else if (childEntry.type === AdvancedFieldType.simple) {
      structureResult[childEntry.uriBFLite] = childValues.map(({ meta, label }) => ({
        // TODO: take field names from the model
        'http://bibfra.me/vocab/lite/link': [meta?.uri],
        'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label],
      }));
    }
  }

  private isUnwrappedDropdownOption(modelField: RecordModelField, schemaEntry: SchemaEntry) {
    return schemaEntry.type === AdvancedFieldType.dropdown && modelField.options?.hiddenWrapper === true;
  }

  private processUnwrappedDropdownOption(dropdownEntry: SchemaEntry) {
    const results: any[] = [];

    if (!dropdownEntry.children) return results;

    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.schemaManager.getSchemaEntry(optionUuid);

      if (!optionEntry?.children || !this.schemaManager.hasOptionValues(optionEntry, this.userValues)) continue;

      const result = this.processUnwrappedOptionEntry(optionEntry);

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  private processUnwrappedOptionEntry(optionEntry: SchemaEntry) {
    if (!optionEntry.uriBFLite) return null;

    const wrappedResult = this.buildUnwrappedDropdownOptionValue(optionEntry);

    if (Object.keys(wrappedResult).length === 0) return null;

    // Use the dropdown option's uriBFLite (e.g. distribution) instead of provisionActivity
    return {
      [optionEntry.uriBFLite]: [wrappedResult],
    };
  }

  private buildUnwrappedDropdownOptionValue(optionEntry: SchemaEntry) {
    const wrappedResult: Record<string, any> = {};

    if (!optionEntry.children) return wrappedResult;

    for (const childUuid of optionEntry.children) {
      this.processUnwrappedChild(childUuid, wrappedResult);
    }

    return wrappedResult;
  }

  private processUnwrappedChild(childUuid: string, wrappedResult: Record<string, any>) {
    const childEntry = this.schemaManager.getSchemaEntry(childUuid);

    if (!childEntry) return;

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0 || !childEntry.uriBFLite) return;

    if (childEntry.type === AdvancedFieldType.literal) {
      wrappedResult[childEntry.uriBFLite] = childValues.map(({ label }) => label);
    } else if (childEntry.type === AdvancedFieldType.simple) {
      // TODO: take field names from the model
      wrappedResult[childEntry.uriBFLite] = childValues.map(({ meta, label }) => ({
        'http://bibfra.me/vocab/lite/name': [meta?.basicLabel ?? label],
        'http://bibfra.me/vocab/marc/code': [meta?.uri?.split('/').pop()],
        'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label],
        'http://bibfra.me/vocab/lite/link': [meta?.uri],
      }));
    }
  }

  private generateValueFromModel(modelField: RecordModelField, schemaEntry: SchemaEntry) {
    const options: any = {}; // TODO: Can be populated with metadata/options if needed

    // Handle dropdown cases
    if (this.isUnwrappedDropdownOption(modelField, schemaEntry)) {
      options.hiddenWrapper = true;

      return { value: this.processUnwrappedDropdownOption(schemaEntry), options };
    }

    if (schemaEntry.type === AdvancedFieldType.dropdown) {
      return { value: this.processDropdown(schemaEntry), options };
    }

    // Handle non-dropdown cases
    const values = this.userValues[schemaEntry.uuid]?.contents || [];

    if (modelField.type === RecordModelType.array) {
      return { value: this.processArrayType(modelField, schemaEntry, values), options };
    }

    if (modelField.type === RecordModelType.object && modelField.fields) {
      return { value: this.processObjectType(modelField, schemaEntry), options };
    }

    // Default case for simple fields
    return { value: values.map(({ label }) => label), options };
  }

  private processArrayType(modelField: RecordModelField, schemaEntry: SchemaEntry, values: any[]) {
    if (modelField.value === RecordModelType.string) {
      return values.map(({ label }) => label);
    }

    if (
      modelField.value === RecordModelType.object &&
      (schemaEntry.type === AdvancedFieldType.complex || schemaEntry.type === AdvancedFieldType.simple)
    ) {
      return this.processComplexArrayObjects(modelField, values);
    }

    // Handle regular groups with children (e.g. accessLocation, supplementaryContent, _notes)
    if (
      modelField.value === RecordModelType.object &&
      schemaEntry.children &&
      schemaEntry.type === AdvancedFieldType.group
    ) {
      return this.processGroupWithChildren(modelField, schemaEntry);
    }

    return null;
  }

  private processComplexArrayObjects(modelField: RecordModelField, values: any[]) {
    return values.map(({ meta, label }) => {
      const result: Record<string, any> = {};

      if (!modelField.fields) return result;

      for (const key of Object.keys(modelField.fields)) {
        if (meta?.uri && key.includes('link')) {
          result[key] = [meta.uri];
        } else if (meta?.basicLabel && key.includes('term')) {
          result[key] = [meta.basicLabel];
        } else if (key.includes('code')) {
          result[key] = [meta?.uri?.split('/').pop() ?? label];
        } else {
          result[key] = [label];
        }
      }
      return result;
    });
  }

  private processObjectType(modelField: RecordModelField, schemaEntry: SchemaEntry) {
    const result: Record<string, any> = {};

    if (!modelField.fields) return null;

    const parentPath = schemaEntry ? schemaEntry.path : undefined;

    for (const [key, field] of Object.entries(modelField.fields)) {
      this.processObjectField(key, field, result, parentPath);
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  private processObjectField(key: string, field: RecordModelField, result: Record<string, any>, parentPath?: string[]) {
    const localParentPath = parentPath ? [...parentPath] : undefined;
    const childEntries = this.schemaManager.findSchemaEntriesByUriBFLite(key, localParentPath);

    for (const childEntry of childEntries) {
      const childResult = this.generateValueFromModel(field, childEntry);

      if (!childResult.value) continue;

      if (field.type === RecordModelType.array) {
        this.processArrayField(key, childResult, result);
      } else {
        result[key] = childResult.value;
      }
    }
  }

  private processArrayField(key: string, childResult: { value: any; options: any }, result: Record<string, any>) {
    if (childResult.options.hiddenWrapper) {
      Object.assign(result, childResult.value[0]);
    } else {
      result[key] = result[key] ?? [];
      result[key] = result[key].concat(childResult.value);
    }
  }

  private processGroupWithChildren(modelField: RecordModelField, groupEntry: SchemaEntry) {
    if (!groupEntry.children || !modelField.fields) {
      return [];
    }

    const childEntriesWithValues = this.getChildEntriesWithValues(groupEntry.children);

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

  private createGroupObject(indexGroup: GroupedValue, modelFields: Record<string, RecordModelField>) {
    const groupObject: Record<string, string[]> = {};

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
    groupObject: Record<string, string[]>,
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
