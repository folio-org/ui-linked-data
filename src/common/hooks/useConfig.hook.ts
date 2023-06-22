import { useRecoilValue, useSetRecoilState } from 'recoil';
import state from '../../state/state';
import { fetchProfiles } from '../api/profiles.api';
import { getComponentType } from '../helpers/common.helper';
import { FieldType, PROFILE_NAMES, RESOURCE_TEMPLATE_IDS } from '../constants/bibframe.constants';
import { UIFieldRenderType } from '../constants/uiControls.constants';
import { generateGroupKey } from '../helpers/profileSchema.helper';

type IParseField = {
  propertyTemplate: PropertyTemplate;
  fields: PreparedFields;
  parent: RenderedFieldMap;
  path: string;
  level: number;
  userValue?: Record<string, any>;
};

const TEMPORARY_FALLBACK_RECORD: Record<string, string | Array<any>> = {
  profile: 'lc:profile:bf2:Monograph',
  'http://id.loc.gov/ontologies/bibframe/Work': [{}],
  'http://id.loc.gov/ontologies/bibframe/Instance': [{}],
  'http://id.loc.gov/ontologies/bibframe/Item': [{}],
};

// TODO: split & naming
export default function useConfig() {
  const setProfiles = useSetRecoilState(state.config.profiles);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const setUserValues = useSetRecoilState(state.inputs.userValues);
  const userRecord = useRecoilValue(state.inputs.record);
  const setPreparedFields = useSetRecoilState(state.config.preparedFields);
  const setNormalizedFields = useSetRecoilState(state.config.normalizedFields);

  const prepareFields = (profiles: ProfileEntry[]): PreparedFields => {
    const preparedFields = profiles.reduce<PreparedFields>((fields, profile) => {
      const resourceTemplate = profile.json.Profile.resourceTemplates.reduce<PreparedFields>(
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

  const parseField = ({ propertyTemplate, fields, parent, path, level, userValue }: IParseField) => {
    let pathToField = `${path}_${propertyTemplate.propertyLabel}`;
    const fieldType = getComponentType(propertyTemplate);

    // TODO: workaround and should be replaced with another unique identifier
    const key = generateGroupKey(propertyTemplate.propertyURI, parent, level);
    const groupMap: RenderedFieldMap = parent.get(key)?.fields ?? new Map();
    const groupJson = userValue?.[key];

    if (!groupMap.size) {
      parent.set(key, {
        type: (level === 1 ? UIFieldRenderType.group : fieldType) ?? FieldType.UNKNOWN,
        path: pathToField,
        fields: groupMap,
        name: propertyTemplate.propertyLabel,
      });
    }

    if (fieldType === FieldType.LITERAL || fieldType === FieldType.SIMPLE) {
      const withFormat = groupJson?.map((item: any) => {
        return item.id || item.label || item.uri
          ? item
          : {
              id: null,
              uri: null,
              label: item,
            };
      });

      parent.set(key, {
        type: fieldType,
        path: pathToField,
        name: propertyTemplate.propertyLabel,
        uri: propertyTemplate.valueConstraint?.useValuesFrom[0],
        value: withFormat,
      });
    } else if (fieldType === FieldType.REF) {
      const { valueTemplateRefs } = propertyTemplate.valueConstraint;

      if (valueTemplateRefs.length <= 0) {
        return;
      }

      // Dropdown and nested groups
      const isDropdown = valueTemplateRefs.length > 1;

      parent.set(key, {
        type: isDropdown ? UIFieldRenderType.dropdown : UIFieldRenderType.groupComplex,
        path: pathToField,
        fields: groupMap,
        name: propertyTemplate.propertyLabel,
        value: isDropdown ? [groupJson?.[0]?.id] : undefined, // Dropdown always has only one answer
      });

      valueTemplateRefs.forEach(ref => {
        const { propertyTemplates, resourceLabel, resourceURI, id } = fields[ref];
        pathToField = `${pathToField}_${resourceLabel}`;
        const fieldsMap: RenderedFieldMap = groupMap.get?.(resourceURI)?.fields ?? new Map();

        // find the matching entry in the groupJson array
        // TODO: might fail in case of duplicate input fields ([{val}, {val}]); need to loop
        const matchingEntry = groupJson?.find((entry: any) => Object.keys(entry).includes(resourceURI))?.[resourceURI];

        if (fieldsMap.size === 0) {
          groupMap.set?.(resourceURI, {
            fields: fieldsMap,
            name: resourceLabel,
            id: id,
            path: pathToField,
            type: isDropdown ? UIFieldRenderType.dropdownOption : UIFieldRenderType.hidden,
            uri: resourceURI,
          });
        }

        propertyTemplates.forEach(optionPropertyTemplate => {
          // For dropdown, Option has no value, only parent dropdown has this one, so json argument is undefined
          const optionFieldType = getComponentType(optionPropertyTemplate);
          const isComplexField = optionFieldType === FieldType.COMPLEX;
          let updatedUserValue = matchingEntry;

          if (!isDropdown) {
            updatedUserValue = groupJson?.[0]?.[resourceURI];
          } else if (isComplexField) {
            updatedUserValue = groupJson?.[resourceURI];
          }

          parseField({
            propertyTemplate: optionPropertyTemplate,
            fields,
            parent: fieldsMap,
            path: pathToField,
            level: level + 1,
            userValue: updatedUserValue,
          });
        });
      });
    } else if (fieldType === FieldType.COMPLEX) {
      // TODO: define required fields and values for Complex field
      parent.set(propertyTemplate.propertyURI, {
        type: fieldType,
        path: pathToField,
        fields: groupMap,
        name: propertyTemplate.propertyLabel,
        value: userValue?.[propertyTemplate.propertyURI],
      });
    }
  };

  const parseRecord = (record: any, fields: PreparedFields, selectedProfile: ProfileEntry): void => {
    // Going through all block that we need to render (work, instance, item)
    const schemeMap: RenderedFieldMap = new Map();
    const supportedEntries = Object.keys(RESOURCE_TEMPLATE_IDS);

    // Iterate on bibframe profiles and the user input scheme at the same time.
    selectedProfile?.json.Profile.resourceTemplates
      .filter(({ id }) => supportedEntries.includes(id))
      .forEach(({ id, resourceURI }) => {
        const block = fields[id]; // Data from the other profile
        const blockMap: RenderedFieldMap = new Map();

        // TODO: why do we use user record as the base for iteration? It can be empty
        (record[resourceURI] || TEMPORARY_FALLBACK_RECORD[resourceURI])?.forEach((entry: Record<string, any>) => {
          schemeMap.set(block.resourceURI, {
            type: UIFieldRenderType.block,
            fields: blockMap,
            path: block.resourceLabel,
          });

          block.propertyTemplates.forEach(propertyTemplate => {
            parseField({
              propertyTemplate,
              fields,
              parent: blockMap,
              path: block.resourceLabel,
              level: 1,
              userValue: entry,
            });
          });
        });
      });

    setNormalizedFields(schemeMap);
  };

  const getProfiles = async (): Promise<any> => {
    const response = await fetchProfiles();
    // TODO: check a list of supported profiles
    const monograph = response.find(({ name }: ProfileEntry) => name === PROFILE_NAMES.MONOGRAPH);

    setProfiles(response);
    setSelectedProfile(monograph);
    // Purge user values
    setUserValues([]);
    parseRecord(userRecord, prepareFields(response), monograph);

    return response;
  };

  return { getProfiles, prepareFields };
}
