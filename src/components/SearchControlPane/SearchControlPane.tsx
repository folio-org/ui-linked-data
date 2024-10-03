import { FC } from 'react';
import classNames from 'classnames';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import './SearchControlPane.scss';

type SearchControlPaneProps = {
  children?: ReactElement;
  label: string | ReactElement;
  subLabel?: string | ReactElement;
  renderCloseButton?: () => ReactElement;
};

export const SearchControlPane: FC<SearchControlPaneProps> = ({ children, label, subLabel, renderCloseButton }) => {
  return (
    <div className={classNames(['search-control-pane', IS_EMBEDDED_MODE && 'search-control-pane-embedded'])}>
      {renderCloseButton?.()}
      <div className="search-control-pane-title">
        <div className="search-control-pane-mainLabel">{label}</div>
        {subLabel && <div className="search-control-pane-subLabel">{subLabel}</div>}
      </div>
      {children}
    </div>
  );
};
