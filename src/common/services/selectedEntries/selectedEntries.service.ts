import { ISelectedEntries } from './selectedEntries.interface';

export class SelectedEntriesService implements ISelectedEntries {
  constructor(private selectedEntries: string[] = []) {
    this.selectedEntries = [...selectedEntries];
  }

  get() {
    return this.selectedEntries;
  }

  addNew(selectedEntryUuid?: string, newEntryUuid?: string) {
    if (!newEntryUuid) return;

    const filteredSelectedEntries = this.selectedEntries.filter(uuid => uuid !== selectedEntryUuid);

    this.selectedEntries = [...filteredSelectedEntries, newEntryUuid];
  }

  addDuplicated(originalEntryUuid: string, updatedEntryUuid: string) {
    if (!this.selectedEntries.includes(originalEntryUuid)) return;

    this.selectedEntries.push(updatedEntryUuid);
  }
}
