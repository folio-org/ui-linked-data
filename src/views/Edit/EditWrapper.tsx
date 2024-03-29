import { QueryParams } from '@common/constants/routes.constants';
import { Edit } from '@views';
import { useSearchParams } from 'react-router-dom';

export const EditWrapper = () => {
  const [queryParams] = useSearchParams();

  return <Edit key={queryParams.get(QueryParams.Type)} />;
};
