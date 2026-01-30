import { useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { Edit } from '@/views';

export const EditWrapper = () => {
  const [queryParams] = useSearchParams();

  return <Edit key={queryParams.get(QueryParams.Type)} />;
};
