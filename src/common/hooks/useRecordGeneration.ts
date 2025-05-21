import { useInputsState, useProfileState } from '@src/store';
import { useServicesContext } from './useServicesContext';

export const useRecordGeneration = () => {
  const { recordGeneratorServiceLegacy } = useServicesContext();
  const { userValues, selectedEntries } = useInputsState();
  const { schema, initialSchemaKey } = useProfileState();

  const generateRecord = () => {
    recordGeneratorServiceLegacy?.init({
      schema,
      initKey: initialSchemaKey,
      userValues,
      selectedEntries,
    });

    return recordGeneratorServiceLegacy?.generate();
  };

  return { generateRecord };
};
