import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { Loading } from '@/components/Loading';

import { Preview } from '@/features/preview';

import { useHubQuery } from '../hooks';

import './HubImportPreview.scss';

export const HubImportPreview = () => {
  const { formatMessage } = useIntl();
  const [searchParams] = useSearchParams();
  const sourceUri = searchParams.get(QueryParams.SourceUri);

  const { data, processed, isLoading } = useHubQuery({
    hubUri: sourceUri ?? undefined,
    enabled: !!sourceUri,
  });

  // Keep spinner up through the one-render gap between queryFn resolving and
  // the useHubQuery store-sync useEffect populating downstream consumers
  const loading = isLoading || !data;
  const loaderLabel = formatMessage({ id: 'ld.importHub.fetchingFromUri' }, { uri: sourceUri });

  return (
    <div className="hub-import-preview">
      {loading ? (
        <Loading label={loaderLabel} />
      ) : (
        <Preview
          altSchema={processed?.schema}
          altInitKey={processed?.initKey}
          altUserValues={processed?.userValues}
          forceRenderAllTopLevelEntities
          entityRowDisplay
        />
      )}
    </div>
  );
};
