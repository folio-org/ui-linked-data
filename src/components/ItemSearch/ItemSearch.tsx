import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { getByIdentifier } from '@common/api/search.api';
import { usePagination } from '@common/hooks/usePagination';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { DEFAULT_SEARCH_BY, SEARCH_RESULTS_LIMIT, SearchIdentifiers } from '@common/constants/search.constants';
import { SearchControls } from '@components/SearchControls';
import { FullDisplay } from '@components/FullDisplay';
import { Pagination } from '@components/Pagination';
import state from '@state';
import GeneralSearch from '@src/assets/general-search.svg?react';
import './ItemSearch.scss';
import { SearchResultList } from '@components/SearchResultList';

const EmptyPlaceholder = () => (
  <div className="empty-placeholder">
    <GeneralSearch />
    <FormattedMessage id="marva.enterSearchCriteria" />
  </div>
);

export const ItemSearch = () => {
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const [message, setMessage] = useRecoilState(state.search.message);
  const [data, setData] = useRecoilState(state.search.data);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  // const [previewContent, setPreviewContent] = useRecoilState(state.inputs.previewContent);
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

  const clearPagination = () => {
    setPageMetadata(DEFAULT_PAGES_METADATA);
    setCurrentPageNumber(0);
  };

  useEffect(() => {
    // clear out preview content on page load

    if (data) return;

    // setPreviewContent([]);
    clearPagination();
  }, []);

  const clearMessage = useCallback(() => message && setMessage(''), [message]);

  const validateAndNormalizeQuery = (type: SearchIdentifiers, query: string) => {
    if (type === SearchIdentifiers.LCCN) {
      const normalized = normalizeLccn(query);

      !normalized && setMessage('marva.searchInvalidLccn');

      return normalized;
    }

    return query;
  };

  const fetchData = async (query: string, searchBy?: SearchIdentifiers, offset?: number) => {
    if (!query) return;

    clearMessage();
    // setPreviewContent([]);
    data && setData(null);

    const updatedQuery = searchBy ? validateAndNormalizeQuery(searchBy, query) : query;

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

  useEffect(() => {
    if (!searchBy || !query) return;

    fetchData(query, searchBy, currentPageNumber * SEARCH_RESULTS_LIMIT);
  }, [currentPageNumber]);

  const submitSearch = () => {
    clearPagination();
    fetchData(query, searchBy, 0);
  };

  const clearValues = () => {
    clearPagination();
    setData(null);
    setSearchBy(DEFAULT_SEARCH_BY);
    setQuery('');
    setMessage('');
    // setPreviewContent([]);
  };

  return (
    <div data-testid="id-search" className="item-search">
      <SearchControls submitSearch={submitSearch} clearValues={clearValues} />
      <div className="item-search-content-container">
        {message && (
          <div>
            <FormattedMessage id={message} />
          </div>
        )}
        {data && (
          <>
            <SearchResultList />
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
        <FullDisplay />
      </div>
      <AdvancedSearchModal submitSearch={fetchData} clearValues={clearValues} />
    </div>
  );
};
