export class SelectedEntriesService implements ISelectedEntries {
  constructor(private selectedEntries: string[] = []) {
    this.selectedEntries = [...selectedEntries];
  }

  get() {
    return this.selectedEntries;
  }

  addNew(selectedOptionId?: string, newOptionId?: string) {
    const filteredSelectedentries = this.selectedEntries.filter(id => id !== selectedOptionId);

    if (!newOptionId) return;

    this.selectedEntries = [...filteredSelectedentries, newOptionId];
  }

  addDuplicated(originalEntryUuid: string, updatedEntryUuid: string) {
    if (!this.selectedEntries?.includes(originalEntryUuid)) return;

    this.selectedEntries.push(updatedEntryUuid);
  }
}
