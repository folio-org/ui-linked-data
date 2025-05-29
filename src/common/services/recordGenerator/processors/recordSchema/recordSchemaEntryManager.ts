import { ProfileSchemaManager } from '../../profileSchemaManager';
import { ValueProcessor } from '../value/valueProcessor';
import { ProfileSchemaProcessorManager } from '../profileSchema/profileSchemaProcessorManager';
import { RecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';
import { ArrayEntryProcessor } from './arrayEntryProcessor';
import { ObjectEntryProcessor } from './objectEntryProcessor';
import { SimpleEntryProcessor } from './simpleEntryProcessor';

export class RecordSchemaEntryManager {
  private readonly processors: RecordSchemaEntryProcessor[] = [];

  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly profileSchemaProcessorManager: ProfileSchemaProcessorManager,
    private readonly profileSchemaManager: ProfileSchemaManager,
  ) {
    this.initProcessors();
  }

  private initProcessors() {
    this.processors.push(
      new ArrayEntryProcessor(this.valueProcessor, this.profileSchemaProcessorManager),
      new ObjectEntryProcessor(this.valueProcessor, this.profileSchemaManager, this),
      new SimpleEntryProcessor(this.valueProcessor),
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
      throw new Error(`No processor found for entry type: ${recordSchemaEntry.type}`);
    }

    return processor;
  }
}
