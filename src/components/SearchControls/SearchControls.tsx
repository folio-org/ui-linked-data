import { ChangeEvent, FC, memo, Dispatch, SetStateAction } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SearchDisplayIdentifiers, SearchIdentifiers } from '@common/constants/search.constants';
import { Input } from '@components/Input';
import { SearchTypeSelect } from '@components/SearchTypeSelect';
import './SearchControls.scss';

type Props = {
  searchBy: SearchIdentifiers | null;
  setSearchBy: Dispatch<SetStateAction<SearchIdentifiers | null>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
  clearMessage: VoidFunction;
  submitSearch: VoidFunction;
};

const SearchControls: FC<Props> = ({
  searchBy,
  setSearchBy,
  query,
  setQuery,
  setMessage,
  clearMessage,
  submitSearch,
}) => {
  const { formatMessage } = useIntl();

  const onChangeSearchInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (!searchBy) {
      setMessage('marva.search-select-index');
      return;
    }

    clearMessage();
    setQuery(value);
  };

  return (
    <div data-testid="id-search-controls" className="id-search-controls">
      <SearchTypeSelect searchBy={searchBy} setSearchBy={setSearchBy} clearMessage={clearMessage} />
      <div className="input-box">
        <Input
          testid="id-search-input"
          placeholder={formatMessage(
            { id: 'marva.search-by-sth' },
            { by: searchBy && ` ${formatMessage({ id: SearchDisplayIdentifiers[searchBy] })}` },
          )}
          className="search-input"
          value={query}
          onChange={onChangeSearchInput}
          onPressEnter={submitSearch}
        />
        <button data-testid="id-search-button" onClick={submitSearch} disabled={!query || !searchBy}>
          <FormattedMessage id="marva.search" />
        </button>
      </div>
    </div>
  );
};

export default memo(SearchControls);
