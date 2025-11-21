import { FC } from 'react';
import { SearchProvider } from '../../providers';
import { ItemSearch } from '../ItemSearch';

type SearchProps = SearchParams & { defaultNavigationSegment?: string };

export const Search: FC<SearchProps> = value => (
  <SearchProvider value={value}>
    <ItemSearch />
  </SearchProvider>
);
