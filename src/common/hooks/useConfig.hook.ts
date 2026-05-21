import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import { QueryParams } from '@/common/constants/routes.constants';
import { getProfileConfig } from '@/common/helpers/profile.helper';
import { getEditingRecordBlocks } from '@/common/helpers/record.helper';
import { getUri } from '@/configs/resourceTypes';

import { useLoadProfile, useLoadProfileSettings } from '@/features/profiles';
import { extractProfileParams, useProcessedRecordAndSchema } from '@/features/resources';

import { useInputsState, useProfileState } from '@/store';

import { useServicesContext } from './useServicesContext';

export type PreviewParams = {
  noStateUpdate?: boolean;
  singular?: boolean;
};

type GeneratedPreviewData = {
  base: Schema;
  userValues: UserValues;
  selectedEntries: string[];
  initKey: string;
};

type IGetProfiles = {
  record?: RecordEntry;
  recordId?: string;
  previewParams?: PreviewParams;
  asClone?: boolean;
  profile?: {
    ids: number[];
    rootEntry?: ProfileNode;
  };
};

type IBuildSchema = {
  profile: Profile;
  settings: ProfileSettingsWithDrift;
  record: Record<string, unknown> | Array<unknown>;
  editingRecordBlocks?: SelectedRecordBlocks;
  asClone?: boolean;
  noStateUpdate?: boolean;
};

export const useConfig = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get(QueryParams.Type);
  const profileIdParam = searchParams.get(QueryParams.ProfileId);
  const { userValuesService, selectedEntriesService, schemaGeneratorService } =
    useServicesContext() as Required<ServicesParams>;
  const { setSelectedProfile, setInitialSchemaKey, setSchema } = useProfileState([
    'setSelectedProfile',
    'setInitialSchemaKey',
    'setSchema',
  ]);
  const { setUserValues, setSelectedRecordBlocks, setSelectedEntries } = useInputsState([
    'setUserValues',
    'setSelectedRecordBlocks',
    'setSelectedEntries',
  ]);
  const { getProcessedRecordAndSchema } = useProcessedRecordAndSchema();
  const isProcessingProfiles = useRef(false);
  const processingPromise = useRef<Promise<void | GeneratedPreviewData> | null>(null);
  const { loadProfile } = useLoadProfile();
  const { loadProfileSettings } = useLoadProfileSettings();

  const buildSchema = async ({
    profile,
    settings,
    record,
    editingRecordBlocks,
    asClone = false,
    noStateUpdate = false,
  }: IBuildSchema) => {
    const initKey = uuidv4();
    const userValues: UserValues = {};

    userValuesService.set(userValues);
    selectedEntriesService.set([]);

    schemaGeneratorService.init(profile, settings);
    schemaGeneratorService.generate(initKey);

    const { updatedSchema, updatedUserValues, selectedRecordBlocks } = await getProcessedRecordAndSchema({
      baseSchema: schemaGeneratorService.get(),
      record,
      editingRecordBlocks,
      userValues,
      asClone,
      noStateUpdate,
    });

    if (!noStateUpdate) {
      setUserValues(updatedUserValues ?? userValues);
      setInitialSchemaKey(initKey);
      setSelectedEntries(selectedEntriesService.get());
      setSchema(updatedSchema);
      setSelectedRecordBlocks(selectedRecordBlocks);
    }

    return {
      updatedSchema,
      initKey,
      updatedUserValues: updatedUserValues ?? userValues,
      selectedEntries: selectedEntriesService.get(),
    };
  };

  const processProfiles = async ({
    record,
    previewParams,
    asClone,
  }: IGetProfiles): Promise<GeneratedPreviewData | void> => {
    try {
      const recordData = record?.resource || {};
      isProcessingProfiles.current = true;
      const editingRecordBlocks =
        recordData && Object.keys(recordData).length ? getEditingRecordBlocks(recordData as RecordEntry) : undefined;

      const { profileId, referenceProfileId, resourceType } = extractProfileParams({
        recordData,
        profileIdParam,
        typeParam,
        editingRecordBlocks,
      });
      const profile = getProfileConfig({
        resourceType,
        profileId,
        referenceProfileId,
      });

      const loadedProfiles = await Promise.all(profile?.ids?.map(profileId => loadProfile(profileId)));
      const selectedProfile = profile?.rootEntry ? [profile.rootEntry, ...loadedProfiles.flat()] : loadedProfiles[0];

      if (selectedProfile) {
        if (!previewParams?.noStateUpdate) {
          setSelectedProfile(selectedProfile);
        }

        const profileSettings = await loadProfileSettings(
          String(profile?.ids?.[0]),
          selectedProfile,
          getUri(resourceType),
        );

        const { updatedSchema, initKey, updatedUserValues, selectedEntries } = await buildSchema({
          profile: selectedProfile,
          settings: profileSettings,
          record: recordData,
          editingRecordBlocks,
          asClone,
          noStateUpdate: previewParams?.noStateUpdate,
        });

        const generatedData = {
          base: updatedSchema,
          userValues: updatedUserValues,
          selectedEntries: selectedEntries,
          initKey,
        };

        return generatedData;
      }
    } finally {
      isProcessingProfiles.current = false;
      processingPromise.current = null;
    }
  };

  const getProfiles = async ({
    record,
    recordId,
    previewParams,
    asClone,
  }: IGetProfiles): Promise<GeneratedPreviewData | void> => {
    // If processing is already running and caller provided a record/recordId,
    // wait for the current processing to finish and return its result.
    if (isProcessingProfiles.current && (record || recordId)) {
      if (processingPromise.current) {
        return await processingPromise.current;
      }

      return;
    }

    // If there's no processingPromise active, start one and store it,
    // so other callers can await the same promise instead of racing.
    processingPromise.current ??= processProfiles({
      record,
      recordId,
      previewParams,
      asClone,
    });

    return processingPromise.current;
  };

  return { getProfiles };
};
