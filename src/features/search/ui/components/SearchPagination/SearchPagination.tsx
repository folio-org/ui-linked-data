import { FC } from 'react';
import { SEARCH_RESULTS_LIMIT } from '@/common/constants/search.constants';
import { Pagination as PaginationComponent } from '@/components/Pagination';
import { useSearchContext } from '../../providers/SearchProvider';
import { useCommittedSearchParams } from '../../hooks/useCommittedSearchParams';

interface SearchPaginationProps {
  showCount?: boolean;
  isLooped?: boolean;
}

export const SearchPagination: FC<SearchPaginationProps> = ({ showCount = true, isLooped = false }) => {
  const { results, onPageChange, flow, config } = useSearchContext();
  const committed = useCommittedSearchParams({ flow });

  const uiPageSize = config.defaults?.uiPageSize || SEARCH_RESULTS_LIMIT;
  const offset = committed.offset || 0;
  const currentPage = Math.floor(offset / uiPageSize);

  if (!results?.pageMetadata || results.pageMetadata.totalElements === 0) {
    return null;
  }

  const handlePrevPageClick = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextPageClick = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <PaginationComponent
      currentPage={currentPage}
      totalPages={results.pageMetadata.totalPages}
      pageSize={uiPageSize}
      totalResultsCount={results.pageMetadata.totalElements}
      showCount={showCount}
      onPrevPageClick={handlePrevPageClick}
      onNextPageClick={handleNextPageClick}
      isLooped={isLooped}
    />
  );
};
