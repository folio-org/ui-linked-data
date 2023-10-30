// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

import {
  COMPLEX_GROUPS,
  GROUPS_WITHOUT_ROOT_WRAPPER,
  GROUP_BY_LEVEL,
  LOOKUPS_WITH_SIMPLE_STRUCTURE,
  WRAPPERS_TO_HIDE_WHEN_DEPARSING,
} from '@common/constants/bibframe.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { generateAdvancedFieldObject, getAdvancedValuesField, getLookupLabelKey } from './schema.helper';

type TraverseSchema = {
  schema: Map<string, SchemaEntry>;
  userValues: UserValues;
  selectedEntries?: string[];
  container: Record<string, any>;
  key: string;
  index?: number;
  shouldHaveRootWrapper?: boolean;
};

const getNonArrayTypes = () => [AdvancedFieldType.hidden, AdvancedFieldType.dropdownOption, AdvancedFieldType.profile];

export const hasElement = (collection: string[], uri?: string) => !!uri && collection.includes(uri);

export const generateLookupValue = ({ uriBFLite, label, uri }: { uriBFLite?: string; label?: string; uri?: string }) =>
  LOOKUPS_WITH_SIMPLE_STRUCTURE.includes(uriBFLite as string)
    ? label
    : {
        [getLookupLabelKey(uriBFLite)]: [label],
        [BFLITE_URIS.LINK]: [uri],
      };

const traverseSchema = ({
  schema,
  userValues,
  selectedEntries = [],
  container,
  key,
  index = 0,
  shouldHaveRootWrapper = false,
}: TraverseSchema) => {
  const { children, uri, uriBFLite, bfid, type } = schema.get(key) || {};
  const uriSelector = uriBFLite || uri;
  const selector = uriSelector || bfid;
  const userValueMatch = userValues[key];
  const shouldProceed = Object.keys(userValues)
    .map(uuid => schema.get(uuid)?.path)
    .flat()
    .includes(key);

  const isArray = !getNonArrayTypes().includes(type as AdvancedFieldType);
  const isArrayContainer = !!selector && Array.isArray(container[selector]);

  if (userValueMatch && uri && selector) {
    const advancedValueField = getAdvancedValuesField(uriBFLite);

    const withFormat = userValueMatch.contents.map(({ label, meta: { uri, parentUri, type } = {} }) => {
      if ((parentUri || uri) && !advancedValueField) {
        return generateLookupValue({ uriBFLite, label, uri: parentUri || uri });
      } else if (advancedValueField) {
        return generateAdvancedFieldObject({ advancedValueField, label });
      } else {
        return type ? { label } : label;
      }
    });

    if (isArrayContainer && container[selector].length) {
      // Add duplicated group
      container[selector].push(...withFormat);
    } else {
      container[selector] = withFormat;
    }
  } else if (selector && (shouldProceed || index < GROUP_BY_LEVEL)) {
    let containerSelector: Record<string, any>;
    let hasRootWrapper = shouldHaveRootWrapper;

    const { profile: profileType, block, dropdownOption, groupComplex, hidden } = AdvancedFieldType;
    const isGroupWithoutRootWrapper = hasElement(GROUPS_WITHOUT_ROOT_WRAPPER, uri);

    if (type === profileType) {
      containerSelector = container;
    } else if (
      (type === block || hasElement(COMPLEX_GROUPS, uri) || shouldHaveRootWrapper) &&
      !WRAPPERS_TO_HIDE_WHEN_DEPARSING.includes(selector)
    ) {
      if (type === dropdownOption && !selectedEntries.includes(key)) {
        // Only fields from the selected option should be processed and saved
        return;
      }

      // Groups like "Provision Activity" don't have "block" wrapper,
      // their child elements like "dropdown options" are placed at the top level,
      // where any other blocks are placed.
      containerSelector = {};

      if (isArrayContainer) {
        // Add duplicated group
        container[selector].push(containerSelector);
      } else {
        container[selector] = type === block ? containerSelector : [containerSelector];
      }
    } else if (type === dropdownOption) {
      if (!selectedEntries.includes(key)) {
        // Only fields from the selected option should be processed and saved
        return;
      }

      containerSelector = {};
      container.push({ [selector]: containerSelector });
    } else if (isGroupWithoutRootWrapper || type === hidden || type === groupComplex) {
      // Some groups like "Provision Activity" should not have a root node,
      // and they put their children directly in the block node.
      containerSelector = container;

      if (isGroupWithoutRootWrapper) {
        hasRootWrapper = true;
      }
    } else {
      containerSelector = isArray ? [] : {};

      if (container[selector] && isArrayContainer) {
        // Add duplicated group
        containerSelector = container[selector];
      } else {
        container[selector] = containerSelector;
      }
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

export const filterUserValues = (userValues: UserValues) => {
  const filteredUserValues = {} as UserValues;

  const filteredValues = Object.values(userValues).filter(value => {
    if (!value.contents.length) return false;

    const filteredContents = value.contents.filter(content => content.label?.length);

    if (!filteredContents.length) return false;

    return true;
  });

  filteredValues.forEach(val => (filteredUserValues[val.uuid] = val));

  return filteredUserValues;
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

  const filteredValues = filterUserValues(userValues);
  const result: Record<string, any> = {};

  traverseSchema({ schema, userValues: filteredValues, selectedEntries, container: result, key: initKey });

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
  const isSelectedOptionInRecord = Array.isArray(record) ? record?.[0]?.[uri] : record?.[uri];
  let shouldSelectOption = false;

  if (dropdownOptionSelection?.hasNoRootWrapper) {
    const { isSelectedOption, setIsSelectedOption } = dropdownOptionSelection;

    shouldSelectOption = !isSelectedOption && isSelectedOptionInRecord;

    if (shouldSelectOption) {
      setIsSelectedOption?.(true);
    }
  } else {
    const shouldSelectFirstOption = (!record || dropdownOptionSelection?.hasNoRootWrapper) && firstOfSameType;

    shouldSelectOption = isSelectedOptionInRecord || shouldSelectFirstOption;
  }

  return shouldSelectOption;
};
