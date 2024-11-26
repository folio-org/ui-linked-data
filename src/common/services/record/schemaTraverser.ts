import {
  COMPLEX_GROUPS,
  FORCE_EXCLUDE_WHEN_DEPARSING,
  FORCE_INCLUDE_WHEN_DEPARSING,
  GROUP_BY_LEVEL,
  GROUPS_WITHOUT_ROOT_WRAPPER,
  IDENTIFIER_AS_VALUE,
  IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION,
  KEEP_VALUE_AS_IS,
  NONARRAY_DROPDOWN_OPTIONS,
  OUTGOING_RECORD_IDENTIFIERS_TO_SWAP,
} from '@common/constants/bibframe.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { generateLookupValue, hasElement } from '@common/helpers/profile.helper';
import {
  generateAdvancedFieldObject,
  checkGroupIsNonBFMapped,
  selectNonBFMappedGroupData,
  getAdvancedValuesField,
} from '@common/helpers/schema.helper';
import { Container, InitSchemaParams, ISchemaTraverser, TraverseSchemaParams } from './schemaTraverser.interface';

export class SchemaTraverser implements ISchemaTraverser {
  private schema: Map<string, SchemaEntry>;
  private userValues: UserValues;
  private selectedEntries: string[];
  private initialContainer: Container;

  constructor() {
    this.schema = new Map();
    this.userValues = {};
    this.selectedEntries = [];
    this.initialContainer = {};
  }

  public init({ schema, userValues, selectedEntries, initialContainer }: InitSchemaParams) {
    this.schema = schema;
    this.userValues = userValues;
    this.selectedEntries = selectedEntries;
    this.initialContainer = initialContainer;

    return this;
  }

  public traverse({
    container,
    key,
    index = 0,
    shouldHaveRootWrapper = false,
    parentEntryType,
    nonBFMappedGroup,
  }: TraverseSchemaParams) {
    const initialContainer = container ?? this.initialContainer;
    const { children, uri, uriBFLite, bfid, type } = this.schema.get(key) || {};
    const selector = this.getSelector(uri, uriBFLite, bfid);
    const userValueMatch = this.userValues[key];
    const shouldProceed = this.shouldProceed(key);

    const isArray = this.isArray(type as AdvancedFieldType);
    const isArrayContainer = this.isArrayContainer(initialContainer, selector);
    let updatedNonBFMappedGroup = nonBFMappedGroup;

    if (this.checkGroupIsNonBFMapped(uri as string, parentEntryType as AdvancedFieldType, type as AdvancedFieldType)) {
      const { nonBFMappedGroup: generatedNonBFMappedGroup } = selectNonBFMappedGroupData({
        propertyURI: uri as string,
        type: type as AdvancedFieldType,
        parentEntryType: parentEntryType as AdvancedFieldType,
      });

      if (generatedNonBFMappedGroup) {
        updatedNonBFMappedGroup = generatedNonBFMappedGroup as NonBFMappedGroup;
      }
    }

    if (this.hasUserValueAndSelector(userValueMatch, uri, selector)) {
      this.handleUserValueMatch({
        userValueMatch,
        uriBFLite,
        selector: selector as string,
        isArrayContainer,
        nonBFMappedGroup: updatedNonBFMappedGroup,
        container: initialContainer,
      });
    } else if (this.shouldContinueGroupTraverse(shouldProceed, index, selector)) {
      this.handleGroupTraverse({
        container: initialContainer,
        key,
        index,
        type: type as AdvancedFieldType,
        selector: selector as string,
        uri: uri as string,
        shouldHaveRootWrapper,
        updatedNonBFMappedGroup,
        isArrayContainer,
        isArray,
        children,
      });
    }
  }

  private getNonArrayTypes() {
    const { hidden, dropdownOption, profile } = AdvancedFieldType;

    return [hidden, dropdownOption, profile];
  }

  private getSelector(uri: string | undefined, uriBFLite: string | undefined, bfid: string | undefined) {
    const uriSelector = uriBFLite ?? uri;
    return (uriSelector && OUTGOING_RECORD_IDENTIFIERS_TO_SWAP[uriSelector]) || uriSelector || bfid;
  }

