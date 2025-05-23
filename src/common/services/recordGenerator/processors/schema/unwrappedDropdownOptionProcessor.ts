import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { SchemaManager } from '../../schemaManager';
import { ISchemaProcessor } from './schemaProcessor.interface';

export class UnwrappedDropdownOptionProcessor implements ISchemaProcessor {
  private userValues: UserValues;

  constructor(private readonly schemaManager: SchemaManager) {
    this.userValues = {};
  }

  canProcess(schemaEntry: SchemaEntry, modelField: RecordModelField) {
    return schemaEntry.type === AdvancedFieldType.dropdown && modelField.options?.hiddenWrapper === true;
  }

  process(schemaEntry: SchemaEntry, userValues: UserValues) {
    this.userValues = userValues;

    const dropdownEntry = this.schemaManager.getSchemaEntry(schemaEntry.uuid);

    if (!dropdownEntry) return [];

    return this.processUnwrappedDropdownOption(dropdownEntry);
  }

  private processUnwrappedDropdownOption(dropdownEntry: SchemaEntry) {
    const results: any[] = [];

    if (!dropdownEntry.children) return results;

    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.schemaManager.getSchemaEntry(optionUuid);

      if (!optionEntry?.children || !this.schemaManager.hasOptionValues(optionEntry, this.userValues)) continue;

      const result = this.processUnwrappedOptionEntry(optionEntry);

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  private processUnwrappedOptionEntry(optionEntry: SchemaEntry) {
    if (!optionEntry.uriBFLite) return null;

    const wrappedResult = this.buildUnwrappedDropdownOptionValue(optionEntry);

    if (Object.keys(wrappedResult).length === 0) return null;

    // Use the dropdown option's uriBFLite (e.g. distribution) instead of provisionActivity
    return {
      [optionEntry.uriBFLite]: [wrappedResult],
    };
  }

  private buildUnwrappedDropdownOptionValue(optionEntry: SchemaEntry) {
    const wrappedResult: Record<string, any> = {};

    if (!optionEntry.children) return wrappedResult;

    for (const childUuid of optionEntry.children) {
      this.processUnwrappedChild(childUuid, wrappedResult);
    }

    return wrappedResult;
  }

  private processUnwrappedChild(childUuid: string, wrappedResult: Record<string, any>) {
    const childEntry = this.schemaManager.getSchemaEntry(childUuid);

    if (!childEntry) return;

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0 || !childEntry.uriBFLite) return;

    if (childEntry.type === AdvancedFieldType.literal) {
      wrappedResult[childEntry.uriBFLite] = childValues.map(({ label }) => label);
    } else if (childEntry.type === AdvancedFieldType.simple) {
      // TODO: take field names from the model
      wrappedResult[childEntry.uriBFLite] = childValues.map(({ meta, label }) => ({
        'http://bibfra.me/vocab/lite/name': [meta?.basicLabel ?? label],
        'http://bibfra.me/vocab/marc/code': [meta?.uri?.split('/').pop()],
        'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label],
        'http://bibfra.me/vocab/lite/link': [meta?.uri],
      }));
    }
  }
}
