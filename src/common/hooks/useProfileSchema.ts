import { useRecoilState, useSetRecoilState } from 'recoil';
import state from '@state';
import { useServicesContext } from './useServicesContext';

export const useProfileSchema = () => {
  const { selectedEntriesService, schemaWithDuplicatesService } = useServicesContext() as Required<ServicesParams>;
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
