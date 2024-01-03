import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getByIdentifier } from '@common/api/search.api';
import { usePagination } from '@common/hooks/usePagination';
import { StatusType } from '@common/constants/status.constants';
import { formatKnownItemSearchData } from '@common/helpers/search.helper';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { swapRowPositions } from '@common/helpers/table.helper';
import { scrollElementIntoView } from '@common/helpers/pageScrolling.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { SEARCH_RESULTS_LIMIT, SearchIdentifiers } from '@common/constants/search.constants';
import { DEFAULT_PAGES_METADATA } from '@common/constants/api.constants';
import { DOM_ELEMENTS } from '@common/constants/domElementsIdentifiers.constants';
import { SCROLL_DELAY_MS } from '@common/constants/pageScrolling.constants';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
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
    label: <FormattedMessage id="marva.pub-date" />,
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

const EmptyPlaceholder = () => (
  <div className="empty-placeholder">
    <GeneralSearch />
    <FormattedMessage id="marva.enter-search-criteria" />
  </div>
);

export const ItemSearch = ({ fetchRecord }: Props) => {
  const navElemRef = useRef<Element | null>();
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const fullDisplayContainerElemRef = useRef<Element | null>();
  const searchBy = useRecoilValue(state.search.index);
  const query = useRecoilValue(state.search.query);
  const [message, setMessage] = useRecoilState(state.search.message);
  const [data, setData] = useRecoilState(state.search.data);
  const [header, setHeader] = useState(initHeader);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const [previewContent, setPreviewContent] = useRecoilState(state.inputs.previewContent);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useRecoilState(state.ui.isAdvancedSearchOpen);
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

  useEffect(() => {
    navElemRef.current = document.querySelector(`.${DOM_ELEMENTS.classNames.nav}`);
    fullDisplayContainerElemRef.current = document.querySelector(`.${DOM_ELEMENTS.classNames.fullDisplayContainer}`);
  }, []);

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
                    scrollElementIntoView(fullDisplayContainerElemRef.current, navElemRef.current);
                  }, SCROLL_DELAY_MS);
                } catch {
                  setStatusMessages(currentStatus => [
                    ...currentStatus,
                    UserNotificationFactory.createMessage(StatusType.error, 'marva.error-fetching'),
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

      !normalized && setMessage('marva.search-invalid-lccn');

      return normalized;
    }

    return query;
  };

  const fetchData = async (searchBy: SearchIdentifiers, query: string, offset?: number) => {
    if (!query) return;

    clearMessage();
    setPreviewContent([]);
    data && setData(null);

    const updatedQuery = validateAndNormalizeQuery(searchBy, query);

    if (!updatedQuery) return;

    setIsLoading(true);

    try {
      const result = await getByIdentifier(searchBy, updatedQuery as string, offset?.toString());
      const { content, totalPages, totalRecords } = result;

      if (!content.length) return setMessage('marva.search-no-rds-match');

      swapIdentifiers();
      setData(applyRowActionItems(formatKnownItemSearchData(result), false));
      setPageMetadata({ totalPages, totalElements: totalRecords });
    } catch {
      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.error-fetching'),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchBy || !query) return;

    fetchData(searchBy, query, currentPageNumber * SEARCH_RESULTS_LIMIT);
  }, [currentPageNumber]);

  const submitSearch = () => {
    clearPagination();
    fetchData(searchBy, query, 0);
  };

  return (
    <div data-testid="id-search" className="item-search">
      <SearchControls submitSearch={submitSearch} clearPagination={clearPagination} />
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
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        toggleIsOpen={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
      />
    </div>
  );
};
