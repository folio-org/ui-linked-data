import { PROFILE_BFIDS } from '@/common/constants/bibframe.constants';
import * as DisabledEditorGroups from '@/common/helpers/disabledEditorGroups.helper';

describe('disabledEditorGroups.helper', () => {
  describe('getComplexLookups', () => {
    test('returns an array with a single complex lookup item', () => {
      const schema = new Map([
        ['testKey-1', { path: [], uuid: 'testKey-1', type: 'complex' }],
        ['testKey-2', { path: [], uuid: 'testKey-2', type: 'simple' }],
      ]);

      const result = DisabledEditorGroups.getComplexLookups(schema);

      expect(result).toEqual([{ path: [], uuid: 'testKey-1', type: 'complex' }]);
    });

    test('returns an empty array', () => {
      const schema = new Map([
        ['testKey-1', { path: [], uuid: 'testKey-1', type: 'literal' }],
        ['testKey-2', { path: [], uuid: 'testKey-2', type: 'simple' }],
      ]);

      const result = DisabledEditorGroups.getComplexLookups(schema);

      expect(result).toHaveLength(0);
    });
  });

  describe('getGroupsWithComplexLookups', () => {
    test('returns an array with a single group', () => {
      const complexLookupFields = [{ path: ['testKey-1', 'testKey-2'], uuid: 'testKey-3', type: 'complex' }];
      const schema = new Map([
        ['testKey-1', { path: [], uuid: 'testKey-1', type: 'group' }],
        ['testKey-2', { path: ['testKey-1'], uuid: 'testKey-2', type: 'dropdownOption' }],
        ['testKey-3', { path: ['testKey-1', 'testKey-2'], uuid: 'testKey-3', type: 'complex' }],
      ]);

      const result = DisabledEditorGroups.getGroupsWithComplexLookups(complexLookupFields, schema);

      expect(result).toEqual([{ path: [], uuid: 'testKey-1', type: 'group' }]);
    });
  });

  describe('getDisabledFieldsWithinGroup', () => {
    test('returns a map with two items', () => {
      const schema = new Map([
        ['testKey-1', { path: [], uuid: 'testKey-1', type: 'group' }],
        ['testKey-2', { path: ['testKey-1'], uuid: 'testKey-2', type: 'complex' }],
        ['testKey-3', { path: ['testKey-1'], uuid: 'testKey-3', type: 'literal' }],
      ]);
      const childElements = ['testKey-2', 'testKey-3'];
      const testResult = new Map([
        ['testKey-2', { path: ['testKey-1'], uuid: 'testKey-2', type: 'complex' }],
        ['testKey-3', { path: ['testKey-1'], uuid: 'testKey-3', type: 'literal' }],
      ]);

      const result = DisabledEditorGroups.getDisabledFieldsWithinGroup(schema, childElements);

      expect(result).toEqual(testResult);
    });

    test('returns a map with three items from the nested schema', () => {
      const schema = new Map([
        ['testKey-1', { path: [], uuid: 'testKey-1', type: 'group' }],
        [
          'testKey-2',
          { path: ['testKey-1'], uuid: 'testKey-2', type: 'dropdownOption', children: ['testKey-3', 'testKey-4'] },
        ],
        ['testKey-3', { path: ['testKey-1', 'testKey-2'], uuid: 'testKey-3', type: 'complex' }],
        ['testKey-4', { path: ['testKey-1', 'testKey-2'], uuid: 'testKey-4', type: 'literal' }],
      ]);
      const childElements = ['testKey-2'];
      const testResult = new Map([
        ['testKey-3', { path: ['testKey-1', 'testKey-2'], uuid: 'testKey-3', type: 'complex' }],
        ['testKey-4', { path: ['testKey-1', 'testKey-2'], uuid: 'testKey-4', type: 'literal' }],
      ]);

      const result = DisabledEditorGroups.getDisabledFieldsWithinGroup(schema, childElements);

      expect(result).toEqual(testResult);
    });
  });

  describe('getAllDisabledFields', () => {
    test('returns a map with a 4 disabled fields', () => {
      const schema = new Map();
      const spyGetComplexLookups = jest.spyOn(DisabledEditorGroups, 'getComplexLookups').mockReturnValue([
        { path: ['testKey-1'], uuid: 'testKey-3', type: 'complex' },
        { path: ['testKey-2'], uuid: 'testKey-4', type: 'complex' },
      ]);
      const spyGetGroupsWithComplexLookups = jest
        .spyOn(DisabledEditorGroups, 'getGroupsWithComplexLookups')
        .mockReturnValue([
          { path: [], uuid: 'testKey-1', type: 'group' },
          { path: [], uuid: 'testKey-2', type: 'group' },
        ]);
      const spyGetDisabledFieldsWithinGroup = jest
        .spyOn(DisabledEditorGroups, 'getDisabledFieldsWithinGroup')
        .mockReturnValueOnce(
          new Map([
            ['testKey-3', { path: ['testKey-1'], uuid: 'testKey-3', type: 'complex' }],
            ['testKey-5', { path: ['testKey-1'], uuid: 'testKey-5', type: 'simple' }],
          ]),
        )
        .mockReturnValueOnce(
          new Map([
            ['testKey-4', { path: ['testKey-2'], uuid: 'testKey-4', type: 'complex' }],
            ['testKey-6', { path: ['testKey-2'], uuid: 'testKey-6', type: 'literal' }],
          ]),
        );
      const testResult = new Map([
        ['testKey-3', { path: ['testKey-1'], uuid: 'testKey-3', type: 'complex' }],
        ['testKey-4', { path: ['testKey-2'], uuid: 'testKey-4', type: 'complex' }],
        ['testKey-5', { path: ['testKey-1'], uuid: 'testKey-5', type: 'simple' }],
        ['testKey-6', { path: ['testKey-2'], uuid: 'testKey-6', type: 'literal' }],
      ]);

      const result = DisabledEditorGroups.getAllDisabledFields(schema);

      expect(spyGetComplexLookups).toHaveBeenCalledTimes(1);
      expect(spyGetGroupsWithComplexLookups).toHaveBeenCalledTimes(1);
      expect(spyGetDisabledFieldsWithinGroup).toHaveBeenCalledTimes(2);
      expect(result).toEqual(testResult);
    });

    test('returns an empty map', () => {
      const schema = new Map();
      jest.spyOn(DisabledEditorGroups, 'getComplexLookups').mockReturnValue([]);

      const result = DisabledEditorGroups.getAllDisabledFields(schema);

      expect(result.size).toBe(0);
    });
  });

  describe('getDisabledParentDescendants', () => {
    test('should return the disabled parent and its descendants', () => {
      const schema = new Map([
        ['testKey-1', { path: ['testKey-1'], bfid: PROFILE_BFIDS.WORK, uuid: 'testKey-1' }],
        ['testKey-4', { path: ['testKey-1', 'testKey-2'], uuid: 'testKey-4' }],
        ['testKey-5', { path: ['testKey-1', 'testKey-2', 'testKey-5'], uuid: 'testKey-5' }],
        ['testKey-6', { path: ['testKey-2'], uuid: 'testKey-6' }],
      ]);

      const testResult = [
        { path: ['testKey-1'], bfid: PROFILE_BFIDS.WORK, uuid: 'testKey-1' },
        { path: ['testKey-1', 'testKey-2'], uuid: 'testKey-4' },
        { path: ['testKey-1', 'testKey-2', 'testKey-5'], uuid: 'testKey-5' },
      ];

      const result = DisabledEditorGroups.getDisabledParentDescendants(schema);

      expect(result).toEqual(testResult);
    });
  });
});
