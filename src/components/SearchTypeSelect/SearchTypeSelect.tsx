import { Dispatch, FC, SetStateAction, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { DisplayIdentifiers, Identifiers } from '@common/constants/search.constants';

type Props = {
  searchBy: Identifiers | null;
  setSearchBy: Dispatch<SetStateAction<Identifiers | null>>;
  clearMessage: () => void;
};

const SearchTypeSelect: FC<Props> = ({ searchBy, setSearchBy, clearMessage }) => (
  <div className="search-controls">
    {Object.values(Identifiers).map(id => (
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
          <FormattedMessage id={DisplayIdentifiers[id]} />
        </label>
      </div>
    ))}
  </div>
);

export default memo(SearchTypeSelect);
