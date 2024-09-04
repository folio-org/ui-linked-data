export interface IRecordNormalizing {
  init: (record: RecordEntry, block?: string, reference?: RecordReference) => void;

  get: () => RecordEntry<RecursiveRecordSchema>;
}
