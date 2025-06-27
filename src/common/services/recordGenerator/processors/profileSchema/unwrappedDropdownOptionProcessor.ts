import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BaseDropdownProcessor } from './baseDropdownProcessor';
import { ProcessContext } from '../../types/common.types';

export class UnwrappedDropdownOptionProcessor extends BaseDropdownProcessor {
  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return profileSchemaEntry.type === AdvancedFieldType.dropdown && recordSchemaEntry.options?.hiddenWrapper === true;
  }

  process(data: ProcessContext) {
    this.initializeProcessor(data);

    return this.processDropdownChildren(data.profileSchemaEntry);
  }

  protected processOptionEntry(optionEntry: SchemaEntry) {
    if (!optionEntry.uriBFLite) {
      return null;
    }

    const result = this.processChildren(optionEntry);

    if (Object.keys(result).length === 0) {
      return null;
    }

    return {
      [optionEntry.uriBFLite]: [result],
    };
  }
}
