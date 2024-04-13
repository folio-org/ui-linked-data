import { SearchQueryParams } from '@common/constants/routes.constants';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { generateSearchParamsState } from '@common/helpers/search.helper';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useNavigateToEditPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const querySearchParam = searchParams.get(SearchQueryParams.Query);
  const searchBySearchParam = searchParams.get(SearchQueryParams.SearchBy);

  return {
    navigateToEditPage: (uri: string) =>
      navigate(uri, {
        state: generateSearchParamsState(querySearchParam, searchBySearchParam as SearchIdentifiers),
      }),
  };
};
