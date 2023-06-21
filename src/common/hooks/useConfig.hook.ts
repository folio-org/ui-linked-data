import { useSetRecoilState } from 'recoil';
import state from '../../state/state';
import { fetchProfiles, fetchStartingPoints, fetchUserInputScheme } from '../api/profiles.api';
import { getComponentType } from '../helpers/common.helper';
import { FieldType, PROFILE_NAMES, RESOURCE_TEMPLATE_IDS } from '../constants/bibframe.constants';
import { UIFieldRenderType } from '../constants/uiControls.constants';
import { generateGroupKey } from '../helpers/profileSchema.helper';

export default function useConfig() {
  const setProfiles = useSetRecoilState(state.config.profiles);
  const setStartingPoints = useSetRecoilState(state.config.startingPoints);
  const setSelectedProfile = useSetRecoilState(state.config.selectedProfile);
  const setUserInputScheme = useSetRecoilState(state.inputs.userInputScheme);
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

      fields = {
        ...fields,
        ...resourceTemplate,
      };

      return fields;
    }, {});

    setPreparedFields(preparedFields);

    return preparedFields;
  };

  const parseField = ({
    propertyTemplate,
    fields,
    parent,
    path,
    level,
    json,
  }: {
    propertyTemplate: PropertyTemplate;
    fields: PreparedFields;
    parent: RenderedFieldMap;
    path: string;
    level: number;
    json?: any;
  }) => {
    let pathToField = `${path}_${propertyTemplate.propertyLabel}`;
    const fieldType = getComponentType(propertyTemplate);
    // TODO: workaround and should be replaced with another unique identifier
    const key = generateGroupKey(propertyTemplate.propertyURI, parent, level);
    const groupMap: RenderedFieldMap = parent.get(key)?.fields ?? new Map();
    const groupJson = json?.[key];

    if (!groupMap.size) {
      parent.set(key, {
        type: (level === 1 ? UIFieldRenderType.group : fieldType) ?? FieldType.UNKNOWN,
        path: pathToField,
        fields: groupMap,
        name: propertyTemplate.propertyLabel,
      });
    }

    if (fieldType === FieldType.LITERAL || fieldType === FieldType.SIMPLE) {
      parent.set(key, {
        type: fieldType,
        path: pathToField,
        name: propertyTemplate.propertyLabel,
        uri: propertyTemplate.valueConstraint?.useValuesFrom[0],
        value: groupJson,
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
        value: isDropdown ? [groupJson?.[0].id] : undefined, // Dropdown always has only one answer
      });

      valueTemplateRefs.forEach(ref => {
        const resourceTemplate = fields[ref];
        pathToField = `${pathToField}_${resourceTemplate.resourceLabel}`;
        const fieldsMap: RenderedFieldMap = groupMap.get?.(resourceTemplate.resourceURI)?.fields ?? new Map();

        if (fieldsMap.size === 0) {
          groupMap.set?.(resourceTemplate.resourceURI, {
            fields: fieldsMap,
            name: resourceTemplate.resourceLabel,
            id: resourceTemplate.id,
            path: pathToField,
            type: isDropdown ? UIFieldRenderType.dropdownOption : UIFieldRenderType.hidden,
            uri: resourceTemplate.resourceURI,
          });
        }

        resourceTemplate.propertyTemplates.forEach(optionPropertyTemplate => {
          // For dropdown, Option has no value, only parent dropdown has this one, so json argument is undefined
          parseField({
            propertyTemplate: optionPropertyTemplate,
            fields,
            parent: fieldsMap,
            path: pathToField,
            level: level + 1,
            json: !isDropdown ? groupJson?.[0]?.[resourceTemplate.resourceURI] : undefined,
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
        value: groupJson,
      });
    }
  };

  const parseUserInputScheme = (scheme: any, fields: PreparedFields, selectedProfile: ProfileEntry): void => {
    // Going through all block that we need to render (work, instance, item)
    const schemeMap: RenderedFieldMap = new Map();
    const supportedEntries = Object.keys(RESOURCE_TEMPLATE_IDS);

    // Iterate on bibframe profiles and the user input scheme at the same time.
    selectedProfile?.json.Profile.resourceTemplates
      .filter(({ id }) => supportedEntries.includes(id))
      .forEach(({ id, resourceURI }) => {
        const block = fields[id]; // Data from the other profile
        const blockJson = scheme[resourceURI]; // Data from user input json
        const blockMap: RenderedFieldMap = new Map();

        schemeMap.set(block.resourceLabel, {
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
            json: blockJson,
          });
        });
      });

    setNormalizedFields(schemeMap);
  };

  const getUserInputScheme = async () => {
    const response = await fetchUserInputScheme();
    setUserInputScheme(response);

    return response;
  };

  const getProfiles = async (): Promise<any> => {
    const userInput = await getUserInputScheme();
    const response = await fetchProfiles();
    // TODO: check a list of supported profiles
    const monograph = response.find(({ name }: ProfileEntry) => name === PROFILE_NAMES.MONOGRAPH);

    setProfiles(response);
    setSelectedProfile(monograph);
    parseUserInputScheme(userInput, prepareFields(response), monograph);

    return response;
  };

  const getStartingPoints = async (): Promise<any> => {
    const response = await fetchStartingPoints();

    setStartingPoints(response);

    return response;
  };

  return { getProfiles, getStartingPoints, prepareFields };
}
