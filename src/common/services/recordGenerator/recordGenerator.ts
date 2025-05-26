import { IRecordGenerator } from './recordGenerator.interface';
import { SchemaManager } from './schemaManager';
import { SchemaProcessorManager, ValueProcessor, ModelFieldManager } from './processors';
import { GeneratedValue } from './types/valueTypes';
import { ModelFactory } from './modelFactory';

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
        const { value } = this.modelFieldManager.processField(rootField, entry, this.userValues);

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
}
