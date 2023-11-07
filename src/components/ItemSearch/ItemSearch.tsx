import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { getByIdentifier } from '@common/api/search.api';
import { StatusType } from '@common/constants/status.constants';
import { formatKnownItemSearchData } from '@common/helpers/search.helper';
import { normalizeLccn } from '@common/helpers/validations.helper';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { swapRowPositions } from '@common/helpers/table.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { SearchControls } from '@components/SearchControls';
import { FullDisplay } from '@components/FullDisplay';
import { Table, Row } from '@components/Table';
import state from '@state';
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

type ItemSearch = {
  fetchRecord: (id: string, collectPreviewValues?: boolean) => Promise<void>;
};

export const ItemSearch = ({ fetchRecord }: ItemSearch) => {
  const [searchBy, setSearchBy] = useState<SearchIdentifiers | null>(null);
  const [query, setQuery] = useState('');
  const [data, setData] = useState<null | Row[]>(null);
  const [message, setMessage] = useState('');
  const [header, setHeader] = useState(initHeader);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const [previewContent, setPreviewContent] = useRecoilState(state.inputs.previewContent);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useRecoilState(state.ui.isAdvancedSearchOpen);
  const navigate = useNavigate();

  useEffect(() => {
    // apply disabled/enabled state to row action items
    data && setData(applyRowActionItems(data));
  }, [previewContent]);

  useEffect(() => {
    // clear out preview content on page load
    !data && setPreviewContent([]);
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
            <button
              onClick={ev => {
                ev.stopPropagation();

                const recordId: string = (row.__meta as Record<string, any>).id;

                fetchRecord(recordId, true);
              }}
              disabled={infoButtonDisabled ?? Object.keys(previewContent).length > 1}
            >
              ℹ️
            </button>
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
      setHeader(swapRowPositions(header, SearchIdentifiers.LCCN, SearchIdentifiers.ISBN));
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

  const fetchData = async (searchBy: SearchIdentifiers, query: string) => {
    if (!query) return;

    clearMessage();
    setPreviewContent([]);
    data && setData(null);

    const updatedQuery = validateAndNormalizeQuery(searchBy, query);

    if (!updatedQuery) return;

    try {
      const result = await getByIdentifier(searchBy, updatedQuery as string);

      if (!result.content.length) return setMessage('marva.search-no-rds-match');

      swapIdentifiers();
      setData(applyRowActionItems(formatKnownItemSearchData(result), false));
    } catch {
      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'marva.search-error-fetching'),
      ]);
    }
  };

  return (
    <div data-testid="id-search" className="item-search">
      <strong>
        <FormattedMessage id="marva.search-by" />
      </strong>
      <SearchControls
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        query={query}
        setQuery={setQuery}
        setMessage={setMessage}
        clearMessage={clearMessage}
        fetchData={fetchData}
      />
      <div>
        {message ? (
          <div>
            <FormattedMessage id={message} />
          </div>
        ) : (
          data && <Table onRowClick={onRowClick} header={header} data={data} />
        )}
      </div>
      <FullDisplay />
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        toggleIsOpen={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
      />
    </div>
  );
};
