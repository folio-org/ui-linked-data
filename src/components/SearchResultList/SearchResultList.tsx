import { SearchResultEntry } from '@components/SearchResultEntry';
import { useSearchNavigationState } from '@common/hooks/useSearchNavigationState';
import { useSearchState } from '@src/store';
import './SearchResultList.scss';

export const SearchResultList = () => {
  const { data } = useSearchState();
  useSearchNavigationState();

  return (
    <div className="search-result-list">
      {data?.map(dataEntry => <SearchResultEntry key={`result-entry-${dataEntry.id}`} {...dataEntry} />)}
    </div>
  );
};
