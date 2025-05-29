import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';
import { ProcessorResult } from '../../types/profileSchemaProcessor.types';

export abstract class BaseDropdownProcessor implements IProfileSchemaProcessor {
  protected userValues: UserValues = {};

  constructor(protected readonly profileSchemaManager: ProfileSchemaManager) {}

  abstract canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry): boolean;

  abstract process(
    profileSchemaEntry: SchemaEntry,
    userValues: UserValues,
    recordSchemaEntry: RecordSchemaEntry,
  ): ProcessorResult[];

  protected processDropdownChildren(dropdownEntry: SchemaEntry) {
    const results: ProcessorResult[] = [];

    if (!dropdownEntry.children) return results;

    for (const optionUuid of dropdownEntry.children) {
      const optionEntry = this.profileSchemaManager.getSchemaEntry(optionUuid);

      if (!optionEntry?.children || !this.profileSchemaManager.hasOptionValues(optionEntry, this.userValues)) continue;

      const result = this.processOptionEntry(optionEntry);

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  protected abstract processOptionEntry(optionEntry: SchemaEntry): ProcessorResult | null;

  protected processChildValues(childEntry?: SchemaEntry) {
    if (!childEntry) {
      return null;
    }

    const childValues = this.userValues[childEntry.uuid]?.contents || [];

    if (childValues.length === 0 || !childEntry.uriBFLite) {
      return null;
    }

    if (childEntry.type === AdvancedFieldType.literal) {
      return childValues.map(({ label }) => label ?? '').filter(Boolean);
    }

    return this.processSimpleChildValues(childValues);
  }
  protected processSimpleChildValues(childValues?: UserValueContents[]) {
    if (!childValues) return [];
    return childValues.map(({ meta, label }) => ({
      'http://bibfra.me/vocab/lite/link': [meta?.uri ?? ''],
      'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label ?? ''],
    }));
  }

  protected processChildren(optionEntry: SchemaEntry) {
    const result: ProcessorResult = {};

    if (!optionEntry.children) return result;

    for (const childUuid of optionEntry.children) {
      const childEntry = this.profileSchemaManager.getSchemaEntry(childUuid);
      const childValues = this.processChildValues(childEntry);

      if (childEntry?.uriBFLite && childValues) {
        result[childEntry.uriBFLite] = childValues;
      }
    }

    return result;
  }
}
