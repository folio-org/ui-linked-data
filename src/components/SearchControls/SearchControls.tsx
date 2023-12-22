import { ChangeEvent, FC, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  DEFAULT_SEARCH_BY,
  Format,
  PublishDate,
  SearchIdentifiers,
  SearchLimiterNames,
  Suppressed,
} from '@common/constants/search.constants';
import { Accordion } from '@components/Accordion';
import CaretDown from '@src/assets/caret-down.svg?react';
import XInCircle from '@src/assets/x-in-circle.svg?react';
import { Button, ButtonType } from '@components/Button';
import './SearchControls.scss';
import state from '@state';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { Input } from '@components/Input';

type Props = {
  submitSearch: VoidFunction;
  clearPagination: VoidFunction;
};

export const SearchControls: FC<Props> = ({ submitSearch, clearPagination }) => {
  const [searchBy, setSearchBy] = useRecoilState(state.search.index);
  const [query, setQuery] = useRecoilState(state.search.query);
  const [limiters, setLimiters] = useRecoilState(state.search.limiters);
  const setMessage = useSetRecoilState(state.search.message);
  const setData = useSetRecoilState(state.search.data);
  const resetControls = useResetRecoilState(state.search.limiters);

  const onChangeSearchInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (!searchBy) {
      setMessage('marva.search-select-index');
      return;
    }

    setMessage('');
    setQuery(value);
  };

  const clearValues = () => {
    clearPagination();
    setData(null);
    setSearchBy(DEFAULT_SEARCH_BY);
    setQuery('');
    setMessage('');
    resetControls();
  };

  const onChangeLimiters = ({ target: { id, name } }: ChangeEvent<HTMLInputElement>) => {
    setLimiters(prev => ({
      ...prev,
      [name]: id,
    }));
  };

  const onChangeLimitersMulti = ({ target: { id, name } }: ChangeEvent<HTMLInputElement>) => {
    setLimiters(prev => {
      const init = prev[name as SearchLimiterNames] as any[];

      return {
        ...prev,
        [name]: init.includes(id) ? init.filter(i => i !== id) : [...init, id],
      };
    });
  };

  const fallbackOnChange = (_e: ChangeEvent<HTMLInputElement>) => {};

  useEffect(() => clearValues, []);

  return (
    <div className="search-pane">
      <div className="header">
        <strong>
          <FormattedMessage id="marva.search-and-filter" />
        </strong>
        <CaretDown className="header-caret" />
      </div>
      <div className="inputs">
        <select
          className="select-input"
          value={searchBy}
          onChange={({ target: { value } }) => setSearchBy(value as SearchIdentifiers)}
        >
          {Object.values(SearchIdentifiers).map(id => (
            <option key={id} value={id} data-testid={id}>
              <FormattedMessage id={`marva.${id}`} />
            </option>
          ))}
        </select>
        <Input
          type="text"
          value={query}
          onChange={onChangeSearchInput}
          className="text-input"
          onPressEnter={submitSearch}
          testid="id-search-input"
        />
      </div>
      <Button
        data-testid="id-search-button"
        type={ButtonType.Primary}
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
          onClick={clearValues}
          prefix={<XInCircle />}
          disabled={!query}
        >
          <FormattedMessage id="marva.reset" />
        </Button>
        <Button type={ButtonType.Link} className="search-button">
          <FormattedMessage id="marva.advanced" />
        </Button>
      </div>
      <div className="controls">
        <Accordion
          title={<FormattedMessage id="marva.publish-date" />}
          children={
            <div onChange={onChangeLimiters}>
              <label htmlFor={PublishDate.AllTime}>
                <input
                  checked={limiters.publishDate === PublishDate.AllTime}
                  name={SearchLimiterNames.PublishDate}
                  id={PublishDate.AllTime}
                  type="radio"
                  onChange={fallbackOnChange}
                />
                <FormattedMessage id="marva.all-time" />
              </label>
              <label htmlFor={PublishDate.TwelveMonths}>
                <input
                  checked={limiters.publishDate === PublishDate.TwelveMonths}
                  name={SearchLimiterNames.PublishDate}
                  id={PublishDate.TwelveMonths}
                  type="radio"
                  onChange={fallbackOnChange}
                />
                <FormattedMessage id="marva.past-12-months" />
              </label>
              <label htmlFor={PublishDate.FiveYears}>
                <input
                  checked={limiters.publishDate === PublishDate.FiveYears}
                  name={SearchLimiterNames.PublishDate}
                  id={PublishDate.FiveYears}
                  type="radio"
                  onChange={fallbackOnChange}
                />
                <FormattedMessage id="marva.past-5-yrs" />
              </label>
              <label htmlFor={PublishDate.TenYears}>
                <input
                  checked={limiters.publishDate === PublishDate.TenYears}
                  name={SearchLimiterNames.PublishDate}
                  id={PublishDate.TenYears}
                  type="radio"
                  onChange={fallbackOnChange}
                />
                <FormattedMessage id="marva.past-10-yrs" />
              </label>
            </div>
          }
        />
        <hr />
        <Accordion
          title={<FormattedMessage id="marva.format" />}
          children={
            <div onChange={onChangeLimitersMulti}>
              <label htmlFor={Format.Volume}>
                <input
                  checked={limiters.format?.includes(Format.Volume)}
                  name={SearchLimiterNames.Format}
                  id={Format.Volume}
                  type="checkbox"
                  onChange={fallbackOnChange}
                />
                <FormattedMessage id="marva.volume" />
              </label>
              <label htmlFor={Format.Ebook}>
                <input
                  checked={limiters.format?.includes(Format.Ebook)}
                  name={SearchLimiterNames.Format}
                  id={Format.Ebook}
                  type="checkbox"
                  onChange={fallbackOnChange}
                />
                <FormattedMessage id="marva.online-resource" />
              </label>
            </div>
          }
        />
        <hr />
        <Accordion
          title={<FormattedMessage id="marva.supressed" />}
          children={
            <div onChange={onChangeLimiters}>
              <label htmlFor={Suppressed.All}>
                <input
                  checked={limiters.suppressed === Suppressed.All}
                  name={SearchLimiterNames.Suppressed}
                  id={Suppressed.All}
                  type="radio"
                  onChange={fallbackOnChange}
                />
                <FormattedMessage id="marva.all" />
              </label>
              <label htmlFor={Suppressed.Suppressed}>
                <input
                  checked={limiters.suppressed === Suppressed.Suppressed}
                  name={SearchLimiterNames.Suppressed}
                  id={Suppressed.Suppressed}
                  type="radio"
                  onChange={fallbackOnChange}
                />
                <FormattedMessage id="marva.supressed" />
              </label>
              <label htmlFor={Suppressed.NotSuppressed}>
                <input
                  checked={limiters.suppressed === Suppressed.NotSuppressed}
                  name={SearchLimiterNames.Suppressed}
                  id={Suppressed.NotSuppressed}
                  type="radio"
                  onChange={fallbackOnChange}
                />
                <FormattedMessage id="marva.not-supressed" />
              </label>
            </div>
          }
        />
      </div>
    </div>
  );
};
