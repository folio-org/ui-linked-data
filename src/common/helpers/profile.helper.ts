// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

import { GROUP_BY_LEVEL, PROFILE_URIS } from '@common/constants/bibframe.constants';
import { IS_NEW_API_ENABLED } from '@common/constants/feature.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';

type TraverseSchema = {
  schema: Map<string, SchemaEntry>;
  userValues: UserValues;
  container: Record<string, any>;
  key: string;
  index?: number;
  profile?: string;
};

const getNonArrayTypes = () => {
  const nonArrayTypes = [AdvancedFieldType.hidden, AdvancedFieldType.dropdownOption, AdvancedFieldType.profile];

  if (!IS_NEW_API_ENABLED) {
    nonArrayTypes.push(AdvancedFieldType.block);
  }

  return nonArrayTypes;
};

const traverseSchema = ({
  schema,
  userValues,
  container,
  key,
  index = 0,
  profile = PROFILE_URIS.MONOGRAPH,
}: TraverseSchema) => {
  const { children, uri, uriBFLite, bfid, type } = schema.get(key) || {};
  const uriSelector = IS_NEW_API_ENABLED ? uriBFLite || uri : uri;
  const selector = uriSelector || bfid;
  const userValueMatch = userValues[key];
  const shouldProceed = Object.keys(userValues)
    .map(uuid => schema.get(uuid)?.path)
    .flat()
    .includes(key);

  const isArray = !getNonArrayTypes().includes(type as AdvancedFieldType);

  if (userValueMatch && uri && selector) {
    const withFormat = userValueMatch.contents.map(({ label, meta: { uri, parentUri, type } = {} }) => {
      if (parentUri) {
        // TODO: workaround for the agreed API schema, not the best ?
        return {
          id: null,
          label,
          uri: parentUri,
        };
      } else if (uri) {
        return {
          id: null,
          label,
          uri,
        };
      } else {
        return type ? { label } : label;
      }
    });

    container[selector] = withFormat;
  } else if (selector && (shouldProceed || index < GROUP_BY_LEVEL)) {
    let containerSelector: Record<string, any>;

    if (IS_NEW_API_ENABLED && type === AdvancedFieldType.profile) {
      container.type = profile;
      containerSelector = container;
    } else {
      container[selector] = isArray ? (shouldProceed ? [{}] : []) : {};
      containerSelector = isArray ? container[selector].at(-1) : container[selector];
    }

    children?.forEach(uuid =>
      traverseSchema({
        schema,
        userValues,
        container: containerSelector,
        key: uuid,
        index: index + 1,
      }),
    );
  }
};

export const applyUserValues = (schema: Map<string, SchemaEntry>, userValues: UserValues, initKey: string | null) => {
  if (!Object.keys(userValues).length || !schema.size || !initKey) {
    return;
  }

  const result: Record<string, any> = {};

  traverseSchema({ schema, userValues, container: result, key: initKey });

  return result;
};

export const shouldSelectDropdownOption = (
  resourceURI: string,
  record?: Record<string, any> | Array<any>,
  firstOfSameType?: boolean,
) => {
  const shouldSelectFirstOption = !record && firstOfSameType;
  // Copied from useConfig.hook.ts:
  // TODO: Potentially dangerous HACK ([0])
  // Might be removed with the API schema change
  // If not, refactor to include all indices
  const isSelectedOptionInRecord = Array.isArray(record) && record?.[0]?.[resourceURI];

  return isSelectedOptionInRecord || shouldSelectFirstOption;
};
