import { ChangeEvent, FC, FormEventHandler, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { DEFAULT_FACET_BY_SEGMENT, SearchIdentifiers } from '@common/constants/search.constants';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { Button, ButtonType } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { SearchFilters } from '@components/SearchFilters';
import { Textarea } from '@components/Textarea';
import SearchSegments from './SearchSegments';
import state from '@state';
import CaretDown from '@src/assets/caret-down.svg?react';
import XInCircle from '@src/assets/x-in-circle.svg?react';
import './SearchControls.scss';

type Props = {
  submitSearch: VoidFunction;
  clearValues: VoidFunction;
};

export const SearchControls: FC<Props> = ({ submitSearch, clearValues }) => {
  const {
    isVisibleSearchByControl,
    isVisibleAdvancedSearch,
    isVisibleFilters,
    isVisibleSegments,
    hasMiltilineSearchInput,
    searchByControlOptions,
    hasSearchParams,
    defaultSearchBy,
    navigationSegment,
    getSearchSourceData,
  } = useSearchContext();
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const setMessage = useSetRecoilState(state.search.message);
  const setNavigationState = useSetRecoilState(state.search.navigationState);
  const resetControls = useResetRecoilState(state.search.limiters);
  const setFacets = useSetRecoilState(state.search.limiters);
  const setIsAdvancedSearchOpen = useSetRecoilState(state.ui.isAdvancedSearchOpen);
  const [facetsBySegments, setFacetsBySegments] = useRecoilState(state.search.facetsBySegments);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get(SearchQueryParams.Query);
  const isDisabledResetButton = !query && !searchQueryParam;
  const selectOptions =
    searchByControlOptions && navigationSegment?.value
      ? (searchByControlOptions as ComplexLookupSearchBy)[navigationSegment.value]
      : Object.values(SearchIdentifiers);

  const onChangeSearchInput = ({ target: { value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage('');
    setQuery(value);
  };

  const clearValuesAndResetControls = () => {
    clearValues();
    resetControls();
    setSearchBy(defaultSearchBy);
    setFacetsBySegments(DEFAULT_FACET_BY_SEGMENT);
  };

  const onResetButtonClick = () => {
    clearValuesAndResetControls();
    hasSearchParams && setSearchParams({});
    hasSearchParams && setNavigationState({});
  };

  const onChangeSegment = (value: SearchSegmentValue) => {
    const savedFacetsData = facetsBySegments[value];
    let updatedSearchBy;

    if (savedFacetsData.searchBy) {
      updatedSearchBy = savedFacetsData.searchBy;
    } else {
      const typedSearchByControlOptions = searchByControlOptions as ComplexLookupSearchBy;

      if (typedSearchByControlOptions[value]?.[0]) {
        updatedSearchBy = typedSearchByControlOptions[value][0].value;
      }
    }

    setSearchBy(updatedSearchBy as SearchIdentifiers);
    setQuery(savedFacetsData.query || '');
    setFacets(savedFacetsData.facets || {});
    getSearchSourceData?.();
  };

  useEffect(() => clearValuesAndResetControls, []);

  return (
    <div className="search-pane">
      <div className="search-pane-header">
        <strong className="search-pane-header-title">
          <FormattedMessage id="marva.search" />
        </strong>
        <CaretDown className="header-caret" />
      </div>
      <div className="search-pane-content">
        {isVisibleSegments && <SearchSegments onChangeSegment={onChangeSegment} />}

        <div className="inputs">
          {isVisibleSearchByControl && (
            <Select
              withIntl
              id="id-search-select"
              className="select-input"
              value={searchBy}
              options={selectOptions}
              onChange={({ value }) => setSearchBy(value as SearchIdentifiers)}
            />
          )}
          {hasMiltilineSearchInput ? (
            <Textarea
              id="id-search-textarea"
              className="select-textarea"
              value={query}
              onChange={onChangeSearchInput as FormEventHandler<HTMLTextAreaElement>}
              data-testid="id-search-textarea"
              fullWidth
            />
          ) : (
            <Input
              id="id-search-input"
              type="text"
              value={query}
              onChange={onChangeSearchInput}
              className="text-input"
              onPressEnter={submitSearch}
              data-testid="id-search-input"
            />
          )}
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

        {isVisibleFilters && <SearchFilters />}
      </div>
    </div>
  );
};
