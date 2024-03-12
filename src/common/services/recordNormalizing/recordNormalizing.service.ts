import { cloneDeep } from 'lodash';
import { RECORD_NORMALIZING_CASES } from './recordProcessingMap';
import { BLOCKS_BFLITE } from '@common/constants/bibframeMapping.constants';

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
    const typedBlocksList = BLOCKS_BFLITE as RecordBlocks;

    for (const block in typedBlocksList) {
      const blockItem = typedBlocksList[block];

      if (!this.record[blockItem.uri]) continue;

      this.block = blockItem.uri;
      this.reference = blockItem.reference;

      this.recordBlocks.push(blockItem.uri);
      this.recordBlocks.push(blockItem.reference.uri);
    }
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
