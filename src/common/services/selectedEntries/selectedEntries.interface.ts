interface ISelectedEntries {
  get: () => string[] | undefined;

  addNew: (originalEntryUuid: string, updatedEntryUuid: string) => void;

  addDuplicated: (originalEntryUuid: string, updatedEntryUuid: string) => void;
}
