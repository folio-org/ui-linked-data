import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { SimplePropertyResult } from '@/common/services/recordGenerator/types/profileSchemaProcessor.types';

import { IValueFormatter } from './valueFormatter.interface';

export abstract class BaseValueFormatter implements IValueFormatter {
  formatLiteral(value: UserValueContents): string[] {
    return value.label ? [value.label] : [];
  }

  abstract formatSimple(
    value: UserValueContents,
    recordSchemaEntry?: RecordSchemaEntry,
  ): string[] | SimplePropertyResult;

  formatComplex(
    value: UserValueContents,
    recordSchemaEntry?: RecordSchemaEntry,
  ): string | Record<string, string[]> | null {
    // If recordSchemaEntry has properties, try to generate complex object structure.
    // This is used for Hubs.
    if (recordSchemaEntry?.properties && Object.keys(recordSchemaEntry.properties).length > 0) {
      const result = this.buildComplexObject(value, recordSchemaEntry.properties);

      if (Object.keys(result).length > 0) {
        return result;
      }
    }

    // Default behavior - return ID-based structure as string.
    // This is used for Creator, Contributor, etc.
    const selectedId = value.meta?.srsId ?? value.id ?? '';

    return Array.isArray(selectedId) ? selectedId[0] : selectedId;
  }

  protected buildComplexObject(
    value: UserValueContents,
    properties: Record<string, RecordSchemaEntry>,
  ): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    if (!value.label || !value.meta?.uri) {
      return result;
    }

    const labelProperty = Object.keys(properties).find(key => key === BFLITE_URIS.LABEL);
    if (labelProperty) {
      result[labelProperty] = [value.label];
    }

    const linkProperty = Object.keys(properties).find(key => key === BFLITE_URIS.LINK);
    if (linkProperty) {
      result[linkProperty] = [value.meta.uri];
    }

    return result;
  }
}
