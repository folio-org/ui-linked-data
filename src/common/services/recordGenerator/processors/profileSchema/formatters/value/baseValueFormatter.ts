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
  ): string | Record<string, string | string[]> | null {
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
  ): Record<string, string | string[]> {
    const result: Record<string, string | string[]> = {};

    if (!value.label) {
      return result;
    }

    Object.entries(properties).forEach(([propertyKey, propertySchema]) => {
      const mappedValue = this.getValueFromSource(value, propertySchema.options?.valueSource, propertyKey);

      if (mappedValue !== null && mappedValue !== undefined && mappedValue !== '') {
        // Use the schema type: array or string
        const isArrayType = propertySchema.type === 'array';

        if (isArrayType) {
          result[propertyKey] = Array.isArray(mappedValue) ? mappedValue : [mappedValue];
        } else {
          result[propertyKey] = Array.isArray(mappedValue) ? mappedValue[0] : mappedValue;
        }
      }
    });

    return result;
  }

  private getValueFromSource(
    value: UserValueContents,
    valueSource: string | undefined,
    propertyKey: string,
  ): string | string[] | null {
    if (valueSource) {
      return this.resolveValuePath(value, valueSource);
    }

    // Fallback: existing heuristic-based mapping for backward compatibility
    return this.baseValueMapping(value, propertyKey);
  }

  private resolveValuePath(value: UserValueContents, path: string): string | null {
    // Simple path resolver for dot notation (e.g., 'meta.uri')
    const parts = path.split('.');
    let current: unknown = value;

    for (const part of parts) {
      if (current === null || current === undefined) return null;

      current = (current as Record<string, unknown>)[part];
    }

    return typeof current === 'string' ? current : null;
  }

  private baseValueMapping(value: UserValueContents, propertyKey: string): string | null {
    if (propertyKey === BFLITE_URIS.LABEL) {
      return value.label ?? null;
    }

    if (propertyKey === BFLITE_URIS.LINK) {
      return value.meta?.uri ?? null;
    }

    return null;
  }
}
