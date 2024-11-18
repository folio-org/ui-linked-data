import { useContext } from 'react';
import { ServicesContext } from '@src/contexts';

export const useServicesContext = () => {
  return useContext(ServicesContext);
};
