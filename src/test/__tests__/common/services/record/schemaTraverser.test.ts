import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { SchemaTraverser } from '@common/services/record';
import { Container, InitSchemaParams, TraverseSchemaParams } from '@common/services/record/schemaTraverser.interface';

describe('SchemaTraverser', () => {
  let schemaTraverser: SchemaTraverser;
  let schema: Map<string, any>;
  let userValues: any;
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
      schema.set(key, schemaEntry);
      userValues[key] = { contents: [{ id: '1', label: 'testLabel' }] };
      schemaTraverser.init({ schema, userValues, selectedEntries, initialContainer });

      const handleUserValueMatchSpy = jest.spyOn(schemaTraverser as any, 'handleUserValueMatch');
      schemaTraverser.traverse(traverseParams);

      expect(handleUserValueMatchSpy).toHaveBeenCalled();
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
      schema.set(key, schemaEntry);
      schema.set('childKey', {
        children: [],
        uri: 'childUri',
        uriBFLite: 'childUriBFLite',
        bfid: 'childBfid',
        type: AdvancedFieldType.simple,
      });
      schemaTraverser.init({ schema, userValues, selectedEntries, initialContainer });

      const handleGroupTraverseSpy = jest.spyOn(schemaTraverser as any, 'handleGroupTraverse');
      schemaTraverser.traverse(traverseParams);

      expect(handleGroupTraverseSpy).toHaveBeenCalled();
    });
  });

  describe('private methods', () => {
    it('returns correct non-array types', () => {
      const nonArrayTypes = (schemaTraverser as any).getNonArrayTypes();

      expect(nonArrayTypes).toEqual([
        AdvancedFieldType.hidden,
        AdvancedFieldType.dropdownOption,
        AdvancedFieldType.profile,
      ]);
    });

    it('returns correct selector', () => {
      const selector = (schemaTraverser as any).getSelector('uri', 'uriBFLite', 'bfid');

      expect(selector).toBe('uriBFLite');
    });

    it('returns correct shouldProceed value', () => {
      userValues = { testKey: {} };
      schema.set('testKey', { path: ['testKey'] });
      schemaTraverser.init({ schema, userValues, selectedEntries, initialContainer });

      const shouldProceed = (schemaTraverser as any).shouldProceed('testKey');

      expect(shouldProceed).toBe(true);
    });

    it('returns correct isArray value', () => {
      const isArray = (schemaTraverser as any).isArray(AdvancedFieldType.simple);

      expect(isArray).toBe(true);
    });

    it('returns correct isArrayContainer value', () => {
      const container = { testSelector: [] };
      const isArrayContainer = (schemaTraverser as any).isArrayContainer(container, 'testSelector');

      expect(isArrayContainer).toBe(true);
    });

    it('returns correct checkGroupIsNonBFMapped value', () => {
      const checkGroupIsNonBFMapped = (schemaTraverser as any).checkGroupIsNonBFMapped(
        'uri',
        AdvancedFieldType.simple,
        AdvancedFieldType.groupComplex,
      );

      expect(checkGroupIsNonBFMapped).toBe(false);
    });

    it('returns correct checkGroupShouldHaveWrapper value', () => {
      const checkGroupShouldHaveWrapper = (schemaTraverser as any).checkGroupShouldHaveWrapper({
        type: AdvancedFieldType.groupComplex,
        uri: 'uri',
        shouldHaveRootWrapper: false,
        selector: 'selector',
      });

      expect(checkGroupShouldHaveWrapper).toBe(false);
    });

    it('returns correct shouldContinueGroupTraverse value', () => {
      const shouldContinueGroupTraverse = (schemaTraverser as any).shouldContinueGroupTraverse(true, 0, 'selector');

      expect(shouldContinueGroupTraverse).toBe(true);
    });

    it('returns correct hasUserValueAndSelector value', () => {
      const hasUserValueAndSelector = (schemaTraverser as any).hasUserValueAndSelector(
        { contents: [] },
        'uri',
        'selector',
      );

      expect(hasUserValueAndSelector).toBe(true);
    });

    it('returns correct checkDropdownOptionWithoutUserValues value', () => {
      const checkDropdownOptionWithoutUserValues = (schemaTraverser as any).checkDropdownOptionWithoutUserValues(
        AdvancedFieldType.dropdownOption,
        'key',
      );

      expect(checkDropdownOptionWithoutUserValues).toBe(true);
    });

    it('returns correct checkEntryWithoutWrapper value', () => {
      const checkEntryWithoutWrapper = (schemaTraverser as any).checkEntryWithoutWrapper(
        false,
        AdvancedFieldType.hidden,
        'selector',
      );

      expect(checkEntryWithoutWrapper).toBe(true);
    });
  });
});
