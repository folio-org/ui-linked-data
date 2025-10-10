import { useCallback } from 'react';
import { useApi } from './useApi';
import { generateValidationRequestBody } from '@common/helpers/complexLookup.helper';
import { AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT } from '@common/constants/api.constants';

export const useMarcValidation = () => {
  const { makeRequest } = useApi<{ validAssignment: boolean; invalidAssignmentReason?: string }>();

  const validateMarcRecord = useCallback(
    async (
      marcData: MarcDTO | null,
      lookupConfig: ComplexLookupsConfigEntry,
      authority: string,
    ): Promise<{ validAssignment: boolean; invalidAssignmentReason?: string }> => {
      const { endpoints, validationTarget } = lookupConfig.api;

      return makeRequest({
        url: endpoints.validation ?? AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT,
        method: 'POST',
        body: generateValidationRequestBody(marcData, validationTarget?.[authority]),
      });
    },
    [makeRequest],
  );

  return { validateMarcRecord };
};
