import { useSearchNavigationState } from '@/features/search';
import { useSearchState } from '@/store';
import { SearchResultEntry } from '../SearchResultEntry';
import './SearchResultList.scss';

export const SearchResultList = () => {
  const { data } = useSearchState(['data']);
  useSearchNavigationState();

  return (
    <div className="search-result-list">
      {data?.map(dataEntry => (
        <SearchResultEntry key={`result-entry-${dataEntry.id}`} {...dataEntry} />
      ))}
    </div>
  );
};
