import _ from 'lodash';
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
    const updatedSelectedEntriesService = new SelectedEntriesService(selectedEntries);
    const updatedSchemaService = new SchemaWithDuplicatesService(schema, updatedSelectedEntriesService);
    updatedSchemaService.duplicateEntry(entry);

    setSelectedEntries(updatedSelectedEntriesService.get());

    return updatedSchemaService.get();
  };

  return { getSchemaWithCopiedEntries };
};
