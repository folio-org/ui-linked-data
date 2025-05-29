import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BaseDropdownProcessor } from './baseDropdownProcessor';

export class UnwrappedDropdownOptionProcessor extends BaseDropdownProcessor {
  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return profileSchemaEntry.type === AdvancedFieldType.dropdown && recordSchemaEntry.options?.hiddenWrapper === true;
  }

  process(profileSchemaEntry: SchemaEntry, userValues: UserValues, _recordSchemaEntry: RecordSchemaEntry) {
    this.userValues = userValues;

    return this.processDropdownChildren(profileSchemaEntry);
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

  protected override processSimpleChildValues(childValues: UserValueContents[]) {
    return childValues.map(({ meta, label }) => ({
      'http://bibfra.me/vocab/lite/name': [meta?.basicLabel ?? label ?? ''],
      'http://bibfra.me/vocab/marc/code': [meta?.uri?.split('/').pop() ?? ''],
      'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label ?? ''],
      'http://bibfra.me/vocab/lite/link': [meta?.uri ?? ''],
    }));
  }
}
