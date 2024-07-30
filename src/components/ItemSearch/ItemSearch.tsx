import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { SEARCH_RESULTS_LIMIT } from '@common/constants/search.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { SearchControls } from '@components/SearchControls';
import { FullDisplay } from '@components/FullDisplay';
import { Pagination } from '@components/Pagination';
import { useSearch } from '@common/hooks/useSearch';
import { useLoadSearchResults } from '@common/hooks/useLoadSearchResults';
import { EmptyPlaceholder } from './SearchEmptyPlaceholder';
import './ItemSearch.scss';

type ItemSearchProps = {
  endpointUrl: string;
  filters: SearchFilters;
  hasSearchParams: boolean;
  defaultSearchBy: SearchIdentifiers;
  controlPaneComponent: ReactElement;
  resultsListComponent: ReactElement;
  isSortedResults?: boolean;
  isVisibleFullDisplay?: boolean;
  isVisibleAdvancedSearch?: boolean;
  isVisibleSearchByControl?: boolean;
  labelEmptySearch?: string;
  classNameEmptyPlaceholder?: string;
};

export const ItemSearch: FC<ItemSearchProps> = ({
  endpointUrl,
  filters,
  hasSearchParams,
  defaultSearchBy,
  controlPaneComponent,
  resultsListComponent,
  isSortedResults = true,
  isVisibleFullDisplay = true,
  isVisibleAdvancedSearch = true,
  isVisibleSearchByControl = true,
  labelEmptySearch = 'marva.enterSearchCriteria',
  classNameEmptyPlaceholder,
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
    fetchData,
  } = useSearch({ endpointUrl, isSortedResults, hasSearchParams, defaultSearchBy });

  useLoadSearchResults(fetchData, hasSearchParams);

  return (
    <div data-testid="id-search" className="item-search">
      <SearchControls
        submitSearch={submitSearch}
        clearValues={clearValues}
        filters={filters}
        isVisibleSearchBy={isVisibleSearchByControl}
        isVisibleAdvancedSearch={isVisibleAdvancedSearch}
        hasSearchParams={hasSearchParams}
      />
      <div className={DOM_ELEMENTS.classNames.itemSearchContent}>
        {controlPaneComponent}
        <div className={DOM_ELEMENTS.classNames.itemSearchContentContainer}>
          {message && (
            <div>
              <FormattedMessage id={message} />
            </div>
          )}
          {data && (
            <>
              {resultsListComponent}
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
