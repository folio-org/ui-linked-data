import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';

export class FlattenedDropdownProcessor implements IProfileSchemaProcessor {
  private userValues: UserValues = {};

  constructor(private readonly profileSchemaManager: ProfileSchemaManager) {}

  canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry) {
    return (
      profileSchemaEntry.type === AdvancedFieldType.dropdown && recordSchemaEntry.options?.flattenDropdown === true
    );
  }

  process(profileSchemaEntry: SchemaEntry, userValues: UserValues, recordSchemaEntry: RecordSchemaEntry) {
    this.userValues = userValues;

    const sourceField = recordSchemaEntry.options?.sourceField ?? BFLITE_URIS.SOURCE;

    return this.processFlattenedDropdown(profileSchemaEntry, sourceField);
  }

  private processFlattenedDropdown(profileSchemaEntry: SchemaEntry, sourceField: string) {
    const results: Array<Record<string, any>> = [];

    if (!profileSchemaEntry.children) return results;

    for (const optionUuid of profileSchemaEntry.children) {
      const optionEntry = this.profileSchemaManager.getSchemaEntry(optionUuid);

      if (!optionEntry?.children || !this.profileSchemaManager.hasOptionValues(optionEntry, this.userValues)) continue;

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
    const childEntry = this.profileSchemaManager.getSchemaEntry(childUuid);

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
