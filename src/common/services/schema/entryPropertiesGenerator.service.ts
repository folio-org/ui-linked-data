import { getHtmlIdForEntry } from '@/common/helpers/schema.helper';

import { IEntryPropertiesGeneratorService } from './entryPropertiesGenerator.interface';

export class EntryPropertiesGeneratorService implements IEntryPropertiesGeneratorService {
  private entriesWithHtmlId: string[];

  constructor() {
    this.entriesWithHtmlId = [];
  }

  addEntryWithHtmlId(uuid: string) {
    this.entriesWithHtmlId = [...this.entriesWithHtmlId, uuid];
  }

  applyHtmlIdToEntries(schema: Schema) {
    for (const uuid of this.entriesWithHtmlId) {
      const entry = schema.get(uuid);

      if (entry) {
        schema.set(uuid, { ...entry, htmlId: getHtmlIdForEntry(entry, schema) });
      }
    }

    this.entriesWithHtmlId = [];
  }
}
