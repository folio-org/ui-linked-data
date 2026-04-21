import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';

import { BaseValueFormatter } from './baseValueFormatter';

export class DropdownValueFormatter extends BaseValueFormatter {
  formatSimple(value: UserValueContents) {
    const uri = value.meta?.uri;
    const label = value.meta?.basicLabel ?? value.label ?? '';

    return this.buildLinkLabelObject(BFLITE_URIS.LABEL, label, uri);
  }
}
