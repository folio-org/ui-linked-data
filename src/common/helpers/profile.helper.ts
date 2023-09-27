// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

import {
  COMPLEX_GROUPS,
  GROUPS_WITHOUT_ROOT_WRAPPER,
  GROUP_BY_LEVEL,
  LOOKUPS_WITH_SIMPLE_STRUCTURE,
} from '@common/constants/bibframe.constants';
import { BFLITE_URIS, BF_URIS } from '@common/constants/bibframeMapping.constants';
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
  shouldHaveRootWrapper?: boolean;
};

const getNonArrayTypes = () => {
  const nonArrayTypes = [AdvancedFieldType.hidden, AdvancedFieldType.dropdownOption, AdvancedFieldType.profile];

  if (!IS_NEW_API_ENABLED) {
    nonArrayTypes.push(AdvancedFieldType.block);
  }

  return nonArrayTypes;
};

export const hasElement = (collection: string[], uri?: string) => !!uri && collection.includes(uri);

export const generateLookupValue = ({
  uriBFLite,
  label,
  uri,
  bfLabel,
}: {
  uriBFLite?: string;
  label?: string;
  uri?: string;
  bfLabel?: string;
}) => {
  // TODO: workaround for the agreed API schema, not the best ?
  let value: LookupValue = {
    id: null,
    label,
    uri,
  };

  if (IS_NEW_API_ENABLED) {
    value = LOOKUPS_WITH_SIMPLE_STRUCTURE.includes(uriBFLite as string)
      ? label
      : {
          [getLookupLabelKey(uriBFLite)]: [label],
          [BFLITE_URIS.LINK]: [uri],
        };

    if (typeof value === 'object' && bfLabel) {
      value[BF_URIS.LABEL] = bfLabel;
    }
  }

  return value;
};

export const enrichContainerSelectorWithLabel = (
  type: AdvancedFieldType,
  userValueMatch: UserValue,
  containerSelector: Record<string, any>,
) => {
  const userValueContent = userValueMatch?.contents[0];
  const generatedLabel = userValueContent?.meta?.type === type ? userValueContent.label : undefined;

  if (containerSelector && generatedLabel) {
    containerSelector[BF_URIS.LABEL] = generatedLabel;
  }
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
  const uriSelector = IS_NEW_API_ENABLED ? uriBFLite || uri : uri;
  const selector = uriSelector || bfid;
  const userValueMatch = userValues[key];
  const shouldProceed = Object.keys(userValues)
    .map(uuid => schema.get(uuid)?.path)
    .flat()
    .includes(key);

  const isArray = !getNonArrayTypes().includes(type as AdvancedFieldType);
  const isMetaType = userValueMatch?.contents?.some(
    ({ meta }) => meta?.type === AdvancedFieldType.dropdownOption || meta?.type === AdvancedFieldType.hidden,
  );

  if (userValueMatch && uri && selector && !isMetaType) {
    const withFormat = userValueMatch.contents.map(({ label, meta: { uri, parentUri, type, bfLabel } = {} }) => {
      if (parentUri || uri) {
        return generateLookupValue({ uriBFLite, label, uri: parentUri || uri, bfLabel });
      } else {
        return type ? { label } : label;
      }
    });

    container[selector] = withFormat;
  } else if (selector && (shouldProceed || index < GROUP_BY_LEVEL)) {
    let containerSelector: Record<string, any>;
    let hasRootWrapper = shouldHaveRootWrapper;

    const { profile: profileType, block, dropdownOption, groupComplex, hidden } = AdvancedFieldType;

    if (IS_NEW_API_ENABLED) {
      const isGroupWithoutRootWrapper = hasElement(GROUPS_WITHOUT_ROOT_WRAPPER, uri);

      if (type === profileType) {
        containerSelector = container;
      } else if (type === block || hasElement(COMPLEX_GROUPS, uri) || shouldHaveRootWrapper) {
        if (type === dropdownOption && !selectedEntries.includes(key)) {
          // Only fields from the selected option should be processed and saved
          return;
        }

        // Groups like "Provision Activity" don't have "block" wrapper,
        // their child elements like "dropdown options" are placed at the top level,
        // where any other blocks are placed.
        containerSelector = {};
        container[selector] = type === block ? containerSelector : [containerSelector];
      } else if (type === dropdownOption) {
        if (!selectedEntries.includes(key)) {
          // Only fields from the selected option should be processed and saved
          return;
        }

        containerSelector = {};
        enrichContainerSelectorWithLabel(AdvancedFieldType.dropdownOption, userValueMatch, containerSelector);

        container.push({ [selector]: containerSelector });
      } else if (isGroupWithoutRootWrapper || type === hidden || type === groupComplex) {
        // Some groups like "Provision Activity" should not have a root node,
        // and they put their children directly in the block node.
        containerSelector = container;
        enrichContainerSelectorWithLabel(AdvancedFieldType.hidden, userValueMatch, containerSelector);

        if (isGroupWithoutRootWrapper) {
          hasRootWrapper = true;
        }
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

  if (IS_NEW_API_ENABLED && dropdownOptionSelection?.hasNoRootWrapper) {
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
