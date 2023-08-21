import { getByIdentifier } from '@common/api/search.api';
import { StatusType } from '@common/constants/status.constants';
import { formatKnownItemSearchData } from '@common/helpers/search.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { Input } from '@components/Input';
import { Table, Row } from '@components/Table';
import state from '@state';
import { ChangeEvent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSetRecoilState } from 'recoil';
import './ItemSearch.scss';

enum Identifiers {
  ISBN = 'isbn',
  LCCN = 'lccn',
}

const header: Row = {
  actionItems: {
    label: <FormattedMessage id='marva.actions' />,
    className: 'action-items',
  },
  id: {
    label: <FormattedMessage id='marva.isbn-lccn' />,
  },
  title: {
    label: <FormattedMessage id='marva.title' />,
  },
  author: {
    label: <FormattedMessage id='marva.author' />,
  },
  date: {
    label: <FormattedMessage id='marva.pub-date' />,
  },
  edition: {
    label: <FormattedMessage id='marva.edition' />,
  },
};

type ItemSearch = {
  fetchRecord: (id: string) => Promise<void>;
};

export const ItemSearch = ({ fetchRecord }: ItemSearch) => {
  const [searchBy, setSearchBy] = useState(Identifiers.ISBN);
  const [query, setQuery] = useState('');
  const [data, setData] = useState<null | Row[]>(null);
  const [message, setMessage] = useState('');
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
        <label htmlFor={id}>{id.toUpperCase()}</label>
      </div>
    ));

  const onChangeSearchInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
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

  const onRowClick = ({ __meta }: Row) => fetchRecord((__meta as Record<string, any>).id);

  const fetchData = async (searchBy: string, query: string) => {
    if (!query) return;

    clearMessage();
    data && setData(null);

    try {
      const result = await getByIdentifier(searchBy, query);

      if (!result.content.length) return setMessage(formatMessage({ id: 'marva.search-no-descriptions-match' }));

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
        <FormattedMessage id="marva.search-by-identifier" />
      </strong>
      <div className="search-controls">{drawControls()}</div>
      <div>
        <Input
          testid="id-search-input"
          placeholder={formatMessage({ id: 'marva.search-by' }, { by: searchBy.toUpperCase() })}
          className="search-input"
          value={query}
          onChange={onChangeSearchInput}
        />
        <button data-testid="id-search-button" onClick={() => fetchData(searchBy, query)}>
          <FormattedMessage id="marva.search" />
        </button>
        {message ? <div>{message}</div> : data && <Table onRowClick={onRowClick} header={header} data={data} />}
      </div>
    </div>
  );
};
