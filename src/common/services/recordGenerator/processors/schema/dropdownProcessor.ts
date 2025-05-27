import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { SchemaManager } from '../../schemaManager';
import { ISchemaProcessor } from './schemaProcessor.interface';

export class DropdownProcessor implements ISchemaProcessor {
  private userValues: UserValues = {};

  constructor(private readonly schemaManager: SchemaManager) {}

  canProcess(schemaEntry: SchemaEntry, modelField: RecordModelField) {
    return schemaEntry.type === AdvancedFieldType.dropdown && !modelField.options?.hiddenWrapper;
  }

  process(schemaEntry: SchemaEntry, userValues: UserValues) {
    this.userValues = userValues;

    return this.processDropdown(schemaEntry);
  }

  private processDropdown(dropdownEntry: SchemaEntry) {
    const results: Array<Record<string, any>> = [];

    if (!dropdownEntry.children) return results;

    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.schemaManager.getSchemaEntry(optionUuid);

      if (!optionEntry?.children) continue;

      if (!this.schemaManager.hasOptionValues(optionEntry, this.userValues)) continue;

      const result = this.processDropdownOptionEntry(optionEntry);

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  private processDropdownOptionEntry(optionEntry: SchemaEntry) {
    if (!optionEntry.uriBFLite) return null;

    const structureResult = this.buildDropdownOptionValue(optionEntry);

    if (Object.keys(structureResult).length === 0) return null;

    const result: Record<string, any> = {};
    result[optionEntry.uriBFLite] = structureResult;

    return result;
  }

  private buildDropdownOptionValue(optionEntry: SchemaEntry) {
    const structureResult: Record<string, any> = {};

    if (!optionEntry.children) {
      return structureResult;
    }

    for (const optionChildUuid of optionEntry.children) {
      this.processDropdownOptionChild(optionChildUuid, structureResult);
    }

    return structureResult;
  }

  private processDropdownOptionChild(childUuid: string, structureResult: Record<string, any>) {
    const childEntry = this.schemaManager.getSchemaEntry(childUuid);

    if (!childEntry) return;

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0 || !childEntry.uriBFLite) return;

    if (childEntry.type === AdvancedFieldType.literal) {
      structureResult[childEntry.uriBFLite] = childValues.map(({ label }) => label);
    } else if (childEntry.type === AdvancedFieldType.simple) {
      structureResult[childEntry.uriBFLite] = childValues.map(({ meta, label }) => ({
        // TODO: take field names from the model
        'http://bibfra.me/vocab/lite/link': [meta?.uri],
        'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label],
      }));
    }
  }
}
