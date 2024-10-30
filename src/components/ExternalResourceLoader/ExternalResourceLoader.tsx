import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import './ExternalResourceLoader.scss';

export const ExternalResourceLoader = () => {
  const { externalId } = useParams();

  return (
    <div className="external-resource-loader">
      <div className="contents">
        <FormattedMessage id="ld.fetchingExternalResourceById" values={{ resourceId: externalId }} />
      </div>
    </div>
  );
};
