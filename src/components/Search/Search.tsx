import { FC } from 'react';
import { SearchProvider } from '@src/providers/SearchProvider';
import { ItemSearch } from '@components/ItemSearch';

export const Search: FC<SearchParams> = value => (
  <SearchProvider value={value}>
    <ItemSearch />
  </SearchProvider>
);
