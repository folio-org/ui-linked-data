import { ChangeEvent } from 'react';
import { useRecoilState } from 'recoil';
import { FormattedMessage } from 'react-intl';
import { PublishDate, SearchLimiterNames, Format, Suppressed } from '@common/constants/search.constants';
import { Accordion } from '@components/Accordion';
import state from '@state';

export const SearchFilters = () => {
  const [limiters, setLimiters] = useRecoilState(state.search.limiters);

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

  return (
    <div className="controls">
      <Accordion
        title={<FormattedMessage id="marva.publishDate" />}
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
              <FormattedMessage id="marva.allTime" />
            </label>
            <label htmlFor={PublishDate.TwelveMonths}>
              <input
                checked={limiters.publishDate === PublishDate.TwelveMonths}
                name={SearchLimiterNames.PublishDate}
                id={PublishDate.TwelveMonths}
                type="radio"
                onChange={fallbackOnChange}
              />
              <FormattedMessage id="marva.past12Months" />
            </label>
            <label htmlFor={PublishDate.FiveYears}>
              <input
                checked={limiters.publishDate === PublishDate.FiveYears}
                name={SearchLimiterNames.PublishDate}
                id={PublishDate.FiveYears}
                type="radio"
                onChange={fallbackOnChange}
              />
              <FormattedMessage id="marva.past5Yrs" />
            </label>
            <label htmlFor={PublishDate.TenYears}>
              <input
                checked={limiters.publishDate === PublishDate.TenYears}
                name={SearchLimiterNames.PublishDate}
                id={PublishDate.TenYears}
                type="radio"
                onChange={fallbackOnChange}
              />
              <FormattedMessage id="marva.past10Yrs" />
            </label>
          </div>
        }
      />
      <hr />
      <Accordion
        title={<FormattedMessage id="marva.format" />}
        children={
          <div onChange={onChangeLimitersMulti} className="input-group">
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
              <FormattedMessage id="marva.onlineResource" />
            </label>
          </div>
        }
      />
      <hr />
      <Accordion
        title={<FormattedMessage id="marva.suppressed" />}
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
              <FormattedMessage id="marva.suppressed" />
            </label>
            <label htmlFor={Suppressed.NotSuppressed}>
              <input
                checked={limiters.suppressed === Suppressed.NotSuppressed}
                name={SearchLimiterNames.Suppressed}
                id={Suppressed.NotSuppressed}
                type="radio"
                onChange={fallbackOnChange}
              />
              <FormattedMessage id="marva.notSuppressed" />
            </label>
          </div>
        }
      />
    </div>
  );
};
