import { IRecordGenerator, IRecordGeneratorData } from './recordGenerator.interface';
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
  private referenceIds?: { id: string }[];

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

  generate(data: IRecordGeneratorData, profileType: ProfileType = 'monograph', entityType: ResourceType = 'work') {
    const model = this.getValidatedModel(profileType, entityType);

    this.init({ ...data, model });

    return this.processModel();
  }

  private getValidatedModel(profileType: ProfileType, entityType: ResourceType) {
    const model = ModelFactory.getModel(profileType, entityType);

    if (!model) {
      throw new Error(`Model not found for profile type: ${profileType}, entity type: ${entityType}`);
    }

    return model;
  }

  private init({ schema, model, userValues, referenceIds }: IRecordGeneratorData & { model: RecordModel }) {
    this.schemaManager.init(schema);
    this.model = model;
    this.userValues = userValues;
    this.referenceIds = referenceIds;
  }

  private processModel() {
    const result: GeneratedValue = { resource: {} };

    Object.entries(this.model).forEach(([rootKey, rootField]) => {
      const processedValue = this.processRootEntry(rootKey, rootField);

      if (this.isValidValue(processedValue)) {
        this.addValueToResource(result, rootKey, processedValue);
      }
    });

    // Process references if defined in the model
    if ('references' in this.model && Array.isArray(this.model.references) && this.referenceIds?.length) {
      this.processReferences(result);
    }

    return result;
  }

  private processRootEntry(rootKey: string, rootField: RecordModelField) {
    const rootEntries = this.schemaManager.findSchemaEntriesByUriBFLite(rootKey);
    const processedValues = rootEntries
      .map(entry => this.modelFieldManager.processField({ field: rootField, entry, userValues: this.userValues }).value)
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

  private processReferences(result: GeneratedValue) {
    const modelWithRefs = this.model as RecordModel & { references: RecordModelReferenceDefinition[] };

    if (!this.referenceIds?.length) {
      return;
    }

    const rootEntityKey = this.findRootEntityKey();

    if (!rootEntityKey || !result.resource) {
      return;
    }

    const resourceObj = result.resource as Record<string, SchemaFieldValue>;

    if (!resourceObj[rootEntityKey]) {
      return;
    }

    modelWithRefs.references?.forEach(refDef => {
      const entityNode = resourceObj[rootEntityKey];

      if (typeof entityNode === 'object' && entityNode !== null) {
        (entityNode as Record<string, SchemaFieldValue>)[refDef.outputField] = this
          .referenceIds as unknown as SchemaFieldValue;
      }
    });
  }

  private findRootEntityKey() {
    for (const [key, field] of Object.entries(this.model)) {
      if (field.options?.isRootEntity) {
        return key;
      }
    }

    // If no root entity explicitly marked, use the first non-special key
    const entityKeys = Object.keys(this.model).filter(key => !key.startsWith('_') && key !== 'references');

    return entityKeys.length > 0 ? entityKeys[0] : null;
  }
}
