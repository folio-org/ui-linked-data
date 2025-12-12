import { FC, ReactNode } from 'react';
import './SearchResultsRoot.scss';

interface SearchResultsProps {
  children?: ReactNode;
  className?: string;
}

export const SearchResultsRoot: FC<SearchResultsProps> = ({ children, className }) => {
  return <div className={`search-results-container ${className || ''}`.trim()}>{children}</div>;
};
