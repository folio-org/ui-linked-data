import { ChangeEvent, FC, FormEventHandler, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { DEFAULT_FACET_BY_SEGMENT, SearchIdentifiers } from '@common/constants/search.constants';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { Button, ButtonType } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { SearchFilters } from '@components/SearchFilters';
import { Textarea } from '@components/Textarea';
import { Announcement } from '@components/Announcement';
import { useInputsState, useSearchState, useUIState } from '@src/store';
import SearchSegments from './SearchSegments';
import CaretDown from '@src/assets/caret-down.svg?react';
import XInCircle from '@src/assets/x-in-circle.svg?react';
import './SearchControls.scss';

type Props = {
  submitSearch: VoidFunction;
  clearValues: VoidFunction;
  changeSegment: (value: SearchSegmentValue) => void;
};

export const SearchControls: FC<Props> = ({ submitSearch, changeSegment, clearValues }) => {
  const { formatMessage } = useIntl();
  const {
    isVisibleSearchByControl,
    isVisibleAdvancedSearch,
    isVisibleFilters,
    isVisibleSegments,
    hasMultilineSearchInput,
    searchByControlOptions,
    hasSearchParams,
    defaultSearchBy,
    navigationSegment,
  } = useSearchContext();

  const {
    searchBy,
    setSearchBy,
    query,
    setQuery,
    setMessage,
    setNavigationState,
    resetFacets: resetControls,
    setFacetsBySegments,
  } = useSearchState();
  const { isSearchPaneCollapsed, setIsSearchPaneCollapsed, setIsAdvancedSearchOpen } = useUIState();
  const { resetPreviewContent } = useInputsState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [announcementMessage, setAnnouncementMessage] = useState('');
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
  };

  const onResetButtonClick = () => {
    clearValuesAndResetControls();
    resetPreviewContent();
    hasSearchParams && setSearchParams({});
    hasSearchParams && setNavigationState({});
    setAnnouncementMessage(formatMessage({ id: 'ld.aria.filters.reset.announce' }));
  };

  useEffect(() => {
    clearValuesAndResetControls();
    setFacetsBySegments(DEFAULT_FACET_BY_SEGMENT);
  }, []);

  useEffect(() => () => setIsSearchPaneCollapsed(false), []);

  return (
    !isSearchPaneCollapsed && (
      <div className="search-pane" role="region" aria-labelledby="search-pane-header-title">
        <div className="search-pane-header">
          <h2 id="search-pane-header-title" className="search-pane-header-title">
            <FormattedMessage id={isVisibleFilters ? 'ld.searchAndFilter' : 'ld.search'} />
          </h2>
          <Button
            className='close-ctl'
            onClick={() => setIsSearchPaneCollapsed(true)}
            ariaLabel={formatMessage({ id: 'ld.aria.searchPane.close' })}
          >
            <CaretDown />
          </Button>
        </div>
        <div className="search-pane-content">
          {isVisibleSegments && <SearchSegments onChangeSegment={changeSegment} />}
          <div className="inputs">
            {isVisibleSearchByControl && (
              <Select
                withIntl
                id="id-search-select"
                data-testid="id-search-select"
                className="select-input"
                value={searchBy}
                options={selectOptions}
                onChange={({ value }) => setSearchBy(value as SearchIdentifiers)}
                ariaLabel={formatMessage({ id: 'ld.aria.filters.select' })}
              />
            )}
            {hasMultilineSearchInput ? (
              <Textarea
                id="id-search-textarea"
                className="select-textarea"
                value={query}
                onChange={onChangeSearchInput as FormEventHandler<HTMLTextAreaElement>}
                data-testid="id-search-textarea"
                fullWidth
                ariaLabel={formatMessage({ id: 'ld.aria.filters.textbox' })}
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
                ariaLabel={formatMessage({ id: 'ld.aria.filters.textbox' })}
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
            <FormattedMessage id="ld.search" />
          </Button>
          <div className={classNames(['meta-controls', !isVisibleAdvancedSearch && 'meta-controls-centered'])}>
            <Button
              type={ButtonType.Text}
              className="search-button"
              onClick={onResetButtonClick}
              prefix={<XInCircle />}
              disabled={isDisabledResetButton}
              data-testid="id-search-reset-button"
              ariaLabel={formatMessage({ id: 'ld.aria.filters.reset' })}
            >
              <FormattedMessage id="ld.reset" />
            </Button>
            <Announcement message={announcementMessage} onClear={() => setAnnouncementMessage('')} />
            {isVisibleAdvancedSearch && (
              <Button
                type={ButtonType.Link}
                className="search-button"
                onClick={() => setIsAdvancedSearchOpen(isOpen => !isOpen)}
              >
                <FormattedMessage id="ld.advanced" />
              </Button>
            )}
          </div>

          {isVisibleFilters && <SearchFilters />}
        </div>
      </div>
    )
  );
};
