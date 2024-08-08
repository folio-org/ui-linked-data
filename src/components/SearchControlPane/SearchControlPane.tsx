import { FC } from 'react';
import './SearchControlPane.scss';

type SearchControlPaneProps = {
  children?: ReactElement;
  label: string | ReactElement;
  subLabel?: string | ReactElement;
};

export const SearchControlPane: FC<SearchControlPaneProps> = ({ children, label, subLabel }) => {
  return (
    <div className="search-control-pane">
      <div className="search-control-pane-title">
        <div className="search-control-pane-mainLabel">{label}</div>
        {subLabel && <div className="search-control-pane-subLabel">{subLabel}</div>}
      </div>
      {children}
    </div>
  );
};
