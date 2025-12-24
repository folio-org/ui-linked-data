import { FC, type ReactElement } from 'react';
import classNames from 'classnames';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { IS_EMBEDDED_MODE } from '@/common/constants/build.constants';
import { useUIState } from '@/store';
import { Button } from '@/components/Button';
import CaretDown from '@/assets/caret-down.svg?react';
import { useSearchContext } from '../../providers/SearchProvider';
import './SearchControlPane.scss';

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
  const { formatMessage } = useIntl();
  const { activeUIConfig, results } = useSearchContext();
  const { isSearchPaneCollapsed, setIsSearchPaneCollapsed } = useUIState([
    'isSearchPaneCollapsed',
    'setIsSearchPaneCollapsed',
  ]);

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
    <div className={classNames(['search-control-pane', IS_EMBEDDED_MODE && 'search-control-pane-embedded'])}>
      {renderCloseButton?.()}
      {isSearchPaneCollapsed && (
        <Button
          onClick={() => setIsSearchPaneCollapsed(false)}
          className="open-ctl"
          ariaLabel={formatMessage({ id: 'ld.aria.searchPane.open' })}
        >
          <CaretDown className="header-caret" />
        </Button>
      )}
      {label && (
        <div className="search-control-pane-title">
          <h2 className="search-control-pane-mainLabel">
            <span>{label}</span>
          </h2>

          {isVisibleSubLabel && subLabel && (
            <div className="search-control-pane-subLabel">
              <span>{subLabel}</span>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
