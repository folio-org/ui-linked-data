import { FC } from 'react';
import { SearchProvider } from '@common/providers/SearchProvider';
import { ItemSearch } from '@components/ItemSearch';

export const Search: FC<SearchParams> = ({
  endpointUrl,
  hasSearchParams,
  defaultSearchBy,
  isSortedResults,
  isVisibleFilters,
  isVisibleFullDisplay,
  isVisibleAdvancedSearch,
  isVisibleSearchByControl,
  labelEmptySearch,
  classNameEmptyPlaceholder,
  filters,
  controlPaneComponent,
  resultsListComponent,
}) => {
  return (
    <SearchProvider
      value={{
        endpointUrl,
        hasSearchParams,
        defaultSearchBy,
        isSortedResults,
        isVisibleFilters,
        isVisibleFullDisplay,
        isVisibleAdvancedSearch,
        isVisibleSearchByControl,
        labelEmptySearch,
        classNameEmptyPlaceholder,
      }}
    >
      <ItemSearch
        filters={filters}
        controlPaneComponent={controlPaneComponent}
        resultsListComponent={resultsListComponent}
      />
    </SearchProvider>
  );
};
