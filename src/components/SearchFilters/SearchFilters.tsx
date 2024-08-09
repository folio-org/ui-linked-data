import { Fragment, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { FiltersGroupCheckType } from '@common/constants/search.constants';
import { Accordion } from '@components/Accordion';
import { useSearchFilters } from '@common/hooks/useSearchFilters';
import { SearchContext } from '@src/contexts';

export const SearchFilters = () => {
  const { filters } = useContext(SearchContext);
  const { limiters, onChangeLimiters, onChangeLimitersMulti, onChange } = useSearchFilters();
  const filtersLastGroupIndex = filters.length - 1;

  return (
    <div className="controls">
      {filters.map(({ type, labelId, children }, index) => {
        const isSingleGroupCheckType = type === FiltersGroupCheckType.Single;

        return (
          <Fragment key={labelId}>
            <Accordion title={<FormattedMessage id={labelId} />}>
              <div onChange={isSingleGroupCheckType ? onChangeLimiters : onChangeLimitersMulti}>
                {children?.map(({ id, name, type, labelId }) => (
                  <label htmlFor={id} key={id}>
                    <input
                      checked={isSingleGroupCheckType ? limiters[name] === id : limiters[name]?.includes(id)}
                      name={name}
                      id={id}
                      type={type}
                      onChange={onChange}
                    />
                    <FormattedMessage id={labelId} />
                  </label>
                ))}
              </div>
            </Accordion>
            {index !== filtersLastGroupIndex && <hr />}
          </Fragment>
        );
      })}
    </div>
  );
};
