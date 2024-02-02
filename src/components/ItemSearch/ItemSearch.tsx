import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getByIdentifier } from '@common/api/search.api';
import { usePagination } from '@common/hooks/usePagination';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { StatusType } from '@common/constants/status.constants';
import { formatKnownItemSearchData } from '@common/helpers/search.helper';
import { swapRowPositions } from '@common/helpers/table.helper';
import { getByClassNameAndScrollIntoView } from '@common/helpers/pageScrolling.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { SCROLL_DELAY_MS } from '@common/constants/pageScrolling.constants';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { DEFAULT_SEARCH_BY, SEARCH_RESULTS_LIMIT, SearchIdentifiers } from '@common/constants/search.constants';
import { SearchControls } from '@components/SearchControls';
import { FullDisplay } from '@components/FullDisplay';
import { Table, Row } from '@components/Table';
import { Pagination } from '@components/Pagination';
import { Button } from '@components/Button';
import state from '@state';
import GeneralSearch from '@src/assets/general-search.svg?react';
import './ItemSearch.scss';

const initHeader: Row = {
  actionItems: {
    label: <FormattedMessage id="marva.actions" />,
    className: 'action-items',
    position: 0,
  },
  isbn: {
    label: <FormattedMessage id="marva.isbn" />,
    position: 1,
  },
  lccn: {
    label: <FormattedMessage id="marva.lccn" />,
    position: 2,
  },
  title: {
    label: <FormattedMessage id="marva.title" />,
    position: 3,
  },
  author: {
    label: <FormattedMessage id="marva.author" />,
    position: 4,
  },
  date: {
    label: <FormattedMessage id="marva.pubDate" />,
    position: 5,
  },
  edition: {
    label: <FormattedMessage id="marva.edition" />,
    position: 6,
  },
};

type Props = {
  fetchRecord: (id: string, collectPreviewValues?: boolean) => Promise<void>;
};

const scrollFullDisplayIntoView = () => getByClassNameAndScrollIntoView(DOM_ELEMENTS.classNames.fullDisplayContainer);

const EmptyPlaceholder = () => (
  <div className="empty-placeholder">
    <GeneralSearch />
    <FormattedMessage id="marva.enterSearchCriteria" />
  </div>
);

export const ItemSearch = ({ fetchRecord }: Props) => {
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const [message, setMessage] = useRecoilState(state.search.message);
  const [data, setData] = useRecoilState(state.search.data);
  const [header, setHeader] = useState(initHeader);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const [previewContent, setPreviewContent] = useRecoilState(state.inputs.previewContent);
  const navigate = useNavigate();
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
    // apply disabled/enabled state to row action items
    data && setData(applyRowActionItems(data));
  }, [previewContent]);

  useEffect(() => {
    // clear out preview content on page load

    if (data) return;

    setPreviewContent([]);
    clearPagination();
  }, []);

  const clearMessage = useCallback(() => message && setMessage(''), [message]);

  // state update is not always reflected in the fn
  // alternatively, pass a flag to manually enable the icons
  // even if the preview content hasn't been flushed yet
  const applyRowActionItems = (rows: Row[], infoButtonDisabled?: boolean): Row[] =>
    rows.map(row => ({
      ...row,
      actionItems: {
        children: (
          <div className="action-items__container">
            <Button
              data-testid="preview-button"
              onClick={async event => {
                event.stopPropagation();
                setIsLoading(true);

                try {
                  const recordId: string = (row.__meta as Record<string, any>).id;

                  await fetchRecord(recordId, true);

                  setTimeout(() => {
                    setIsLoading(false);
                    scrollFullDisplayIntoView();
                  }, SCROLL_DELAY_MS);
                } catch {
                  setStatusMessages(currentStatus => [
                    ...currentStatus,
                    UserNotificationFactory.createMessage(StatusType.error, 'marva.errorFetching'),
                  ]);
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={infoButtonDisabled ?? Object.keys(previewContent).length > 1}
            >
              ℹ️
            </Button>
            <Link
              data-testid="edit-button"
              to={generateEditResourceUrl((row.__meta as Record<string, any>).id)}
              className="button"
            >
              ✏️
            </Link>
          </div>
        ),
        className: 'action-items',
      },
    }));

  const canSwapRows = (row1: SearchIdentifiers, row2: SearchIdentifiers) =>
    searchBy === row1 && header[row2].position < header[row1].position;

  const swapIdentifiers = () => {
    if (
      canSwapRows(SearchIdentifiers.ISBN, SearchIdentifiers.LCCN) ||
      canSwapRows(SearchIdentifiers.LCCN, SearchIdentifiers.ISBN)
    ) {
      setHeader(header => swapRowPositions(header, SearchIdentifiers.LCCN, SearchIdentifiers.ISBN));
    }
  };

  const onRowClick = ({ __meta }: Row) => navigate(generateEditResourceUrl((__meta as Record<string, any>).id));

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
    setPreviewContent([]);
    data && setData(null);

    const updatedQuery = searchBy ? validateAndNormalizeQuery(searchBy, query) : query;

    if (!updatedQuery) return;

    setIsLoading(true);

    try {
      const result = await getByIdentifier({ searchBy, query: updatedQuery as string, offset: offset?.toString() });
      const { content, totalPages, totalRecords } = result;

      if (!content.length) return setMessage('marva.searchNoRdsMatch');

      swapIdentifiers();
      setData(applyRowActionItems(formatKnownItemSearchData(result), false));
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
    setPreviewContent([]);
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
            <Table onRowClick={onRowClick} header={header} data={data} className="table-with-pagination" />
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
