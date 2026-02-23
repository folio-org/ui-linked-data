import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import { BibframeEntitiesMap } from '@/common/constants/bibframe.constants';
import { QueryParams } from '@/common/constants/routes.constants';
import { getProfileConfig } from '@/common/helpers/profile.helper';
import { getEditingRecordBlocks, getPrimaryEntitiesFromRecord, getRecordTitle } from '@/common/helpers/record.helper';
import { getReferenceIdsRaw } from '@/common/helpers/recordFormatting.helper';
import { mapToResourceType } from '@/configs/resourceTypes';

import { useInputsState, useProfileState } from '@/store';

import { useLoadProfile } from './useLoadProfile';
import { useLoadProfileSettings } from './useLoadProfileSettings';
import { useProcessedRecordAndSchema } from './useProcessedRecordAndSchema.hook';
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
  skipPreviewContentUpdate?: boolean;
  profile?: {
    ids: number[];
    rootEntry?: ProfileNode;
  };
};

type IExtractProfileParams = {
  recordData: RecordData;
  profileIdParam: string | null;
  typeParam: string | null;
  editingRecordBlocks?: SelectedRecordBlocks;
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
  const { setUserValues, setPreviewContent, setSelectedRecordBlocks, setSelectedEntries } = useInputsState([
    'setUserValues',
    'setPreviewContent',
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

    schemaGeneratorService.init(profile as unknown as Profile, settings);
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

    return { updatedSchema, initKey };
  };

  const extractProfileParams = ({
    recordData,
    profileIdParam,
    typeParam,
    editingRecordBlocks,
  }: IExtractProfileParams) => {
    if (recordData && Object.keys(recordData).length) {
      const block = editingRecordBlocks?.block as keyof typeof BibframeEntitiesMap;
      const reference = editingRecordBlocks?.reference?.key;
      const profileId = profileIdParam ?? (recordData[block]?.profileId as string | number | null | undefined);
      const referenceProfileId = (recordData[block]?.[reference as string] as unknown as RecursiveRecordSchema[])?.[0]
        ?.profileId as string;
      const resourceTypeValue = BibframeEntitiesMap[block];
      const mappedResourceType = mapToResourceType(resourceTypeValue);

      return {
        profileId,
        referenceProfileId,
        resourceType: mappedResourceType,
      };
    }

    return {
      profileId: profileIdParam,
      resourceType: mapToResourceType(typeParam),
    };
  };

  const processProfiles = async ({
    record,
    recordId,
    previewParams,
    asClone,
    skipPreviewContentUpdate = false,
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

      const recordTitle = getRecordTitle(recordData as RecordEntry);
      const entities = getPrimaryEntitiesFromRecord(record as RecordEntry);
      const referenceIds = getReferenceIdsRaw(record as RecordEntry);

      if (selectedProfile) {
        if (!previewParams?.noStateUpdate) {
          setSelectedProfile(selectedProfile);
        }

        const profileSettings = await loadProfileSettings(profile?.ids?.[0], selectedProfile);

        const { updatedSchema, initKey } = await buildSchema({
          profile: selectedProfile,
          settings: profileSettings,
          record: recordData,
          editingRecordBlocks,
          asClone,
          noStateUpdate: previewParams?.noStateUpdate,
        });

        const generatedData = {
          base: updatedSchema,
          userValues: userValuesService.getAllValues(),
          selectedEntries: selectedEntriesService.get(),
          initKey,
        };

        // Update previewContent store unless explicitly skipped
        if (previewParams && recordId && !skipPreviewContentUpdate) {
          setPreviewContent(prev => [
            ...(previewParams.singular ? [] : prev.filter(({ id }) => id !== recordId)),
            {
              id: recordId,
              ...generatedData,
              title: recordTitle,
              entities,
              referenceIds,
            },
          ]);
        }

        // Return the generated data for local use (e.g., hub preview)
        if (skipPreviewContentUpdate) {
          return generatedData;
        }
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
    skipPreviewContentUpdate,
  }: IGetProfiles): Promise<GeneratedPreviewData | void> => {
    // If processing is already running and caller provided a record/recordId,
    // wait for the current processing to finish instead of returning immediately.
    if (isProcessingProfiles.current && (record || recordId)) {
      if (processingPromise.current) {
        await processingPromise.current;
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
      skipPreviewContentUpdate,
    });

    return processingPromise.current;
  };

  return { getProfiles };
};
