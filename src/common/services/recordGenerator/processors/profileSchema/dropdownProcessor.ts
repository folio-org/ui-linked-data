import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BaseDropdownProcessor } from './baseDropdownProcessor';

export class DropdownProcessor extends BaseDropdownProcessor {
  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      profileSchemaEntry.type === AdvancedFieldType.dropdown &&
      !recordSchemaEntry.options?.hiddenWrapper &&
      !recordSchemaEntry.options?.flattenDropdown
    );
  }

  process(profileSchemaEntry: SchemaEntry, userValues: UserValues, recordSchemaEntry: RecordSchemaEntry) {
    this.initializeProcessor(profileSchemaEntry, userValues, recordSchemaEntry);

    return this.processDropdownChildren(profileSchemaEntry);
  }

  protected processOptionEntry(optionEntry: SchemaEntry) {
    if (!optionEntry.uriBFLite) return null;

    const result = this.processChildren(optionEntry);

    if (Object.keys(result).length === 0) return null;

    return {
      [optionEntry.uriBFLite]: result,
    };
  }
}
