import { FC } from 'react';
import classNames from 'classnames';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { SearchSegment } from '@common/constants/search.constants';
import { useSearchState, useUIState } from '@src/store';
import { Button } from '@components/Button';
import CaretDown from '@src/assets/caret-down.svg?react';
import { useIntl } from 'react-intl';
import './SearchControlPane.scss';

type SearchControlPaneProps = {
  children?: ReactElement;
  label: string | ReactElement;
  segmentsConfig?: PrimarySegmentsConfig;
  renderSubLabel?: (count: number) => ReactElement;
  renderCloseButton?: () => ReactElement;
};

export const SearchControlPane: FC<SearchControlPaneProps> = ({
  children,
  label,
  renderSubLabel,
  renderCloseButton,
  segmentsConfig,
}) => {
  const { formatMessage } = useIntl();
  const { pageMetadata: searchResultsMetadata } = useSearchState();
  const { isSearchPaneCollapsed, setIsSearchPaneCollapsed } = useUIState();
  const { navigationSegment } = useSearchContext();
  const selectedSegment = navigationSegment?.value;
  const isVisibleSubLabel = segmentsConfig
    ? segmentsConfig[selectedSegment as SearchSegment]?.isVisibleSubLabel
    : !!renderSubLabel;

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
      <div className="search-control-pane-title">
        <h2 className="search-control-pane-mainLabel">
          <span>{label}</span>
        </h2>
        {isVisibleSubLabel && !!renderSubLabel && (
          <div className="search-control-pane-subLabel">
            <span>{renderSubLabel?.(searchResultsMetadata?.totalElements)}</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
