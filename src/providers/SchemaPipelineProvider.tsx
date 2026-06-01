import { FC, type ReactElement, useContext, useMemo } from 'react';

import { createSchemaPipeline } from '@/common/services/pipeline';
import { SchemaPipelineContext, SharedInfraContext } from '@/contexts';

type SchemaPipelineProviderProps = {
  children: ReactElement<unknown>;
};

export const SchemaPipelineProvider: FC<SchemaPipelineProviderProps> = ({ children }) => {
  const sharedInfra = useContext(SharedInfraContext);
  const pipeline = useMemo(() => createSchemaPipeline(sharedInfra), [sharedInfra]);

  return <SchemaPipelineContext.Provider value={pipeline}>{children}</SchemaPipelineContext.Provider>;
};
