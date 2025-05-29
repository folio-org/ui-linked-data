import { IRecordGenerator, IRecordGeneratorData } from './recordGenerator.interface';
import { ProfileSchemaManager } from './profileSchemaManager';
import { ProfileSchemaProcessorManager, ValueProcessor, RecordSchemaEntryManager } from './processors';
import { GeneratedValue, SchemaFieldValue } from './types/valueTypes';
import { RecordSchemaFactory } from './schemas';

export class RecordGenerator implements IRecordGenerator {
  private readonly profileSchemaManager: ProfileSchemaManager;
  private readonly schemaProcessorManager: ProfileSchemaProcessorManager;
  private readonly valueProcessor: ValueProcessor;
  private readonly recordSchemaEntryManager: RecordSchemaEntryManager;
  private recordSchema: RecordSchema;
  private userValues: UserValues;
  private referenceIds?: { id: string }[];

  constructor() {
    this.profileSchemaManager = new ProfileSchemaManager();
    this.schemaProcessorManager = new ProfileSchemaProcessorManager(this.profileSchemaManager);
    this.valueProcessor = new ValueProcessor();

    this.recordSchemaEntryManager = new RecordSchemaEntryManager(
      this.valueProcessor,
      this.schemaProcessorManager,
      this.profileSchemaManager,
    );

    this.recordSchema = {};
    this.userValues = {};
  }

  generate(data: IRecordGeneratorData, profileType: ProfileType = 'monograph', entityType: ResourceType = 'work') {
    const recordSchema = this.getValidatedRecordSchema(profileType, entityType);

    this.init({ ...data, recordSchema });

    return this.processRecordSchema();
  }

  private getValidatedRecordSchema(profileType: ProfileType, entityType: ResourceType) {
    const recordSchema = RecordSchemaFactory.getRecordSchema(profileType, entityType);

    if (!recordSchema) {
      throw new Error(`Record schema not found for profile type: ${profileType}, entity type: ${entityType}`);
    }

    return recordSchema;
  }

  private init({
    schema,
    recordSchema,
    userValues,
    referenceIds,
  }: IRecordGeneratorData & { recordSchema: RecordSchema }) {
    this.profileSchemaManager.init(schema);
    this.recordSchema = recordSchema;
    this.userValues = userValues;
    this.referenceIds = referenceIds;
  }

  private processRecordSchema() {
    const result: GeneratedValue = { resource: {} };
    const rootEntryKey = this.findRootEntryKey();

    Object.entries(this.recordSchema).forEach(([rootKey, rootField]) => {
      const processedValue = this.processRootEntry(rootKey, rootField);

      if (this.isValidValue(processedValue)) {
        if (rootKey === rootEntryKey && rootField.options?.references && this.referenceIds?.length) {
          this.addReferencesToRootEntry(processedValue, rootField.options.references);
        }

        this.addValueToResource(result, rootKey, processedValue);
      }
    });

    return result;
  }

  private processRootEntry(rootKey: string, rootField: RecordSchemaEntry) {
    const rootEntries = this.profileSchemaManager.findSchemaEntriesByUriBFLite(rootKey);
    const processedValues = rootEntries
      .map(
        entry =>
          this.recordSchemaEntryManager.processEntry({
            recordSchemaEntry: rootField,
            profileSchemaEntry: entry,
            userValues: this.userValues,
          }).value,
      )
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

  private findRootEntryKey() {
    for (const [key, entry] of Object.entries(this.recordSchema)) {
      if (entry.options?.isRootEntry) {
        return key;
      }
    }

    const entityKeys = Object.keys(this.recordSchema).filter(key => !key.startsWith('_') && key !== 'references');

    return entityKeys.length > 0 ? entityKeys[0] : null;
  }

  private addReferencesToRootEntry(entryNode: SchemaFieldValue, references: RecordSchemaReferenceDefinition[]) {
    if (typeof entryNode !== 'object' || entryNode === null) {
      return;
    }

    references.forEach(refDef => {
      (entryNode as Record<string, SchemaFieldValue>)[refDef.outputField] = this
        .referenceIds as unknown as SchemaFieldValue;
    });
  }
}
