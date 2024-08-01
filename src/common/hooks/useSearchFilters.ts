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
      const init = prev[name as SearchLimiterNames] as any[];

      return {
        ...prev,
        [name]: init.includes(id) ? init.filter(i => i !== id) : [...init, id],
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
