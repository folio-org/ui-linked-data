import { createContext } from 'react';

const defaultSharedInfra: SharedInfraServices = {
  commonStatusService: undefined as unknown as ICommonStatus,
};

export const SharedInfraContext = createContext<SharedInfraServices>(defaultSharedInfra);
