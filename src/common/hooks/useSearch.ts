import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { getByIdentifier } from '@common/api/search.api';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { StatusType } from '@common/constants/status.constants';
import { generateSearchParamsState } from '@common/helpers/search.helper';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import state from '@state';
import { useLoadSearchResults } from './useLoadSearchResults';
import { usePagination } from './usePagination';

export const useSearch = ({
  hasSearchParams,
  defaultSearchBy,
}: {
  hasSearchParams: boolean;
  defaultSearchBy: SearchIdentifiers;
}) => {
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const [message, setMessage] = useRecoilState(state.search.message);
  const [data, setData] = useRecoilState(state.search.data);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const setForceRefreshSearch = useSetRecoilState(state.search.forceRefresh);

  const {
    getPageMetadata,
    setPageMetadata,
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick,
    onNextPageClick,
  } = usePagination(DEFAULT_PAGES_METADATA);
  const currentPageNumber = getCurrentPageNumber();
  const pageMetadata = getPageMetadata();
  const setSearchParams = useSearchParams()?.[1];

  const clearPagination = () => {
    setPageMetadata(DEFAULT_PAGES_METADATA);
    setCurrentPageNumber(0);
  };

  const clearMessage = useCallback(() => message && setMessage(''), [message]);

  const validateAndNormalizeQuery = (type: SearchIdentifiers, query: string) => {
    if (type === SearchIdentifiers.LCCN) {
      const normalized = normalizeLccn(query);

      !normalized && setMessage('marva.searchInvalidLccn');

      return normalized;
    }

    return query;
  };

  const fetchData = async (query: string, searchBy: SearchIdentifiers, offset?: number) => {
    clearMessage();

    data && setData(null);

    const updatedQuery = validateAndNormalizeQuery(searchBy, query);

    if (!updatedQuery) return;

    setIsLoading(true);

    try {
      const result = await getByIdentifier({ searchBy, query: updatedQuery as string, offset: offset?.toString() });
      const { content, totalPages, totalRecords } = result;

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
  };

  useLoadSearchResults(fetchData, hasSearchParams ? {} : { query, searchBy, offset: pageMetadata.number?.toString() });

  const submitSearch = () => {
    clearPagination();
    hasSearchParams && setSearchParams(generateSearchParamsState(query, searchBy) as unknown as URLSearchParams);
    setForceRefreshSearch(true);
  };

  const clearValues = () => {
    clearPagination();
    setData(null);
    setSearchBy(defaultSearchBy);
    setQuery('');
    setMessage('');
  };

  return {
    submitSearch,
    clearValues,
    onPrevPageClick,
    onNextPageClick,
    currentPageNumber,
    pageMetadata,
    message,
    data,
  };
};
