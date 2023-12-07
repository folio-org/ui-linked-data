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
  IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION,
  INSTANTIATES_TO_INSTANCE_FIELDS,
  PROFILE_NAMES,
  RESOURCE_TEMPLATE_IDS,
  TEMPORARY_COMPLEX_GROUPS,
  TEMPORARY_URIS_WITHOUT_MAPPING,
} from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { BFLITE_URIS, TEMP_BF2_TO_BFLITE_MAP } from '@common/constants/bibframeMapping.constants';
import { shouldSelectDropdownOption } from '@common/helpers/profile.helper';
import { getUris } from '@common/helpers/bibframe.helper';
import {
  generateCopiedGroupUuids,
  generateRecordForDropdown,
  generateUserValueContent,
  getFilteredRecordData,
} from '@common/helpers/schema.helper';
import { defineMemoizedValue } from '@common/helpers/memoizedValue.helper';

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
    recordItemIndex?: number;
    hasSelectedRecord?: boolean;
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
    recordItemIndex,
    hasSelectedRecord,
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
      const recordIndex = recordItemIndex || 0;
      const withContentsSelected = Array.isArray(record) ? record[recordIndex] : record;
      const { uriBFLite, uriWithSelector } = getUris({
        uri: propertyURI,
        dataTypeURI: valueDataType?.dataTypeURI,
        schema: base,
        path,
      });
      const isWorkToInstanceField = INSTANTIATES_TO_INSTANCE_FIELDS.includes(uriWithSelector);
      const workToInstanceRecord = withContentsSelected?.[BFLITE_URIS.INSTANTIATES];
      const recordData =
        isWorkToInstanceField && workToInstanceRecord ? workToInstanceRecord?.[0] : withContentsSelected;
      const selectedRecord = typeof recordData === 'string' ? [recordData] : recordData?.[uriWithSelector];

      if (selectedRecord?.length > 1 && parentEntryType === AdvancedFieldType.block) {
        const copiedGroupsUuid = selectedRecord.map(() => uuidv4());

        updateParentEntryChildren({ base, copiedGroupsUuid, path, uuid });

        selectedRecord.forEach((_: Record<string, any>, index: number) => {
          processSimpleUIConrol({
            base,
            recordData: selectedRecord,
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
          recordData: selectedRecord,
          userValues,
          uuid,
          type,
          uriBFLite,
          path,
          propertyLabel,
          propertyURI,
          constraints,
          index: recordIndex,
        });
      }
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
        // i.e. Work, Instance, Item
        case AdvancedFieldType.block: {
          const { id, resourceURI, resourceLabel, propertyTemplates } = entry as ResourceTemplate;
          const { uriBFLite, uriWithSelector } = getUris({ uri: resourceURI, schema: base, path });
          const uuidArray = propertyTemplates.map(() => uuidv4());
          const supportedEntries = Object.keys(RESOURCE_TEMPLATE_IDS);
          const isProfileResourceTemplate = path.length <= GROUP_BY_LEVEL;

          if (!supportedEntries.includes(id) && isProfileResourceTemplate) return;

          if (
            (type === AdvancedFieldType.dropdownOption &&
              hasSelectedRecord &&
              uriBFLite === dropdownOptionSelection?.selectedRecordUriBFLite) ||
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

          const isHiddenType = type === AdvancedFieldType.hidden || HIDDEN_WRAPPERS.includes(resourceURI);
          const selectedRecord = hasSelectedRecord
            ? record
            : generateRecordForDropdown({
                record,
                uriWithSelector,
                hasRootWrapper: !isHiddenType,
              });

          propertyTemplates.map((entry, i) => {
            traverseProfile({
              entry,
              templates,
              uuid: uuidArray[i],
              path: updatedPath,
              base,
              selectedEntries,
              record: selectedRecord,
              recordItemIndex,
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
          const {
            propertyURI,
            valueConstraint: { valueTemplateRefs, valueDataType },
          } = entry as PropertyTemplate;
          const { uriWithSelector } = getUris({
            uri: propertyURI,
            dataTypeURI: valueDataType?.dataTypeURI,
            schema: base,
            path,
          });

          const hasNoRootWrapper =
            GROUPS_WITHOUT_ROOT_WRAPPER.includes(propertyURI) ||
            COMPLEX_GROUPS_WITHOUT_WRAPPER.includes(propertyURI) ||
            (hasHiddenParent && !IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION.includes(propertyURI));
          const isTemporaryComplexGroup = TEMPORARY_COMPLEX_GROUPS.includes(propertyURI);

          const selectedRecord = generateRecordForDropdown({
            record,
            uriWithSelector,
            hasRootWrapper: !hasNoRootWrapper,
          });
          const filteredRecordData = getFilteredRecordData({
            valueTemplateRefs,
            templates,
            base,
            path,
            selectedRecord,
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
          } else if (hasNoRootWrapper && (filteredRecordData?.length || (isTemporaryComplexGroup && selectedRecord))) {
            processGroupsWithoutWrapper({
              valueTemplateRefs,
              base,
              path,
              uuid,
              templates,
              selectedRecord,
              entry,
              type,
              selectedEntries,
              userValues,
              hasNoRootWrapper,
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
          console.error('Not implemented.', entry);

          return;
        }
      }
    }
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
      const start = children?.slice(0, originalEntryIndex) || [];
      const end = children?.slice(originalEntryIndex + 1, children?.length) || [];

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
    recordItemIndex,
    userValues,
    hasNoRootWrapper,
    hasSelectedRecord,
    selectedRecordUriBFLite,
  }: {
    uuid: string;
    entry: ProfileEntry | ResourceTemplate | PropertyTemplate;
    base: Map<string, SchemaEntry>;
    type: AdvancedFieldType;
    path: string[];
    templates: ResourceTemplates;
    selectedEntries?: Array<string>;
    record: Record<string, any> | Array<any>;
    recordItemIndex?: number;
    userValues?: UserValues;
    hasNoRootWrapper: boolean;
    hasSelectedRecord?: boolean;
    selectedRecordUriBFLite?: string;
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

    const { getValue: getIsSelectedOption, setValue } = defineMemoizedValue(false);

    valueTemplateRefs.forEach((item, index) => {
      const entry = templates[item];

      const { uriBFLite } = getUris({ uri: entry.resourceURI, schema: base, path });

      if (uriBFLite === selectedRecordUriBFLite) {
        setValue(true);
      }

      let recordData;

      if (hasSelectedRecord) {
        recordData = uriBFLite === selectedRecordUriBFLite ? record : undefined;
      } else {
        recordData = record;
      }

      traverseProfile({
        entry,
        auxType: type === AdvancedFieldType.dropdown ? AdvancedFieldType.dropdownOption : AdvancedFieldType.hidden,
        templates,
        uuid: uuidArray[index],
        path: [...path, newUuid],
        base,
        firstOfSameType: index === 0,
        selectedEntries,
        record: recordData,
        recordItemIndex,
        hasSelectedRecord,
        userValues,
        dropdownOptionSelection: {
          hasNoRootWrapper,
          isSelectedOption: getIsSelectedOption(),
          setIsSelectedOption: setValue,
          selectedRecordUriBFLite,
        },
      });
    });

    // Select the first dropdown option if nothing was selected
    if (hasNoRootWrapper && !getIsSelectedOption()) {
      selectedEntries?.push(uuidArray[0]);
    }
  };

  const processGroupsWithoutWrapper = ({
    valueTemplateRefs,
    base,
    path,
    uuid,
    templates,
    selectedRecord,
    entry,
    type,
    selectedEntries,
    userValues,
    hasNoRootWrapper,
  }: {
    valueTemplateRefs: string[];
    base: Map<string, SchemaEntry>;
    path: string[];
    uuid: string;
    templates: ResourceTemplates;
    selectedRecord: Record<string, any>;
    entry: ProfileEntry | ResourceTemplate | PropertyTemplate;
    type: AdvancedFieldType;
    selectedEntries: Array<string>;
    userValues?: UserValues;
    hasNoRootWrapper: boolean;
  }) => {
    const copiedUuids: Array<Array<string>> = generateCopiedGroupUuids({
      valueTemplateRefs,
      templates,
      base,
      path,
      selectedRecord,
    });
    const uuidList = copiedUuids?.flat();

    updateParentEntryChildren({ base, copiedGroupsUuid: uuidList, path, uuid });

    valueTemplateRefs.forEach((templateRef, templateRefIndex: number) => {
      const entryData = templates[templateRef];
      const { uriBFLite } = getUris({ uri: entryData.resourceURI, schema: base, path });

      if (!uriBFLite) return;

      const isTempMappedURI = TEMPORARY_URIS_WITHOUT_MAPPING.includes(uriBFLite);
      const recordData = isTempMappedURI
        ? selectedRecord?.[TEMP_BF2_TO_BFLITE_MAP[uriBFLite]]
        : selectedRecord?.[uriBFLite];

      if (recordData?.length) {
        const copiedGroupsUuid = copiedUuids[templateRefIndex];

        recordData?.forEach((recordItem: Record<string, any>, recordItemIndex: number) => {
          processGroup({
            uuid: copiedGroupsUuid?.[recordItemIndex],
            entry,
            base,
            type,
            path,
            templates,
            selectedEntries,
            record: isTempMappedURI ? selectedRecord : recordItem,
            recordItemIndex,
            userValues,
            hasNoRootWrapper,
            hasSelectedRecord: true,
            selectedRecordUriBFLite: uriBFLite,
          });
        });
      }
    });
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

  return { getProfiles, prepareFields };
};
