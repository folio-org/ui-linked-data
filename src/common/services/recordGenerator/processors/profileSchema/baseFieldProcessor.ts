import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { IProfileSchemaManager } from '../../profileSchemaManager.interface';
import { ProcessContext } from '../../types/common.types';
import {
  ExtendedPropertyResult,
  ProcessorResult,
  SimplePropertyResult,
} from '../../types/profileSchemaProcessor.types';
import { IValueFormatter } from './formatters';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';
import { ProcessorUtils } from './utils/processorUtils';

export abstract class BaseFieldProcessor implements IProfileSchemaProcessor {
  protected userValues: UserValues = {};
  protected selectedEntries: string[] = [];
  protected profileSchemaEntry: SchemaEntry | null = null;
  protected recordSchemaEntry: RecordSchemaEntry | null = null;

  constructor(
    protected readonly profileSchemaManager: IProfileSchemaManager,
    protected readonly valueFormat: IValueFormatter,
  ) {}

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

  protected processValueByType(
    type: AdvancedFieldType,
    value: UserValueContents,
    recordSchemaEntry?: RecordSchemaEntry,
  ) {
    switch (type) {
      case AdvancedFieldType.literal:
        return this.valueFormat.formatLiteral(value);
      case AdvancedFieldType.simple:
      case AdvancedFieldType.enumerated:
        return this.valueFormat.formatSimple(value, recordSchemaEntry);
      case AdvancedFieldType.complex:
        return this.valueFormat.formatComplex(value, recordSchemaEntry);
      default:
        return null;
    }
  }

  protected mergeValues(
    existing: string[] | SimplePropertyResult[] | ExtendedPropertyResult[] | ProcessorResult | ProcessorResult[],
    childValues: string[] | ProcessorResult | SimplePropertyResult[],
  ) {
    if (ProcessorUtils.canMergeArrays(existing, childValues)) {
      return ProcessorUtils.mergeArrays(existing, childValues);
    }
    return childValues;
  }
}
