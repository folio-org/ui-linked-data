import { useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import state from '@state';
import { fetchProfiles } from '@common/api/profiles.api';
import { PROFILE_NAMES } from '@common/constants/bibframe.constants';
import { getPrimaryEntitiesFromRecord, getRecordTitle } from '@common/helpers/record.helper';
import { useProfileState } from '@src/store';
import { useProcessedRecordAndSchema } from './useProcessedRecordAndSchema.hook';
import { useServicesContext } from './useServicesContext';

export type PreviewParams = {
  singular?: boolean;
};

type GetProfiles = {
  record?: RecordEntry;
  recordId?: string;
  previewParams?: PreviewParams;
  asClone?: boolean;
};

export const useConfig = () => {
  const { schemaCreatorService, userValuesService, selectedEntriesService } =
    useServicesContext() as Required<ServicesParams>;
  const {
    profiles,
    setProfiles,
    setSelectedProfile,
    preparedFields,
    setPreparedFields,
    setInitialSchemaKey,
    setSchema,
  } = useProfileState();
  const setUserValues = useSetRecoilState(state.inputs.userValues);
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);
  const setPreviewContent = useSetRecoilState(state.inputs.previewContent);
  const setSelectedRecordBlocks = useSetRecoilState(state.inputs.selectedRecordBlocks);
  const { getProcessedRecordAndSchema } = useProcessedRecordAndSchema();
  const isProcessingProfiles = useRef(false);

  const prepareFields = (profiles: ProfileEntry[]): ResourceTemplates => {
    const preparedFields = profiles.reduce<ResourceTemplates>((fields, profile) => {
      const resourceTemplate = profile.json.Profile.resourceTemplates.reduce<ResourceTemplates>(
        (resourceObject, resourceTemplate) => {
          resourceObject[resourceTemplate.id] = resourceTemplate;

          return resourceObject;
        },
        {},
      );

      return {
        ...fields,
        ...resourceTemplate,
      };
    }, {});

    setPreparedFields(preparedFields);

    return preparedFields;
  };

  const buildSchema = async (
    profile: ProfileEntry,
    templates: ResourceTemplates,
    record: Record<string, unknown> | Array<unknown>,
    asClone = false,
  ) => {
    const initKey = uuidv4();
    const userValues: UserValues = {};

    userValuesService.set(userValues);
    selectedEntriesService.set([]);
    schemaCreatorService.init(templates, profile);
    schemaCreatorService.generate(initKey);

    const { updatedSchema, updatedUserValues, selectedRecordBlocks } = await getProcessedRecordAndSchema({
      baseSchema: schemaCreatorService.get(),
      record,
      userValues,
      asClone,
    });

    setUserValues(updatedUserValues || userValues);
    setInitialSchemaKey(initKey);
    setSelectedEntries(selectedEntriesService.get());
    setSchema(updatedSchema);
    setSelectedRecordBlocks(selectedRecordBlocks);

    return { updatedSchema, initKey };
  };

  const getProfiles = async ({ record, recordId, previewParams, asClone }: GetProfiles): Promise<unknown> => {
    if (isProcessingProfiles.current && (record || recordId)) return;

    try {
      isProcessingProfiles.current = true;

      const hasStoredProfiles = profiles?.length;
      const response = hasStoredProfiles ? profiles : await fetchProfiles();
      // TODO: UILD-438 - check a list of supported profiles and implement the profile selection
      const selectedProfile = response.find(({ name }: ProfileEntry) => name === PROFILE_NAMES.MONOGRAPH);
      const templates = preparedFields || prepareFields(response);

      if (!hasStoredProfiles) {
        setProfiles(response);
      }

      setUserValues({});

      const recordData = record?.resource || {};
      const recordTitle = getRecordTitle(recordData as RecordEntry);
      const entities = getPrimaryEntitiesFromRecord(record as RecordEntry);

      if (selectedProfile) {
        setSelectedProfile(selectedProfile);

        const { updatedSchema, initKey } = await buildSchema(selectedProfile, templates, recordData, asClone);

        if (previewParams && recordId) {
          setPreviewContent(prev => [
            ...(previewParams.singular ? [] : prev.filter(({ id }) => id !== recordId)),
            {
              id: recordId,
              base: updatedSchema,
              userValues: userValuesService.getAllValues(),
              initKey,
              title: recordTitle,
              entities,
            },
          ]);
        }
      }

      return response;
    } finally {
      isProcessingProfiles.current = false;
    }
  };

  return { getProfiles, prepareFields };
};
