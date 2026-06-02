import { FC, type ReactElement, useCallback, useMemo, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { lookupQueryOptions } from '@/common/helpers/lookupQuery.helper';
import { useCommonStatus } from '@/common/hooks/useCommonStatus';
import { createSchemaPipeline } from '@/common/services/pipeline';
import { SchemaPipelineContext, SharedInfraContext } from '@/contexts';

type ServicesProviderProps = {
  children: ReactElement<unknown>;
};

export const ServicesProvider: FC<ServicesProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const rawCommonStatus = useCommonStatus();
  const commonStatusRef = useRef(rawCommonStatus);
  commonStatusRef.current = rawCommonStatus;
  const commonStatusService = useMemo<ICommonStatus>(
    () => ({ set: (l10nId, type) => commonStatusRef.current.set(l10nId, type) }),
    [],
  );

  const sharedInfra = useMemo<SharedInfraServices>(() => ({ commonStatusService }), [commonStatusService]);

  const loadLookup = useCallback((uri: string) => queryClient.ensureQueryData(lookupQueryOptions(uri)), [queryClient]);

  const pipeline = useMemo(() => createSchemaPipeline(sharedInfra, loadLookup), [sharedInfra, loadLookup]);

  return (
    <SharedInfraContext.Provider value={sharedInfra}>
      <SchemaPipelineContext.Provider value={pipeline}>{children}</SchemaPipelineContext.Provider>
    </SharedInfraContext.Provider>
  );
};
