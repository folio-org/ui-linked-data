import { useServicesContext } from './useServicesContext';
import { deleteFromSetImmutable } from '@common/helpers/common.helper';
import { useInputsState, useProfileState, useStatusState, useUIState } from '@src/store';

export const useProfileSchema = () => {
  const { selectedEntriesService, schemaWithDuplicatesService, userValuesService } =
    useServicesContext() as Required<ServicesParams>;
  const { setCollapsibleEntries } = useUIState(['setCollapsibleEntries']);
  const { userValues, setUserValues, setSelectedEntries } = useInputsState([
    'userValues',
    'setUserValues',
    'setSelectedEntries',
  ]);
  const { setIsRecordEdited: setIsEdited } = useStatusState(['setIsRecordEdited']);
  const { schema, setSchema } = useProfileState(['schema', 'setSchema']);

  const updateSchemaWithCopiedEntries = async (entry: SchemaEntry, selectedEntries: string[]) => {
    selectedEntriesService.set(selectedEntries);
    schemaWithDuplicatesService.set(schema);
    userValuesService.set(userValues);

    const newUuid = await schemaWithDuplicatesService.duplicateEntry(entry);

    setSelectedEntries(selectedEntriesService.get());
    setUserValues(userValuesService.getAllValues());
    setCollapsibleEntries(prev => new Set(newUuid ? [...prev, entry.uuid, newUuid] : [...prev, entry.uuid]));
    setSchema(schemaWithDuplicatesService.get());

    setIsEdited(true);
  };

  const updateSchemaWithDeletedEntries = (entry: SchemaEntry) => {
    schemaWithDuplicatesService.set(schema);
    const deletedUuids = schemaWithDuplicatesService.deleteEntry(entry);

    setCollapsibleEntries(prev => deleteFromSetImmutable(prev, [entry.uuid]));
    setSchema(schemaWithDuplicatesService.get());
    setUserValues(prev => Object.fromEntries(Object.entries(prev).filter(([key]) => !deletedUuids?.includes(key))));

    setIsEdited(true);
  };

  return { updateSchemaWithCopiedEntries, updateSchemaWithDeletedEntries };
};
