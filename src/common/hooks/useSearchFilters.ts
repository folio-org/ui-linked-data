import { ChangeEvent } from 'react';
import { useRecoilState } from 'recoil';
import { SearchLimiterNames } from '@common/constants/search.constants';
import state from '@state';

export const useSearchFilters = () => {
  const [limiters, setLimiters] = useRecoilState(state.search.limiters);

  const onChangeLimiters = ({ target: { id, name } }: ChangeEvent<HTMLInputElement>) => {
    setLimiters(prev => ({
      ...prev,
      [name]: id,
    }));
  };

  const onChangeLimitersMulti = ({ target: { id, name } }: ChangeEvent<HTMLInputElement>) => {
    setLimiters(prev => {
      const initialLimiters = prev[name as SearchLimiterNames] as any[];

      return {
        ...prev,
        [name]: initialLimiters.includes(id)
          ? initialLimiters.filter(limiterId => limiterId !== id)
          : [...initialLimiters, id],
      };
    });
  };

  const onChange = (_e: ChangeEvent<HTMLInputElement>) => {};

  return {
    limiters,
    onChangeLimiters,
    onChangeLimitersMulti,
    onChange,
  };
};
