import { IRecordGenerator, IRecordGeneratorData } from './recordGenerator.interface';
import { ProfileSchemaManager } from './profileSchemaManager';
import { ProfileSchemaProcessorManager, ValueProcessor, RecordSchemaEntryManager } from './processors';
import { IRecordSchemaEntryManager } from './processors/recordSchema/recordSchemaEntryManager.interface';
import { IProfileSchemaProcessorManager } from './processors/profileSchema/profileSchemaProcessorManager.interface';
import { IValueProcessor } from './processors/value/valueProcessor.interface';
import { GeneratedValue, SchemaPropertyValue } from './types/value.types';
import { RecordSchemaFactory } from './schemas';
import { IProfileSchemaManager } from './profileSchemaManager.interface';

export class RecordGenerator implements IRecordGenerator {
  private readonly profileSchemaManager: IProfileSchemaManager;
  private readonly profileSchemaProcessorManager: IProfileSchemaProcessorManager;
  private readonly valueProcessor: IValueProcessor;
  private readonly recordSchemaEntryManager: IRecordSchemaEntryManager;
  private recordSchema: RecordSchema;
  private userValues: UserValues;
  private selectedEntries: string[];
  private referenceIds?: { id: string }[];
  private profileId?: string | null;

  constructor() {
    this.profileSchemaManager = new ProfileSchemaManager();
    this.profileSchemaProcessorManager = new ProfileSchemaProcessorManager(this.profileSchemaManager);
    this.valueProcessor = new ValueProcessor();

    this.recordSchemaEntryManager = new RecordSchemaEntryManager(
      this.valueProcessor,
      this.profileSchemaProcessorManager,
      this.profileSchemaManager,
    );

    this.recordSchema = {};
    this.userValues = {};
    this.selectedEntries = [];
  }

  generate(data: IRecordGeneratorData, entityType: ResourceType = 'work') {
    const recordSchema = this.getValidatedRecordSchema(entityType);

    this.init({ ...data, recordSchema });

    return this.processRecordSchema();
  }

  private getValidatedRecordSchema(entityType: ResourceType) {
    const recordSchema = RecordSchemaFactory.getRecordSchema(entityType);

    if (!recordSchema) {
      throw new Error(`Record schema not found for entity type: ${entityType}`);
    }

    return recordSchema;
  }

  private init({
    schema,
    recordSchema,
    userValues,
    selectedEntries,
    referenceIds,
    profileId,
  }: IRecordGeneratorData & { recordSchema: RecordSchema }) {
    this.profileSchemaManager.init(schema);
    this.recordSchema = recordSchema;
    this.userValues = userValues;
    this.selectedEntries = selectedEntries;
    this.referenceIds = referenceIds;
    this.profileId = profileId;
  }

  private processRecordSchema() {
    const result: GeneratedValue = { resource: {} };
    const rootEntryKey = this.findRootEntryKey();

    Object.entries(this.recordSchema).forEach(([rootKey, rootProperty]) => {
      const processedValue = this.processRootEntry(rootKey, rootProperty);

      if (this.isValidValue(processedValue)) {
        if (rootKey === rootEntryKey && rootProperty.options?.references && this.referenceIds?.length) {
          this.addReferencesToRootEntry(processedValue, rootProperty.options.references);
          this.addProfileId(processedValue as unknown as SchemaEntry);
        }

        this.addValueToResource(result, rootKey, processedValue);
      }
    });

    return result;
  }

  private processRootEntry(rootKey: string, rootProperty: RecordSchemaEntry) {
    const rootEntries = this.profileSchemaManager.findSchemaEntriesByUriBFLite(rootKey);
    const processedValues = rootEntries
      .map(
        entry =>
          this.recordSchemaEntryManager.processEntry({
            recordSchemaEntry: rootProperty,
            profileSchemaEntry: entry,
            userValues: this.userValues,
            selectedEntries: this.selectedEntries,
          }).value,
      )
      .filter((value): value is SchemaPropertyValue => value !== null);

    return processedValues.length === 1 ? processedValues[0] : processedValues;
  }

  private isValidValue(value: SchemaPropertyValue) {
    return Array.isArray(value) ? value.length > 0 : true;
  }

  private addValueToResource(result: GeneratedValue, key: string, value: SchemaPropertyValue) {
    if (typeof result.resource === 'object' && result.resource !== null) {
      (result.resource as Record<string, SchemaPropertyValue>)[key] = value;
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

  private addReferencesToRootEntry(entryNode: SchemaPropertyValue, references: RecordSchemaReferenceDefinition[]) {
    if (typeof entryNode !== 'object' || entryNode === null) {
      return;
    }

    references.forEach(refDef => {
      (entryNode as Record<string, SchemaPropertyValue>)[refDef.outputProperty] = this
        .referenceIds as unknown as SchemaPropertyValue;
    });
  }

  private addProfileId(entryNode: SchemaEntry) {
    if ((typeof entryNode !== 'object' || entryNode === null) && typeof this.profileId !== 'string') {
      return;
    }

    entryNode.profileId = Number(this.profileId);
  }
}
