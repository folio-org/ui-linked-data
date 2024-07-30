import { ChangeEvent, FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { Button, ButtonType } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { SearchFilters } from '@components/SearchFilters';
import state from '@state';
import CaretDown from '@src/assets/caret-down.svg?react';
import XInCircle from '@src/assets/x-in-circle.svg?react';
import './SearchControls.scss';

type Props = {
  submitSearch: VoidFunction;
  clearValues: VoidFunction;
  filters: SearchFilters;
  isVisibleSearchBy?: boolean;
  isVisibleAdvancedSearch?: boolean;
  isVisibleFilters?: boolean;
  hasSearchParams?: boolean;
};

export const SearchControls: FC<Props> = ({
  submitSearch,
  clearValues,
  filters,
  isVisibleSearchBy = true,
  isVisibleAdvancedSearch = true,
  isVisibleFilters = true,
  hasSearchParams = true,
}) => {
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const setMessage = useSetRecoilState(state.search.message);
  const setNavigationState = useSetRecoilState(state.search.navigationState);
  const resetControls = useResetRecoilState(state.search.limiters);
  const setIsAdvancedSearchOpen = useSetRecoilState(state.ui.isAdvancedSearchOpen);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get(SearchQueryParams.Query);
  const isDisabledResetButton = !query && !searchQueryParam;

  const onChangeSearchInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    setQuery(value);
  };

  const clearValuesAndResetControls = () => {
    clearValues();
    resetControls();
  };

  const onResetButtonClick = () => {
    clearValuesAndResetControls();
    hasSearchParams && setSearchParams({});
    hasSearchParams && setNavigationState({});
  };

  useEffect(() => clearValuesAndResetControls, []);

  return (
    <div className="search-pane">
      <div className="search-pane-header">
        <strong className="search-pane-header-title">
          <FormattedMessage id="marva.searchAndFilter" />
        </strong>
        <CaretDown className="header-caret" />
      </div>
      <div className="search-pane-content">
        <div className="inputs">
          {isVisibleSearchBy && (
            <Select
              withIntl
              id="id-search-select"
              className="select-input"
              value={searchBy}
              options={Object.values(SearchIdentifiers)}
              onChange={({ value }) => setSearchBy(value as SearchIdentifiers)}
            />
          )}
          <Input
            id="id-search-input"
            type="text"
            value={query}
            onChange={onChangeSearchInput}
            className="text-input"
            onPressEnter={submitSearch}
            data-testid="id-search-input"
          />
        </div>
        <Button
          data-testid="id-search-button"
          type={ButtonType.Highlighted}
          className="search-button primary-search"
          onClick={submitSearch}
          disabled={!query}
        >
          <FormattedMessage id="marva.search" />
        </Button>
        <div className={classNames(['meta-controls', !isVisibleAdvancedSearch && 'meta-controls-centered'])}>
          <Button
            type={ButtonType.Text}
            className="search-button"
            onClick={onResetButtonClick}
            prefix={<XInCircle />}
            disabled={isDisabledResetButton}
            data-testid="id-search-reset-button"
          >
            <FormattedMessage id="marva.reset" />
          </Button>
          {isVisibleAdvancedSearch && (
            <Button
              type={ButtonType.Link}
              className="search-button"
              onClick={() => setIsAdvancedSearchOpen(isOpen => !isOpen)}
            >
              <FormattedMessage id="marva.advanced" />
            </Button>
          )}
        </div>

        {isVisibleFilters && <SearchFilters filters={filters} />}
      </div>
    </div>
  );
};
