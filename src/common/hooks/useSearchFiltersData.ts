import * as SearchApi from '@common/api/search.api';

export const useSearchFiltersData = () => {
  const getSearchSourceData = async (url?: string) => {
    if (!url) return;

    try {
      const response = await SearchApi.getSearchSourceData(url);

      console.log('response', response);
    } catch (error) {
      console.error(error);
    }
  };

  const getSearchFacetsData = async (url?: string, facet?: string) => {
    if (!url) return;

    try {
      const response = await SearchApi.getFacets(url);

      console.log('response', response, facet);
    } catch (error) {
      console.error(error);
    }
  };

  return { getSearchSourceData, getSearchFacetsData };
};
