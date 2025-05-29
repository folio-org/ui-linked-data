import { ProfileSchemaManager } from '../../profileSchemaManager';
import { ValueProcessor } from '../value/valueProcessor';
import { ProfileSchemaProcessorManager } from '../profileSchema/profileSchemaProcessorManager';
import { RecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';
import { ArrayFieldProcessor } from './arrayFieldProcessor';
import { ObjectFieldProcessor } from './objectFieldProcessor';
import { SimpleFieldProcessor } from './simpleFieldProcessor';

export class RecordSchemaEntryManager {
  private readonly processors: RecordSchemaEntryProcessor[] = [];

  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly schemaProcessorManager: ProfileSchemaProcessorManager,
    private readonly profileSchemaManager: ProfileSchemaManager,
  ) {
    this.initProcessors();
  }

  private initProcessors() {
    this.processors.push(
      new ArrayFieldProcessor(this.valueProcessor, this.schemaProcessorManager),
      new ObjectFieldProcessor(this.valueProcessor, this.profileSchemaManager, this),
      new SimpleFieldProcessor(this.valueProcessor),
    );
  }

  processEntry({
    recordSchemaEntry,
    profileSchemaEntry,
    userValues,
  }: {
    recordSchemaEntry: RecordSchemaEntry;
    profileSchemaEntry: SchemaEntry;
    userValues: UserValues;
  }) {
    const processor = this.getProcessorForEntry(recordSchemaEntry);

    return processor.process({ recordSchemaEntry, profileSchemaEntry, userValues });
  }

  private getProcessorForEntry(recordSchemaEntry: RecordSchemaEntry) {
    const processor = this.processors.find(processor => processor.canProcess(recordSchemaEntry));

    if (!processor) {
      throw new Error(`No processor found for field type: ${recordSchemaEntry.type}`);
    }

    return processor;
  }
}
