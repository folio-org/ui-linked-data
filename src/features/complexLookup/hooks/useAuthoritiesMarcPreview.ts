import { useState, useCallback, useEffect } from 'react';
import { useMarcPreviewState } from '@/store';
import { useMarcQuery } from './useMarcQuery';

interface UseAuthoritiesMarcPreviewParams {
  endpointUrl: string;
  isMarcPreviewOpen: boolean;
}

interface UseAuthoritiesMarcPreviewResult {
  loadMarcData: (id: string, title?: string, headingType?: string) => void;
  resetPreview: () => void;
  isLoading: boolean;
}

/**
 * Custom hook for handling MARC preview in Authorities modal.
 */
export function useAuthoritiesMarcPreview({
  endpointUrl,
  isMarcPreviewOpen,
}: UseAuthoritiesMarcPreviewParams): UseAuthoritiesMarcPreviewResult {
  const { setComplexValue, setMetadata: setMarcMetadata } = useMarcPreviewState(['setComplexValue', 'setMetadata']);

  // State to track which record ID to load MARC data for
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>();
  const [pendingMarcMetadata, setPendingMarcMetadata] = useState<{
    id: string;
    title: string;
    headingType: string;
  } | null>(null);

  // Use React Query to fetch MARC data
  const { data: marcData, isLoading } = useMarcQuery({
    recordId: selectedRecordId,
    endpointUrl,
    enabled: !!selectedRecordId && isMarcPreviewOpen,
  });

  // Update store when MARC data is loaded
  useEffect(() => {
    if (marcData && pendingMarcMetadata) {
      setComplexValue(marcData);
      setMarcMetadata({
        baseId: pendingMarcMetadata.id,
        marcId: marcData.id,
        srsId: marcData.matchedId,
        title: pendingMarcMetadata.title,
        headingType: pendingMarcMetadata.headingType,
      });
      setPendingMarcMetadata(null);
    }
  }, [marcData, pendingMarcMetadata, setComplexValue, setMarcMetadata]);

  // Load MARC data when title is clicked
  const loadMarcData = useCallback((id: string, title?: string, headingType?: string) => {
    if (title && headingType) {
      setSelectedRecordId(id);
      setPendingMarcMetadata({ id, title, headingType });
    }
  }, []);

  const resetPreview = useCallback(() => {
    setSelectedRecordId(undefined);
    setPendingMarcMetadata(null);
  }, []);

  return { loadMarcData, resetPreview, isLoading };
}
