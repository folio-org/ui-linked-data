export interface ISelectedEntries {
  get: () => string[];

  set: (selectedEntries: string[]) => void;

  addNew: (originalEntryUuid?: string, updatedEntryUuid?: string) => void;

  addDuplicated: (originalEntryUuid: string, updatedEntryUuid: string) => void;

  remove: (selectedEntryUuid?: string) => void;
}
