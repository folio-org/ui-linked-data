import state from '@state';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { QueryParams } from '@common/constants/routes.constants';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { useSearchParams } from 'react-router-dom';

export const useLoadSearchResults = (
  fetchData: (query: string, searchBy?: SearchIdentifiers, offset?: number) => Promise<void>,
) => {
  const [searchParams] = useSearchParams();
  const setSearchBy = useSetRecoilState(state.search.index);
  const setQuery = useSetRecoilState(state.search.query);

  useEffect(() => {
    const querySearchParam = searchParams.get(QueryParams.Query);
    const searchBySearchParam = searchParams.get(QueryParams.SearchBy);

    if (searchBySearchParam) {
      setSearchBy(searchBySearchParam as SearchIdentifiers);
    }

    if (!querySearchParam) return;

    // Sets query's value for Basic search
    if (searchBySearchParam) {
      setQuery(querySearchParam);
    }

    fetchData(querySearchParam, searchBySearchParam as SearchIdentifiers, 0);
  }, [searchParams]);
};
