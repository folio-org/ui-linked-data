import { useContext } from 'react';

import { ServicesContext } from '@/contexts';

export const useServicesContext = () => {
  return useContext(ServicesContext);
};
