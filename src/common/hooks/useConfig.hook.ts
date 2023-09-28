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
import { IS_NEW_API_ENABLED } from '@common/constants/feature.constants';
import { generateRecordForDropdown, generateUserValueObject } from '@common/helpers/schema.helper';
import { useMemoizedValue } from '@common/helpers/memoizedValue.helper';
import { BF_URIS } from '@common/constants/bibframeMapping.constants';

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

      if (withContentsSelected?.[uriWithSelector] && userValues) {
        userValues[uuid] = {
          uuid,
          contents: withContentsSelected?.[uriWithSelector].map((entry: any) =>
            typeof entry === 'string'
              ? {
                  label: entry,
                }
              : generateUserValueObject(entry, type, uriBFLite),
          ),
        };
      }

      base.set(uuid, {
        uuid,
        type,
        path: updatedPath,
        displayName: propertyLabel,
        uri: propertyURI,
        uriBFLite,
        constraints,
      });
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
          const isDropdownOptionType = type === AdvancedFieldType.dropdownOption;
          const isHiddenType = type === AdvancedFieldType.hidden;

          if (!supportedEntries.includes(id) && isProfileResourceTemplate) return;

          if (
            isDropdownOptionType &&
            shouldSelectDropdownOption({ uri: uriWithSelector, record, firstOfSameType, dropdownOptionSelection })
          ) {
            selectedEntries.push(uuid);
          }

          if (isDropdownOptionType || isHiddenType) {
            let label;

            if (isDropdownOptionType) {
              const selectedRecord = Array.isArray(record) ? record?.[0] : record;

              label = selectedRecord?.[uriWithSelector]?.[BF_URIS.LABEL];
            } else if (isHiddenType) {
              label = Array.isArray(record) && record?.[0]?.[BF_URIS.LABEL];
            }

            if (userValues && label) {
              userValues[uuid] = {
                uuid,
                contents: [{ label, meta: { type } }],
              };
            }
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
            const isHiddenType =
              IS_NEW_API_ENABLED && (type === AdvancedFieldType.hidden || HIDDEN_WRAPPERS.includes(resourceURI));
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
            });
          });

          return;
        }
        // parent-intermediate-? types
        case AdvancedFieldType.group:
        case AdvancedFieldType.groupComplex:
        case AdvancedFieldType.dropdown: {
          const {
            propertyURI,
            propertyLabel,
            mandatory,
            repeatable,
            valueConstraint: { valueTemplateRefs, useValuesFrom, editable, valueDataType },
          } = entry as PropertyTemplate;
          const { uriBFLite, uriWithSelector } = getUris(propertyURI, base, path);

          const constraints = {
            ...CONSTRAINTS,
            mandatory: Boolean(mandatory),
            repeatable: Boolean(repeatable),
            editable: Boolean(editable),
            useValuesFrom,
            valueDataType,
          };

          const uuidArray = valueTemplateRefs.map(() => uuidv4());

          base.set(uuid, {
            uuid,
            type,
            path: updatedPath,
            displayName: propertyLabel,
            uri: propertyURI,
            uriBFLite,
            constraints,
            children: uuidArray,
          });

          // TODO: how to avoid circular references when handling META | HIDE
          if (type === AdvancedFieldType.group) return;

          const { getValue: getIsSelectedOption, setValue } = useMemoizedValue(false);
          const hasNoRootWrapper =
            IS_NEW_API_ENABLED &&
            (GROUPS_WITHOUT_ROOT_WRAPPER.includes(propertyURI) ||
              COMPLEX_GROUPS_WITHOUT_WRAPPER.includes(propertyURI) ||
              hasHiddenParent);

          valueTemplateRefs.forEach((item, i) => {
            const entry = templates[item];
            const selectedRecord = generateRecordForDropdown({
              record,
              uriWithSelector,
              hasRootWrapper: !hasNoRootWrapper,
            });

            traverseProfile({
              entry,
              auxType:
                type === AdvancedFieldType.dropdown ? AdvancedFieldType.dropdownOption : AdvancedFieldType.hidden,
              templates,
              uuid: uuidArray[i],
              path: updatedPath,
              base,
              firstOfSameType: i === 0,
              selectedEntries,
              record: selectedRecord,
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
            selectedEntries.push(uuidArray[0]);
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
    const uriWithSelector = IS_NEW_API_ENABLED ? uriBFLite || uri : uri;

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

    const recordData = (IS_NEW_API_ENABLED ? record?.resource : record) || {};
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

  return { getProfiles, prepareFields };
};
