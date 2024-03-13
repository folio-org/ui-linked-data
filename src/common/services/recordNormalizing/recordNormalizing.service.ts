import { cloneDeep } from 'lodash';
import { RECORD_NORMALIZING_CASES } from './recordProcessingMap';

export class RecordNormalizingService {
  constructor(
    private record: RecordEntry,
    private block?: string,
    private reference?: { key: string; uri: string },
  ) {
    this.record = cloneDeep(record);

    this.decoupleBlocks();
    this.normalize();
  }

  get() {
    return this.record;
  }

  // Pass the block URIs for the required profile?
  private decoupleBlocks() {
    if (!this.block || !this.reference) return;

    const reference = this.record[this.block]?.[this.reference?.key];

    if (!reference) return;

    this.record[this.reference?.uri] = reference[0] as unknown as Record<string, RecursiveRecordSchema>;

    delete this.record[this.block]?.[this.reference?.key];
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
