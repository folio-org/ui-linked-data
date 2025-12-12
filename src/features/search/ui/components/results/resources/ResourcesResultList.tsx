import { useFormattedResults } from '@/features/search/ui';
import { SearchResultEntry } from './SearchResultEntry';
import './ResourcesResultList.scss';

export const ResourcesResultList = () => {
  const data = useFormattedResults<WorkAsSearchResultDTO>();

  return (
    <div className="search-result-list">
      {data?.map((dataEntry: WorkAsSearchResultDTO) => (
        <SearchResultEntry key={`result-entry-${dataEntry.id}`} {...dataEntry} />
      ))}
    </div>
  );
};
