import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { generateSearchParamsState } from '@common/helpers/search.helper';
import state from '@state';

export const useSearchNavigationState = () => {
  const [searchParams] = useSearchParams();
  const querySearchParam = searchParams.get(SearchQueryParams.Query);
  const searchBySearchParam = searchParams.get(SearchQueryParams.SearchBy);

  const setNavigationState = useSetRecoilState(state.search.navigationState);

  useEffect(() => {
    const generatedState = generateSearchParamsState(querySearchParam, searchBySearchParam as SearchIdentifiers);

    setNavigationState(generatedState);
  }, [searchParams]);
};
