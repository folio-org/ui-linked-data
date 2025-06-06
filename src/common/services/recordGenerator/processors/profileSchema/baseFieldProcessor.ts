import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ProfileSchemaManager } from '../../profileSchemaManager';
import { IProfileSchemaProcessor } from './profileSchemaProcessor.interface';
import { ProcessorResult } from '../../types/profileSchemaProcessor.types';
import { IValueFormatter } from './formatters';
import { ProcessorUtils } from './utils/processorUtils';

export abstract class BaseFieldProcessor implements IProfileSchemaProcessor {
  protected userValues: UserValues = {};
  protected profileSchemaEntry: SchemaEntry | null = null;
  protected recordSchemaEntry: RecordSchemaEntry | null = null;

  constructor(
    protected readonly profileSchemaManager: ProfileSchemaManager,
    protected readonly valueFormat: IValueFormatter,
  ) {}

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

  protected processValueByType(
    type: AdvancedFieldType,
    value: UserValueContents,
    recordSchemaEntry?: RecordSchemaEntry,
  ) {
    switch (type) {
      case AdvancedFieldType.literal:
        return this.valueFormat.formatLiteral(value);
      case AdvancedFieldType.simple:
        return this.valueFormat.formatSimple(value, recordSchemaEntry);
      case AdvancedFieldType.complex:
        return this.valueFormat.formatComplex(value);
      default:
        return null;
    }
  }

  protected mergeValues(existing: any, childValues: any) {
    if (ProcessorUtils.canMergeArrays(existing, childValues)) {
      return ProcessorUtils.mergeArrays(existing, childValues);
    }
    return childValues;
  }
}
