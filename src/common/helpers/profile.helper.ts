// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

import { GROUP_BY_LEVEL } from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';

type TraverseSchema = {
  schema: Map<string, SchemaEntry>;
  userValues: UserValues;
  container: Record<string, any>;
  key: string;
  index?: number;
};

const traverseSchema = ({
  schema,
  userValues,
  container,
  key,
  index = 0,
}: TraverseSchema) => {
  const { children, uri, bfid, type } = schema.get(key) || {}
  const selector = uri || bfid;
  const userValueMatch = userValues[key];
  const shouldProceed = Object.keys(userValues).map((uuid) => schema.get(uuid)?.path).flat().includes(key);
  const isArray = ![
    AdvancedFieldType.block,
    AdvancedFieldType.hidden,
    AdvancedFieldType.dropdownOption,
    AdvancedFieldType.profile,
  ].includes(type as AdvancedFieldType);

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
    container[selector] = isArray ? (shouldProceed ? [{}] : []) : {};
    const containerSelector = isArray ? container[selector].at(-1) : container[selector];

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
