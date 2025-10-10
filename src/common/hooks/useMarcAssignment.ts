import { useCallback } from 'react';
import { useMarcData } from './useMarcData';

interface MarcAssignmentOptions {
  complexValue: MarcDTO | null;
  marcPreviewMetadata: MarcPreviewMetadata | null;
  marcPreviewEndpoint?: string;
}

interface MarcAssignmentResult {
  srsId?: string;
  marcData: MarcDTO | null;
}

export const useMarcAssignment = (setMarcPreviewData: (value: MarcDTO | null) => void) => {
  const { fetchMarcData } = useMarcData(setMarcPreviewData);

  const getMarcDataForAssignment = useCallback(
    async (id: string, options: MarcAssignmentOptions): Promise<MarcAssignmentResult> => {
      const { complexValue, marcPreviewMetadata, marcPreviewEndpoint } = options;
      let srsId;
      let marcData = complexValue;

      if (marcPreviewMetadata?.baseId === id) {
        srsId = marcPreviewMetadata.srsId;
      } else {
        const response = await fetchMarcData(id, marcPreviewEndpoint);

        if (response) {
          marcData = response;
          srsId = marcData?.matchedId;
        }
      }

      return { srsId, marcData };
    },
    [fetchMarcData],
  );

  return { getMarcDataForAssignment };
};
