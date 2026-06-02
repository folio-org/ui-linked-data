import { ExternalResourceIdType } from '@/common/constants/api.constants';
import { createSchemaPipeline } from '@/common/services/pipeline';

import { getRecord } from '../api/records.api';
import { buildProcessedResource } from '../helpers/buildProcessedResource';
import type { ProcessedResource } from '../types';

export type PreviewResult = ProcessedResource & { record: RecordEntry };

export type FetchAndBuildPreviewParams = {
  resourceId: string;
  signal: AbortSignal;
  sharedInfra: SharedInfraServices;
  loadLookup: (uri: string) => Promise<MultiselectOption[]>;
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
  loadLookup,
  loadProfile,
  loadProfileSettings,
  idType,
}: FetchAndBuildPreviewParams): Promise<PreviewResult | null> => {
  const rawRecord = await getRecord({ recordId: resourceId, signal, idType });

  if (!rawRecord) return null;

  const pipeline = createSchemaPipeline(sharedInfra, loadLookup);

  const processed = await buildProcessedResource({
    pipeline,
    record: rawRecord as RecordEntry,
    loadProfile,
    loadProfileSettings,
  });

  if (!processed) return null;

  return { ...processed, record: rawRecord as RecordEntry };
};
