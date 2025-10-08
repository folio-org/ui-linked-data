import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { IValueFormatter } from './valueFormatter.interface';

export class DropdownValueFormatter implements IValueFormatter {
  formatLiteral(value: UserValueContents) {
    return value.label ? [value.label] : [];
  }

  formatSimple(value: UserValueContents) {
    return {
      [BFLITE_URIS.LINK]: [value.meta?.uri ?? ''],
      [BFLITE_URIS.LABEL]: [value.meta?.basicLabel ?? value.label ?? ''],
    };
  }

  formatComplex(value: UserValueContents, recordSchemaEntry?: RecordSchemaEntry): string | Record<string, string[]> {
    // If recordSchemaEntry has properties, try to generate complex object structure
    if (recordSchemaEntry?.properties && Object.keys(recordSchemaEntry.properties).length > 0) {
      const result: Record<string, string[]> = {};
      
      if (value.label && value.meta?.uri) {
        const properties = recordSchemaEntry.properties;
        
        // Find label property
        const labelProperty = Object.keys(properties).find(key => key === BFLITE_URIS.LABEL);
        if (labelProperty) {
          result[labelProperty] = [value.label];
        }
        
        // Find link property  
        const linkProperty = Object.keys(properties).find(key => key === BFLITE_URIS.LINK);
        if (linkProperty) {
          result[linkProperty] = [value.meta.uri];
        }
      }
      
      if (Object.keys(result).length > 0) {
        return result;
      }
    }
    
    // Default behavior - return ID-based structure as string
    return value.meta?.srsId ?? value.id ?? '';
  }
}
