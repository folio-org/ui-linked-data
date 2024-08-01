import { FC } from 'react';
import './SearchControlPane.scss';

type SearchControlPaneProps = {
  children?: ReactElement;
  label: string | ReactElement;
};

export const SearchControlPane: FC<SearchControlPaneProps> = ({ children, label }) => {
  return (
    <div className="search-control-pane">
      <div className="search-control-pane-title">
        <div className="search-control-pane-mainLabel">{label}</div>
        {/* <div className="search-control-pane-subLabel"></div> */}
      </div>
      {children}
    </div>
  );
};
