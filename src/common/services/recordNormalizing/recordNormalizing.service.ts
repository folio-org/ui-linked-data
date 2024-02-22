import { cloneDeep } from 'lodash';
import { RECORD_NORMALIZING_CASES } from './recordProcessingCases';

export class RecordNormalizingService {
  constructor(private record: RecordEntry) {
    this.record = cloneDeep(record);

    this.decoupleBlocks();
    this.normalize();
  }

  get() {
    return this.record;
  }

  private decoupleBlocks() {
    // Pass the block URIs for the required profile?
    const instantiates =
      this.record['http://bibfra.me/vocab/lite/Instance']?.['http://bibfra.me/vocab/lite/instantiates'];

    if (!instantiates) return;

    this.record['http://bibfra.me/vocab/lite/instantiates'] = instantiates[0];

    delete this.record['http://bibfra.me/vocab/lite/Instance']?.['http://bibfra.me/vocab/lite/instantiates'];
  }

  private normalize() {
    for (const recordBlockKey in this.record) {
      for (const recordGroup in this.record[recordBlockKey]) {
        RECORD_NORMALIZING_CASES?.[recordGroup]?.processor?.(this.record, recordBlockKey);
      }
    }
  }
}
