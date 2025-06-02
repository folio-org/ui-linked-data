import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { SimpleFieldResult } from '@common/services/recordGenerator/types/profileSchemaProcessor.types';
import { IValueFormatter } from './valueFormater.interface';

export class DropdownValueFormatter implements IValueFormatter {
  formatLiteral(value: UserValueContents): string[] {
    return value.label ? [value.label] : [];
  }

  formatSimple(value: UserValueContents): SimpleFieldResult {
    return {
      [BFLITE_URIS.LINK]: [value.meta?.uri ?? ''],
      [BFLITE_URIS.LABEL]: [value.meta?.basicLabel ?? value.label ?? ''],
    };
  }

  formatComplex(value: UserValueContents): any {
    return value.meta?.srsId ? { srsId: value.meta.srsId } : { id: value.id };
  }
}
