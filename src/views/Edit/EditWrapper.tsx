import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { Edit } from '@/views';

export const EditWrapper = () => {
  const [queryParams] = useSearchParams();
  const typeParam = queryParams.get(QueryParams.Type);
  const [stableType, setStableType] = useState<string | null>(typeParam);

  if (typeParam !== null && typeParam !== stableType) {
    setStableType(typeParam);
  }

  return <Edit key={stableType} />;
};
