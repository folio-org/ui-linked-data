import { useInputsState, useProfileState } from '@src/store';
import { useServicesContext } from './useServicesContext';

export const useRecordGeneration = () => {
  const { recordGeneratorService } = useServicesContext();
  const { userValues, selectedEntries } = useInputsState();
  const { schema, initialSchemaKey } = useProfileState();

  const generateRecord = () => {
    recordGeneratorService?.init({
      schema,
      initKey: initialSchemaKey,
      userValues,
      selectedEntries,
    });

    return recordGeneratorService?.generate();
  };

  return { generateRecord };
};
