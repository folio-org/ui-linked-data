import { useContext } from 'react';

import { SchemaPipelineContext } from '@/contexts';

export const useSchemaPipeline = (): SchemaPipelineServices => {
  const context = useContext(SchemaPipelineContext);

  if (!context) throw new Error('useSchemaPipeline must be used inside SchemaPipelineProvider or ServicesProvider');

  return context;
};
