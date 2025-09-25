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
// import { useLoadProfile } from './useLoadProfile';
import { getMappedResourceType, getProfileConfig } from '@common/helpers/profile.helper';
import ProfileJSON from '@src/data/work-books.json';

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

type IExtractProfileParams = {
  recordData: RecordData;
  profileIdParam: string | null;
  typeParam: string | null;
  editingRecordBlocks?: SelectedRecordBlocks;
};

type IBuildSchema = {
  profile: Profile;
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
  // const { loadProfile } = useLoadProfile();

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
      const mappedResourceType = getMappedResourceType(resourceTypeValue);

      return {
        profileId,
        referenceProfileId,
        resourceType: mappedResourceType,
      };
    }

    return {
      profileId: profileIdParam,
      resourceType: getMappedResourceType(typeParam),
    };
  };

  const getProfiles = async ({ record, recordId, previewParams, asClone }: IGetProfiles): Promise<unknown> => {
    if (isProcessingProfiles.current && (record || recordId)) return;

    try {
      const recordData = record?.resource || {};
      isProcessingProfiles.current = true;
      let editingRecordBlocks;

      if (recordData && Object.keys(recordData).length) {
        editingRecordBlocks = getEditingRecordBlocks(recordData as RecordEntry);
      }

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

      // const loadedProfiles = await Promise.all(profile?.ids?.map(profileId => loadProfile(profileId)));
      // const selectedProfile = profile?.rootEntry ? [profile.rootEntry, ...loadedProfiles.flat()] : loadedProfiles[0];
      const selectedProfile = [profile.rootEntry, ...ProfileJSON.value] as Profile;

      const recordTitle = getRecordTitle(recordData as RecordEntry);
      const entities = getPrimaryEntitiesFromRecord(record as RecordEntry);
      const referenceIds = getReferenceIdsRaw(record as RecordEntry);

      if (selectedProfile) {
        if (!previewParams?.noStateUpdate) {
          setSelectedProfile(selectedProfile);
        }

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
