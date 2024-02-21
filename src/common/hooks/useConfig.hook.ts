import { useRecoilState, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import state from '@state';
import { fetchProfiles } from '@common/api/profiles.api';
import { getAdvancedFieldType } from '@common/helpers/common.helper';
import {
  CONSTRAINTS,
  GROUP_BY_LEVEL,
  PROFILE_NAMES,
  RESOURCE_TEMPLATE_IDS,
} from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { getUris } from '@common/helpers/bibframe.helper';
import { RecordNormalizingService } from '@common/services/recordNormalizing';
import { RecordToSchemaMappingService } from '@common/services/recordToSchemaMapping';
import { SelectedEntriesService } from '@common/services/selectedEntries';
import { SchemaWithDuplicatesService } from '@common/services/schema';
import { UserValuesService } from '@common/services/userValues';
import { loadSimpleLookup } from '@common/helpers/api.helper';

export const useConfig = () => {
  const setProfiles = useSetRecoilState(state.config.profiles);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const setUserValues = useSetRecoilState(state.inputs.userValues);
  const setPreparedFields = useSetRecoilState(state.config.preparedFields);
  const setSchema = useSetRecoilState(state.config.schema);
  const setInitialSchemaKey = useSetRecoilState(state.config.initialSchemaKey);
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);
  const setPreviewContent = useSetRecoilState(state.inputs.previewContent);
  const [lookupData, setLookupData] = useRecoilState(state.config.lookupData);

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

  type TraverseProfile = {
    entry: ProfileEntry | ResourceTemplate | PropertyTemplate;
    templates: ResourceTemplates;
    uuid?: string;
    path?: Array<string>;
    base?: Map<string, SchemaEntry>;
    auxType?: AdvancedFieldType;
    firstOfSameType?: boolean;
    selectedEntries?: Array<string>;
    recordItemIndex?: number;
  };

  // TODO: create a separate service for the schema processing and move all the code there
  const traverseProfile = async ({
    entry,
    templates,
    uuid = uuidv4(),
    path = [],
    base = new Map(),
    auxType,
    firstOfSameType = false,
    selectedEntries = [],
    recordItemIndex,
  }: TraverseProfile) => {
    const type = auxType || getAdvancedFieldType(entry);
    const updatedPath = [...path, uuid];
    const branchEnds = [AdvancedFieldType.literal, AdvancedFieldType.simple, AdvancedFieldType.complex];

    if (branchEnds.includes(type)) {
      const {
        propertyURI,
        propertyLabel,
        mandatory,
        repeatable,
        valueConstraint: { useValuesFrom, editable, valueDataType },
      } = entry as PropertyTemplate;

      const constraints = {
        ...CONSTRAINTS,
        mandatory: Boolean(mandatory),
        repeatable: Boolean(repeatable),
        editable: Boolean(editable),
        useValuesFrom,
        valueDataType,
      };

      const { uriBFLite } = getUris({
        uri: propertyURI,
        dataTypeURI: valueDataType?.dataTypeURI,
        schema: base,
        path,
      });

      base.set(uuid, {
        uuid,
        type,
        path: [...path, uuid],
        displayName: propertyLabel,
        uri: propertyURI,
        uriBFLite,
        constraints,
      });
    } else {
      switch (type) {
        // parent types (i.e Monograph)
        case AdvancedFieldType.profile: {
          const { title, id, resourceTemplates } = (entry as ProfileEntry).json.Profile;
          const uuidArray = resourceTemplates.map(() => uuidv4());

          base.set(uuid, {
            uuid,
            type,
            path: updatedPath,
            displayName: title,
            bfid: id,
            children: uuidArray,
          });

          for await (const [index, entry] of resourceTemplates.entries()) {
            await traverseProfile({
              entry,
              templates,
              uuid: uuidArray[index],
              path: updatedPath,
              base,
              selectedEntries,
            });
          }

          return;
        }
        case AdvancedFieldType.hidden:
        case AdvancedFieldType.dropdownOption:
        // i.e. Work, Instance, Item
        case AdvancedFieldType.block: {
          const { id, resourceURI, resourceLabel, propertyTemplates } = entry as ResourceTemplate;
          const { uriBFLite } = getUris({ uri: resourceURI, schema: base, path });
          const uuidArray = propertyTemplates.map(() => uuidv4());
          const supportedEntries = Object.keys(RESOURCE_TEMPLATE_IDS);
          const isProfileResourceTemplate = path.length <= GROUP_BY_LEVEL;

          if (!supportedEntries.includes(id) && isProfileResourceTemplate) return;

          if (type === AdvancedFieldType.dropdownOption && firstOfSameType) {
            selectedEntries.push(uuid);
          }

          base.set(uuid, {
            uuid,
            type,
            path: updatedPath,
            displayName: resourceLabel,
            bfid: id,
            uri: resourceURI,
            uriBFLite,
            children: uuidArray,
          });

          for await (const [index, entry] of propertyTemplates.entries()) {
            await traverseProfile({
              entry,
              templates,
              uuid: uuidArray[index],
              path: updatedPath,
              base,
              selectedEntries,
              recordItemIndex,
            });
          }

          return;
        }
        // parent-intermediate-? types
        case AdvancedFieldType.group:
        case AdvancedFieldType.groupComplex:
        case AdvancedFieldType.dropdown: {
          await processGroup({
            uuid,
            entry,
            base,
            type,
            path,
            templates,
            selectedEntries,
          });

          return;
        }
        default: {
          console.error('Not implemented.', entry);

          return;
        }
      }
    }
  };

  const buildSchema = async (
    profile: ProfileEntry,
    templates: ResourceTemplates,
    record: Record<string, unknown> | Array<unknown>,
  ) => {
    const base = new Map();
    const initKey = uuidv4();
    const selectedEntries: Array<string> = [];
    const userValues: UserValues = {};

    await traverseProfile({
      entry: profile,
      uuid: initKey,
      templates,
      base,
      selectedEntries,
    });

    let updatedRecord = record;
    let updatedSchema = base;
    let updatedUserValues = userValues;
    let updatedSelectedEntries = selectedEntries;

    // TODO: move this to a separate method or function
    if (record) {
      const recordNormalizingService = new RecordNormalizingService(record as RecordEntry);
      updatedRecord = recordNormalizingService.get();

      const selectedEntriesService = new SelectedEntriesService(selectedEntries);
      const repeatableFieldsService = new SchemaWithDuplicatesService(base, selectedEntriesService);

      // TODO: create a service for this
      const lookupApiClient = {
        load: loadSimpleLookup,
      };

      const lookupCacheService = {
        save: (key: string, data: MultiselectOption[]) => {
          const updatedData = { ...lookupData, [key]: data };

          setLookupData(updatedData);
        },
        getAll: () => lookupData,
        getById: (id: string) => lookupData[id],
      };

      const userValuesService = new UserValuesService(userValues, lookupApiClient, lookupCacheService);
      const recordToSchemaMappingService = new RecordToSchemaMappingService(
        base,
        updatedRecord,
        selectedEntriesService,
        repeatableFieldsService,
        userValuesService,
      );

      await recordToSchemaMappingService.init();
      updatedSchema = recordToSchemaMappingService.getUpdatedSchema();
      updatedUserValues = userValuesService.getAllValues();
      updatedSelectedEntries = selectedEntriesService.get();
    }

    setUserValues(updatedUserValues || userValues);
    setInitialSchemaKey(initKey);
    setSelectedEntries(updatedSelectedEntries);
    setSchema(updatedSchema);

    return { updatedSchema: updatedSchema, userValues, initKey };
  };

  type GetProfiles = {
    record?: RecordEntry;
    recordId?: string;
    asPreview?: boolean;
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

  const processGroup = async ({
    uuid,
    entry,
    base,
    type,
    path,
    templates,
    selectedEntries,
  }: {
    uuid: string;
    entry: ProfileEntry | ResourceTemplate | PropertyTemplate;
    base: Map<string, SchemaEntry>;
    type: AdvancedFieldType;
    path: string[];
    templates: ResourceTemplates;
    selectedEntries?: Array<string>;
  }) => {
    const {
      propertyURI,
      propertyLabel,
      mandatory,
      repeatable,
      valueConstraint: { valueTemplateRefs, useValuesFrom, editable, valueDataType },
    } = entry as PropertyTemplate;
    const { uriBFLite } = getUris({ uri: propertyURI, dataTypeURI: valueDataType?.dataTypeURI, schema: base, path });

    const constraints = {
      ...CONSTRAINTS,
      mandatory: Boolean(mandatory),
      repeatable: Boolean(repeatable),
      editable: Boolean(editable),
      useValuesFrom,
      valueDataType,
    };

    const newUuid = uuid;
    const uuidArray = valueTemplateRefs.map(() => uuidv4());

    base.set(newUuid, {
      uuid: newUuid,
      type,
      path: [...path, newUuid],
      displayName: propertyLabel,
      uri: propertyURI,
      uriBFLite,
      constraints,
      children: uuidArray,
    });

    // TODO: how to avoid circular references when handling META | HIDE
    if (type === AdvancedFieldType.group) return;

    for await (const [index, item] of valueTemplateRefs.entries()) {
      const entry = templates[item];

      await traverseProfile({
        entry,
        auxType: type === AdvancedFieldType.dropdown ? AdvancedFieldType.dropdownOption : AdvancedFieldType.hidden,
        templates,
        uuid: uuidArray[index],
        path: [...path, newUuid],
        base,
        firstOfSameType: index === 0,
        selectedEntries,
      });
    }
  };

  return { getProfiles, prepareFields };
};
