import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { FormattedMessage } from 'react-intl';
import state from '@state';
import { getByIdentifier } from '@common/api/search.api';
import { usePagination } from '@common/hooks/usePagination';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { DEFAULT_SEARCH_BY, SEARCH_RESULTS_LIMIT, SearchIdentifiers } from '@common/constants/search.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { SearchControls } from '@components/SearchControls';
import { FullDisplay } from '@components/FullDisplay';
import { Pagination } from '@components/Pagination';
import { SearchResultList } from '@components/SearchResultList';
import { SearchControlPane } from '@components/SearchControlPane';
import { generateSearchParamsState } from '@common/helpers/search.helper';
import { useLoadSearchResults } from '@common/hooks/useLoadSearchResults';
import GeneralSearch from '@src/assets/general-search.svg?react';
import './ItemSearch.scss';

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
  const setSearchParams = useSearchParams()?.[1];

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
    let updatedQuery: string | null = query;

    if (type === SearchIdentifiers.LCCN) {
      const normalized = normalizeLccn(query);

      !normalized && setMessage('marva.searchInvalidLccn');

      updatedQuery = normalized;
    }

    return updatedQuery?.replaceAll('"', '\\"');
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

  useLoadSearchResults(fetchData, currentPageNumber);

  const submitSearch = () => {
    clearPagination();
    setSearchParams(generateSearchParamsState(query, searchBy) as unknown as URLSearchParams);
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
      </div>
      <AdvancedSearchModal clearValues={clearValues} />
    </div>
  );
};
