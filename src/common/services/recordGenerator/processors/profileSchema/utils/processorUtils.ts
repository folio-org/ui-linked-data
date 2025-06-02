import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import {
  ProcessorResult,
  SimpleFieldResult,
  ExtendedFieldResult,
} from '@common/services/recordGenerator/types/profileSchemaProcessor.types';

export class ProcessorUtils {
  static isStringArray(arr: unknown[]): boolean {
    return arr.length === 0 || typeof arr[0] === 'string';
  }

  static isSimpleFieldResultArray(arr: unknown[]): boolean {
    return (
      arr.length === 0 ||
      (typeof arr[0] === 'object' && arr[0] !== null && BFLITE_URIS.LINK in arr[0] && BFLITE_URIS.LABEL in arr[0])
    );
  }

  static mergeArrays(
    existing: string[] | SimpleFieldResult[] | ExtendedFieldResult[] | ProcessorResult | ProcessorResult[],
    childValues: string[] | ProcessorResult | SimpleFieldResult[],
  ) {
    if (ProcessorUtils.isStringArray(existing as unknown[]) && ProcessorUtils.isStringArray(childValues as unknown[])) {
      return [...(existing as string[]), ...(childValues as string[])];
    }

    if (
      ProcessorUtils.isSimpleFieldResultArray(existing as unknown[]) &&
      ProcessorUtils.isSimpleFieldResultArray(childValues as unknown[])
    ) {
      return [...(existing as SimpleFieldResult[]), ...(childValues as SimpleFieldResult[])];
    }

    return childValues;
  }

  static canMergeArrays(
    existing: string[] | SimpleFieldResult[] | ExtendedFieldResult[] | ProcessorResult | ProcessorResult[],
    childValues: string[] | ProcessorResult | SimpleFieldResult[],
  ): boolean {
    return (
      Array.isArray(existing) &&
      Array.isArray(childValues) &&
      ((ProcessorUtils.isStringArray(existing as unknown[]) &&
        ProcessorUtils.isStringArray(childValues as unknown[])) ||
        (ProcessorUtils.isSimpleFieldResultArray(existing as unknown[]) &&
          ProcessorUtils.isSimpleFieldResultArray(childValues as unknown[])))
    );
  }

  static extractLabel(value: UserValueContents): string {
    return value.label ?? '';
  }

  static extractUri(value: UserValueContents): string {
    return value.meta?.uri ?? '';
  }
}
