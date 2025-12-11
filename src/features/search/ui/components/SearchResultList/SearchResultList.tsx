import { useFormattedResults } from '@/features/search/ui';
import { SearchResultEntry } from '../SearchResultEntry';
import './SearchResultList.scss';

export const SearchResultList = () => {
  const data = useFormattedResults<WorkAsSearchResultDTO>();

  return (
    <div className="search-result-list">
      {data?.map((dataEntry: WorkAsSearchResultDTO) => (
        <SearchResultEntry key={`result-entry-${dataEntry.id}`} {...dataEntry} />
      ))}
    </div>
  );
};
