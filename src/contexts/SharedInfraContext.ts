import { createContext } from 'react';

const defaultSharedInfra: SharedInfraServices = {
  lookupCacheService: undefined as unknown as ILookupCacheService,
  commonStatusService: undefined as unknown as ICommonStatus,
};

export const SharedInfraContext = createContext<SharedInfraServices>(defaultSharedInfra);
