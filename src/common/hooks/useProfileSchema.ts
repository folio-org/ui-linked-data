import { useContext } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ServicesContext } from '@src/contexts';
import state from '@state';

export const useProfileSchema = () => {
  const { selectedEntriesService, schemaWithDuplicatesService } = useContext(
    ServicesContext,
  ) as Required<ServicesParams>;
  const [schema, setSchema] = useRecoilState(state.config.schema);
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
