import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState, useRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';
import { getByIdentifier } from '@common/api/search.api';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { StatusType } from '@common/constants/status.constants';
import { generateSearchParamsState, normalizeQuery } from '@common/helpers/search.helper';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import state from '@state';
import { usePagination } from '@common/hooks/usePagination';
import { useSearchContext } from './useSearchContext';

export const useSearch = () => {
  const {
    endpointUrl,
    searchFilter,
    isSortedResults,
    hasSearchParams,
    defaultSearchBy,
    navigationSegment,
    endpointUrlsBySegments,
    searchResultsLimit,
  } = useSearchContext();
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const facets = useRecoilValue(state.search.limiters);
  const [message, setMessage] = useRecoilState(state.search.message);
  const [data, setData] = useRecoilState(state.search.data);
  const [pageMetadata, setPageMetadata] = useRecoilState(state.search.pageMetadata);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const setForceRefreshSearch = useSetRecoilState(state.search.forceRefresh);
  const resetPreviewContent = useResetRecoilState(state.inputs.previewContent);
  const setFacetsBySegments = useSetRecoilState(state.search.facetsBySegments);

  const { getCurrentPageNumber, setCurrentPageNumber, onPrevPageClick, onNextPageClick } =
    usePagination(hasSearchParams);
  const currentPageNumber = getCurrentPageNumber();
  const setSearchParams = useSearchParams()?.[1];
  const selectedNavigationSegment = navigationSegment?.value;

  useEffect(() => {
    setSearchBy(defaultSearchBy);
  }, [setSearchBy, defaultSearchBy]);

  const clearPagination = useCallback(() => {
    setPageMetadata(DEFAULT_PAGES_METADATA);
    setCurrentPageNumber(0);
  }, []);

  const validateAndNormalizeQuery = useCallback(
    (type: SearchIdentifiers, query: string) => {
      if (type === SearchIdentifiers.LCCN) {
        const normalized = normalizeLccn(query);

        !normalized && setMessage('ld.searchInvalidLccn');

        return normalized;
      }

      return normalizeQuery(query);
    },
    [setMessage],
  );

  const fetchData = useCallback(
    async (query: string, searchBy: SearchIdentifiers, offset?: number) => {
      setMessage('');

      data && setData(null);

      const updatedQuery = validateAndNormalizeQuery(searchBy, query);

      if (!updatedQuery) return;

      setIsLoading(true);

      try {
        const currentEndpointUrl = selectedNavigationSegment
          ? endpointUrlsBySegments?.[selectedNavigationSegment]
          : endpointUrl;

        const result = await getByIdentifier({
          endpointUrl: currentEndpointUrl ?? endpointUrl,
          searchFilter,
          isSortedResults,
          searchBy,
          query: updatedQuery as string,
          offset: offset?.toString(),
          limit: searchResultsLimit?.toString(),
        });
        const { content, totalPages, totalRecords } = result;

        // TODO: pass the message though the context
        if (!content.length) return setMessage('ld.searchNoRdsMatch');

        setData(content);
        setPageMetadata({ totalPages, totalElements: totalRecords });
      } catch {
        setStatusMessages(currentStatus => [
          ...currentStatus,
          UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'),
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [data, endpointUrl, selectedNavigationSegment, searchFilter, isSortedResults],
  );

  const submitSearch = useCallback(() => {
    clearPagination();
    resetPreviewContent();

    if (selectedNavigationSegment) {
      setFacetsBySegments(prevValue => ({
        ...prevValue,
        [selectedNavigationSegment as string]: {
          query,
          searchBy,
          facets,
        },
      }));
    }

    if (hasSearchParams) {
      setSearchParams(generateSearchParamsState(query, searchBy) as unknown as URLSearchParams);
    } else {
      fetchData(query, searchBy);
    }

    setForceRefreshSearch(true);
  }, [fetchData, hasSearchParams, query, searchBy, selectedNavigationSegment, facets]);

  const clearValues = useCallback(() => {
    clearPagination();
    setData(null);
    setSearchBy(defaultSearchBy);
    setQuery('');
    setMessage('');
    resetPreviewContent();
  }, [defaultSearchBy]);

  return {
    submitSearch,
    clearValues,
    onPrevPageClick,
    onNextPageClick,
    currentPageNumber,
    pageMetadata,
    message,
    data,
    fetchData,
  };
};
