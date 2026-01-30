import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import {
  ExtendedPropertyResult,
  ProcessorResult,
  SimplePropertyResult,
} from '@/common/services/recordGenerator/types/profileSchemaProcessor.types';

export class ProcessorUtils {
  static isStringArray(arr: unknown[]): boolean {
    return arr.length === 0 || typeof arr[0] === 'string';
  }

  static isSimplePropertyResultArray(arr: unknown[]): boolean {
    return (
      arr.length === 0 ||
      (typeof arr[0] === 'object' && arr[0] !== null && BFLITE_URIS.LINK in arr[0] && BFLITE_URIS.LABEL in arr[0])
    );
  }

  static mergeArrays(
    existing: string[] | SimplePropertyResult[] | ExtendedPropertyResult[] | ProcessorResult | ProcessorResult[],
    childValues: string[] | ProcessorResult | SimplePropertyResult[],
  ) {
    if (ProcessorUtils.isStringArray(existing as unknown[]) && ProcessorUtils.isStringArray(childValues as unknown[])) {
      return [...(existing as string[]), ...(childValues as string[])];
    }

    if (
      ProcessorUtils.isSimplePropertyResultArray(existing as unknown[]) &&
      ProcessorUtils.isSimplePropertyResultArray(childValues as unknown[])
    ) {
      return [...(existing as SimplePropertyResult[]), ...(childValues as SimplePropertyResult[])];
    }

    return childValues;
  }

  static canMergeArrays(
    existing: string[] | SimplePropertyResult[] | ExtendedPropertyResult[] | ProcessorResult | ProcessorResult[],
    childValues: string[] | ProcessorResult | SimplePropertyResult[],
  ): boolean {
    return (
      Array.isArray(existing) &&
      Array.isArray(childValues) &&
      ((ProcessorUtils.isStringArray(existing as unknown[]) &&
        ProcessorUtils.isStringArray(childValues as unknown[])) ||
        (ProcessorUtils.isSimplePropertyResultArray(existing as unknown[]) &&
          ProcessorUtils.isSimplePropertyResultArray(childValues as unknown[])))
    );
  }

  static extractLabel(value: UserValueContents): string {
    return value.label ?? '';
  }

  static extractUri(value: UserValueContents): string {
    return value.meta?.uri ?? '';
  }
}
