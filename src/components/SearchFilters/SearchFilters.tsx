import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { FiltersGroupCheckType } from '@common/constants/search.constants';
import { Accordion } from '@components/Accordion';
import { useSearchFilters } from '@common/hooks/useSearchFilters';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { SimpleLookupFilter } from '@components/SimpleLookupField';

export const SearchFilters = () => {
  const { filters, getSearchFacetsData } = useSearchContext();
  const { limiters, onChangeLimiters, onChangeLimitersMulti, onChange } = useSearchFilters();
  const filtersLastGroupIndex = filters.length - 1;

  return (
    <div className="controls">
      {filters.map(({ type, labelId, children, facet, isOpen }, index) => {
        const isSingleGroupCheckType = type === FiltersGroupCheckType.Single;
        const isGroupCheckType = type === FiltersGroupCheckType.Single || type === FiltersGroupCheckType.Multi;

        return (
          <Fragment key={labelId}>
            <Accordion
              title={<FormattedMessage id={labelId} />}
              defaultState={isOpen}
              onToggle={getSearchFacetsData}
              groupId={facet}
            >
              {isGroupCheckType && (
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
              )}

              {type === FiltersGroupCheckType.Lookup && <SimpleLookupFilter facet={facet} onChange={() => {}} />}
            </Accordion>
            {index !== filtersLastGroupIndex && <hr />}
          </Fragment>
        );
      })}
    </div>
  );
};
