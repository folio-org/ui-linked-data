import { useRecoilValue } from 'recoil';
import { useServicesContext } from './useServicesContext';
import state from '@state';

export const useRecordGeneration = () => {
  const { recordGeneratorService } = useServicesContext();
  const schema = useRecoilValue(state.config.schema);
  const userValues = useRecoilValue(state.inputs.userValues);
  const selectedEntries = useRecoilValue(state.config.selectedEntries);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);

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
