import { FC, ReactNode } from 'react';
import { SearchPagination as Pagination } from '../SearchPagination';

interface SearchResultsProps {
  children?: ReactNode;
}

const SearchResultsRoot: FC<SearchResultsProps> = ({ children }) => {
  return <>{children}</>;
};

export const SearchResults = Object.assign(SearchResultsRoot, {
  Pagination,
});
