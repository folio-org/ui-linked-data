import { useContext } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ServicesContext } from '@src/contexts';
import state from '@state';

export const useProfileSchema = () => {
  const {
    selectedEntriesService: baseSelectedEntriesService,
    schemaWithDuplicatesService: baseSchemaWithDuplicatesService,
  } = useContext(ServicesContext);
  const [schema, setSchema] = useRecoilState(state.config.schema);
  const selectedEntriesService = baseSelectedEntriesService as ISelectedEntries;
  const schemaWithDuplicatesService = baseSchemaWithDuplicatesService as ISchemaWithDuplicates;
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);
  const setClonePrototypes = useSetRecoilState(state.config.clonePrototypes);

  const getSchemaWithCopiedEntries = (entry: SchemaEntry, selectedEntries: string[]) => {
    selectedEntriesService.set(selectedEntries);
    schemaWithDuplicatesService.set(schema);
    schemaWithDuplicatesService.duplicateEntry(entry);

    setSelectedEntries(selectedEntriesService.get());
    setClonePrototypes(prev => [...prev, entry.uuid]);
    setSchema(schemaWithDuplicatesService.get());
  };

  return { getSchemaWithCopiedEntries };
};
