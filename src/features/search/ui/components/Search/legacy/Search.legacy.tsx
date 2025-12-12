import { FC } from 'react';
import { LegacySearchProvider } from '../../../providers';
import { ItemSearch } from './ItemSearch';

type SearchProps = SearchParams & { defaultNavigationSegment?: string };

export const Search: FC<SearchProps> = value => (
  <LegacySearchProvider value={value}>
    <ItemSearch />
  </LegacySearchProvider>
);
