import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { IValueFormatter } from './valueFormatter.interface';

export class GroupValueFormatter implements IValueFormatter {
  formatLiteral(value: UserValueContents) {
    return value.label ? [value.label] : [];
  }

  formatSimple(value: UserValueContents, recordSchemaEntry?: RecordSchemaEntry) {
    if (!value.meta?.uri) return [];

    if (recordSchemaEntry?.options?.mappedValues) {
      const mappedUri = Object.entries(recordSchemaEntry.options.mappedValues).find(
        ([, mappedValue]) => mappedValue.uri === value.meta?.uri,
      )?.[0];

      if (mappedUri) return [mappedUri];
    }

    if (recordSchemaEntry?.options?.includeTerm) {
      return {
        [BFLITE_URIS.LINK]: [value.meta.uri],
        [BFLITE_URIS.TERM]: [value.meta?.basicLabel ?? value.label ?? ''],
      };
    }

    return [value.meta.uri];
  }

  formatComplex(value: UserValueContents, recordSchemaEntry?: RecordSchemaEntry): string | Record<string, string[]> {
    // If recordSchemaEntry has properties (like for _hub), generate the complex object structure
    if (recordSchemaEntry?.properties && Object.keys(recordSchemaEntry.properties).length > 0) {
      const result: Record<string, string[]> = {};
      
      // For hub entries, we expect label and link from the user value
      if (value.label && value.meta?.uri) {
        // Map to the BF Lite URIs defined in the record schema
        const properties = recordSchemaEntry.properties;
        
        // Find label property (should be BFLITE_URIS.LABEL)
        const labelProperty = Object.keys(properties).find(key => key === BFLITE_URIS.LABEL);
        if (labelProperty) {
          result[labelProperty] = [value.label];
        }
        
        // Find link property (should be BFLITE_URIS.LINK)  
        const linkProperty = Object.keys(properties).find(key => key === BFLITE_URIS.LINK);
        if (linkProperty) {
          result[linkProperty] = [value.meta.uri];
        }
      }
      
      return result;
    }
    
    // Default behavior for simple complex values (return ID)
    const selectedId = value.meta?.srsId ?? value.id ?? '';
    return Array.isArray(selectedId) ? selectedId[0] : selectedId;
  }
}
