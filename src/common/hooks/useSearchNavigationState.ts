import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { generateSearchParamsState } from '@common/helpers/search.helper';
import { useSearchState } from '@src/store';

export const useSearchNavigationState = () => {
  const [searchParams] = useSearchParams();
  const querySearchParam = searchParams.get(SearchQueryParams.Query);
  const searchBySearchParam = searchParams.get(SearchQueryParams.SearchBy);
  const offsetSearchParam = searchParams.get(SearchQueryParams.Offset);

  const { setNavigationState } = useSearchState();

  useEffect(() => {
    const generatedState = generateSearchParamsState(
      querySearchParam,
      searchBySearchParam as SearchIdentifiers,
      offsetSearchParam as unknown as number,
    );

    setNavigationState(generatedState);
  }, [searchParams]);
};
