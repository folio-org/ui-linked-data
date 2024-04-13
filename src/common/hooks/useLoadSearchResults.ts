import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { QueryParams } from '@common/constants/routes.constants';
import { SearchIdentifiers } from '@common/constants/search.constants';
import state from '@state';

export const useLoadSearchResults = (
  fetchData: (query: string, searchBy?: SearchIdentifiers, offset?: number) => Promise<void>,
) => {
  const setSearchBy = useSetRecoilState(state.search.index);
  const setQuery = useSetRecoilState(state.search.query);
  const [searchParams] = useSearchParams();
  const querySearchParam = searchParams.get(QueryParams.Query);
  const searchBySearchParam = searchParams.get(QueryParams.SearchBy);

  useEffect(() => {
    if (searchBySearchParam) {
      setSearchBy(searchBySearchParam as SearchIdentifiers);
    }

    if (!querySearchParam) return;

    // Sets query's value for Basic search
    if (searchBySearchParam) {
      setQuery(querySearchParam);
    }

    fetchData(querySearchParam, searchBySearchParam as SearchIdentifiers, 0);
  }, [querySearchParam, searchBySearchParam]);
};
