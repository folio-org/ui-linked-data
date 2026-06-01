import { FC, type ReactElement, useMemo, useRef } from 'react';

import { useCommonStatus } from '@/common/hooks/useCommonStatus';
import { useLookupCacheService } from '@/common/hooks/useLookupCache.hook';
import { createSchemaPipeline } from '@/common/services/pipeline';
import { SchemaPipelineContext, ServicesContext, SharedInfraContext } from '@/contexts';

type ServicesProviderProps = {
  children: ReactElement<unknown>;
};

export const ServicesProvider: FC<ServicesProviderProps> = ({ children }) => {
  const lookupCacheService = useLookupCacheService();
  const rawCommonStatus = useCommonStatus();
  const commonStatusRef = useRef(rawCommonStatus);
  commonStatusRef.current = rawCommonStatus;
  const commonStatusService = useMemo<ICommonStatus>(
    () => ({ set: (l10nId, type) => commonStatusRef.current.set(l10nId, type) }),
    [],
  );

  const sharedInfra = useMemo<SharedInfraServices>(
    () => ({ lookupCacheService, commonStatusService }),
    [lookupCacheService, commonStatusService],
  );

  const pipeline = useMemo(() => createSchemaPipeline(sharedInfra), [sharedInfra]);

  const servicesValue = useMemo(
    () => ({ ...pipeline, lookupCacheService, commonStatusService }),
    [pipeline, lookupCacheService, commonStatusService],
  );

  return (
    <SharedInfraContext.Provider value={sharedInfra}>
      <SchemaPipelineContext.Provider value={pipeline}>
        <ServicesContext.Provider value={servicesValue}>{children}</ServicesContext.Provider>
      </SchemaPipelineContext.Provider>
    </SharedInfraContext.Provider>
  );
};
