import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { EDIT_ALT_DISPLAY_LABELS } from '@/common/constants/uiElements.constants';
import { ExternalResourceLoader } from '@/components/ExternalResourceLoader';
import { ModalDuplicateImportedResource } from '@/components/ModalDuplicateImportedResource';
import { Preview } from '@/components/Preview';

import { useInputsState, useMarcPreviewState } from '@/store';

import { DEFAULT_HUB_SOURCE } from '../constants/hubSources.constants';
import { useHubImport } from '../hooks/useHubImport';

import './HubImportPreview.scss';

export const HubImportPreview = () => {
  const { record } = useInputsState(['record']);
  const { fetchHubForPreview } = useHubImport();
  const { resetBasicValue } = useMarcPreviewState(['resetBasicValue']);
  const { hubToken } = useParams<{ hubToken: string }>();
  const [searchParams] = useSearchParams();
  const source = searchParams.get(QueryParams.Source) ?? DEFAULT_HUB_SOURCE;

  useEffect(() => {
    if (hubToken) {
      fetchHubForPreview(hubToken, source);
    }

    // TODO: UILD-552 - temporary solution. Reset the whole state on application unload.
    resetBasicValue();
  }, [hubToken, source]);

  return (
    <div className="hub-import-preview">
      {record ? (
        <Preview altDisplayNames={EDIT_ALT_DISPLAY_LABELS} forceRenderAllTopLevelEntities entityRowDisplay />
      ) : (
        <ExternalResourceLoader />
      )}
      <ModalDuplicateImportedResource />
    </div>
  );
};