  private shouldProceed(key: string) {
    return Object.keys(this.userValues)
      .map(uuid => this.schema.get(uuid)?.path)
      .flat()
      .includes(key);
  }

  private isArray(type: AdvancedFieldType) {
    return !this.getNonArrayTypes().includes(type);
  }

  private isArrayContainer(container: Container, selector: string | undefined) {
    return !!selector && Array.isArray(container[selector]);
  }

  private checkGroupIsNonBFMapped(uri: string, parentEntryType: AdvancedFieldType, type: AdvancedFieldType) {
    return checkGroupIsNonBFMapped({
      propertyURI: uri,
      parentEntryType,
      type,
    });
  }

  private checkGroupShouldHaveWrapper({
    type,
    uri,
    nonBFMappedGroup,
    shouldHaveRootWrapper,
    selector,
  }: {
    type: AdvancedFieldType;
    uri: string;
    nonBFMappedGroup?: NonBFMappedGroup;
    shouldHaveRootWrapper: boolean;
    selector: string;
  }) {
    const { block, groupComplex, hidden } = AdvancedFieldType;

    return (
      (type === block ||
        (type === groupComplex && hasElement(COMPLEX_GROUPS, uri)) ||
        (type === groupComplex && nonBFMappedGroup) ||
        shouldHaveRootWrapper ||
        (FORCE_INCLUDE_WHEN_DEPARSING.includes(selector) && type !== hidden)) &&
      !FORCE_EXCLUDE_WHEN_DEPARSING.includes(selector)
    );
  }

  private shouldContinueGroupTraverse(shouldProceed: boolean, index: number, selector?: string) {
    return selector && (shouldProceed || index < GROUP_BY_LEVEL);
  }

  private hasUserValueAndSelector(userValueMatch: UserValue, uri?: string, selector?: string) {
    return !!(userValueMatch && uri && selector);
  }

  private checkDropdownOptionWithoutUserValues(type: AdvancedFieldType, key: string) {
    return type === AdvancedFieldType.dropdownOption && !this.selectedEntries.includes(key);
  }

  private checkEntryWithoutWrapper(isGroupWithoutRootWrapper: boolean, type: AdvancedFieldType, selector: string) {
    return (
      isGroupWithoutRootWrapper ||
      type === AdvancedFieldType.hidden ||
      type === AdvancedFieldType.groupComplex ||
      IGNORE_HIDDEN_PARENT_OR_RECORD_SELECTION.includes(selector)
    );
  }

  private handleUserValueMatch({
    userValueMatch,
    uriBFLite,
    selector,
    isArrayContainer,
    nonBFMappedGroup,
    container,
  }: {
    userValueMatch: UserValue;
    uriBFLite: string | undefined;
    selector: string;
    isArrayContainer: boolean;
    nonBFMappedGroup: NonBFMappedGroup | undefined;
    container: Container;
  }) {
    const advancedValueField = getAdvancedValuesField(uriBFLite);

    const withFormat = userValueMatch.contents.map(
      ({ id, label, meta: { uri, parentUri, type, basicLabel, srsId } = {} }) => {
        if (KEEP_VALUE_AS_IS.includes(selector) || type === AdvancedFieldType.complex) {
          return { id, label, srsId };
        } else if (
          ((parentUri || uri) && (!advancedValueField || nonBFMappedGroup)) ||
          type === AdvancedFieldType.simple
        ) {
          return generateLookupValue({
            uriBFLite,
            label,
            basicLabel,
            uri: uri ?? parentUri,
            type: type as AdvancedFieldType,
            nonBFMappedGroup,
          });
        } else if (advancedValueField) {
          return generateAdvancedFieldObject({ advancedValueField, label });
        } else {
          return type ? { label } : label;
        }
      },
    );

    if (isArrayContainer && container[selector].length) {
      // Add duplicated group
      container[selector].push(...withFormat);
    } else {
      container[selector] = withFormat;
    }
  }

