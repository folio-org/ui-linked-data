import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { SearchSegment } from '@common/constants/search.constants';
import state from '@state';
import './SearchControlPane.scss';

type SearchControlPaneProps = {
  children?: ReactElement;
  label: string | ReactElement;
  segmentsConfig: PrimarySegmentsConfig;
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
  const searchResultsMetadata = useRecoilValue(state.search.pageMetadata);
  const { navigationSegment } = useSearchContext();
  const selectedSegment = navigationSegment?.value;
  const isVisibleSubLabel = segmentsConfig[selectedSegment as SearchSegment]?.isVisibleSubLabel;

  return (
    <div className={classNames(['search-control-pane', IS_EMBEDDED_MODE && 'search-control-pane-embedded'])}>
      {renderCloseButton?.()}
      <div className="search-control-pane-title">
        <div className="search-control-pane-mainLabel">{label}</div>
        {isVisibleSubLabel && !!renderSubLabel && (
          <div className="search-control-pane-subLabel">{renderSubLabel?.(searchResultsMetadata?.totalElements)}</div>
        )}
      </div>
      {children}
    </div>
  );
};
