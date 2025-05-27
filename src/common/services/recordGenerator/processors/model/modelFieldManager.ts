import { ModelFieldProcessor } from './modelFieldProcessor.interface';
import { ValueProcessor } from '../value/valueProcessor';
import { SchemaProcessorManager } from '../schema/schemaProcessorManager';
import { SchemaManager } from '../../schemaManager';
import { ArrayFieldProcessor } from './arrayFieldProcessor';
import { ObjectFieldProcessor } from './objectFieldProcessor';
import { SimpleFieldProcessor } from './simpleFieldProcessor';

export class ModelFieldManager {
  private readonly processors: ModelFieldProcessor[] = [];

  constructor(
    private readonly valueProcessor: ValueProcessor,
    private readonly schemaProcessorManager: SchemaProcessorManager,
    private readonly schemaManager: SchemaManager,
  ) {
    this.initProcessors();
  }

  private initProcessors() {
    this.processors.push(
      new ArrayFieldProcessor(this.valueProcessor, this.schemaProcessorManager),
      new ObjectFieldProcessor(this.valueProcessor, this.schemaManager, this),
      new SimpleFieldProcessor(this.valueProcessor),
    );
  }

  processField({ field, entry, userValues }: { field: RecordModelField; entry: SchemaEntry; userValues: UserValues }) {
    const processor = this.getProcessorForField(field);

    return processor.process({ field, entry, userValues });
  }

  private getProcessorForField(field: RecordModelField) {
    const processor = this.processors.find(processor => processor.canProcess(field));

    if (!processor) {
      throw new Error(`No processor found for field type: ${field.type}`);
    }

    return processor;
  }
}
