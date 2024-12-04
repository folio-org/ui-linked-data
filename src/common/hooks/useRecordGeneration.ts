import { useRecoilValue } from 'recoil';
import { useInputsState, useProfileState } from '@src/store';
import state from '@state';
import { useServicesContext } from './useServicesContext';

export const useRecordGeneration = () => {
  const { recordGeneratorService } = useServicesContext();
  const selectedEntries = useRecoilValue(state.config.selectedEntries);
  const { userValues } = useInputsState();
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
