import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { RecordModelType } from '@common/constants/recordModel.constants';
import { IRecordGenerator } from './recordGenerator.interface';
import { SchemaManager } from './schemaManager';
import { SchemaProcessorManager } from './processors/schema/schemaProcessorManager';
import { GeneratedValue, ValueOptions, ValueResult } from './processors/schema/valueTypes';

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
  private readonly schemaProcessorManager: SchemaProcessorManager;
  private model: RecordModel;
  private userValues: UserValues;

  constructor() {
    this.schemaManager = new SchemaManager();
    this.schemaProcessorManager = new SchemaProcessorManager(this.schemaManager);
    this.model = {};
    this.userValues = {};
  }

  generate(data: { schema: Schema; model: RecordModel; userValues: UserValues }): GeneratedValue {
    this.init(data);

    const result: GeneratedValue = {
      resource: {},
    };

    for (const [rootKey, rootField] of Object.entries(this.model)) {
      const rootEntries = this.schemaManager.findSchemaEntriesByUriBFLite(rootKey);

      for (const entry of rootEntries) {
        const { value } = this.generateValueFromModel(rootField, entry);

        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          if (typeof result.resource === 'object' && result.resource !== null) {
            (result.resource as GeneratedValue)[rootKey] = value;
          }
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

  private generateValueFromModel(modelField: RecordModelField, schemaEntry: SchemaEntry) {
    const options: ValueOptions = {};

    const processorValue = this.schemaProcessorManager.process(schemaEntry, modelField, this.userValues);
    if (Object.keys(processorValue).length > 0) {
      if (modelField.options?.hiddenWrapper) {
        options.hiddenWrapper = true;
      }
      return { value: processorValue, options };
    }

    // Handle non-processor cases
    const values = this.userValues[schemaEntry.uuid]?.contents || [];

    if (modelField.type === RecordModelType.array) {
      const arrayResult = this.processArrayType(modelField, schemaEntry, values as UserValueContent[]);
      return { value: arrayResult, options };
    }

    if (modelField.type === RecordModelType.object && modelField.fields) {
      return { value: this.processObjectType(modelField, schemaEntry), options };
    }

    // Default case for simple fields - ensure we filter out any undefined values
    return {
      value: values.map(({ label }) => label).filter((label): label is string => label !== undefined),
      options,
    };
  }

  private processArrayType(modelField: RecordModelField, schemaEntry: SchemaEntry, values: UserValueContent[]) {
    if (modelField.value === RecordModelType.string) {
      return values.map(({ label }) => label).filter((label): label is string => label !== undefined);
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

  private processComplexArrayObjects(modelField: RecordModelField, values: UserValueContent[]) {
    return values.map(({ meta, label }) => {
      const result: GeneratedValue = {};

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
    const result: GeneratedValue = {};

    if (!modelField.fields) return null;

    const parentPath = schemaEntry ? schemaEntry.path : undefined;

    for (const [key, field] of Object.entries(modelField.fields)) {
      this.processObjectField(key, field, result, parentPath);
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  private processObjectField(key: string, field: RecordModelField, result: GeneratedValue, parentPath?: string[]) {
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

  private processArrayField(key: string, childResult: ValueResult, result: GeneratedValue) {
    if (childResult.options.hiddenWrapper) {
      const firstValue = Array.isArray(childResult.value) ? childResult.value[0] : null;
      if (firstValue && typeof firstValue === 'object') {
        Object.assign(result, firstValue);
      }
    } else {
      result[key] = result[key] ?? [];

      const existingValue = result[key];

      if (Array.isArray(existingValue)) {
        if (Array.isArray(childResult.value)) {
          result[key] = [...existingValue, ...childResult.value];
        } else if (childResult.value !== null) {
          result[key] = [...existingValue, childResult.value];
        }
      }
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
