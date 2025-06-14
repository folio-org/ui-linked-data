import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';
import { DropdownProcessor } from './dropdownProcessor';
import { UnwrappedDropdownOptionProcessor } from './unwrappedDropdownOptionProcessor';
import { GroupProcessor } from './groupProcessor';
import { LookupProcessor } from './lookupProcessor';
import { FlattenedDropdownProcessor } from './flattenedDropdownProcessor';
import { IProfileSchemaProcessorManager } from './profileSchemaProcessorManager.interface';
import { IProfileSchemaManager } from '../../profileSchemaManager.interface';

export class ProfileSchemaProcessorManager implements IProfileSchemaProcessorManager {
  private readonly processors: IProfileSchemaProcessor[];

  constructor(profileSchemaManager: IProfileSchemaManager) {
    this.processors = [
      new GroupProcessor(profileSchemaManager),
      new FlattenedDropdownProcessor(profileSchemaManager, this),
      new DropdownProcessor(profileSchemaManager, this),
      new UnwrappedDropdownOptionProcessor(profileSchemaManager, this),
      new LookupProcessor(),
    ];
  }

  process(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry, userValues: UserValues) {
    for (const processor of this.processors) {
      if (processor.canProcess(profileSchemaEntry, recordSchemaEntry)) {
        return processor.process(profileSchemaEntry, userValues, recordSchemaEntry);
      }
    }

    return [];
  }
}
