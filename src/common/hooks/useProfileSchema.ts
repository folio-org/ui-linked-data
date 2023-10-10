import { useSetRecoilState } from 'recoil';
import state from '@state';
import { SchemaWithDuplicatesService } from '@common/services/schema';
import { SelectedEntriesService } from '@common/services/selectedEntries';

export const useProfileSchema = () => {
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);

  const getSchemaWithCopiedEntries = (
    schema: Map<string, SchemaEntry>,
    entry: SchemaEntry,
    selectedEntries: string[],
  ) => {
    const selectedEntriesService = new SelectedEntriesService(selectedEntries);
    const schemaWithDuplicatesService = new SchemaWithDuplicatesService(schema, selectedEntriesService);
    schemaWithDuplicatesService.duplicateEntry(entry);

    setSelectedEntries(selectedEntriesService.get());

    return schemaWithDuplicatesService.get();
  };

  return { getSchemaWithCopiedEntries };
};
