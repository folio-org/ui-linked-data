import { IRecordGenerator } from './recordGenerator.interface';
import { SchemaManager } from './schemaManager';
import { SchemaProcessorManager, ValueProcessor, ModelFieldManager } from './processors';
import { GeneratedValue, SchemaFieldValue } from './types/valueTypes';
import { ModelFactory } from './models';

export class RecordGenerator implements IRecordGenerator {
  private readonly schemaManager: SchemaManager;
  private readonly schemaProcessorManager: SchemaProcessorManager;
  private readonly valueProcessor: ValueProcessor;
  private readonly modelFieldManager: ModelFieldManager;
  private model: RecordModel;
  private userValues: UserValues;

  constructor() {
    this.schemaManager = new SchemaManager();
    this.schemaProcessorManager = new SchemaProcessorManager(this.schemaManager);
    this.valueProcessor = new ValueProcessor();

    this.modelFieldManager = new ModelFieldManager(
      this.valueProcessor,
      this.schemaProcessorManager,
      this.schemaManager,
    );

    this.model = {};
    this.userValues = {};
  }

  generate(
    data: { schema: Schema; userValues: UserValues; record?: RecordEntry },
    profileType: ProfileType = 'monograph',
    entityType: ProfileEntityType = 'instance',
  ) {
    const model = this.getValidatedModel(profileType, entityType);

    this.init({ ...data, model });

    return this.processModel();
  }

  private getValidatedModel(profileType: ProfileType, entityType: ProfileEntityType) {
    const model = ModelFactory.getModel(profileType, entityType);

    if (!model) {
      throw new Error(`Model not found for profile type: ${profileType}, entity type: ${entityType}`);
    }

    return model;
  }

  private init({ schema, model, userValues }: { schema: Schema; model: RecordModel; userValues: UserValues }) {
    this.schemaManager.init(schema);
    this.model = model;
    this.userValues = userValues;
  }

  private processModel() {
    const result: GeneratedValue = { resource: {} };

    Object.entries(this.model).forEach(([rootKey, rootField]) => {
      const processedValue = this.processRootEntry(rootKey, rootField);

      if (this.isValidValue(processedValue)) {
        this.addValueToResource(result, rootKey, processedValue);
      }
    });

    return result;
  }

  private processRootEntry(rootKey: string, rootField: RecordModelField) {
    const rootEntries = this.schemaManager.findSchemaEntriesByUriBFLite(rootKey);
    const processedValues = rootEntries
      .map(entry => this.modelFieldManager.processField(rootField, entry, this.userValues).value)
      .filter((value): value is SchemaFieldValue => value !== null);

    return processedValues.length === 1 ? processedValues[0] : processedValues;
  }

  private isValidValue(value: SchemaFieldValue) {
    return Array.isArray(value) ? value.length > 0 : true;
  }

  private addValueToResource(result: GeneratedValue, key: string, value: SchemaFieldValue) {
    if (typeof result.resource === 'object' && result.resource !== null) {
      (result.resource as Record<string, SchemaFieldValue>)[key] = value;
    }
  }
}
