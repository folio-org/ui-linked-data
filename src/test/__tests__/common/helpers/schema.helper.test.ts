import * as BibframeMappingConstants from '@/common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import * as SchemaHelper from '@/common/helpers/schema.helper';
import { checkEmptyChildren, generateTwinChildrenKey } from '@/common/helpers/schema.helper';
import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

describe('schema.helper', () => {
  const { getLookupLabelKey, hasChildEntry, findParentEntryByProperty, getHtmlIdForEntry } = SchemaHelper;
  const mockBFUrisConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
  const mockBFLabelsConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_LABELS_MAP');

  describe('getLookupLabelKey', () => {
    test('returns mapped value', () => {
      const uriBFLite = 'testUriBFLite';
      const mappedValue = 'testMappedValue';
      mockBFLabelsConstant({ testUriBFLite: mappedValue });

      const result = getLookupLabelKey(uriBFLite);

      expect(result).toBe(mappedValue);
    });

    test('returns default Label value', () => {
      const uriBFLite = 'testUriBFLite';
      const labelUri = 'testLabelUri';
      mockBFLabelsConstant({});
      mockBFUrisConstant({ LABEL: labelUri });

      const result = getLookupLabelKey(uriBFLite);

      expect(result).toBe(labelUri);
    });

    test('returns Term value', () => {
      const termUri = 'testTermUri';
      mockBFUrisConstant({ TERM: termUri });

      const result = getLookupLabelKey();

      expect(result).toBe(termUri);
    });
  });

  describe('hasChildEntry', () => {
    const schema = new Map([
      ['testId_1', { id: 'testId_1' } as unknown as SchemaEntry],
      ['testId_2', { id: 'testId_2' } as unknown as SchemaEntry],
    ]);

    test('returns false if there is no "children" passed', () => {
      const result = hasChildEntry(schema);

      expect(result).toBeFalsy();
    });

    test('returns false if "children" array is empty', () => {
      const result = hasChildEntry(schema, []);

      expect(result).toBeFalsy();
    });

    test('returns false', () => {
      const result = hasChildEntry(schema, ['testId_3']);

      expect(result).toBeFalsy();
    });

    test('returns true', () => {
      const result = hasChildEntry(schema, ['testId_1']);

      expect(result).toBeTruthy();
    });
  });

  describe('findParentEntryByProperty', () => {
    const schema = new Map([
      ['blockUuid', { uuid: 'blockUuid', path: ['blockUuid'], type: AdvancedFieldType.block } as SchemaEntry],
      [
        'groupUuid',
        { uuid: 'groupUuid', path: ['blockUuid', 'groupUuid'], type: AdvancedFieldType.group } as SchemaEntry,
      ],
      [
        'fieldUuid',
        {
          uuid: 'fieldUuid',
          path: ['blockUuid', 'groupUuid', 'fieldUuid'],
          type: AdvancedFieldType.literal,
        } as SchemaEntry,
      ],
    ]);
    const path = ['blockUuid', 'groupUuid', 'fieldUuid'];

    test('returns a schema entry', () => {
      const type = AdvancedFieldType.block;

      const result = findParentEntryByProperty({ schema, path, key: 'type', value: type });

      expect(result).toEqual({ uuid: 'blockUuid', path: ['blockUuid'], type: AdvancedFieldType.block });
    });

    test('returns null', () => {
      const type = AdvancedFieldType.groupComplex;

      const result = findParentEntryByProperty({ schema, path, key: 'type', value: type });

      expect(result).toBeNull();
    });
  });

  describe('getHtmlIdForEntry', () => {
    const schema = new Map([
      ['blockUuid', { uuid: 'blockUuid', path: ['blockUuid'], uriBFLite: 'mockUriBFLite', bfid: 'mockBfid' }],
      ['groupUuid', { uuid: 'groupUuid', path: ['blockUuid', 'groupUuid'], uriBFLite: 'mockUri' }],
      [
        'fieldUuid',
        {
          uuid: 'fieldUuid',
          path: ['blockUuid', 'groupUuid', 'fieldUuid'],
          uriBFLite: 'mockUriBFLite',
        },
      ],
    ]);
    const path = ['blockUuid', 'groupUuid', 'fieldUuid'];

    test('returns htmlId', () => {
      const htmlId = getHtmlIdForEntry({ path }, schema);

      expect(htmlId).toEqual('mockUriBFLite$$mockBfid::0__mockUri::0__mockUriBFLite::0');
    });
  });

  describe('generateTwinChildrenKey', () => {
    test('returns just URI when no valueDataType exists', () => {
      const entry = {
        uriBFLite: 'test:uri',
        constraints: {},
      } as SchemaEntry;

      const result = generateTwinChildrenKey(entry);

      expect(result).toBe('test:uri');
    });

    test('returns concatenated string with valueDataType when present', () => {
      const entry = {
        uriBFLite: 'test:uri',
        constraints: {
          valueDataType: {
            dataTypeURI: 'test:dataType',
          },
        },
      } as SchemaEntry;

      const result = generateTwinChildrenKey(entry);

      expect(result).toBe('test:uri$$test:dataType');
    });

    test('returns URI when constraints is undefined', () => {
      const entry = {
        uriBFLite: 'test:uri',
      } as SchemaEntry;

      const result = generateTwinChildrenKey(entry);

      expect(result).toBe('test:uri');
    });

    test('returns URI when valueDataType is empty object', () => {
      const entry = {
        uriBFLite: 'test:uri',
        constraints: {
          valueDataType: {},
        },
      } as SchemaEntry;

      const result = generateTwinChildrenKey(entry);

      expect(result).toBe('test:uri');
    });
  });

  describe('checkEmptyChildren', () => {
    const mockSchema = new Map();

    it('returns false for UI control types', () => {
      const entry = {
        type: AdvancedFieldType.literal,
        children: ['child_1'],
      } as SchemaEntry;

      expect(checkEmptyChildren(mockSchema, entry)).toBe(false);
    });

    it('returns true for non-UI control with non-existent children', () => {
      const entry = {
        type: AdvancedFieldType.block,
        children: ['child_1', 'child_2'],
      } as SchemaEntry;

      expect(checkEmptyChildren(mockSchema, entry)).toBe(true);
    });

    it('returns false for undefined entry', () => {
      expect(checkEmptyChildren(mockSchema)).toBe(false);
    });
  });
});
