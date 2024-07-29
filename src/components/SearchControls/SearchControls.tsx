import { ChangeEvent, FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { FormattedMessage } from 'react-intl';
import {
  FiltersGroupCheckType,
  FiltersType,
  Format,
  PublishDate,
  SearchIdentifiers,
  SearchLimiterNames,
  Suppressed,
} from '@common/constants/search.constants';
import { SEARCH_FILTERS_ENABLED } from '@common/constants/feature.constants';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { Button, ButtonType } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { SearchFilters } from '@components/SearchFilters';
import state from '@state';
import CaretDown from '@src/assets/caret-down.svg?react';
import XInCircle from '@src/assets/x-in-circle.svg?react';
import './SearchControls.scss';

const filters = [
  {
    labelId: 'marva.publishDate',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: PublishDate.AllTime,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'marva.allTime',
      },
      {
        id: PublishDate.TwelveMonths,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'marva.past12Months',
      },
      {
        id: PublishDate.FiveYears,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'marva.past5Yrs',
      },
      {
        id: PublishDate.TenYears,
        type: FiltersType.Radio,
        name: SearchLimiterNames.PublishDate,
        labelId: 'marva.past10Yrs',
      },
    ],
  },
  {
    labelId: 'marva.format',
    type: FiltersGroupCheckType.Multi,
    children: [
      {
        id: Format.Volume,
        type: FiltersType.Checkbox,
        name: SearchLimiterNames.Format,
        labelId: 'marva.volume',
      },
      {
        id: Format.Ebook,
        type: FiltersType.Checkbox,
        name: SearchLimiterNames.Format,
        labelId: 'marva.onlineResource',
      },
    ],
  },
  {
    labelId: 'marva.suppressed',
    type: FiltersGroupCheckType.Single,
    children: [
      {
        id: Suppressed.All,
        type: FiltersType.Radio,
        name: SearchLimiterNames.Suppressed,
        labelId: 'marva.volume',
      },
      {
        id: Suppressed.NotSuppressed,
        type: FiltersType.Radio,
        name: SearchLimiterNames.Suppressed,
        labelId: 'marva.suppressed',
      },
    ],
  },
];

type Props = {
  submitSearch: VoidFunction;
  clearValues: VoidFunction;
};

export const SearchControls: FC<Props> = ({ submitSearch, clearValues }) => {
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
    setSearchParams({});
    setNavigationState({});
  };

  useEffect(() => clearValuesAndResetControls, []);

  return (
    <div className="search-pane">
      <div className="header">
        <strong>
          <FormattedMessage id="marva.searchAndFilter" />
        </strong>
        <CaretDown className="header-caret" />
      </div>
      <div className="inputs">
        <Select
          withIntl
          id="id-search-select"
          className="select-input"
          value={searchBy}
          options={Object.values(SearchIdentifiers)}
          onChange={({ value }) => setSearchBy(value as SearchIdentifiers)}
        />
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
        className="search-button"
        onClick={submitSearch}
        disabled={!query}
      >
        <FormattedMessage id="marva.search" />
      </Button>
      <div className="meta-controls">
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
        <Button
          type={ButtonType.Link}
          className="search-button"
          onClick={() => setIsAdvancedSearchOpen(isOpen => !isOpen)}
        >
          <FormattedMessage id="marva.advanced" />
        </Button>
      </div>

      {SEARCH_FILTERS_ENABLED && <SearchFilters filters={filters} />}
    </div>
  );
};
