import { FC } from 'react';
import { SEARCH_RESULTS_LIMIT } from '@/common/constants/search.constants';
import { Pagination as PaginationComponent } from '@/components/Pagination';
import { useSearchState } from '@/store';
import { useSearchContext } from '../../providers/SearchProvider';

interface SearchPaginationProps {
  showCount?: boolean;
  isLooped?: boolean;
}

export const SearchPagination: FC<SearchPaginationProps> = ({ showCount = true, isLooped = false }) => {
  const { pageMetadata, navigationState } = useSearchState(['pageMetadata', 'navigationState']);
  const { onPageChange } = useSearchContext();

  const offset = (navigationState?.offset as number) || 0;
  const currentPage = Math.floor(offset / SEARCH_RESULTS_LIMIT);

  if (!pageMetadata || pageMetadata.totalElements === 0) {
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
      totalPages={pageMetadata.totalPages}
      pageSize={SEARCH_RESULTS_LIMIT}
      totalResultsCount={pageMetadata.totalElements}
      showCount={showCount}
      onPrevPageClick={handlePrevPageClick}
      onNextPageClick={handleNextPageClick}
      isLooped={isLooped}
    />
  );
};
