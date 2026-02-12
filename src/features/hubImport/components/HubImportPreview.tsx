import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { Loading } from '@/components/Loading';
import { Preview } from '@/components/Preview';

import { useInputsState } from '@/store';

import { useHubQuery } from '../hooks';

import './HubImportPreview.scss';

export const HubImportPreview = () => {
  const { formatMessage } = useIntl();
  const { record } = useInputsState(['record']);
  const [searchParams] = useSearchParams();
  const sourceUri = searchParams.get(QueryParams.SourceUri);

  const { isLoading } = useHubQuery({
    hubUri: sourceUri ?? undefined,
    enabled: !!sourceUri,
  });

  const loaderLabel = formatMessage({ id: 'ld.importHub.fetchingFromUri' }, { uri: sourceUri });

  return (
    <div className="hub-import-preview">
      {record && !isLoading ? (
        <Preview forceRenderAllTopLevelEntities entityRowDisplay />
      ) : (
        <Loading label={loaderLabel} />
      )}
    </div>
  );
};
