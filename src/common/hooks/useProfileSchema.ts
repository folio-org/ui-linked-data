import { useContext } from 'react';
import { useSetRecoilState } from 'recoil';
import { ServicesContext } from '@src/contexts';
import state from '@state';

export const useProfileSchema = () => {
  const {
    selectedEntriesService: baseSelectedEntriesService,
    schemaWithDuplicatesService: baseSchemaWithDuplicatesService,
  } = useContext(ServicesContext);
  const selectedEntriesService = baseSelectedEntriesService as ISelectedEntries;
  const schemaWithDuplicatesService = baseSchemaWithDuplicatesService as ISchemaWithDuplicates;
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);
  const setClonePrototypes = useSetRecoilState(state.config.clonePrototypes);

  const getSchemaWithCopiedEntries = (
    schema: Map<string, SchemaEntry>,
    entry: SchemaEntry,
    selectedEntries: string[],
  ) => {
    selectedEntriesService.set(selectedEntries);
    schemaWithDuplicatesService.set(schema);
    schemaWithDuplicatesService.duplicateEntry(entry);

    setSelectedEntries(selectedEntriesService.get());
    setClonePrototypes(prev => [...prev, entry.uuid]);

    return schemaWithDuplicatesService.get();
  };

  return { getSchemaWithCopiedEntries };
};
