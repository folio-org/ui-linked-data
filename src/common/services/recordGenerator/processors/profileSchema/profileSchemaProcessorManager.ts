import { IProfileSchemaManager } from '../../profileSchemaManager.interface';
import { ProcessContext } from '../../types/common.types';
import { DropdownProcessor } from './dropdownProcessor';
import { FlattenedDropdownProcessor } from './flattenedDropdownProcessor';
import { GroupProcessor } from './groupProcessor';
import { LookupProcessor } from './lookupProcessor';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';
import { IProfileSchemaProcessorManager } from './profileSchemaProcessorManager.interface';
import { UnwrappedDropdownOptionProcessor } from './unwrappedDropdownOptionProcessor';

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

  process(data: ProcessContext) {
    for (const processor of this.processors) {
      if (processor.canProcess(data.profileSchemaEntry, data.recordSchemaEntry)) {
        return processor.process(data);
      }
    }

    return [];
  }
}
