import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { hasAllEmptyValues } from '@/common/helpers/record.helper';

import { IProfileSchemaManager } from '../../profileSchemaManager.interface';
import { ProcessContext } from '../../types/common.types';
import { ProcessorResult, SimplePropertyResult } from '../../types/profileSchemaProcessor.types';
import { BaseFieldProcessor } from './baseFieldProcessor';
import { DropdownValueFormatter } from './formatters/value/dropdownValueFormatter';
import { IProfileSchemaProcessorManager } from './profileSchemaProcessorManager.interface';
import { ProcessorUtils } from './utils/processorUtils';

export abstract class BaseDropdownProcessor extends BaseFieldProcessor {
  constructor(
    protected readonly profileSchemaManager: IProfileSchemaManager,
    protected readonly profileSchemaProcessorManager: IProfileSchemaProcessorManager,
  ) {
    super(profileSchemaManager, new DropdownValueFormatter());
  }

  abstract canProcess(profileSchemaEntry: SchemaEntry, recordSchemaEntry: RecordSchemaEntry): boolean;

  abstract process(data: ProcessContext): ProcessorResult[];

  protected initializeProcessor({
    profileSchemaEntry,
    userValues,
    selectedEntries,
    recordSchemaEntry,
  }: ProcessContext) {
    this.profileSchemaEntry = profileSchemaEntry;
    this.userValues = userValues;
    this.selectedEntries = selectedEntries;
    this.recordSchemaEntry = recordSchemaEntry;
  }

  protected processDropdownChildren(dropdownEntry: SchemaEntry, selectedEntries: string[]) {
    const results: ProcessorResult[] = [];

    if (!dropdownEntry.children) return results;

    dropdownEntry.children.forEach(optionUuid => {
      const optionEntry = this.profileSchemaManager.getSchemaEntry(optionUuid);

      if (
        !optionEntry?.children ||
        !selectedEntries.includes(optionEntry.uuid) ||
        !this.profileSchemaManager.hasOptionValues(optionEntry, this.userValues)
      )
        return;

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

    if (childValues.length === 0 || hasAllEmptyValues(childValues) || !childEntry.uriBFLite) {
      return null;
    }

    if (childEntry.type === AdvancedFieldType.literal) {
      return childValues.flatMap(value => this.valueFormat.formatLiteral(value)).filter(Boolean);
    }

    if (recordSchemaEntry) {
      return this.profileSchemaProcessorManager.process({
        profileSchemaEntry: childEntry,
        recordSchemaEntry,
        userValues: this.userValues,
        selectedEntries: this.selectedEntries,
      });
    } else {
      return this.processSimpleChildValues(childValues);
    }
  }

  protected processSimpleChildValues(childValues?: UserValueContents[]) {
    if (!childValues) return [];

    return childValues
      .map(value => this.valueFormat.formatSimple(value))
      .filter((result): result is SimplePropertyResult => !Array.isArray(result));
  }

  protected processChildren(optionEntry: SchemaEntry) {
    const result: ProcessorResult = {};

    if (!optionEntry.children || !this.recordSchemaEntry?.properties) {
      return result;
    }

    const recordSchemaProperty = this.recordSchemaEntry.properties[optionEntry.uriBFLite ?? ''];

    this.processChildEntries(optionEntry.children, recordSchemaProperty, result);

    return result;
  }

  private processChildEntries(
    childUuids: string[],
    recordSchemaProperty: RecordSchemaEntry | undefined,
    result: ProcessorResult,
  ) {
    childUuids.forEach(childUuid => {
      const childEntry = this.profileSchemaManager.getSchemaEntry(childUuid);

      if (!childEntry?.uriBFLite) return;

      const childRecordSchemaProperty = recordSchemaProperty?.properties?.[childEntry.uriBFLite];
      const childValues = this.processChildValues(childEntry, childRecordSchemaProperty);

      if (childValues) {
        this.mergeChildValues(result, childEntry.uriBFLite, childValues);
      }
    });
  }

  private mergeChildValues(
    result: ProcessorResult,
    key: string,
    childValues: string[] | ProcessorResult | SimplePropertyResult[] | null,
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
