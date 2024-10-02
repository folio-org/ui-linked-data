import { FormattedMessage } from 'react-intl';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { SEARCH_RESULTS_LIMIT } from '@common/constants/search.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { SearchControls } from '@components/SearchControls';
import { FullDisplay } from '@components/FullDisplay';
import { Pagination } from '@components/Pagination';
import { useSearch } from '@common/hooks/useSearch';
import { useLoadSearchResults } from '@common/hooks/useLoadSearchResults';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { EmptyPlaceholder } from './SearchEmptyPlaceholder';
import './ItemSearch.scss';

export const ItemSearch = () => {
  const {
    labelEmptySearch,
    classNameEmptyPlaceholder,
    isVisibleFullDisplay,
    isVisibleAdvancedSearch,
    renderResultsList,
    renderSearchControlPane,
    isVisibleSegments,
    primarySegments,
    navigationSegment,
  } = useSearchContext();
  const {
    submitSearch,
    clearValues,
    onPrevPageClick,
    onNextPageClick,
    currentPageNumber,
    pageMetadata,
    message,
    data,
    fetchData,
  } = useSearch();

  useLoadSearchResults(fetchData, currentPageNumber);

  const isVisiblePaginationCount = isVisibleSegments
    ? !!navigationSegment?.value && primarySegments?.[navigationSegment?.value]?.isVisiblePaginationCount
    : true;

  return (
    <div data-testid="id-search" className="item-search">
      <SearchControls submitSearch={submitSearch} clearValues={clearValues} />
      <div className={DOM_ELEMENTS.classNames.itemSearchContent}>
        {renderSearchControlPane()}
        <div className={DOM_ELEMENTS.classNames.itemSearchContentContainer}>
          {message && (
            <div className={DOM_ELEMENTS.classNames.itemSearchMessage}>
              <FormattedMessage id={message} />
            </div>
          )}
          {data && (
            <>
              {renderResultsList()}
              {pageMetadata.totalElements > 0 && (
                <Pagination
                  currentPage={currentPageNumber}
                  totalPages={pageMetadata.totalPages}
                  pageSize={SEARCH_RESULTS_LIMIT}
                  totalResultsCount={pageMetadata.totalElements}
                  showCount={isVisiblePaginationCount}
                  onPrevPageClick={onPrevPageClick}
                  onNextPageClick={onNextPageClick}
                />
              )}
            </>
          )}
          {!data && !message && <EmptyPlaceholder labelId={labelEmptySearch} className={classNameEmptyPlaceholder} />}
        </div>
      </div>
      {isVisibleFullDisplay && <FullDisplay />}
      {isVisibleAdvancedSearch && <AdvancedSearchModal clearValues={clearValues} />}
    </div>
  );
};
