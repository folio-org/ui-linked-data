import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import state from '@state';
import { fetchProfiles } from '@common/api/profiles.api';
import { PROFILE_NAMES } from '@common/constants/bibframe.constants';
import { RecordNormalizingService } from '@common/services/recordNormalizing';
import { RecordToSchemaMappingService } from '@common/services/recordToSchemaMapping';
import { SelectedEntriesService } from '@common/services/selectedEntries';
import { SchemaService, SchemaWithDuplicatesService } from '@common/services/schema';
import { UserValuesService } from '@common/services/userValues';
import { useLookupCacheService } from './useLookupCache.hook';
import { useCommonStatus } from './useCommonStatus';
import { apiClient } from '@common/api/client';

type GetProfiles = {
  record?: RecordEntry;
  recordId?: string;
  asPreview?: boolean;
};

export const useConfig = () => {
  const setProfiles = useSetRecoilState(state.config.profiles);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const setUserValues = useSetRecoilState(state.inputs.userValues);
  const setPreparedFields = useSetRecoilState(state.config.preparedFields);
  const setSchema = useSetRecoilState(state.config.schema);
  const setInitialSchemaKey = useSetRecoilState(state.config.initialSchemaKey);
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);
  const setPreviewContent = useSetRecoilState(state.inputs.previewContent);
  const lookupCacheService = useLookupCacheService();
  const commonStatusService = useCommonStatus();

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

  // TODO: create a service for initializing all the schema, record and other services
  const buildSchema = async (
    profile: ProfileEntry,
    templates: ResourceTemplates,
    record: Record<string, unknown> | Array<unknown>,
  ) => {
    const initKey = uuidv4();
    const selectedEntries: Array<string> = [];
    const userValues: UserValues = {};

    const selectedEntriesService = new SelectedEntriesService(selectedEntries);
    const schemaCreatorService = new SchemaService(templates, profile, selectedEntriesService);
    const base = schemaCreatorService.generate(initKey);

    let updatedRecord = record;
    let updatedSchema = base;
    let updatedUserValues = userValues;

    try {
      // TODO: move this to a separate method or function
      if (record && Object.keys(record).length) {
        const recordNormalizingService = new RecordNormalizingService(record as RecordEntry);
        updatedRecord = recordNormalizingService.get();
        const repeatableFieldsService = new SchemaWithDuplicatesService(base, selectedEntriesService);
        const userValuesService = new UserValuesService(userValues, apiClient, lookupCacheService);
        const recordToSchemaMappingService = new RecordToSchemaMappingService(
          base,
          updatedRecord as RecordEntry,
          selectedEntriesService,
          repeatableFieldsService,
          userValuesService,
          commonStatusService,
        );

        await recordToSchemaMappingService.init();

        updatedSchema = recordToSchemaMappingService.getUpdatedSchema();
        updatedUserValues = userValuesService.getAllValues();
      }
    } catch (error) {
      // TODO: display an user error
      console.error(error);
    }

    setUserValues(updatedUserValues || userValues);
    setInitialSchemaKey(initKey);
    setSelectedEntries(selectedEntriesService.get());
    setSchema(updatedSchema);

    return { updatedSchema: updatedSchema, userValues, initKey };
  };

  const getProfiles = async ({ record, recordId, asPreview }: GetProfiles): Promise<any> => {
    const response = await fetchProfiles();
    // TODO: check a list of supported profiles
    const monograph = response.find(({ name }: ProfileEntry) => name === PROFILE_NAMES.MONOGRAPH);
    const templates = prepareFields(response);

    setProfiles(response);
    setSelectedProfile(monograph);
    setUserValues({});

    const recordData = record?.resource || {};
    const { updatedSchema, userValues, initKey } = await buildSchema(monograph, templates, recordData);

    if (asPreview && recordId) {
      setPreviewContent(prev => [
        ...prev.filter(({ id }) => id !== recordId),
        {
          id: recordId,
          base: updatedSchema,
          userValues,
          initKey,
        },
      ]);
    }

    return response;
  };

  return { getProfiles, prepareFields };
};
