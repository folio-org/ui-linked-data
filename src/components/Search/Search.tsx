import { FC } from 'react';
import { SearchProvider } from '@src/providers/SearchProvider';
import { ItemSearch } from '@components/ItemSearch';

type SearchProps = SearchParams & { defaultNavigationSegment?: string; hasMiltilineSearchInput?: boolean };

export const Search: FC<SearchProps> = value => (
  <SearchProvider value={value}>
    <ItemSearch />
  </SearchProvider>
);
