import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchProfile, fetchProfiles } from '@common/api/profiles.api';
import { PROFILE_NAMES } from '@common/constants/bibframe.constants';
import { getPrimaryEntitiesFromRecord, getRecordTitle } from '@common/helpers/record.helper';
import { useInputsState, useProfileState } from '@src/store';
import { useProcessedRecordAndSchema } from './useProcessedRecordAndSchema.hook';
import { useServicesContext } from './useServicesContext';
import { getReferenceIdsRaw } from '@common/helpers/recordFormatting.helper';
import { CUSTOM_PROFILE_ENABLED } from '@common/constants/feature.constants';

export type PreviewParams = {
  noStateUpdate?: boolean;
  singular?: boolean;
};

type IGetProfiles = {
  record?: RecordEntry;
  recordId?: string;
  previewParams?: PreviewParams;
  asClone?: boolean;
};

type IBuildSchema = {
  profile: ProfileEntry;
  templates?: ResourceTemplates;
  record: Record<string, unknown> | Array<unknown>;
  asClone?: boolean;
  noStateUpdate?: boolean;
};

export const useConfig = () => {
  const { schemaCreatorService, userValuesService, selectedEntriesService, schemaGeneratorService } =
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
  const { setUserValues, setPreviewContent, setSelectedRecordBlocks, setSelectedEntries } = useInputsState();
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

  const buildSchema = async ({ profile, templates, record, asClone = false, noStateUpdate = false }: IBuildSchema) => {
    const initKey = uuidv4();
    const userValues: UserValues = {};

    userValuesService.set(userValues);
    selectedEntriesService.set([]);

    if (CUSTOM_PROFILE_ENABLED) {
      schemaGeneratorService.init(profile as unknown as Profile);
      schemaGeneratorService.generate(initKey);
    } else {
      // TODO: UILD-550 - delete this service after refactoring
      schemaCreatorService.init(templates ?? {}, profile);
      schemaCreatorService.generate(initKey);
    }

    const { updatedSchema, updatedUserValues, selectedRecordBlocks } = await getProcessedRecordAndSchema({
      baseSchema: CUSTOM_PROFILE_ENABLED ? schemaGeneratorService.get() : schemaCreatorService.get(),
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

  const getProfiles = async ({ record, recordId, previewParams, asClone }: IGetProfiles): Promise<unknown> => {
    if (isProcessingProfiles.current && (record || recordId)) return;

    let templates;
    let selectedProfile;
    let response;

    try {
      isProcessingProfiles.current = true;

      if (CUSTOM_PROFILE_ENABLED) {
        // TODO: pass the profile ID after adding profile selection
        response = await fetchProfile();
        selectedProfile = response?.value;
      } else {
        const hasStoredProfiles = profiles?.length;
        response = hasStoredProfiles ? profiles : await fetchProfiles();
        // TODO: UILD-438 - check a list of supported profiles and implement the profile selection
        selectedProfile = response.find(({ name }: ProfileEntry) => name === PROFILE_NAMES.MONOGRAPH);
        templates = preparedFields ?? prepareFields(response);

        if (!hasStoredProfiles) {
          setProfiles(response);
        }
      }

      const recordData = record?.resource || {};
      const recordTitle = getRecordTitle(recordData as RecordEntry);
      const entities = getPrimaryEntitiesFromRecord(record as RecordEntry);
      const referenceIds = getReferenceIdsRaw(record as RecordEntry);

      if (selectedProfile) {
        !previewParams?.noStateUpdate && setSelectedProfile(selectedProfile);

        const { updatedSchema, initKey } = await buildSchema({
          profile: selectedProfile,
          templates,
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

      return response;
    } finally {
      isProcessingProfiles.current = false;
    }
  };

  return { getProfiles, prepareFields };
};
