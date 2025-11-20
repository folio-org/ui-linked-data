import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { FiltersGroupCheckType } from '@/common/constants/search.constants';
import { useSearchFilters } from '../../hooks';
import { SimpleLookupFilter } from '@/components/SimpleLookupField';
import { Accordion } from '@/components/Accordion';
import { DateRange } from '@/components/DateRange';
import { useSearchContext } from '../../providers';

export const SearchFilters = () => {
  const { filters, getSearchFacetsData } = useSearchContext();
  const { facets, onChangeLimiters, onChangeLimitersMulti, onChange } = useSearchFilters();
  const filtersLastGroupIndex = filters.length - 1;

  return (
    <div className="controls">
      {filters.map(
        (
          { id, type, labelId, children, facet, isOpen, hasExternalDataSource, hasMappedSourceData, excludedOptions },
          index,
        ) => {
          const isSingleGroupCheckType = type === FiltersGroupCheckType.Single;
          const isGroupCheckType = type === FiltersGroupCheckType.Single || type === FiltersGroupCheckType.Multi;

          return (
            <Fragment key={labelId}>
              <Accordion
                id={id}
                title={<FormattedMessage id={labelId} />}
                defaultState={isOpen}
                onToggle={hasExternalDataSource ? getSearchFacetsData : undefined}
                groupId={facet ?? labelId}
              >
                {isGroupCheckType && (
                  <div onChange={isSingleGroupCheckType ? onChangeLimiters : onChangeLimitersMulti}>
                    {children?.map(({ id, name, type, labelId }) => (
                      <label htmlFor={id} key={id}>
                        <input
                          checked={isSingleGroupCheckType ? facets[name] === id : facets[name]?.includes(id)}
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

                {/* TODO: handle value change */}
                {type === FiltersGroupCheckType.Lookup && (
                  <SimpleLookupFilter
                    facet={facet}
                    onChange={() => {}}
                    hasMappedSourceData={hasMappedSourceData}
                    excludedOptions={excludedOptions}
                  />
                )}
                {type === FiltersGroupCheckType.DateRange && <DateRange facet={facet} onSubmit={() => {}} />}
              </Accordion>
              {index !== filtersLastGroupIndex && <hr />}
            </Fragment>
          );
        },
      )}
    </div>
  );
};
