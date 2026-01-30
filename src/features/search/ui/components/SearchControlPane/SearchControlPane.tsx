import { FC, type ReactElement } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { useSearchContext } from '../../providers/SearchProvider';
import { ControlPane } from './ControlPane';

type SearchControlPaneProps = {
  children?: ReactElement;
  label?: string | ReactElement;
  renderSubLabel?: (count: number) => ReactElement;
  renderCloseButton?: () => ReactElement;
  showSubLabel?: boolean;
};

export const SearchControlPane: FC<SearchControlPaneProps> = ({
  children,
  label: labelProp,
  renderSubLabel,
  renderCloseButton,
  showSubLabel,
}) => {
  const { activeUIConfig, results } = useSearchContext();

  // Use props if provided, otherwise get from context
  const titleId = activeUIConfig.ui?.titleId;
  const subtitleId = activeUIConfig.ui?.subtitleId;
  const isVisibleSubLabel = showSubLabel ?? activeUIConfig.features?.isVisibleSubLabel ?? false;

  // Get total count from search results
  const totalElements = results?.totalRecords ?? 0;

  // Label: use prop if provided, otherwise use titleId from config
  const label = labelProp ?? (titleId ? <FormattedMessage id={titleId} /> : null);

  // SubLabel: use renderSubLabel if provided, otherwise use subtitleId from config
  let subLabel = null;

  if (renderSubLabel) {
    subLabel = renderSubLabel(totalElements);
  } else if (subtitleId) {
    subLabel = (
      <FormattedMessage
        id={subtitleId}
        values={{ recordsCount: <FormattedNumber value={totalElements} data-testid="records-found-count" /> }}
      />
    );
  }

  return (
    <ControlPane
      label={label ?? undefined}
      subLabel={subLabel ?? undefined}
      showSubLabel={isVisibleSubLabel}
      renderCloseButton={renderCloseButton}
    >
      {children}
    </ControlPane>
  );
};
