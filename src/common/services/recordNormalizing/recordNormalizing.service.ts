import { cloneDeep } from 'lodash';
import { RECORD_NORMALIZING_CASES } from './recordProcessingMap';
import { getEditingRecordBlocks } from '@common/helpers/record.helper';

export class RecordNormalizingService {
  private recordBlocks: string[];
  private block?: string;
  private reference?: { key: string; uri: string };

  constructor(private record: RecordEntry) {
    this.record = cloneDeep(record);
    this.recordBlocks = [];

    this.generateBlocksStructure();
    this.decoupleBlocks();
    this.normalize();
  }

  get() {
    return this.record;
  }

  getRecordBlocks() {
    return this.recordBlocks;
  }

  private generateBlocksStructure() {
    const { block, reference } = getEditingRecordBlocks(this.record);

    if (!block || !reference) return;

    this.block = block;
    this.reference = reference;
    this.recordBlocks = [block, reference?.uri];
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
