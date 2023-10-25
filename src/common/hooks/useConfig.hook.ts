import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import state from '@state';
import { fetchProfiles } from '@common/api/profiles.api';
import { getAdvancedFieldType } from '@common/helpers/common.helper';
import {
  COMPLEX_GROUPS_WITHOUT_WRAPPER,
  CONSTRAINTS,
  GROUPS_WITHOUT_ROOT_WRAPPER,
  GROUP_BY_LEVEL,
  HIDDEN_WRAPPERS,
  PROFILE_NAMES,
  RESOURCE_TEMPLATE_IDS,
} from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { shouldSelectDropdownOption } from '@common/helpers/profile.helper';
import { getMappedBFLiteUri } from '@common/helpers/bibframe.helper';
import { generateRecordForDropdown, generateUserValueObject } from '@common/helpers/schema.helper';
import { useMemoizedValue } from '@common/helpers/memoizedValue.helper';

export const useConfig = () => {
  const setProfiles = useSetRecoilState(state.config.profiles);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const setUserValues = useSetRecoilState(state.inputs.userValues);
  const setPreparedFields = useSetRecoilState(state.config.preparedFields);
  const setSchema = useSetRecoilState(state.config.schema);
  const setInitialSchemaKey = useSetRecoilState(state.config.initialSchemaKey);
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);
  const setPreviewContent = useSetRecoilState(state.inputs.previewContent);

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
    record?: Record<string, any> | Array<any>;
    dropdownOptionSelection?: DropdownOptionSelection;
    hasHiddenParent?: boolean;
    userValues?: UserValues;
    parentEntryType?: AdvancedFieldType;
  };

  const traverseProfile = ({
    entry,
    templates,
    uuid = uuidv4(),
    path = [],
    base = new Map(),
    auxType,
    firstOfSameType = false,
    selectedEntries = [],
    record,
    dropdownOptionSelection,
    hasHiddenParent = false,
    userValues,
    parentEntryType,
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

      // TODO: Potentially dangerous HACK ([0])
      // Might be removed with the API schema change
      // If not, refactor to include all indices
      const withContentsSelected = Array.isArray(record) ? record[0] : record;
      const { uriBFLite, uriWithSelector } = getUris(propertyURI, base, path);

      if (withContentsSelected?.[uriWithSelector]?.length > 1 && parentEntryType === AdvancedFieldType.block) {
        const copiedGroupsUuid = withContentsSelected?.[uriWithSelector].map(() => uuidv4());

        updateParentEntryChildren({ base, copiedGroupsUuid, path, uuid });

        withContentsSelected[uriWithSelector].forEach((_: Record<string, any>, index: number) => {
          processSimpleUIConrol({
            base,
            recordData: withContentsSelected?.[uriWithSelector],
            userValues,
            uuid: copiedGroupsUuid[index],
            type,
            uriBFLite,
            path,
            propertyLabel,
            propertyURI,
            constraints,
            index,
          });
        });
      } else {
        processSimpleUIConrol({
          base,
          recordData: withContentsSelected?.[uriWithSelector],
          userValues,
          uuid,
          type,
          uriBFLite,
          path,
          propertyLabel,
          propertyURI,
          constraints,
        });
      }
    } else {
      switch (type) {
        // parent types
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

          resourceTemplates.map((entry, i) => {
            traverseProfile({
              entry,
              templates,
              uuid: uuidArray[i],
              path: updatedPath,
              base,
              selectedEntries,
              record,
              userValues,
            });
          });

          return;
        }
        case AdvancedFieldType.hidden:
        case AdvancedFieldType.dropdownOption:
        case AdvancedFieldType.block: {
          const { id, resourceURI, resourceLabel, propertyTemplates } = entry as ResourceTemplate;
          const { uriBFLite, uriWithSelector } = getUris(resourceURI, base, path);
          const uuidArray = propertyTemplates.map(() => uuidv4());
          const supportedEntries = Object.keys(RESOURCE_TEMPLATE_IDS);
          const isProfileResourceTemplate = path.length <= GROUP_BY_LEVEL;

          if (!supportedEntries.includes(id) && isProfileResourceTemplate) return;

          if (
            type === AdvancedFieldType.dropdownOption &&
            shouldSelectDropdownOption({ uri: uriWithSelector, record, firstOfSameType, dropdownOptionSelection })
          ) {
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

          propertyTemplates.map((entry, i) => {
            const isHiddenType = type === AdvancedFieldType.hidden || HIDDEN_WRAPPERS.includes(resourceURI);
            const selectedRecord = generateRecordForDropdown({
              record,
              uriWithSelector,
              hasRootWrapper: !isHiddenType,
            });

            traverseProfile({
              entry,
              templates,
              uuid: uuidArray[i],
              path: updatedPath,
              base,
              selectedEntries,
              record: selectedRecord,
              hasHiddenParent: isHiddenType,
              userValues,
              parentEntryType: type,
            });
          });

          return;
        }
        // parent-intermediate-? types
        case AdvancedFieldType.group:
        case AdvancedFieldType.groupComplex:
        case AdvancedFieldType.dropdown: {
          const { propertyURI } = entry as PropertyTemplate;
          const { uriWithSelector } = getUris(propertyURI, base, path);

          const hasNoRootWrapper =
            GROUPS_WITHOUT_ROOT_WRAPPER.includes(propertyURI) ||
            COMPLEX_GROUPS_WITHOUT_WRAPPER.includes(propertyURI) ||
            hasHiddenParent;

          const selectedRecord = generateRecordForDropdown({
            record,
            uriWithSelector,
            hasRootWrapper: !hasNoRootWrapper,
          });

          if (selectedRecord?.length) {
            const copiedGroupsUuid = selectedRecord.map(() => uuidv4());

            updateParentEntryChildren({ base, copiedGroupsUuid, path, uuid });

            selectedRecord.forEach((recordData: Record<string, any> | Array<any>, index: string) => {
              processGroup({
                uuid: copiedGroupsUuid[index],
                entry,
                base,
                type,
                path,
                templates,
                selectedEntries,
                record: recordData,
                userValues,
                hasNoRootWrapper,
              });
            });
          } else {
            processGroup({
              uuid,
              entry,
              base,
              type,
              path,
              templates,
              selectedEntries,
              record: selectedRecord,
              userValues,
              hasNoRootWrapper,
            });
          }

          return;
        }
        default: {
          console.log('Not implemented.', entry);

          return;
        }
      }
    }
  };

  const getUris = (uri: string, schema?: Schema, path?: string[]) => {
    const uriBFLite = getMappedBFLiteUri(uri, schema, path);
    const uriWithSelector = uriBFLite || uri;

    return { uriBFLite, uriWithSelector };
  };

  const buildSchema = (
    profile: ProfileEntry,
    templates: ResourceTemplates,
    record: Record<string, any> | Array<any>,
  ) => {
    const base = new Map();
    const initKey = uuidv4();
    const selectedEntries: Array<string> = [];
    const userValues: UserValues = {};

    traverseProfile({
      entry: profile,
      uuid: initKey,
      templates,
      base,
      selectedEntries,
      record,
      userValues,
    });

    setUserValues(userValues);
    setInitialSchemaKey(initKey);
    setSelectedEntries(selectedEntries);
    setSchema(base);

    return { base, userValues, initKey };
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
    const { base, userValues, initKey } = buildSchema(monograph, templates, recordData);

    if (asPreview && recordId) {
      setPreviewContent(prev => [
        ...prev.filter(({ id }) => id !== recordId),
        {
          id: recordId,
          base,
          userValues,
          initKey,
        },
      ]);
    }

    return response;
  };

  const updateParentEntryChildren = ({
    base,
    copiedGroupsUuid,
    path,
    uuid,
  }: {
    base: Map<string, SchemaEntry>;
    copiedGroupsUuid: string[];
    path: string[];
    uuid: string;
  }) => {
    const parentElemUuid = path[path.length - 1];
    const parentElem = base.get(parentElemUuid);
    const children = parentElem?.children;
    const originalEntryIndex = children?.indexOf(uuid);

    if (originalEntryIndex !== undefined && originalEntryIndex >= 0 && parentElem) {
      const start = parentElem.children?.slice(0, originalEntryIndex) || [];
      const end = parentElem.children?.slice(originalEntryIndex + 1, parentElem.children?.length) || [];

      parentElem.children = [...start, ...copiedGroupsUuid, ...end];
    }
  };

  const processGroup = ({
    uuid,
    entry,
    base,
    type,
    path,
    templates,
    selectedEntries,
    record,
    userValues,
    hasNoRootWrapper,
  }: {
    uuid: string;
    entry: ProfileEntry | ResourceTemplate | PropertyTemplate;
    base: Map<string, SchemaEntry>;
    type: AdvancedFieldType;
    path: string[];
    templates: ResourceTemplates;
    selectedEntries?: Array<string>;
    record: Record<string, any> | Array<any>;
    userValues?: UserValues;
    hasNoRootWrapper: boolean;
  }) => {
    const {
      propertyURI,
      propertyLabel,
      mandatory,
      repeatable,
      valueConstraint: { valueTemplateRefs, useValuesFrom, editable, valueDataType },
    } = entry as PropertyTemplate;
    const { uriBFLite } = getUris(propertyURI, base, path);

    const constraints = {
      ...CONSTRAINTS,
      mandatory: Boolean(mandatory),
      repeatable: Boolean(repeatable),
      editable: Boolean(editable),
      useValuesFrom,
      valueDataType,
    };

    const newUUid = uuid;
    const uuidArray = valueTemplateRefs.map(() => uuidv4());

    base.set(newUUid, {
      uuid: newUUid,
      type,
      path: [...path, newUUid],
      displayName: propertyLabel,
      uri: propertyURI,
      uriBFLite,
      constraints,
      children: uuidArray,
    });

    // TODO: how to avoid circular references when handling META | HIDE
    if (type === AdvancedFieldType.group) return;

    const { getValue: getIsSelectedOption, setValue } = useMemoizedValue(false);

    valueTemplateRefs.forEach((item, i) => {
      const entry = templates[item];

      traverseProfile({
        entry,
        auxType: type === AdvancedFieldType.dropdown ? AdvancedFieldType.dropdownOption : AdvancedFieldType.hidden,
        templates,
        uuid: uuidArray[i],
        path: [...path, newUUid],
        base,
        firstOfSameType: i === 0,
        selectedEntries,
        record,
        userValues,
        dropdownOptionSelection: {
          hasNoRootWrapper,
          isSelectedOption: getIsSelectedOption(),
          setIsSelectedOption: setValue,
        },
      });
    });

    // Select the first dropdown option if nothing was selected
    if (hasNoRootWrapper && !getIsSelectedOption()) {
      selectedEntries?.push(uuidArray[0]);
    }
  };

  const processSimpleUIConrol = ({
    base,
    recordData,
    userValues,
    uuid,
    type,
    uriBFLite,
    path,
    propertyLabel,
    propertyURI,
    constraints,
    index,
  }: {
    base: Map<string, SchemaEntry>;
    recordData: Array<Record<string, any>>;
    userValues?: UserValues;
    uuid: string;
    type: AdvancedFieldType;
    uriBFLite?: string;
    path: string[];
    propertyLabel: string;
    propertyURI: string;
    constraints: Constraints;
    index?: number;
  }) => {
    if (recordData && userValues) {
      let contents = recordData.map((entry: any) => generateUserValueContent(entry, type, uriBFLite));

      if (index !== undefined) {
        const selectedRecordData = recordData?.[index];

        contents = [generateUserValueContent(selectedRecordData, type, uriBFLite)];
      }

      userValues[uuid] = {
        uuid,
        contents,
      };
    }

    base.set(uuid, {
      uuid,
      type,
      path: [...path, uuid],
      displayName: propertyLabel,
      uri: propertyURI,
      uriBFLite,
      constraints,
    });
  };

  const generateUserValueContent = (
    entry: string | Record<string, any> | Array<Record<string, any>>,
    type: AdvancedFieldType,
    uriBFLite?: string,
  ) =>
    typeof entry === 'string'
      ? {
          label: entry,
        }
      : generateUserValueObject(entry, type, uriBFLite);

  return { getProfiles, prepareFields };
};
