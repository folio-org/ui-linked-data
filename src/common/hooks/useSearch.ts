import { useCallback, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { getByIdentifier } from '@common/api/search.api';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { StatusType } from '@common/constants/status.constants';
import { generateSearchParamsState } from '@common/helpers/search.helper';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { SearchContext } from '@src/contexts';
import state from '@state';
import { usePagination } from './usePagination';

export const useSearch = () => {
  const { endpointUrl, searchFilter, isSortedResults, hasSearchParams, defaultSearchBy } = useContext(SearchContext);
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const [message, setMessage] = useRecoilState(state.search.message);
  const [data, setData] = useRecoilState(state.search.data);
  const [pageMetadata, setPageMetadata] = useRecoilState(state.search.pageMetadata);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const setForceRefreshSearch = useSetRecoilState(state.search.forceRefresh);

  const { getCurrentPageNumber, setCurrentPageNumber, onPrevPageClick, onNextPageClick } =
    usePagination(hasSearchParams);
  const currentPageNumber = getCurrentPageNumber();
  const setSearchParams = useSearchParams()?.[1];

  useEffect(() => {
    setSearchBy(defaultSearchBy);
  }, [setSearchBy, defaultSearchBy]);

  const clearPagination = useCallback(() => {
    setPageMetadata(DEFAULT_PAGES_METADATA);
    setCurrentPageNumber(0);
  }, []);

  const clearMessage = useCallback(() => message && setMessage(''), [message, setMessage]);

  const validateAndNormalizeQuery = useCallback(
    (type: SearchIdentifiers, query: string) => {
      if (type === SearchIdentifiers.LCCN) {
        const normalized = normalizeLccn(query);

        !normalized && setMessage('marva.searchInvalidLccn');

        return normalized;
      }

      return query;
    },
    [setMessage],
  );

  const fetchData = useCallback(
    async (query: string, searchBy: SearchIdentifiers, offset?: number) => {
      clearMessage();

      data && setData(null);

      const updatedQuery = validateAndNormalizeQuery(searchBy, query);

      if (!updatedQuery) return;

      setIsLoading(true);

      try {
        const result = await getByIdentifier({
          endpointUrl,
          searchFilter,
          isSortedResults,
          searchBy,
          query: updatedQuery as string,
          offset: offset?.toString(),
        });
        const { content, totalPages, totalRecords } = result;

        // TODO: pass the message though the context
        if (!content.length) return setMessage('marva.searchNoRdsMatch');

        setData(content);
        setPageMetadata({ totalPages, totalElements: totalRecords });
      } catch {
        setStatusMessages(currentStatus => [
          ...currentStatus,
          UserNotificationFactory.createMessage(StatusType.error, 'marva.errorFetching'),
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [data, endpointUrl, searchFilter, isSortedResults],
  );

  const submitSearch = useCallback(() => {
    clearPagination();

    if (hasSearchParams) {
      setSearchParams(generateSearchParamsState(query, searchBy) as unknown as URLSearchParams);
    } else {
      fetchData(query, searchBy);
    }

    setForceRefreshSearch(true);
  }, [fetchData, hasSearchParams, query, searchBy]);

  const clearValues = useCallback(() => {
    clearPagination();
    setData(null);
    setSearchBy(defaultSearchBy);
    setQuery('');
    setMessage('');
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
