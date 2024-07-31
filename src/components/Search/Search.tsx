import { FC } from 'react';
import { SearchProvider } from '@common/providers/SearchProvider';
import { ItemSearch } from '@components/ItemSearch';

export const Search: FC<SearchParams> = value => (
  <SearchProvider value={value}>
    <ItemSearch />
  </SearchProvider>
);
