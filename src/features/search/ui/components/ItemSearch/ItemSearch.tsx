import { FormattedMessage } from 'react-intl';
import { SEARCH_RESULTS_LIMIT } from '@/common/constants/search.constants';
import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';
import { FullDisplay } from '@/components/FullDisplay';
import { Pagination } from '@/components/Pagination';
import { SearchEmptyPlaceholder } from '../SearchEmptyPlaceholder';
import './ItemSearch.scss';
import { useUIState } from '@/store';
import { useSearchContextLegacy } from '../../providers';
import { useLoadSearchResults, useSearch } from '../../hooks';
import { LegacySearchControls } from '../SearchControls';
import { AdvancedSearchModal } from '../AdvancedSearchModal';

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
    searchResultsLimit,
    hasMarcPreview,
    renderMarcPreview,
  } = useSearchContextLegacy();
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
    onChangeSegment,
  } = useSearch();
  const { isMarcPreviewOpen } = useUIState(['isMarcPreviewOpen']);

  useLoadSearchResults(fetchData);

  const segmentConfig = isVisibleSegments
    ? !!navigationSegment?.value && primarySegments?.[navigationSegment?.value]
    : undefined;
  const isVisiblePaginationCount = segmentConfig ? segmentConfig.isVisiblePaginationCount : true;
  const isLoopedPagination = segmentConfig ? segmentConfig.isLoopedPagination : false;

  return (
    <div data-testid="id-search" className="item-search">
      <LegacySearchControls submitSearch={submitSearch} clearValues={clearValues} changeSegment={onChangeSegment} />
      {!(hasMarcPreview && isMarcPreviewOpen) && (
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
                    pageSize={searchResultsLimit ?? SEARCH_RESULTS_LIMIT}
                    totalResultsCount={pageMetadata.totalElements}
                    showCount={isVisiblePaginationCount}
                    onPrevPageClick={onPrevPageClick}
                    onNextPageClick={onNextPageClick}
                    isLooped={isLoopedPagination}
                  />
                )}
              </>
            )}
            {!data && !message && (
              <SearchEmptyPlaceholder labelId={labelEmptySearch} className={classNameEmptyPlaceholder} />
            )}
          </div>
        </div>
      )}
      {hasMarcPreview && renderMarcPreview?.()}
      {isVisibleFullDisplay && <FullDisplay />}
      {isVisibleAdvancedSearch && <AdvancedSearchModal clearValues={clearValues} />}
    </div>
  );
};
