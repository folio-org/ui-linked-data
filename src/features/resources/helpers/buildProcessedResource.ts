import { v4 as uuidv4 } from 'uuid';

import { PROFILE_SETTINGS_DEFAULT_OPTION } from '@/common/constants/profileSettings.constants';
import { getProfileConfig } from '@/common/helpers/profile.helper';
import {
  getAdjustedRecordContents,
  getEditingRecordBlocks,
  getPrimaryEntitiesFromRecord,
  getRecordTitle,
} from '@/common/helpers/record.helper';
import { getReferenceIdsRaw } from '@/common/helpers/recordFormatting.helper';
import { getUri } from '@/configs/resourceTypes';

import type { ProcessedResource } from '../types';
import { extractProfileParams } from './resourceParams';

type BuildProcessedResourceParams = {
  pipeline: SchemaPipelineServices;
  record?: RecordEntry;
  profileIdParam?: string | null;
  profileSettingsIdParam?: string | null;
  typeParam?: string | null;
  asClone?: boolean;
  templateMetadata?: ResourceTemplateMetadata[];
  loadProfile: (id: string | number) => Promise<Profile>;
  loadProfileSettings: (
    id: string | number,
    profileId: string | number | undefined,
    profile: Profile,
    uri?: string,
  ) => Promise<ProfileSettingsWithDrift>;
};

export const buildProcessedResource = async ({
  pipeline,
  record,
  profileIdParam = null,
  profileSettingsIdParam = null,
  typeParam = null,
  asClone = false,
  templateMetadata,
  loadProfile,
  loadProfileSettings,
}: BuildProcessedResourceParams): Promise<ProcessedResource | null> => {
  const recordData = record?.resource ?? {};

  const editingRecordBlocks =
    recordData && Object.keys(recordData).length ? getEditingRecordBlocks(recordData as RecordEntry) : undefined;

  const { profileId, referenceProfileId, resourceType } = extractProfileParams({
    recordData,
    profileIdParam,
    typeParam,
    editingRecordBlocks,
  });

  const profileConfig = getProfileConfig({ resourceType, profileId, referenceProfileId });

  const loadedProfiles = await Promise.all(profileConfig.ids.map(id => loadProfile(id)));
  const selectedProfile = profileConfig.rootEntry
    ? ([profileConfig.rootEntry, ...loadedProfiles.flat()] as Profile)
    : loadedProfiles[0];

  if (!selectedProfile) return null;

  const profileSettings = await loadProfileSettings(
    profileSettingsIdParam ?? PROFILE_SETTINGS_DEFAULT_OPTION,
    String(profileConfig.ids?.[0]),
    selectedProfile,
    getUri(resourceType),
  );

  const initKey = uuidv4();
  const userValues: UserValues = {};

  pipeline.userValuesService.set(userValues);
  pipeline.selectedEntriesService.set([]);
  pipeline.schemaGeneratorService.init(selectedProfile, profileSettings);
  pipeline.schemaGeneratorService.generate(initKey);

  let updatedSchema = pipeline.schemaGeneratorService.get();
  let updatedUserValues = userValues;
  let selectedRecordBlocks: SelectedRecordBlocks | undefined;

  if (recordData && Object.keys(recordData).length) {
    const { block, reference } = editingRecordBlocks ?? {};
    const { record: adjustedRecord } = getAdjustedRecordContents({
      record: recordData as RecordEntry,
      block,
      reference,
      asClone,
    });

    const recordBlocks = [block, reference?.uri] as RecordBlocksList;

    selectedRecordBlocks = { block, reference };
    pipeline.schemaWithDuplicatesService.set(updatedSchema);
    pipeline.recordNormalizingService.init(adjustedRecord, block, reference);

    const normalizedRecord = pipeline.recordNormalizingService.get();

    await pipeline.recordToSchemaMappingService.init({
      schema: updatedSchema,
      record: normalizedRecord,
      recordBlocks,
      templateMetadata,
    });

    updatedSchema = pipeline.recordToSchemaMappingService.get();
    updatedUserValues = pipeline.userValuesService.getAllValues();
  }

  return {
    schema: updatedSchema,
    userValues: updatedUserValues,
    initKey,
    selectedEntries: pipeline.selectedEntriesService.get(),
    selectedRecordBlocks,
    selectedProfile,
    title: getRecordTitle(recordData as RecordEntry),
    entities: record ? getPrimaryEntitiesFromRecord(record) : undefined,
    referenceIds: record ? getReferenceIdsRaw(record) : undefined,
  };
};
