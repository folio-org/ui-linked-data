// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

import { GROUPS_WITHOUT_ROOT_WRAPPER, GROUP_BY_LEVEL, PROFILE_URIS } from '@common/constants/bibframe.constants';
import { BFLITE_LABELS_MAP, BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { IS_NEW_API_ENABLED } from '@common/constants/feature.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';

type TraverseSchema = {
  schema: Map<string, SchemaEntry>;
  userValues: UserValues;
  container: Record<string, any>;
  key: string;
  index?: number;
  profile?: string;
  shouldHaveRootWrapper?: boolean;
};

const getNonArrayTypes = () => {
  const nonArrayTypes = [AdvancedFieldType.hidden, AdvancedFieldType.dropdownOption, AdvancedFieldType.profile];

  if (!IS_NEW_API_ENABLED) {
    nonArrayTypes.push(AdvancedFieldType.block);
  }

  return nonArrayTypes;
};

export const hasNoRootElement = (uri: string | undefined) => !!uri && GROUPS_WITHOUT_ROOT_WRAPPER.includes(uri);

export const getLookupLabelKey = (uriBFLite: string | undefined) => {
  const typedUriBFLite = uriBFLite as keyof typeof BFLITE_LABELS_MAP;

  return uriBFLite ? BFLITE_LABELS_MAP[typedUriBFLite] : BFLITE_URIS.TERM;
};

const generateLookupValue = (uriBFLite?: string, label?: string, uri?: string) => {
  const keyName = getLookupLabelKey(uriBFLite);

  return IS_NEW_API_ENABLED
    ? {
        [keyName]: [label],
        [BFLITE_URIS.LINK]: [uri],
      }
    : // TODO: workaround for the agreed API schema, not the best ?
      {
        id: null,
        label,
        uri,
      };
};

const traverseSchema = ({
  schema,
  userValues,
  container,
  key,
  index = 0,
  profile = PROFILE_URIS.MONOGRAPH,
  shouldHaveRootWrapper = false,
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
      if (parentUri || uri) {
        return generateLookupValue(uriBFLite, label, parentUri || uri);
      } else {
        return type ? { label } : label;
      }
    });

    container[selector] = withFormat;
  } else if (selector && (shouldProceed || index < GROUP_BY_LEVEL)) {
    let containerSelector: Record<string, any>;
    let hasRootWrapper = shouldHaveRootWrapper;

    const { profile: profileType, block, dropdown, dropdownOption } = AdvancedFieldType;

    if (IS_NEW_API_ENABLED) {
      if (type === profileType) {
        container.type = profile;
        containerSelector = container;
      } else if (type === block) {
        containerSelector = {};
        container[selector] = [containerSelector];
      } else if (type === dropdown && !hasNoRootElement(uri)) {
        containerSelector = [];
        container[selector] = containerSelector;
      } else if (type === dropdownOption && !shouldHaveRootWrapper) {
        containerSelector = {};
        container.push({ [selector]: containerSelector });
      } else if (hasNoRootElement(uri)) {
        containerSelector = container;
        hasRootWrapper = true;
      } else if (shouldHaveRootWrapper) {
        containerSelector = {};
        container[selector] = [containerSelector];
      } else {
        containerSelector = isArray ? [] : {};
        container[selector] = containerSelector;
      }
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
        shouldHaveRootWrapper: hasRootWrapper,
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

export const shouldSelectDropdownOption = ({
  uri,
  record,
  firstOfSameType,
  dropdownOptionSelection,
}: {
  uri: string;
  record?: Record<string, any> | Array<any>;
  firstOfSameType?: boolean;
  dropdownOptionSelection?: DropdownOptionSelection;
}) => {
  // Copied from useConfig.hook.ts:
  // TODO: Potentially dangerous HACK ([0])
  // Might be removed with the API schema change
  // If not, refactor to include all indices
  const isSelectedOptionInRecord = Array.isArray(record) && record?.[0]?.[uri];

  if (dropdownOptionSelection?.hasNoRootWrapper) {
    const { isSelectedOption, setIsSelectedOption } = dropdownOptionSelection;

    if (!isSelectedOption && isSelectedOptionInRecord) {
      setIsSelectedOption?.(true);

      return true;
    } else {
      return false;
    }
  } else {
    const shouldSelectFirstOption = (!record || dropdownOptionSelection?.hasNoRootWrapper) && firstOfSameType;

    return isSelectedOptionInRecord || shouldSelectFirstOption;
  }
};
