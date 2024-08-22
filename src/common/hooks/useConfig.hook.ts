import { useContext } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import state from '@state';
import { fetchProfiles } from '@common/api/profiles.api';
import { PROFILE_NAMES } from '@common/constants/bibframe.constants';
import { RecordNormalizingService } from '@common/services/recordNormalizing';
import { RecordToSchemaMappingService } from '@common/services/recordToSchemaMapping';
import { SchemaService } from '@common/services/schema';
import { getEditingRecordBlocks, getPrimaryEntitiesFromRecord, getRecordTitle } from '@common/helpers/record.helper';
import { ServicesContext } from '@src/contexts';
import { useCommonStatus } from './useCommonStatus';

export type PreviewParams = {
  singular?: boolean;
};

type GetProfiles = {
  record?: RecordEntry;
  recordId?: string;
  previewParams?: PreviewParams;
};

export const useConfig = () => {
  const {
    userValuesService: baseUserValuesService,
    selectedEntriesService: baseSelectedEntriesService,
    schemaWithDuplicatesService: baseSchemaWithDuplicatesService,
  } = useContext(ServicesContext);
  const userValuesService = baseUserValuesService as IUserValues;
  const selectedEntriesService = baseSelectedEntriesService as ISelectedEntries;
  const schemaWithDuplicatesService = baseSchemaWithDuplicatesService as ISchemaWithDuplicates;
  const setProfiles = useSetRecoilState(state.config.profiles);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const setUserValues = useSetRecoilState(state.inputs.userValues);
  const setPreparedFields = useSetRecoilState(state.config.preparedFields);
  const setSchema = useSetRecoilState(state.config.schema);
  const setInitialSchemaKey = useSetRecoilState(state.config.initialSchemaKey);
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);
  const setPreviewContent = useSetRecoilState(state.inputs.previewContent);
  const setSelectedRecordBlocks = useSetRecoilState(state.inputs.selectedRecordBlocks);
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
    const userValues: UserValues = {};
    userValuesService.set(userValues);
    selectedEntriesService.set([]);

    const schemaCreatorService = new SchemaService(templates, profile, selectedEntriesService);
    const base = schemaCreatorService.generate(initKey);

    let updatedRecord = record;
    let updatedSchema = base;
    let updatedUserValues = userValues;
    let selectedRecordBlocks = undefined;

    try {
      // TODO: move this to a separate method or function
      if (record && Object.keys(record).length) {
        const typedRecord = record as RecordEntry;
        const { block, reference } = getEditingRecordBlocks(typedRecord);
        const recordBlocks = [block, reference?.uri] as RecordBlocksList;
        selectedRecordBlocks = { block, reference };

        const recordNormalizingService = new RecordNormalizingService(typedRecord, block, reference);
        updatedRecord = recordNormalizingService.get();
        schemaWithDuplicatesService.set(base);
        const recordToSchemaMappingService = new RecordToSchemaMappingService(
          base,
          updatedRecord as RecordEntry,
          recordBlocks as RecordBlocksList,
          selectedEntriesService,
          schemaWithDuplicatesService,
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
    setSelectedRecordBlocks(selectedRecordBlocks);

    return { updatedSchema: updatedSchema, initKey };
  };

  const getProfiles = async ({ record, recordId, previewParams }: GetProfiles): Promise<any> => {
    const response = await fetchProfiles();
    // TODO: check a list of supported profiles
    const monograph = response.find(({ name }: ProfileEntry) => name === PROFILE_NAMES.MONOGRAPH);
    const templates = prepareFields(response);

    setProfiles(response);
    setSelectedProfile(monograph);
    setUserValues({});

    const recordData = record?.resource || {};
    const recordTitle = getRecordTitle(recordData as RecordEntry);
    const entities = getPrimaryEntitiesFromRecord(record as RecordEntry);
    const { updatedSchema, initKey } = await buildSchema(monograph, templates, recordData);

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

    return response;
  };

  return { getProfiles, prepareFields };
};
