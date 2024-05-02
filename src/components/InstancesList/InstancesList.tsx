import { FormattedMessage } from 'react-intl';
import './InstancesList.scss';

export const InstancesList = () => {
  return (
    <div className="instances-list" data-testid="instances-list">
      {/* TODO: show this only when there is no Instances */}
      <div className="instances-list-empty">
        <FormattedMessage id="marva.noInstancesAdded" />
      </div>
    </div>
  );
};
