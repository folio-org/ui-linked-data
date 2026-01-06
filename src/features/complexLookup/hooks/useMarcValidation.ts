import { useCallback } from 'react';
import { useApi } from '../../../common/hooks/useApi';
import { generateValidationRequestBody } from '@/features/complexLookup/utils/complexLookup.helper';
import { AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT } from '@/common/constants/api.constants';
import { ModalConfig, ModalApiConfig } from '../configs/modalRegistry';

export const useMarcValidation = () => {
  const { makeRequest } = useApi<{ validAssignment: boolean; invalidAssignmentReason?: string }>();

  const validateMarcRecord = useCallback(
    async (
      marcData: MarcDTO | null,
      config: ModalConfig | ComplexLookupsConfigEntry,
      lookupContext: string,
    ): Promise<{ validAssignment: boolean; invalidAssignmentReason?: string }> => {
      // Extract API config - works for both modern ModalConfig and legacy ComplexLookupsConfigEntry
      const apiConfig = 'component' in config ? (config as { api?: ModalApiConfig }).api : config.api;

      return makeRequest({
        url: apiConfig?.endpoints?.validation ?? AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT,
        method: 'POST',
        body: generateValidationRequestBody(marcData, apiConfig?.validationTarget?.[lookupContext]),
      });
    },
    [makeRequest],
  );

  return { validateMarcRecord };
};
