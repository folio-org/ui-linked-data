import { cloneDeep } from 'lodash';
import { RECORD_NORMALIZING_CASES } from './recordProcessingMap';
import { BLOCK_URIS_BFLITE } from '@common/constants/bibframeMapping.constants';

export class RecordNormalizingService {
  constructor(private record: RecordEntry) {
    this.record = cloneDeep(record);

    this.decoupleBlocks();
    this.normalize();
  }

  get() {
    return this.record;
  }

  // TODO: use a new API contract
  private decoupleBlocks() {
    // Pass the block URIs for the required profile?
    const instantiates = this.record[BLOCK_URIS_BFLITE.INSTANCE]?.[BLOCK_URIS_BFLITE.WORK];

    if (!instantiates) return;

    this.record[BLOCK_URIS_BFLITE.WORK] = instantiates[0] as unknown as Record<string, RecursiveRecordSchema>;

    delete this.record[BLOCK_URIS_BFLITE.INSTANCE]?.[BLOCK_URIS_BFLITE.WORK];
  }

  private normalize() {
    for (const recordBlockKey in this.record) {
      for (const recordGroup in this.record[recordBlockKey]) {
        (RECORD_NORMALIZING_CASES as RecordNormalizingCasesMap)?.[recordGroup]?.process?.(
          this.record,
          recordBlockKey,
          recordGroup,
        );
      }
    }
  }
}