  private handleGroupsWithWrapper({
    isArrayContainer,
    container,
    selector,
    type,
  }: {
    isArrayContainer: boolean;
    container: Container;
    selector: string;
    type: AdvancedFieldType;
  }) {
    // Groups like "Provision Activity" don't have "block" wrapper,
    // their child elements like "dropdown options" are placed at the top level,
    // where any other blocks are placed.
    const containerSelector = {};

    if (isArrayContainer) {
      // Add duplicated group
      container[selector].push(containerSelector);
    } else {
      container[selector] = type === AdvancedFieldType.block ? containerSelector : [containerSelector];
    }

    return containerSelector;
  }

  private handleDropdownOption({
    container,
    selector,
    identifierAsValueSelection,
  }: {
    container: Container;
    selector: string;
    identifierAsValueSelection?: {
      field: string;
      value: string;
    };
  }) {
    let containerSelector = {};

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

    return containerSelector;
  }

  private handleBasicGroup({
    isArray,
    container,
    selector,
    isArrayContainer,
  }: {
    isArray: boolean;
    container: Container;
    selector: string;
    isArrayContainer: boolean;
  }) {
    let containerSelector = isArray ? [] : {};

    if (container[selector] && isArrayContainer) {
      // Add duplicated group
      containerSelector = container[selector];
    } else {
      container[selector] = containerSelector;
    }

    return containerSelector;
  }

  private handleGroupTraverse({
    container,
    key,
    index,
    type,
    selector,
    uri,
    shouldHaveRootWrapper,
    updatedNonBFMappedGroup,
    isArrayContainer,
    isArray,
    children,
  }: {
    container: Container;
    key: string;
    index: number;
    type: AdvancedFieldType;
    selector: string;
    uri: string;
    shouldHaveRootWrapper: boolean;
    updatedNonBFMappedGroup?: NonBFMappedGroup;
    isArrayContainer: boolean;
    isArray: boolean;
    children?: string[];
  }) {
    let containerSelector: RecursiveRecordSchema | RecursiveRecordSchema[] | string[];
    let hasRootWrapper = shouldHaveRootWrapper;

    const { profile: profileType, dropdownOption } = AdvancedFieldType;
    const isGroupWithoutRootWrapper = hasElement(GROUPS_WITHOUT_ROOT_WRAPPER, uri);
    const identifierAsValueSelection = IDENTIFIER_AS_VALUE[selector];

    if (type === profileType) {
      containerSelector = container;
    } else if (
      this.checkGroupShouldHaveWrapper({
        type,
        uri,
        nonBFMappedGroup: updatedNonBFMappedGroup,
        shouldHaveRootWrapper,
        selector,
      })
    ) {
      if (this.checkDropdownOptionWithoutUserValues(type, key)) {
        // Only fields from the selected option should be processed and saved
        return;
      }

      containerSelector = this.handleGroupsWithWrapper({
        isArrayContainer,
        container,
        selector,
        type,
      });
    } else if (type === dropdownOption) {
      if (!this.selectedEntries.includes(key)) {
        // Only fields from the selected option should be processed and saved
        return;
      }

      containerSelector = this.handleDropdownOption({
        container,
        selector,
        identifierAsValueSelection,
      });
    } else if (this.checkEntryWithoutWrapper(isGroupWithoutRootWrapper, type, selector)) {
      // Some groups like "Provision Activity" should not have a root node,
      // and they put their children directly in the block node.
      containerSelector = container;

      if (isGroupWithoutRootWrapper) {
        hasRootWrapper = true;
      }
    } else {
      containerSelector = this.handleBasicGroup({
        isArray,
        container,
        selector,
        isArrayContainer,
      });
    }

    children?.forEach(uuid =>
      this.traverse({
        container: containerSelector,
        key: uuid,
        index: index + 1,
        shouldHaveRootWrapper: hasRootWrapper,
        parentEntryType: type,
        nonBFMappedGroup: updatedNonBFMappedGroup,
      }),
    );
  }
}
