import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { SEARCH_RESULTS_LIMIT } from '@common/constants/search.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { SearchControls } from '@components/SearchControls';
import { FullDisplay } from '@components/FullDisplay';
import { Pagination } from '@components/Pagination';
import { useSearch } from '@common/hooks/useSearch';
import { SearchContext } from '@common/contexts';
import { useLoadSearchResults } from '@common/hooks/useLoadSearchResults';
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
  } = useContext(SearchContext);
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

  useLoadSearchResults(fetchData);

  return (
    <div data-testid="id-search" className="item-search">
      <SearchControls submitSearch={submitSearch} clearValues={clearValues} />
      <div className={DOM_ELEMENTS.classNames.itemSearchContent}>
        {renderSearchControlPane()}
        <div className={DOM_ELEMENTS.classNames.itemSearchContentContainer}>
          {message && (
            <div>
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
