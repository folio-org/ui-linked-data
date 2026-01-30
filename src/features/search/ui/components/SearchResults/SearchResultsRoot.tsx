import { FC, ReactNode } from 'react';

import './SearchResultsRoot.scss';

interface SearchResultsProps {
  children?: ReactNode;
  className?: string;
}

export const SearchResultsRoot: FC<SearchResultsProps> = ({ children, className }) => {
  return className ? <div className={className}>{children}</div> : <>{children}</>;
};
