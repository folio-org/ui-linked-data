import { Dispatch, FC, SetStateAction, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { SearchDisplayIdentifiers, SearchIdentifiers } from '@common/constants/search.constants';
import { Link } from 'react-router-dom';
import './SearchTypeSelect.scss';
import { useSetRecoilState } from 'recoil';
import state from '@state';
import { ADVANCED_SEARCH_ENABLED } from '@common/constants/feature.constants';

type Props = {
  searchBy: SearchIdentifiers | null;
  setSearchBy: Dispatch<SetStateAction<SearchIdentifiers | null>>;
  clearMessage: VoidFunction;
};

// TODO: replace <Link /> with <Button /> (non-existent yet) with the appropriste styling
const SearchTypeSelect: FC<Props> = ({ searchBy, setSearchBy, clearMessage }) => {
  const setIsAdvancedSearchOpen = useSetRecoilState(state.ui.isAdvancedSearchOpen);

  return (
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
      {ADVANCED_SEARCH_ENABLED && (
        <Link to="#" onClick={() => setIsAdvancedSearchOpen(true)} className="advanced-search-button">
          <FormattedMessage id="marva.advanced-search" />
        </Link>
      )}
    </div>
  );
};

export default memo(SearchTypeSelect);
