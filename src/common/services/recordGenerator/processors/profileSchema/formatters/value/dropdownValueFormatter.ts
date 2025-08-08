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

  formatComplex(value: UserValueContents) {
    return value.meta?.srsId ? { srsId: value.meta.srsId } : { id: value.id };
  }
}
