import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { ProcessorResult } from '../../types/profileSchemaProcessor.types';
import { BaseDropdownProcessor } from './baseDropdownProcessor';

export class FlattenedDropdownProcessor extends BaseDropdownProcessor {
  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      profileSchemaEntry.type === AdvancedFieldType.dropdown && recordSchemaEntry.options?.flattenDropdown === true
    );
  }

  process(profileSchemaEntry: SchemaEntry, userValues: UserValues, recordSchemaEntry: RecordSchemaEntry) {
    this.initializeProcessor(profileSchemaEntry, userValues, recordSchemaEntry);

    const sourceField = recordSchemaEntry.options?.sourceField ?? BFLITE_URIS.SOURCE;

    return this.processDropdownChildren(profileSchemaEntry).map(
      result =>
        ({
          [sourceField]: [Object.keys(result)[0]],
          ...Object.values(result)[0],
        }) as ProcessorResult,
    );
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
