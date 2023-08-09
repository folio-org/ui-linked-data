import { getByIdentifier } from '@common/api/search.api';
import { StatusType } from '@common/constants/status.constants';
import { formatKnownItemSearchData } from '@common/helpers/search.helper';
import { UserNotificationFactory } from '@common/services/userNotification';
import { Input } from '@components/Input';
import { Table, Row } from '@components/Table';
import state from '@state';
import { ChangeEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import './ItemSearch.scss';

enum Identifiers {
  ISBN = 'isbn',
  LCCN = 'lccn',
}

const header: Row = {
  id: {
    label: 'ISBN/LCCN',
  },
  title: {
    label: 'Title',
  },
  author: {
    label: 'Author',
  },
  date: {
    label: 'Publication Date',
  },
  edition: {
    label: 'Edition',
  },
};

type ItemSearch = {
  fetchRecord: (id: string) => Promise<void>;
};

export const ItemSearch = ({ fetchRecord }: ItemSearch) => {
  const [searchBy, setSearchBy] = useState(Identifiers.ISBN);
  const [query, setQuery] = useState('');
  const [data, setData] = useState<null | Row[]>(null);
  const setStatusMessages = useSetRecoilState(state.status.commonMessages);

  const drawControls = () =>
    Object.values(Identifiers).map(id => (
      <div key={id}>
        <input data-testid={id} id={id} type="radio" checked={searchBy === id} onChange={() => setSearchBy(id)} />
        <label htmlFor={id}>{id.toUpperCase()}</label>
      </div>
    ));

  const onChangeSearchInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setQuery(value);
  const onRowClick = ({ __meta }: Row) => fetchRecord((__meta as Record<string, any>).id);

  const fetchData = async (searchBy: string, query: string) => {
    if (!query) return;

    try {
      const result = await getByIdentifier(searchBy, query);

      setData(formatKnownItemSearchData(result));
    } catch (e) {
      setStatusMessages(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'No resource descriptions match your query.'),
      ]);
    }
  };

  return (
    <div data-testid="id-search" className="item-search">
      <strong>Search by Identifier:</strong>
      <div className="search-controls">{drawControls()}</div>
      <div>
        <Input
          testid="id-search-input"
          placeholder={`Search by ${searchBy.toUpperCase()}...`}
          className="search-input"
          value={query}
          onChange={onChangeSearchInput}
        />
        <button data-testid="id-search-button" onClick={() => fetchData(searchBy, query)}>
          Search
        </button>
        {data && <Table onRowClick={onRowClick} header={header} data={data} />}
      </div>
    </div>
  );
};
