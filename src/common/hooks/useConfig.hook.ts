import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import state from '@state';
import { fetchProfiles } from '@api/profiles.api';
import { getAdvancedFieldType } from '@helpers/common.helper';
import { CONSTRAINTS, GROUP_BY_LEVEL, PROFILE_NAMES, RESOURCE_TEMPLATE_IDS } from '@constants/bibframe.constants';
import { AdvancedFieldType } from '@constants/uiControls.constants';

// TODO: split & naming ?
export default function useConfig() {
  const setProfiles = useSetRecoilState(state.config.profiles);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const setUserValues = useSetRecoilState(state.inputs.userValues);
  const setPreparedFields = useSetRecoilState(state.config.preparedFields);
  const setSchema = useSetRecoilState(state.config.schema);
  const setInitialSchemaKey = useSetRecoilState(state.config.initialSchemaKey);
  const setSelectedEntries = useSetRecoilState(state.config.selectedEntries);

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
  }: TraverseProfile) => {
    const type = auxType || getAdvancedFieldType(entry);
    const updatedPath = [...path, uuid];
    const branchEnds = [AdvancedFieldType.literal, AdvancedFieldType.simple, AdvancedFieldType.complex];
    const isRecordArray = Array.isArray(record);

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
      const withContentsSelected = isRecordArray ? record[0] : record;

      withContentsSelected?.[propertyURI] &&
        setUserValues(oldValue => ({
          ...oldValue,
          [uuid]: {
            uuid,
            contents: withContentsSelected?.[propertyURI].map((entry: any) =>
              typeof entry === 'string'
                ? {
                    label: entry,
                  }
                : {
                    label: entry.label,
                    meta: {
                      parentURI: entry.uri,
                      uri: entry.uri,
                      type,
                    },
                  },
            ),
          },
        }));

      base.set(uuid, {
        uuid,
        type,
        path: updatedPath,
        displayName: propertyLabel,
        uri: propertyURI,
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
            });
          });

          return;
        }
        case AdvancedFieldType.hidden:
        case AdvancedFieldType.dropdownOption:
        case AdvancedFieldType.block: {
          const { id, resourceURI, resourceLabel, propertyTemplates } = entry as ResourceTemplate;
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
            children: uuidArray,
          });

          propertyTemplates.map((entry, i) => {
            traverseProfile({
              entry,
              templates,
              uuid: uuidArray[i],
              path: updatedPath,
              base,
              selectedEntries,
              record: isRecordArray
                ? record.find(entry => Object.keys(entry).includes(resourceURI))?.[resourceURI]
                : record?.[resourceURI],
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
            constraints,
            children: uuidArray,
          });

          // TODO: how to avoid circular references when handling META | HIDE
          type !== AdvancedFieldType.group &&
            valueTemplateRefs.forEach((item, i) => {
              const entry = templates[item];

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
                record: isRecordArray
                  ? record.find(entry => Object.keys(entry).includes(propertyURI))?.[propertyURI]
                  : record?.[propertyURI],
              });
            });

          return;
        }
        default: {
          console.log('Not implemented.', entry);

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

    traverseProfile({
      entry: profile,
      uuid: initKey,
      templates,
      base,
      selectedEntries,
      record,
    });

    setInitialSchemaKey(initKey);
    setSelectedEntries(selectedEntries);
    setSchema(base);

    return base;
  };

  const getProfiles = async (record?: RecordEntry): Promise<any> => {
    const response = await fetchProfiles();
    // TODO: check a list of supported profiles
    const monograph = response.find(({ name }: ProfileEntry) => name === PROFILE_NAMES.MONOGRAPH);
    const templates = prepareFields(response);

    setProfiles(response);
    setSelectedProfile(monograph);
    // Purge user values
    setUserValues({});

    buildSchema(monograph, templates, record || {});

    return response;
  };

  return { getProfiles, prepareFields };
}
