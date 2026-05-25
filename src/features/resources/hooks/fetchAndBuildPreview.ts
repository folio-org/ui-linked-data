import { ExternalResourceIdType } from '@/common/constants/api.constants';
import { createSchemaPipeline } from '@/common/services/pipeline';

import { getRecord } from '../api/records.api';
import { buildProcessedResource } from '../helpers/buildProcessedResource';
import type { ProcessedResource } from '../types';

export type FetchAndBuildPreviewParams = {
  resourceId: string;
  signal: AbortSignal;
  sharedInfra: SharedInfraServices;
  loadProfile: (id: string | number) => Promise<Profile>;
  loadProfileSettings: (
    id: string | number | undefined,
    profile: Profile,
    uri?: string,
  ) => Promise<ProfileSettingsWithDrift>;
  idType?: ExternalResourceIdType;
};

export const fetchAndBuildPreview = async ({
  resourceId,
  signal,
  sharedInfra,
  loadProfile,
  loadProfileSettings,
  idType,
}: FetchAndBuildPreviewParams): Promise<ProcessedResource | null> => {
  const rawRecord = await getRecord({ recordId: resourceId, signal, idType });

  if (!rawRecord) return null;

  const pipeline = createSchemaPipeline(sharedInfra);

  return buildProcessedResource({
    pipeline,
    record: rawRecord as RecordEntry,
    loadProfile,
    loadProfileSettings,
  });
};
