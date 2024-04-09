import { QueryParams } from '@common/constants/routes.constants';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { generateSearchParamsState } from '@common/helpers/search.helper';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useNavigateEditPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const querySearchParam = searchParams.get(QueryParams.Query);
  const searchBySearchParam = searchParams.get(QueryParams.SearchBy);

  return {
    navigateToEditPage: (uri: string) =>
      navigate(uri, {
        state: generateSearchParamsState(querySearchParam, searchBySearchParam as SearchIdentifiers),
      }),
  };
};
