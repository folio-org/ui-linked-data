import { IProfileSchemaManager } from '../../profileSchemaManager.interface';
import { IProfileSchemaProcessorManager } from '../profileSchema/profileSchemaProcessorManager.interface';
import { IValueProcessor } from '../value/valueProcessor.interface';
import { IRecordSchemaEntryProcessor } from './recordSchemaProcessor.interface';
import { IRecordSchemaEntryManager } from './recordSchemaEntryManager.interface';
import { ArrayEntryProcessor } from './arrayEntryProcessor';
import { ObjectEntryProcessor } from './objectEntryProcessor';
import { SimpleEntryProcessor } from './simpleEntryProcessor';
import { ProcessContext } from '../../types/common.types';

export class RecordSchemaEntryManager implements IRecordSchemaEntryManager {
  private readonly processors: IRecordSchemaEntryProcessor[] = [];

  constructor(
    private readonly valueProcessor: IValueProcessor,
    private readonly profileSchemaProcessorManager: IProfileSchemaProcessorManager,
    private readonly profileSchemaManager: IProfileSchemaManager,
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

  processEntry({ recordSchemaEntry, profileSchemaEntry, userValues, selectedEntries }: ProcessContext) {
    const processor = this.getProcessorForEntry(recordSchemaEntry);

    return processor.process({ recordSchemaEntry, profileSchemaEntry, userValues, selectedEntries });
  }

  private getProcessorForEntry(recordSchemaEntry: RecordSchemaEntry) {
    const processor = this.processors.find(processor => processor.canProcess(recordSchemaEntry));

    if (!processor) {
      throw new Error(`No processor found for entry type: ${recordSchemaEntry.type}`);
    }

    return processor;
  }
}
