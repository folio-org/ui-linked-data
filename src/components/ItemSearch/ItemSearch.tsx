import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { SEARCH_RESULTS_LIMIT } from '@common/constants/search.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { SearchControls } from '@components/SearchControls';
import { FullDisplay } from '@components/FullDisplay';
import { Pagination } from '@components/Pagination';
import { SearchControlPane } from '@components/SearchControlPane';
import { useSearch } from '@common/hooks/useSearch';
import GeneralSearch from '@src/assets/general-search.svg?react';
import './ItemSearch.scss';

const EmptyPlaceholder = () => (
  <div className="empty-placeholder">
    <GeneralSearch />
    <FormattedMessage id="marva.enterSearchCriteria" />
  </div>
);

type ItemSearchProps = {
  filters: SearchFilters;
  hasSearchParams: boolean;
  defaultSearchBy: SearchIdentifiers;
  searchResultsListComponent: ReactElement;
  isVisibleFullDisplay?: boolean;
  isVisibleAdvancedSearch?: boolean;
  isVisibleSearchByControl?: boolean;
};

export const ItemSearch: FC<ItemSearchProps> = ({
  filters,
  hasSearchParams,
  defaultSearchBy,
  searchResultsListComponent,
  isVisibleFullDisplay = true,
  isVisibleAdvancedSearch = true,
  isVisibleSearchByControl = true,
}) => {
  const {
    submitSearch,
    clearValues,
    onPrevPageClick,
    onNextPageClick,
    currentPageNumber,
    pageMetadata,
    message,
    data,
  } = useSearch({ hasSearchParams, defaultSearchBy });

  return (
    <div data-testid="id-search" className="item-search">
      <SearchControls
        submitSearch={submitSearch}
        clearValues={clearValues}
        filters={filters}
        isVisibleSearchBy={isVisibleSearchByControl}
        isVisibleAdvancedSearch={isVisibleAdvancedSearch}
      />
      <div className={DOM_ELEMENTS.classNames.itemSearchContent}>
        <SearchControlPane />
        <div className={DOM_ELEMENTS.classNames.itemSearchContentContainer}>
          {message && (
            <div>
              <FormattedMessage id={message} />
            </div>
          )}
          {data && (
            <>
              {searchResultsListComponent}
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
          {!data && !message && <EmptyPlaceholder />}
        </div>
      </div>
      {isVisibleFullDisplay && <FullDisplay />}
      {isVisibleAdvancedSearch && <AdvancedSearchModal clearValues={clearValues} />}
    </div>
  );
};
