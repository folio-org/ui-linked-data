// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

import { hasGroupKey, parseGroupKey } from './profileSchema.helper';

export const getTitleFromId = (fieldId: string) => {
  const parts = fieldId.split('_');
  return parts[parts.length - 1];
};

const traverseSchema = async (
  schema: RenderedFieldMap,
  userValues: Array<UserValue>,
  container: Record<string, any>,
) => {
  if (!userValues.length || !schema.size) {
    return;
  }

  for (const [key, { path, fields }] of schema.entries()) {
    const userValueMatch = userValues.find(({ field }) => field === path);
    const parsedKey = hasGroupKey(key) ? parseGroupKey(key) : key;

    if (userValueMatch && !userValueMatch.hasChildren) {
      container[parsedKey] = userValueMatch.value.map(entry => (!entry.id && !entry.uri ? entry.label : entry));
    } else if (userValues.some(({ field, hasChildren }) => field.includes(path) && !hasChildren)) {
      container[parsedKey] = {};
      fields && traverseSchema(fields, userValues, container[key]);
    }
  }
};

export const applyUserValues = async (schema: RenderedFieldMap, userValues: Array<UserValue>) => {
  const result: Record<string, object> = {};
  const userValuesWithContent = userValues.filter(({ value }) => value.length);

  try {
    await traverseSchema(schema, userValuesWithContent, result);
  } catch (err) {
    console.error('Unable to traverse schema: ', err);
  }

  return result;
};
