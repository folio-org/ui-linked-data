import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import './SearchResultsRoot.scss';

interface SearchResultsProps {
  children?: ReactNode;
  className?: string;
}

export const SearchResultsRoot: FC<SearchResultsProps> = ({ children, className }) => {
  return <div className={classNames(['search-results-container', className])}>{children}</div>;
};
