import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ProcessContext } from '../../types/common.types';
import { BaseDropdownProcessor } from './baseDropdownProcessor';

export class UnwrappedDropdownOptionProcessor extends BaseDropdownProcessor {
  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      (profileSchemaEntry.type === AdvancedFieldType.dropdown ||
        profileSchemaEntry.type === AdvancedFieldType.enumerated) &&
      recordSchemaEntry.options?.hiddenWrapper === true
    );
  }

  process(data: ProcessContext) {
    this.initializeProcessor(data);

    return this.processDropdownChildren(data.profileSchemaEntry, data.selectedEntries);
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
