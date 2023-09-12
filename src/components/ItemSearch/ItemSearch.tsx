import { getByIdentifier } from '@common/api/search.api';
import { StatusType } from '@common/constants/status.constants';
import { formatKnownItemSearchData } from '@common/helpers/search.helper';
import { swapRowPositions } from '@common/helpers/table.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { Input } from '@components/Input';
import { Table, Row } from '@components/Table';
import state from '@state';
import { ChangeEvent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSetRecoilState } from 'recoil';
import './ItemSearch.scss';

export enum Identifiers {
  ISBN = 'isbn',
  LCCN = 'lccn',
  TITLE = 'title',
}

enum DisplayIdentifiers {
  isbn = 'marva.isbn',
  lccn = 'marva.lccn',
  title = 'marva.title',
}

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
  fetchRecord: (id: string) => Promise<void>;
};

export const ItemSearch = ({ fetchRecord }: ItemSearch) => {
  const [searchBy, setSearchBy] = useState<Identifiers | null>(null);
  const [query, setQuery] = useState('');
  const [data, setData] = useState<null | Row[]>(null);
  const [message, setMessage] = useState('');
  const [header, setHeader] = useState(initHeader);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);
  const { formatMessage } = useIntl();

  const clearMessage = () => message && setMessage('');

  const drawControls = () =>
    Object.values(Identifiers).map(id => (
      <div key={id}>
        <input
          data-testid={id}
          id={id}
          type="radio"
          checked={searchBy === id}
          onChange={() => {
            clearMessage();
            setSearchBy(id);
          }}
        />
        <label htmlFor={id}><FormattedMessage id={DisplayIdentifiers[id]} /></label>
      </div>
    ));

  const onChangeSearchInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (!searchBy) {
      return setMessage('marva.search-select-index');
    }

    clearMessage();

    setQuery(value);
  };

  const applyRowActionItems = (rows: Row[]): Row[] =>
    rows.map(row => ({
      ...row,
      actionItems: {
        children: (
          <div className="action-items__container">
            <button
              data-testid="edit-button"
              onClick={ev => {
                ev.stopPropagation();

                fetchRecord((row.__meta as Record<string, any>).id);
              }}
            >
              &#9997;
            </button>
            <button
              onClick={ev => {
                ev.stopPropagation();
              }}
            >
              &#128064;
            </button>
          </div>
        ),
        className: 'action-items',
      },
    }));

  const canSwapRows = (row1: Identifiers, row2: Identifiers) =>
    searchBy === row1 && header[row2].position < header[row1].position;

  const swapIdentifiers = () => {
    if (canSwapRows(Identifiers.ISBN, Identifiers.LCCN) || canSwapRows(Identifiers.LCCN, Identifiers.ISBN)) {
      setHeader(swapRowPositions(header, Identifiers.LCCN, Identifiers.ISBN));
    }
  };

  const onRowClick = ({ __meta }: Row) => fetchRecord((__meta as Record<string, any>).id);

  const fetchData = async (searchBy: string, query: string) => {
    if (!query) return;

    clearMessage();
    data && setData(null);

    try {
      const result = await getByIdentifier(searchBy, query);

      if (!result.content.length) return setMessage('marva.search-no-rds-match');

      swapIdentifiers();
      setData(applyRowActionItems(formatKnownItemSearchData(result)));
    } catch (e) {
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
      <div className="search-controls">{drawControls()}</div>
      <div>
        <Input
          testid="id-search-input"
          placeholder={formatMessage({ id: 'marva.search-by-sth' }, { by: searchBy && ` ${formatMessage({ id: DisplayIdentifiers[searchBy] })}` })}
          className="search-input"
          value={query}
          onChange={onChangeSearchInput}
        />
        <button
          data-testid="id-search-button"
          onClick={() => searchBy && fetchData(searchBy, query)}
          disabled={!query || !searchBy}
        >
          <FormattedMessage id="marva.search" />
        </button>
        {message ? (
          <div>
            <FormattedMessage id={message} />
          </div>
        ) : (
          data && <Table onRowClick={onRowClick} header={header} data={data} />
        )}
      </div>
    </div>
  );
};
