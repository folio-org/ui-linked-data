// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

import {
  COMPLEX_GROUPS,
  FORCE_INCLUDE_WHEN_DEPARSING,
  GROUPS_WITHOUT_ROOT_WRAPPER,
  GROUP_BY_LEVEL,
  IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION,
  LOOKUPS_WITH_SIMPLE_STRUCTURE,
  NONARRAY_DROPDOWN_OPTIONS,
  FORCE_EXCLUDE_WHEN_DEPARSING,
  IDENTIFIER_AS_VALUE,
} from '@common/constants/bibframe.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { generateAdvancedFieldObject, getAdvancedValuesField, getLookupLabelKey } from './schema.helper';
import { checkIdentifierAsValue } from '@common/helpers/record.helper';

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

export const generateLookupValue = ({
  uriBFLite,
  label,
  uri,
  type,
}: {
  uriBFLite?: string;
  label?: string;
  uri?: string;
  type?: AdvancedFieldType;
}) =>
  LOOKUPS_WITH_SIMPLE_STRUCTURE.includes(uriBFLite as string) || type === AdvancedFieldType.complex
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
        return generateLookupValue({ uriBFLite, label, uri: parentUri || uri, type: type as AdvancedFieldType });
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
    const identifierAsValueSelection = IDENTIFIER_AS_VALUE[selector];

    if (type === profileType) {
      containerSelector = container;
    } else if (
      (type === block ||
        hasElement(COMPLEX_GROUPS, uri) ||
        shouldHaveRootWrapper ||
        (FORCE_INCLUDE_WHEN_DEPARSING.includes(selector) && type !== hidden)) &&
      !FORCE_EXCLUDE_WHEN_DEPARSING.includes(selector)
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

      if (NONARRAY_DROPDOWN_OPTIONS.includes(selector)) {
        container[selector] = containerSelector;
      } else if (identifierAsValueSelection) {
        containerSelector = {
          [identifierAsValueSelection.field]: [identifierAsValueSelection.value],
        };

        container.push(containerSelector);
      } else {
        container.push({ [selector]: containerSelector });
      }
    } else if (
      isGroupWithoutRootWrapper ||
      type === hidden ||
      type === groupComplex ||
      IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION.includes(selector)
    ) {
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

export const filterUserValues = (userValues: UserValues) =>
  Object.values(userValues).reduce((accum, current) => {
    const { contents, uuid } = current;

    if (!contents.length) return accum;

    const filteredContents = contents.filter(({ label }) => label?.length);

    if (!filteredContents.length) return accum;

    accum[uuid] = { ...current, contents: filteredContents };

    return accum;
  }, {} as UserValues);

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
  const identifierAsValueSelection = record && checkIdentifierAsValue(record as Record<string, string[]>, uri);
  let shouldSelectOption = false;

  if (dropdownOptionSelection?.hasNoRootWrapper) {
    const { isSelectedOption, setIsSelectedOption } = dropdownOptionSelection;

    shouldSelectOption = !isSelectedOption && isSelectedOptionInRecord;

    if (shouldSelectOption) {
      setIsSelectedOption?.(true);
    }
  } else if (identifierAsValueSelection) {
    shouldSelectOption = true;
  } else {
    const shouldSelectFirstOption = (!record || dropdownOptionSelection?.hasNoRootWrapper) && firstOfSameType;

    shouldSelectOption = isSelectedOptionInRecord || shouldSelectFirstOption;
  }

  return shouldSelectOption;
};
