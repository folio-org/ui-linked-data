import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { SchemaManager } from '../../schemaManager';
import { ISchemaProcessor } from './schemaProcessor.interface';

export class FlattenedDropdownProcessor implements ISchemaProcessor {
  private userValues: UserValues = {};

  constructor(private readonly schemaManager: SchemaManager) {}

  canProcess(schemaEntry: SchemaEntry, modelField: RecordModelField) {
    return schemaEntry.type === AdvancedFieldType.dropdown && modelField.options?.flattenDropdown === true;
  }

  process(schemaEntry: SchemaEntry, userValues: UserValues, modelField: RecordModelField) {
    this.userValues = userValues;

    const sourceField = modelField.options?.sourceField ?? BFLITE_URIS.SOURCE;

    return this.processFlattenedDropdown(schemaEntry, sourceField);
  }

  private processFlattenedDropdown(dropdownEntry: SchemaEntry, sourceField: string) {
    const results: Array<Record<string, any>> = [];

    if (!dropdownEntry.children) return results;

    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.schemaManager.getSchemaEntry(optionUuid);

      if (!optionEntry?.children || !this.schemaManager.hasOptionValues(optionEntry, this.userValues)) continue;

      const result = this.processDropdownOptionEntry(optionEntry, sourceField);

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  private processDropdownOptionEntry(optionEntry: SchemaEntry, sourceField: string) {
    if (!optionEntry.children) return null;

    const result: Record<string, any> = {
      [sourceField]: [optionEntry.uriBFLite],
    };

    for (const childUuid of optionEntry.children) {
      this.processChildField(childUuid, result);
    }

    return result;
  }

  private processChildField(childUuid: string, result: Record<string, any>) {
    const childEntry = this.schemaManager.getSchemaEntry(childUuid);

    if (!childEntry) return;

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0 || !childEntry.uriBFLite) return;

    if (childEntry.type === AdvancedFieldType.literal) {
      result[childEntry.uriBFLite] = childValues.map(({ label }) => label);
    } else if (childEntry.type === AdvancedFieldType.simple) {
      result[childEntry.uriBFLite] = childValues.map(({ meta, label }) => ({
        'http://bibfra.me/vocab/lite/link': [meta?.uri],
        'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label],
      }));
    }
  }
}
