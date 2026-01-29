import { useSearchNavigationState } from '@/features/search/ui';

import { useSearchState } from '@/store';

import { SearchResultEntry } from '../SearchResultEntry';

import '../ResourcesResultList.scss';

export const LegacySearchResultList = () => {
  const { data } = useSearchState(['data']);
  useSearchNavigationState();

  return (
    <div className="search-result-list">
      {data?.map((dataEntry: WorkAsSearchResultDTO) => (
        <SearchResultEntry key={`result-entry-${dataEntry.id}`} {...dataEntry} />
      ))}
    </div>
  );
};
