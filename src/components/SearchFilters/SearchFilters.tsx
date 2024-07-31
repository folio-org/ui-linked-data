import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { FiltersGroupCheckType } from '@common/constants/search.constants';
import { Accordion } from '@components/Accordion';
import { useSearchFilters } from '@common/hooks/useSearchFilters';
import { SearchContext } from '@common/contexts';

export const SearchFilters = () => {
  const { filters } = useContext(SearchContext);
  const { limiters, onChangeLimiters, onChangeLimitersMulti, onChange } = useSearchFilters();
  const filtersLastGroupIndex = filters.length - 1;

  return (
    <div className="controls">
      {filters.map((group, index) => {
        const isSingleGroupCheckType = group.type === FiltersGroupCheckType.Single;

        return (
          <>
            <Accordion title={<FormattedMessage id={group.labelId} />}>
              <div onChange={isSingleGroupCheckType ? onChangeLimiters : onChangeLimitersMulti}>
                {group.children?.map(groupElem => (
                  <label htmlFor={groupElem.id}>
                    <input
                      checked={
                        isSingleGroupCheckType
                          ? limiters[groupElem.name] === groupElem.id
                          : limiters[groupElem.name]?.includes(groupElem.id)
                      }
                      name={groupElem.name}
                      id={groupElem.id}
                      type={groupElem.type}
                      onChange={onChange}
                    />
                    <FormattedMessage id={groupElem.labelId} />
                  </label>
                ))}
              </div>
            </Accordion>
            {index !== filtersLastGroupIndex && <hr />}
          </>
        );
      })}
    </div>
  );
};
