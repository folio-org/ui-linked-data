import { SimplePropertyResult } from '@common/services/recordGenerator/types/profileSchemaProcessor.types';

export interface IValueFormatter {
  formatLiteral(value: UserValueContents): string[];

  formatSimple(value: UserValueContents, recordSchemaEntry?: RecordSchemaEntry): string[] | SimplePropertyResult;

  formatComplex(value: UserValueContents, recordSchemaEntry?: RecordSchemaEntry): string | Record<string, string[]> | null;
}
