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
  const { results, onPageChange, flow, config, activeUIConfig } = useSearchContext();
  const committed = useCommittedSearchParams({ flow });

  const uiPageSize = activeUIConfig.limit || config.defaults?.limit || SEARCH_RESULTS_LIMIT;
  const offset = committed.offset || 0;
  const currentPage = Math.floor(offset / uiPageSize);

  // Use activeUIConfig which is already resolved for the current segment
  const effectiveShowCount = activeUIConfig.features?.isVisiblePaginationCount ?? showCount;
  const effectiveIsLooped = activeUIConfig.features?.isLoopedPagination ?? isLooped;

  if (!results?.pageMetadata || results.pageMetadata.totalElements === 0) {
    return null;
  }

  const handlePrevPageClick = () => onPageChange(currentPage - 1);
  const handleNextPageClick = () => onPageChange(currentPage + 1);

  return (
    <PaginationComponent
      currentPage={currentPage}
      totalPages={results.pageMetadata.totalPages}
      pageSize={uiPageSize}
      totalResultsCount={results.pageMetadata.totalElements}
      showCount={effectiveShowCount}
      onPrevPageClick={handlePrevPageClick}
      onNextPageClick={handleNextPageClick}
      isLooped={effectiveIsLooped}
    />
  );
};
