import { useIntl } from 'react-intl';
import { useParams, useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { EDIT_ALT_DISPLAY_LABELS } from '@/common/constants/uiElements.constants';
import { Loading } from '@/components/Loading';
import { ModalDuplicateImportedResource } from '@/components/ModalDuplicateImportedResource';
import { Preview } from '@/components/Preview';

import { useInputsState } from '@/store';

import { DEFAULT_HUB_SOURCE } from '../constants/hubSources.constants';
import { useHubQuery } from '../hooks/useHubQuery';

import './HubImportPreview.scss';

export const HubImportPreview = () => {
  const { hubToken } = useParams<{ hubToken: string }>();
  const { formatMessage } = useIntl();
  const { record } = useInputsState(['record']);
  const [searchParams] = useSearchParams();
  const source = searchParams.get(QueryParams.Source) ?? DEFAULT_HUB_SOURCE;

  const { isLoading } = useHubQuery({
    hubToken,
    source,
    enabled: !!hubToken,
  });

  const loaderLabel = formatMessage({ id: 'ld.importHub.fetchingById' }, { hubId: hubToken });

  return (
    <div className="hub-import-preview">
      {record && !isLoading ? (
        <Preview altDisplayNames={EDIT_ALT_DISPLAY_LABELS} forceRenderAllTopLevelEntities entityRowDisplay />
      ) : (
        <Loading label={loaderLabel} />
      )}
      <ModalDuplicateImportedResource />
    </div>
  );
};
