import { SelectedEntriesService } from '@common/services/selectedEntries';

describe('SelectedEntriesService', () => {
  const selectedEntries = ['test_01', 'test_02'];
  const selectedEntryId = 'test_01';
  const newEntryId = 'test_03';
  let selectedEntriesService: ISelectedEntries;

  beforeEach(() => {
    selectedEntriesService = new SelectedEntriesService(selectedEntries);
  });

  test('addNew - adds a new entry', () => {
    const testResult = ['test_02', 'test_03'];

    selectedEntriesService.addNew(selectedEntryId, newEntryId);

    expect(selectedEntriesService.get()).toEqual(testResult);
  });

  test('addDuplicated - adds a duplicated entry', () => {
    const testResult = ['test_01', 'test_02', 'test_03'];

    selectedEntriesService.addDuplicated(selectedEntryId, newEntryId);

    expect(selectedEntriesService.get()).toEqual(testResult);
  });
});
