import { RecordModelType } from '@common/constants/recordModel.constants';
import { IRecordGenerator } from './recordGenerator.interface';
import { SchemaManager } from './schemaManager';
import { SchemaProcessorManager, ValueProcessor } from './processors';
import { GeneratedValue, UserValueContent, ValueOptions, ValueResult } from './types/valueTypes';
import { ModelFactory } from './modelFactory';

export class RecordGenerator implements IRecordGenerator {
  private readonly schemaManager: SchemaManager;
  private readonly schemaProcessorManager: SchemaProcessorManager;
  private readonly valueProcessor: ValueProcessor;
  private model: RecordModel;
  private userValues: UserValues;

  constructor() {
    this.schemaManager = new SchemaManager();
    this.schemaProcessorManager = new SchemaProcessorManager(this.schemaManager);
    this.valueProcessor = new ValueProcessor();
    this.model = {};
    this.userValues = {};
  }

  generate(
    data: { schema: Schema; userValues: UserValues; record?: RecordEntry },
    profileType: ProfileType = 'monograph',
    entityType: ProfileEntityType = 'instance',
  ): GeneratedValue {
    const model = ModelFactory.getModel(profileType, entityType);

    if (!model) {
      throw new Error(`Model not found for profile type: ${profileType}, entity type: ${entityType}`);
    }

    this.init({ ...data, model });

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
    const options: ValueOptions = {
      hiddenWrapper: modelField.options?.hiddenWrapper ?? false,
    };
    const processorValue = this.schemaProcessorManager.process(schemaEntry, modelField, this.userValues);

    if (Object.keys(processorValue).length > 0) {
      return this.valueProcessor.processSchemaValues(processorValue, options);
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

    // Default case for simple fields
    return this.valueProcessor.process(values as UserValueContent[], options);
  }

  private processArrayType(modelField: RecordModelField, schemaEntry: SchemaEntry, values: UserValueContent[]) {
    if (modelField.value === RecordModelType.string) {
      return this.valueProcessor.processSimpleValues(values);
    }

    const processorValue = this.schemaProcessorManager.process(schemaEntry, modelField, this.userValues);
    if (Object.keys(processorValue).length > 0) {
      return processorValue;
    }

    return null;
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
}
