import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { ProcessorResult, SimpleFieldResult } from '../../types/profileSchemaProcessor.types';
import { ProfileSchemaProcessorManager } from './profileSchemaProcessorManager';
import { ProcessorUtils } from './utils/processorUtils';
import { DropdownValueFormatter } from './formatters/value/dropdownValueFormatter';
import { BaseFieldProcessor } from './baseFieldProcessor';

export abstract class BaseDropdownProcessor extends BaseFieldProcessor {
  constructor(
    protected readonly profileSchemaManager: ProfileSchemaManager,
    protected readonly profileSchemaProcessorManager: ProfileSchemaProcessorManager,
  ) {
    super(profileSchemaManager, new DropdownValueFormatter());
  }

  abstract canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry): boolean;

  abstract process(
    profileSchemaEntry: SchemaEntry,
    userValues: UserValues,
    recordSchemaEntry: RecordSchemaEntry,
  ): ProcessorResult[];

  protected initializeProcessor(
    profileSchemaEntry: SchemaEntry,
    userValues: UserValues,
    recordSchemaEntry: RecordSchemaEntry,
  ) {
    this.profileSchemaEntry = profileSchemaEntry;
    this.userValues = userValues;
    this.recordSchemaEntry = recordSchemaEntry;
  }

  protected processDropdownChildren(dropdownEntry: SchemaEntry) {
    const results: ProcessorResult[] = [];

    if (!dropdownEntry.children) return results;

    dropdownEntry.children.forEach(optionUuid => {
      const optionEntry = this.profileSchemaManager.getSchemaEntry(optionUuid);

      if (!optionEntry?.children || !this.profileSchemaManager.hasOptionValues(optionEntry, this.userValues)) return;

      const result = this.processOptionEntry(optionEntry);

      if (result) {
        results.push(result);
      }
    });

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
      return childValues.flatMap(value => this.valueFormat.formatLiteral(value)).filter(Boolean);
    }

    if (recordSchemaEntry) {
      return this.profileSchemaProcessorManager.process(childEntry, recordSchemaEntry, this.userValues);
    } else {
      return this.processSimpleChildValues(childValues);
    }
  }

  protected processSimpleChildValues(childValues?: UserValueContents[]) {
    if (!childValues) return [];

    return childValues
      .map(value => this.valueFormat.formatSimple(value))
      .filter((result): result is SimpleFieldResult => !Array.isArray(result));
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
  ) {
    childUuids.forEach(childUuid => {
      const childEntry = this.profileSchemaManager.getSchemaEntry(childUuid);

      if (!childEntry?.uriBFLite) return;

      const childRecordSchemaField = recordSchemaField?.fields?.[childEntry.uriBFLite];
      const childValues = this.processChildValues(childEntry, childRecordSchemaField);

      if (childValues) {
        this.mergeChildValues(result, childEntry.uriBFLite, childValues);
      }
    });
  }

  private mergeChildValues(
    result: ProcessorResult,
    key: string,
    childValues: string[] | ProcessorResult | SimpleFieldResult[] | null,
  ) {
    if (!childValues) return;

    if (result[key]) {
      const existing = result[key];

      if (ProcessorUtils.canMergeArrays(existing, childValues)) {
        result[key] = ProcessorUtils.mergeArrays(existing, childValues);
      } else {
        result[key] = childValues;
      }
    } else {
      result[key] = childValues;
    }
  }
}
