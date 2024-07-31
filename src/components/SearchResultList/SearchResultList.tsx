import state from '@state';
import { useRecoilValue } from 'recoil';
import { SearchResultEntry } from '@components/SearchResultEntry';
import { useSearchNavigationState } from '@common/hooks/useSearchNavigationState';
import './SearchResultList.scss';

export const SearchResultList = () => {
  const data = useRecoilValue(state.search.data);
  useSearchNavigationState();

  return (
    <div className="search-result-list">
      {data?.map(dataEntry => <SearchResultEntry key={`result-entry-${dataEntry.id}`} {...dataEntry} />)}
    </div>
  );
};
