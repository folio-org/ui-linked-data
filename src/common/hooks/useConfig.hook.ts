import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getPrimaryEntitiesFromRecord, getRecordTitle } from '@common/helpers/record.helper';
import { useInputsState, useProfileState } from '@src/store';
import { useProcessedRecordAndSchema } from './useProcessedRecordAndSchema.hook';
import { useServicesContext } from './useServicesContext';
import { getReferenceIdsRaw } from '@common/helpers/recordFormatting.helper';
import { useLoadProfile } from './useLoadProfile';

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
  asClone?: boolean;
  noStateUpdate?: boolean;
};

export const useConfig = () => {
  const { userValuesService, selectedEntriesService, schemaGeneratorService } =
    useServicesContext() as Required<ServicesParams>;
  const { setSelectedProfile, setInitialSchemaKey, setSchema } = useProfileState();
  const { setUserValues, setPreviewContent, setSelectedRecordBlocks, setSelectedEntries } = useInputsState();
  const { getProcessedRecordAndSchema } = useProcessedRecordAndSchema();
  const isProcessingProfiles = useRef(false);
  const { loadProfile } = useLoadProfile();

  const buildSchema = async ({ profile, record, asClone = false, noStateUpdate = false }: IBuildSchema) => {
    const initKey = uuidv4();
    const userValues: UserValues = {};

    userValuesService.set(userValues);
    selectedEntriesService.set([]);

    schemaGeneratorService.init(profile as unknown as Profile);
    schemaGeneratorService.generate(initKey);

    const { updatedSchema, updatedUserValues, selectedRecordBlocks } = await getProcessedRecordAndSchema({
      baseSchema: schemaGeneratorService.get(),
      record,
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

  const getProfiles = async ({
    record,
    recordId,
    previewParams,
    asClone,
    profile = {
      ids: [1],
    },
  }: IGetProfiles): Promise<unknown> => {
    if (isProcessingProfiles.current && (record || recordId)) return;

    try {
      let selectedProfile: Profile;
      isProcessingProfiles.current = true;

      const loadedProfiles = await Promise.all(profile.ids?.map(profileId => loadProfile(profileId)));

      if (profile.rootEntry) {
        selectedProfile = [profile.rootEntry, ...loadedProfiles.flat()];
      } else {
        selectedProfile = loadedProfiles[0];
      }

      const recordData = record?.resource || {};
      const recordTitle = getRecordTitle(recordData as RecordEntry);
      const entities = getPrimaryEntitiesFromRecord(record as RecordEntry);
      const referenceIds = getReferenceIdsRaw(record as RecordEntry);

      if (selectedProfile) {
        !previewParams?.noStateUpdate && setSelectedProfile(selectedProfile);

        const { updatedSchema, initKey } = await buildSchema({
          profile: selectedProfile,
          record: recordData,
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
