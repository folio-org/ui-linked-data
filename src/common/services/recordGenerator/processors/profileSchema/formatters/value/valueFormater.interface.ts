import { SimpleFieldResult } from '@common/services/recordGenerator/types/profileSchemaProcessor.types';

export interface IValueFormatter {
  formatLiteral(value: UserValueContents): string[];

  formatSimple(value: UserValueContents, recordSchemaEntry?: RecordSchemaEntry): string[] | SimpleFieldResult;

  formatComplex(value: UserValueContents): any;
}
