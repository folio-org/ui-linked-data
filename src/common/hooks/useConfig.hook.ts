import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { QueryParams } from '@common/constants/routes.constants';
import { BibframeEntitiesMap } from '@common/constants/bibframe.constants';
import { getEditingRecordBlocks, getPrimaryEntitiesFromRecord, getRecordTitle } from '@common/helpers/record.helper';
import { useInputsState, useProfileState } from '@src/store';
import { useProcessedRecordAndSchema } from './useProcessedRecordAndSchema.hook';
import { useServicesContext } from './useServicesContext';
import { getReferenceIdsRaw } from '@common/helpers/recordFormatting.helper';
import { useLoadProfile } from './useLoadProfile';
import { getProfileConfig } from '@common/helpers/profile.helper';

export type PreviewParams = {
  noStateUpdate?: boolean;
  singular?: boolean;
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
  record: Record<string, unknown> | Array<unknown>;
  editingRecordBlocks?: {
    block: string | undefined;
    reference: RecordReference | undefined;
  };
  asClone?: boolean;
  noStateUpdate?: boolean;
};

export const useConfig = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get(QueryParams.Type);
  const profileIdParam = searchParams.get(QueryParams.ProfileId);
  const { userValuesService, selectedEntriesService, schemaGeneratorService } =
    useServicesContext() as Required<ServicesParams>;
  const { setSelectedProfile, setInitialSchemaKey, setSchema } = useProfileState();
  const { setUserValues, setPreviewContent, setSelectedRecordBlocks, setSelectedEntries } = useInputsState();
  const { getProcessedRecordAndSchema } = useProcessedRecordAndSchema();
  const isProcessingProfiles = useRef(false);
  const { loadProfile } = useLoadProfile();

  const buildSchema = async ({
    profile,
    record,
    editingRecordBlocks,
    asClone = false,
    noStateUpdate = false,
  }: IBuildSchema) => {
    const initKey = uuidv4();
    const userValues: UserValues = {};

    userValuesService.set(userValues);
    selectedEntriesService.set([]);

    schemaGeneratorService.init(profile as unknown as Profile);
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

  const getProfiles = async ({ record, recordId, previewParams, asClone }: IGetProfiles): Promise<unknown> => {
    if (isProcessingProfiles.current && (record || recordId)) return;

    try {
      const recordData = record?.resource || {};
      let selectedProfile: Profile;
      isProcessingProfiles.current = true;

      let editingRecordBlocks;
      let profileId = profileIdParam;
      let resourceType = typeParam;

      if (recordData && Object.keys(recordData).length) {
        const typedRecord = recordData as RecordEntry;
        editingRecordBlocks = getEditingRecordBlocks(typedRecord);

        profileId = recordData[editingRecordBlocks.block as string]?.profileId as string;
        resourceType = BibframeEntitiesMap[editingRecordBlocks.block as keyof typeof BibframeEntitiesMap];
      }

      const profile = getProfileConfig({
        profileName: 'Monograph',
        resourceType,
        profileId: Number(profileId),
      });

      const loadedProfiles = await Promise.all(profile?.ids?.map(profileId => loadProfile(profileId)));

      if (profile?.rootEntry) {
        selectedProfile = [profile.rootEntry, ...loadedProfiles.flat()];
      } else {
        selectedProfile = loadedProfiles[0];
      }

      const recordTitle = getRecordTitle(recordData as RecordEntry);
      const entities = getPrimaryEntitiesFromRecord(record as RecordEntry);
      const referenceIds = getReferenceIdsRaw(record as RecordEntry);

      if (selectedProfile) {
        !previewParams?.noStateUpdate && setSelectedProfile(selectedProfile);

        const { updatedSchema, initKey } = await buildSchema({
          profile: selectedProfile,
          record: recordData,
          editingRecordBlocks,
          asClone,
          noStateUpdate: previewParams?.noStateUpdate,
        });

        if (previewParams && recordId) {
          setPreviewContent(prev => [
            ...(previewParams.singular ? [] : prev.filter(({ id }) => id !== recordId)),
            {
              id: recordId,
              base: updatedSchema,
              userValues: userValuesService.getAllValues(),
              selectedEntries: selectedEntriesService.get(),
              initKey,
              title: recordTitle,
              entities,
              referenceIds,
            },
          ]);
        }
      }
    } finally {
      isProcessingProfiles.current = false;
    }
  };

  return { getProfiles };
};
