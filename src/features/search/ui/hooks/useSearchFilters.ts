import { ChangeEvent } from 'react';

import { SearchLimiterNames } from '@/common/constants/search.constants';

import { useSearchState } from '@/store';

export const useSearchFilters = () => {
  const { facets, setFacets } = useSearchState(['facets', 'setFacets']);

  const onChangeLimiters = ({ target: { id, name } }: ChangeEvent<HTMLInputElement>) => {
    setFacets(prev => ({
      ...prev,
      [name]: id,
    }));
  };

  const onChangeLimitersMulti = ({ target: { id, name } }: ChangeEvent<HTMLInputElement>) => {
    setFacets(prev => {
      const initialLimiters = (prev[name as SearchLimiterNames] as any[]) || [];

      return {
        ...prev,
        [name]: initialLimiters?.includes(id)
          ? initialLimiters?.filter(limiterId => limiterId !== id)
          : [...initialLimiters, id],
      };
    });
  };

  const onChange = (_e: ChangeEvent<HTMLInputElement>) => {};

  return {
    facets,
    onChangeLimiters,
    onChangeLimitersMulti,
    onChange,
  };
};
