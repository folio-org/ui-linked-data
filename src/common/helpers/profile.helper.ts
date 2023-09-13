// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

import {
  GROUPS_WITHOUT_ROOT_WRAPPER,
  GROUP_BY_LEVEL,
  LOOKUPS_WITH_SIMPLE_STRUCTURE,
  PROFILE_URIS,
} from '@common/constants/bibframe.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { IS_NEW_API_ENABLED } from '@common/constants/feature.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { getLookupLabelKey } from './schema.helper';

type TraverseSchema = {
  schema: Map<string, SchemaEntry>;
  userValues: UserValues;
  selectedEntries?: string[];
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

const hasNoRootElement = (uri: string | undefined) => !!uri && GROUPS_WITHOUT_ROOT_WRAPPER.includes(uri);

const generateLookupValue = (uriBFLite?: string, label?: string, uri?: string) => {
  const keyName = getLookupLabelKey(uriBFLite);
  let value;

  if (IS_NEW_API_ENABLED) {
    if (LOOKUPS_WITH_SIMPLE_STRUCTURE.includes(uriBFLite as string)) {
      value = label;
    } else {
      value = {
        [keyName]: [label],
        [BFLITE_URIS.LINK]: [uri],
      };
    }
  } else {
    // TODO: workaround for the agreed API schema, not the best ?
    value = {
      id: null,
      label,
      uri,
    };
  }

  return value;
};

const traverseSchema = ({
  schema,
  userValues,
  selectedEntries = [],
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

    const { profile: profileType, block, dropdownOption } = AdvancedFieldType;

    if (IS_NEW_API_ENABLED) {
      if (type === profileType) {
        container.type = profile;
        containerSelector = container;
      } else if (type === block || shouldHaveRootWrapper) {
        if (type === dropdownOption && !selectedEntries.includes(key)) {
          // Only fields from the selected option should be processed and saved
          return;
        }

        // Groups like "Provision Activity" don't have "block" wrapper,
        // their child elements like "dropdown options" are placed at the top level,
        // where any other blocks are placed.
        containerSelector = {};
        container[selector] = [containerSelector];
      } else if (type === dropdownOption) {
        if (!selectedEntries.includes(key)) {
          // Only fields from the selected option should be processed and saved
          return;
        }

        containerSelector = {};
        container.push({ [selector]: containerSelector });
      } else if (hasNoRootElement(uri)) {
        // Some groups like "Provision Activity" should not have a root node,
        // and they put their children directly in the block node
        containerSelector = container;
        hasRootWrapper = true;
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
        selectedEntries,
        container: containerSelector,
        key: uuid,
        index: index + 1,
        shouldHaveRootWrapper: hasRootWrapper,
      }),
    );
  }
};

export const applyUserValues = (
  schema: Map<string, SchemaEntry>,
  initKey: string | null,
  userInput: {
    userValues: UserValues;
    selectedEntries: string[];
  },
) => {
  const { userValues, selectedEntries } = userInput;

  if (!Object.keys(userValues).length || !schema.size || !initKey) {
    return;
  }

  const result: Record<string, any> = {};

  traverseSchema({ schema, userValues, selectedEntries, container: result, key: initKey });

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
  let shouldSelectOption = false;

  if (dropdownOptionSelection?.hasNoRootWrapper) {
    const { isSelectedOption, setIsSelectedOption } = dropdownOptionSelection;

    if (!isSelectedOption && isSelectedOptionInRecord) {
      setIsSelectedOption?.(true);

      shouldSelectOption = true;
    } else {
      shouldSelectOption = false;
    }
  } else {
    const shouldSelectFirstOption = (!record || dropdownOptionSelection?.hasNoRootWrapper) && firstOfSameType;

    shouldSelectOption = isSelectedOptionInRecord || shouldSelectFirstOption;
  }

  return shouldSelectOption;
};
