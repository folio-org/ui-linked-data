import { useContext } from 'react';
import { SearchContext } from '@src/contexts';

export const useSearchContext = () => {
  return useContext(SearchContext);
};
