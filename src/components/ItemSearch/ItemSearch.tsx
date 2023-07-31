import { getByIdentifier } from '@common/api/search.api';
import { Input } from '@components/Input';
import { ChangeEvent, useState } from 'react';
import './ItemSearch.scss';

enum Identifiers {
  ISBN = 'isbn',
  LCCN = 'lccn',
}

export const ItemSearch = () => {
  const [searchBy, setSearchBy] = useState(Identifiers.ISBN);
  const [query, setQuery] = useState('');

  const drawControls = () =>
    Object.values(Identifiers).map(id => (
      <div key={id}>
        <input data-testid={id} id={id} type="radio" checked={searchBy === id} onChange={() => setSearchBy(id)} />
        <label htmlFor={id}>{id.toUpperCase()}</label>
      </div>
    ));

  const onChangeSearchInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setQuery(value);

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
        <button data-testid="id-search-button" onClick={() => query && getByIdentifier(searchBy, query)}>
          Search
        </button>
      </div>
    </div>
  );
};
