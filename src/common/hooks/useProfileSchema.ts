import { useRecoilState, useSetRecoilState } from 'recoil';
import state from '@state';
import { useServicesContext } from './useServicesContext';
import { deleteFromSetImmutable } from '@common/helpers/common.helper';

export const useProfileSchema = () => {
  const { selectedEntriesService, schemaWithDuplicatesService } = useServicesContext() as Required<ServicesParams>;
  const [schema, setSchema] = useRecoilState(state.config.schema);
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);
  const setCollapsibleEntries = useSetRecoilState(state.ui.collapsibleEntries);
  const setIsEdited = useSetRecoilState(state.status.recordIsEdited);
  const setUserValues = useSetRecoilState(state.inputs.userValues);

  const getSchemaWithCopiedEntries = (entry: SchemaEntry, selectedEntries: string[]) => {
    selectedEntriesService.set(selectedEntries);
    schemaWithDuplicatesService.set(schema);
    const newUuid = schemaWithDuplicatesService.duplicateEntry(entry);

    setSelectedEntries(selectedEntriesService.get());
    setCollapsibleEntries(prev => new Set(newUuid ? [...prev, entry.uuid, newUuid] : [...prev, entry.uuid]));
    setSchema(schemaWithDuplicatesService.get());

    setIsEdited(true);
  };

  const getSchemaWithDeletedEntries = (entry: SchemaEntry) => {
    schemaWithDuplicatesService.set(schema);
    const deletedUuids = schemaWithDuplicatesService.deleteEntry(entry);

    setCollapsibleEntries(prev => deleteFromSetImmutable(prev, [entry.uuid]));
    setSchema(schemaWithDuplicatesService.get());
    setUserValues(prev => Object.fromEntries(Object.entries(prev).filter(([key]) => !deletedUuids?.includes(key))));

    setIsEdited(true);
  };

  return { getSchemaWithCopiedEntries, getSchemaWithDeletedEntries };
};
