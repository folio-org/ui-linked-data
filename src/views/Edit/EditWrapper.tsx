import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { Edit } from '@/views';

export const EditWrapper = () => {
  const [queryParams] = useSearchParams();
  const lastTypeRef = useRef<string | null>(null);

  const typeParam = queryParams.get(QueryParams.Type);

  if (typeParam !== null) {
    lastTypeRef.current = typeParam;
  }

  return <Edit key={typeParam ?? lastTypeRef.current} />;
};
