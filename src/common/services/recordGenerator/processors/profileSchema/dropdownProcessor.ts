import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';

export class DropdownProcessor implements IProfileSchemaProcessor {
  private userValues: UserValues = {};
  private profileSchemaEntry: SchemaEntry | null = null;
  private recordSchemaEntry: RecordSchemaEntry | null = null;

  constructor(private readonly profileSchemaManager: ProfileSchemaManager) {}

  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      profileSchemaEntry.type === AdvancedFieldType.dropdown &&
      !recordSchemaEntry.options?.hiddenWrapper &&
      !recordSchemaEntry.options?.flattenDropdown
    );
  }

  process(profileSchemaEntry: SchemaEntry, userValues: UserValues, recordSchemaEntry: RecordSchemaEntry) {
    this.profileSchemaEntry = profileSchemaEntry;
    this.userValues = userValues;
    this.recordSchemaEntry = recordSchemaEntry;

    return this.processDropdown();
  }

  private processDropdown() {
    const results: Array<Record<string, any>> = [];

    if (!this.profileSchemaEntry?.children) return results;

    for (const optionUuid of this.profileSchemaEntry.children) {
      const optionEntry = this.profileSchemaManager.getSchemaEntry(optionUuid);

      if (!optionEntry?.children) continue;

      if (!this.profileSchemaManager.hasOptionValues(optionEntry, this.userValues)) continue;

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
    const childEntry = this.profileSchemaManager.getSchemaEntry(childUuid);

    if (!childEntry) return;

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0 || !childEntry.uriBFLite) return;

    if (childEntry.type === AdvancedFieldType.literal) {
      structureResult[childEntry.uriBFLite] = childValues.map(({ label }) => label);
    } else if (childEntry.type === AdvancedFieldType.simple) {
      structureResult[childEntry.uriBFLite] = childValues.map(({ meta, label }) => ({
        // TODO: take field names from the record schema
        'http://bibfra.me/vocab/lite/link': [meta?.uri],
        'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label],
      }));
    }
  }
}
