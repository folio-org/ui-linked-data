import { useFormattedResults } from '@/features/search/ui';
import { SearchResultEntry } from './SearchResultEntry';

export const ResourcesResultList = () => {
  const data = useFormattedResults<WorkAsSearchResultDTO>();

  return (
    <>
      {data?.map((dataEntry: WorkAsSearchResultDTO) => (
        <SearchResultEntry key={`result-entry-${dataEntry.id}`} {...dataEntry} />
      ))}
    </>
  );
};
