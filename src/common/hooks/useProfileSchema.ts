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
    const updatedSelectedEntries = new SelectedEntriesService(selectedEntries);
    const updatedSchema = new SchemaWithDuplicatesService(schema, updatedSelectedEntries);
    updatedSchema.duplicateEntry(entry);

    setSelectedEntries(updatedSelectedEntries.get());

    return updatedSchema.get();
  };

  return { getSchemaWithCopiedEntries };
};
