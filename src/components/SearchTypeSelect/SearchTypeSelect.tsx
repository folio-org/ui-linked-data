import { Dispatch, FC, SetStateAction, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { SearchDisplayIdentifiers, SearchIdentifiers } from '@common/constants/search.constants';

type Props = {
  searchBy: SearchIdentifiers | null;
  setSearchBy: Dispatch<SetStateAction<SearchIdentifiers | null>>;
  clearMessage: VoidFunction;
};

const SearchTypeSelect: FC<Props> = ({ searchBy, setSearchBy, clearMessage }) => (
  <div data-testid="id-search-type-select" className="search-controls">
    {Object.values(SearchIdentifiers).map(id => (
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
        <label htmlFor={id}>
          <FormattedMessage id={SearchDisplayIdentifiers[id]}>
            {/* {TODO: check this change in Production mode;
              Solution with type assertion don't work in Production build} */}
            {text => <>{text.map(textElem => textElem?.toString().toUpperCase())}</>}
          </FormattedMessage>
        </label>
      </div>
    ))}
  </div>
);

export default memo(SearchTypeSelect);
