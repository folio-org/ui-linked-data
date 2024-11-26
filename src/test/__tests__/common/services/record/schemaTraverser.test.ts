import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { SchemaTraverser } from '@common/services/record';
import { Container, InitSchemaParams, TraverseSchemaParams } from '@common/services/record/schemaTraverser.interface';
import * as SchemaHelper from '@common/helpers/schema.helper';
import * as ProfileHelper from '@common/helpers/profile.helper';

describe('SchemaTraverser', () => {
  let schemaTraverser: SchemaTraverser;
  let schema: Map<string, SchemaEntry>;
  let userValues: UserValues;
  let selectedEntries: string[];
  let initialContainer: Container;

  beforeEach(() => {
    schemaTraverser = new SchemaTraverser();
    schema = new Map();
    userValues = {};
    selectedEntries = [];
    initialContainer = {};
  });

  describe('init', () => {
    it('initializes the schema traverser with given parameters', () => {
      const params: InitSchemaParams = { schema, userValues, selectedEntries, initialContainer };
      const result = schemaTraverser.init(params);

      expect(result).toBe(schemaTraverser);
      expect(schemaTraverser['schema']).toBe(schema);
      expect(schemaTraverser['userValues']).toBe(userValues);
      expect(schemaTraverser['selectedEntries']).toBe(selectedEntries);
      expect(schemaTraverser['initialContainer']).toBe(initialContainer);
    });
  });

  describe('traverse', () => {
    let schemaTraverserTyped: any;

    beforeEach(() => {
      schemaTraverserTyped = schemaTraverser as any;
    });

    it('handles user value match', () => {
      const key = 'testKey';
      const traverseParams: TraverseSchemaParams = { container: {}, key };
      const schemaEntry = {
        children: [],
        uri: 'testUri',
        uriBFLite: 'testUriBFLite',
        bfid: 'testBfid',
        type: AdvancedFieldType.simple,
      };
      schema.set(key, schemaEntry as unknown as SchemaEntry);
      userValues[key] = { contents: [{ id: '1', label: 'testLabel' }] } as UserValue;
      schemaTraverser.init({ schema, userValues, selectedEntries, initialContainer });

      const handleUserValueMatchSpy = jest.spyOn(schemaTraverserTyped, 'handleUserValueMatch');
      schemaTraverser.traverse(traverseParams);

      expect(handleUserValueMatchSpy).toHaveBeenCalled();
    });

    it('handles user value match with nonBFMappedGroup', () => {
      const key = 'testKey';
      const traverseParams: TraverseSchemaParams = { container: {}, key };
      const userValue = { contents: [{ id: '1', label: 'testLabel' }] } as UserValue;
      const nonBFMappedGroup = { uri: 'testUri', data: {} as NonBFMappedGroupData };
      const schemaEntry = {
        children: [],
        uri: 'testUri',
        uriBFLite: 'testUriBFLite',
        bfid: 'testBfid',
        type: AdvancedFieldType.simple,
      };
      schema.set(key, schemaEntry as unknown as SchemaEntry);

      userValues[key] = userValue;
      schemaTraverser.init({ schema, userValues, selectedEntries, initialContainer });

      const handleUserValueMatchSpy = jest.spyOn(schemaTraverserTyped, 'handleUserValueMatch');
      jest.spyOn(schemaTraverserTyped, 'checkGroupIsNonBFMapped').mockReturnValue(true);
      jest
        .spyOn(SchemaHelper, 'selectNonBFMappedGroupData')
        .mockReturnValue({ nonBFMappedGroup, selectedNonBFRecord: {} });

      schemaTraverser.traverse(traverseParams);

      expect(handleUserValueMatchSpy).toHaveBeenCalledWith({
        container: {
          testUriBFLite: ['testLabel'],
        },
        isArrayContainer: false,
        nonBFMappedGroup,
        selector: 'testUriBFLite',
        uriBFLite: 'testUriBFLite',
        userValueMatch: userValue,
      });
    });

    it('handles group traverse', () => {
      const key = 'testKey';
      const traverseParams: TraverseSchemaParams = { container: {}, key };
      const schemaEntry = {
        children: ['childKey'],
        uri: 'testUri',
        uriBFLite: 'testUriBFLite',
        bfid: 'testBfid',
        type: AdvancedFieldType.groupComplex,
      };
      schema.set(key, schemaEntry as SchemaEntry);
      schema.set('childKey', {
        children: [],
        uri: 'childUri',
        uriBFLite: 'childUriBFLite',
        bfid: 'childBfid',
        type: AdvancedFieldType.simple,
      } as unknown as SchemaEntry);
      schemaTraverser.init({ schema, userValues, selectedEntries, initialContainer });

      const handleGroupTraverseSpy = jest.spyOn(schemaTraverser as any, 'handleGroupTraverse');
      schemaTraverser.traverse(traverseParams);

      expect(handleGroupTraverseSpy).toHaveBeenCalled();
    });
  });

  describe('private methods', () => {
    let schemaTraverserTyped: any;

    beforeEach(() => {
      schemaTraverserTyped = schemaTraverser as any;
    });

    it('returns correct non-array types', () => {
      const nonArrayTypes = schemaTraverserTyped.getNonArrayTypes();

      expect(nonArrayTypes).toEqual([
        AdvancedFieldType.hidden,
        AdvancedFieldType.dropdownOption,
        AdvancedFieldType.profile,
      ]);
    });

    it('returns correct selector', () => {
      const selector = schemaTraverserTyped.getSelector('uri', 'uriBFLite', 'bfid');

      expect(selector).toBe('uriBFLite');
    });

    it('returns correct shouldProceed value', () => {
      userValues = { testKey: {} } as unknown as UserValues;
      schema.set('testKey', { path: ['testKey'] } as unknown as SchemaEntry);
      schemaTraverser.init({ schema, userValues, selectedEntries, initialContainer });

      const shouldProceed = schemaTraverserTyped.shouldProceed('testKey');

      expect(shouldProceed).toBe(true);
    });

    it('returns correct isArray value', () => {
      const isArray = schemaTraverserTyped.isArray(AdvancedFieldType.simple);

      expect(isArray).toBe(true);
    });

    it('returns correct isArrayContainer value', () => {
      const container = { testSelector: [] };
      const isArrayContainer = schemaTraverserTyped.isArrayContainer(container, 'testSelector');

      expect(isArrayContainer).toBe(true);
    });

    it('returns correct checkGroupIsNonBFMapped value', () => {
      const checkGroupIsNonBFMapped = schemaTraverserTyped.checkGroupIsNonBFMapped(
        'uri',
        AdvancedFieldType.simple,
        AdvancedFieldType.groupComplex,
      );

      expect(checkGroupIsNonBFMapped).toBe(false);
    });

    it('returns correct checkGroupShouldHaveWrapper value', () => {
      const checkGroupShouldHaveWrapper = schemaTraverserTyped.checkGroupShouldHaveWrapper({
        type: AdvancedFieldType.groupComplex,
        uri: 'uri',
        shouldHaveRootWrapper: false,
        selector: 'selector',
      });

      expect(checkGroupShouldHaveWrapper).toBe(false);
    });

    it('returns correct shouldContinueGroupTraverse value', () => {
      const shouldContinueGroupTraverse = schemaTraverserTyped.shouldContinueGroupTraverse(true, 0, 'selector');

      expect(shouldContinueGroupTraverse).toBe(true);
    });

    it('returns correct hasUserValueAndSelector value', () => {
      const hasUserValueAndSelector = schemaTraverserTyped.hasUserValueAndSelector({ contents: [] }, 'uri', 'selector');

      expect(hasUserValueAndSelector).toBe(true);
    });

    it('returns correct checkDropdownOptionWithoutUserValues value', () => {
      const checkDropdownOptionWithoutUserValues = schemaTraverserTyped.checkDropdownOptionWithoutUserValues(
        AdvancedFieldType.dropdownOption,
        'key',
      );

      expect(checkDropdownOptionWithoutUserValues).toBe(true);
    });

    it('returns correct checkEntryWithoutWrapper value', () => {
      const checkEntryWithoutWrapper = schemaTraverserTyped.checkEntryWithoutWrapper(
        false,
        AdvancedFieldType.hidden,
        'selector',
      );

      expect(checkEntryWithoutWrapper).toBe(true);
    });
  });

  describe('handleUserValueMatch', () => {
    const container = {} as Container;
    const uriBFLite = 'testUriBFLite';
    const selector = 'testSelector';
    let userValueMatch: UserValue;
    let isArrayContainer: boolean;
    let nonBFMappedGroup: NonBFMappedGroup | undefined;
    let schemaTraverserTyped: any;

    beforeEach(() => {
      schemaTraverserTyped = schemaTraverser as any;
      userValueMatch = {
        contents: [{ id: '1', label: 'testLabel' }],
      } as UserValue;
      isArrayContainer = false;
      nonBFMappedGroup = undefined;
    });

    it('handles user value match with KEEP_VALUE_AS_IS', () => {
      jest.spyOn(SchemaHelper, 'getAdvancedValuesField').mockReturnValue(undefined);
      jest.spyOn(ProfileHelper, 'generateLookupValue').mockReturnValue({ id: ['1'], label: ['testLabel'] });

      schemaTraverserTyped.handleUserValueMatch({
        userValueMatch,
        uriBFLite,
        selector,
        isArrayContainer,
        nonBFMappedGroup,
        container,
      });

      expect(container[selector]).toEqual(['testLabel']);
    });

    it('handles user value match with advancedValueField', () => {
      jest.spyOn(SchemaHelper, 'getAdvancedValuesField').mockReturnValue('advancedField');
      jest.spyOn(SchemaHelper, 'generateAdvancedFieldObject').mockReturnValue({ advancedField: ['testLabel'] });

      schemaTraverserTyped.handleUserValueMatch({
        userValueMatch,
        uriBFLite,
        selector,
        isArrayContainer,
        nonBFMappedGroup,
        container,
      });

      expect(container[selector]).toEqual([{ advancedField: ['testLabel'] }]);
    });

    it('handles user value match with nonBFMappedGroup', () => {
      nonBFMappedGroup = { uri: 'testUri', data: {} as NonBFMappedGroupData };
      jest.spyOn(SchemaHelper, 'getAdvancedValuesField').mockReturnValue(undefined);
      jest.spyOn(ProfileHelper, 'generateLookupValue').mockReturnValue({ id: ['1'], label: ['testLabel'] });

      schemaTraverserTyped.handleUserValueMatch({
        userValueMatch,
        uriBFLite,
        selector,
        isArrayContainer,
        nonBFMappedGroup,
        container,
      });

      expect(container[selector]).toEqual(['testLabel']);
    });

    it('handles user value match with isArrayContainer', () => {
      isArrayContainer = true;
      container[selector] = [{ id: '2', label: 'existingLabel' }];
      userValueMatch = userValueMatch = {
        contents: [{ id: '1', label: 'testLabel', meta: { type: AdvancedFieldType.simple } }],
      } as UserValue;
      jest.spyOn(SchemaHelper, 'getAdvancedValuesField').mockReturnValue(undefined);
      jest.spyOn(ProfileHelper, 'generateLookupValue').mockReturnValue({ id: ['1'], label: ['testLabel'] });

      schemaTraverserTyped.handleUserValueMatch({
        userValueMatch,
        uriBFLite,
        selector,
        isArrayContainer,
        nonBFMappedGroup,
        container,
      });

      expect(container[selector]).toEqual([
        { id: '2', label: 'existingLabel' },
        { id: ['1'], label: ['testLabel'] },
      ]);
    });

    it('handles user value match without advancedValueField and nonBFMappedGroup', () => {
      jest.spyOn(SchemaHelper, 'getAdvancedValuesField').mockReturnValue(undefined);
      jest.spyOn(ProfileHelper, 'generateLookupValue').mockReturnValue({ id: ['1'], label: ['testLabel'] });

      schemaTraverserTyped.handleUserValueMatch({
        userValueMatch,
        uriBFLite,
        selector,
        isArrayContainer,
        nonBFMappedGroup,
        container,
      });

      expect(container[selector]).toEqual(['testLabel']);
    });
  });

  describe('handleGroupsWithWrapper', () => {
    const container = {} as Container;
    const selector = 'testSelector';
    let type: AdvancedFieldType;
    let isArrayContainer: boolean;
    let schemaTraverserTyped: any;

    beforeEach(() => {
      schemaTraverserTyped = schemaTraverser as any;
      type = AdvancedFieldType.block;
      isArrayContainer = false;
    });

    it('handles groups with wrapper for block type', () => {
      const result = schemaTraverserTyped.handleGroupsWithWrapper({
        isArrayContainer,
        container,
        selector,
        type,
      });

      expect(container[selector]).toEqual({});
      expect(result).toEqual({});
    });

    it('handles groups with wrapper for non-block type', () => {
      type = AdvancedFieldType.groupComplex;
      const result = schemaTraverserTyped.handleGroupsWithWrapper({
        isArrayContainer,
        container,
        selector,
        type,
      });

      expect(container[selector]).toEqual([{}]);
      expect(result).toEqual({});
    });

    it('handles groups with wrapper for array container', () => {
      isArrayContainer = true;
      container[selector] = [{}];
      const result = schemaTraverserTyped.handleGroupsWithWrapper({
        isArrayContainer,
        container,
        selector,
        type,
      });

      expect(container[selector]).toEqual([{}, {}]);
      expect(result).toEqual({});
    });
  });
});
