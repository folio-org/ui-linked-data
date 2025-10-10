import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { BaseValueFormatter } from './baseValueFormatter';

export class DropdownValueFormatter extends BaseValueFormatter {
  formatSimple(value: UserValueContents) {
    return {
      [BFLITE_URIS.LINK]: [value.meta?.uri ?? ''],
      [BFLITE_URIS.LABEL]: [value.meta?.basicLabel ?? value.label ?? ''],
    };
  }
}
