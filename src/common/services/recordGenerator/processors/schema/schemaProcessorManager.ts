import { SchemaManager } from '../../schemaManager';
import { ISchemaProcessor } from './schemaProcessor.interface';
import { DropdownProcessor } from './dropdownProcessor';
import { UnwrappedDropdownOptionProcessor } from './unwrappedDropdownOptionProcessor';
import { GroupProcessor } from './groupProcessor';
import { LookupProcessor } from './lookupProcessor';
import { FlattenedDropdownProcessor } from './flattenedDropdownProcessor';

export class SchemaProcessorManager {
  private readonly processors: ISchemaProcessor[];

  constructor(schemaManager: SchemaManager) {
    this.processors = [
      new GroupProcessor(schemaManager),
      new FlattenedDropdownProcessor(schemaManager),
      new DropdownProcessor(schemaManager),
      new UnwrappedDropdownOptionProcessor(schemaManager),
      new LookupProcessor(),
    ];
  }

  process(schemaEntry: SchemaEntry, modelField: RecordModelField, userValues: UserValues) {
    for (const processor of this.processors) {
      if (processor.canProcess(schemaEntry, modelField)) {
        return processor.process(schemaEntry, userValues, modelField);
      }
    }

    return [];
  }
}
