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
  renderSearchControlPane,
  renderResultsList,
}) => {
  return (
    <SearchProvider
      value={{
        filters,
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
        renderSearchControlPane,
        renderResultsList,
      }}
    >
      <ItemSearch />
    </SearchProvider>
  );
};
