import { GROUP_KEY_SEPARATOR, GROUP_KEY_SUFFIX } from '../constants/profileSchema.constants';

export const generateGroupKey = (defaultKey: string, parentGroup: RenderedFieldMap, level: number) => {
  let key = defaultKey;

  if (level === 1 && parentGroup.get(key)) {
    const index = Array.from(parentGroup.keys()).filter(groupKey => groupKey === key)?.length;

    key = `${key}${GROUP_KEY_SEPARATOR}${GROUP_KEY_SUFFIX}${index}`;
  }

  return key;
};

export const parseGroupKey = (key: string) => key.split(GROUP_KEY_SEPARATOR)[0];
