import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';
import { ExtendedFieldResult, ProcessorResult, SimpleFieldResult } from '../../types/profileSchemaProcessor.types';
import { ProfileSchemaProcessorManager } from './profileSchemaProcessorManager';

export abstract class BaseDropdownProcessor implements IProfileSchemaProcessor {
  protected userValues: UserValues = {};
  protected profileSchemaEntry: SchemaEntry | null = null;
  protected recordSchemaEntry: RecordSchemaEntry | null = null;

  constructor(
    protected readonly profileSchemaManager: ProfileSchemaManager,
    protected readonly profileSchemaProcessorManager: ProfileSchemaProcessorManager,
  ) {}

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

  protected processChildValues(childEntry?: SchemaEntry, recordSchemaEntry?: RecordSchemaEntry) {
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

    if (recordSchemaEntry) {
      return this.profileSchemaProcessorManager.process(childEntry, recordSchemaEntry, this.userValues);
    } else {
      return this.processSimpleChildValues(childValues);
    }
  }

  protected processSimpleChildValues(childValues?: UserValueContents[]): SimpleFieldResult[] {
    if (!childValues) return [];

    return childValues.map(({ meta, label }) => ({
      'http://bibfra.me/vocab/lite/link': [meta?.uri ?? ''],
      'http://bibfra.me/vocab/lite/label': [meta?.basicLabel ?? label ?? ''],
    }));
  }

  protected processChildren(optionEntry: SchemaEntry) {
    const result: ProcessorResult = {};

    if (!optionEntry.children || !this.recordSchemaEntry?.fields) {
      return result;
    }

    const recordSchemaField = this.recordSchemaEntry.fields[optionEntry.uriBFLite ?? ''];

    this.processChildEntries(optionEntry.children, recordSchemaField, result);

    return result;
  }

  private processChildEntries(
    childUuids: string[],
    recordSchemaField: RecordSchemaEntry | undefined,
    result: ProcessorResult,
  ): void {
    for (const childUuid of childUuids) {
      const childEntry = this.profileSchemaManager.getSchemaEntry(childUuid);

      if (!childEntry?.uriBFLite) continue;

      const childRecordSchemaField = recordSchemaField?.fields?.[childEntry.uriBFLite];
      const childValues = this.processChildValues(childEntry, childRecordSchemaField);

      if (childValues) {
        this.mergeChildValues(result, childEntry.uriBFLite, childValues);
      }
    }
  }

  private mergeChildValues(
    result: ProcessorResult,
    key: string,
    childValues: string[] | ProcessorResult | SimpleFieldResult[] | null,
  ): void {
    if (!childValues) return;

    if (result[key]) {
      const existing = result[key];

      if (this.canMergeArrays(existing, childValues)) {
        result[key] = this.mergeArrays(existing, childValues);
      } else {
        result[key] = childValues;
      }
    } else {
      result[key] = childValues;
    }
  }

  private canMergeArrays(
    existing: string[] | SimpleFieldResult[] | ExtendedFieldResult[] | ProcessorResult | ProcessorResult[],
    childValues: string[] | ProcessorResult | SimpleFieldResult[],
  ) {
    return (
      Array.isArray(existing) &&
      Array.isArray(childValues) &&
      ((this.isStringArray(existing as unknown[]) && this.isStringArray(childValues as unknown[])) ||
        (this.isSimpleFieldResultArray(existing as unknown[]) &&
          this.isSimpleFieldResultArray(childValues as unknown[])))
    );
  }

  private mergeArrays(
    existing: string[] | SimpleFieldResult[] | ExtendedFieldResult[] | ProcessorResult | ProcessorResult[],
    childValues: string[] | ProcessorResult | SimpleFieldResult[],
  ) {
    if (this.isStringArray(existing as unknown[]) && this.isStringArray(childValues as unknown[])) {
      return [...(existing as string[]), ...(childValues as string[])];
    }

    if (
      this.isSimpleFieldResultArray(existing as unknown[]) &&
      this.isSimpleFieldResultArray(childValues as unknown[])
    ) {
      return [...(existing as SimpleFieldResult[]), ...(childValues as SimpleFieldResult[])];
    }

    // Default case - just return the new values
    return childValues as string[] | SimpleFieldResult[];
  }

  private isStringArray(arr: unknown[]) {
    return arr.length === 0 || typeof arr[0] === 'string';
  }

  private isSimpleFieldResultArray(arr: unknown[]) {
    return (
      arr.length === 0 ||
      (typeof arr[0] === 'object' &&
        arr[0] !== null &&
        'http://bibfra.me/vocab/lite/link' in arr[0] &&
        'http://bibfra.me/vocab/lite/label' in arr[0])
    );
  }
}
