import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { GroupProcessor } from '@/common/services/recordGenerator/processors/profileSchema/groupProcessor';
import { ProfileSchemaManager } from '@/common/services/recordGenerator/profileSchemaManager';

jest.mock('@/common/services/recordGenerator/profileSchemaManager');

describe('GroupProcessor', () => {
  let processor: GroupProcessor;
  let mockProfileSchemaManager: jest.Mocked<ProfileSchemaManager>;
  let selectedEntries: string[];

  const createSchemaEntryMock = (uuid: string, type: AdvancedFieldType, uriBFLite: string): SchemaEntry =>
    ({
      uuid,
      type,
      uriBFLite,
    }) as SchemaEntry;

  function mockGetSchemaEntry() {
    mockProfileSchemaManager.getSchemaEntry.mockImplementation(uuid => {
      if (uuid === 'child_with_default') {
        return createSchemaEntryMock('child_with_default', AdvancedFieldType.simple, 'default_uri');
      } else if (uuid === 'linked_child') {
        return createSchemaEntryMock('linked_child', AdvancedFieldType.literal, 'linked_uri');
      }

      return undefined;
    });
  }

  function mockGetSchemaEntryWithLinked() {
    mockProfileSchemaManager.getSchemaEntry.mockImplementation(uuid => {
      if (uuid === 'child_1') {
        return createSchemaEntryMock('child_1', AdvancedFieldType.simple, 'uri_1');
      } else if (uuid === 'linked_child') {
        return createSchemaEntryMock('linked_child', AdvancedFieldType.literal, 'linked_uri');
      }

      return undefined;
    });
  }

  beforeEach(() => {
    mockProfileSchemaManager = new ProfileSchemaManager() as jest.Mocked<ProfileSchemaManager>;
    processor = new GroupProcessor(mockProfileSchemaManager);
    selectedEntries = [];
  });

  describe('canProcess', () => {
    it('returns true for group type entry with children and object value', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        children: ['child_1', 'child_2'],
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
      } as RecordSchemaEntry;

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns false for group type entry without children', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        children: undefined,
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
      } as RecordSchemaEntry;

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for group type entry with non-object value', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        children: ['child_1', 'child_2'],
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for non-group type entry', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.literal,
        children: ['child_1', 'child_2'],
      } as SchemaEntry;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
      } as RecordSchemaEntry;

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });
  });

  describe('process', () => {
    it('returns empty array when profile schema entry has no children', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          property_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
    });

    it('returns empty array when record schema entry has no properties', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1', 'child_2'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
      } as RecordSchemaEntry;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
    });

    it('returns empty array when no child entries have values', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1', 'child_2'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          property_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry
        .mockReturnValueOnce({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_1',
        } as SchemaEntry)
        .mockReturnValueOnce({
          uuid: 'child_2',
          type: AdvancedFieldType.simple,
          uriBFLite: 'uri_2',
        } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
    });

    it('processes single group entry with literal type child correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'test value' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.literal,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ uri_1: ['test value'] }]);
    });

    it('processes single group entry with simple type child correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'test label', meta: { uri: 'test_uri' } }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.simple,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ uri_1: ['test_uri'] }]);
    });

    it('processes single group entry with complex type child correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'test label', meta: { srsId: 'test_srs_id' } }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.complex,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ srsId: 'test_srs_id' }]);
    });

    it('processes complex type child with id instead of srsId correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'test label', id: 'test_id', meta: { id: 'test_id' } }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.complex,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ id: 'test_id' }]);
    });

    it('processes complex type child with propertyKey option correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'Test Hub', meta: { uri: 'http://test.uri' } }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.object,
            properties: {
              [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
              [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
            },
            options: {
              propertyKey: '_hub',
            },
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.complex,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          _hub: {
            [BFLITE_URIS.LABEL]: ['Test Hub'],
            [BFLITE_URIS.LINK]: ['http://test.uri'],
          },
        },
      ]);
    });

    it('processes complex type child with propertyKey but no link correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'Test Hub' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.object,
            properties: {
              [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
              [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
            },
            options: {
              propertyKey: '_hub',
            },
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.complex,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          _hub: {
            [BFLITE_URIS.LABEL]: ['Test Hub'],
          },
        },
      ]);
    });

    it('skips complex type child without propertyKey when no id or srsId exists', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'test label' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.complex,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
    });

    it('processes complex type child prioritizing value with id over value without id', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'value without id' }, { label: 'value with id', id: 'test_id', meta: { id: 'test_id' } }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.complex,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ id: 'test_id' }]);
    });

    it('processes multiple group entries with different types correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1', 'child_2', 'child_3'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'test literal' }],
        },
        child_2: {
          contents: [{ label: 'test simple', meta: { uri: 'test_uri' } }],
        },
        child_3: {
          contents: [{ label: 'test complex', meta: { srsId: 'test_srs_id' } }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          uri_2: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          uri_3: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry
        .mockReturnValueOnce({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_1',
        } as SchemaEntry)
        .mockReturnValueOnce({
          uuid: 'child_2',
          type: AdvancedFieldType.simple,
          uriBFLite: 'uri_2',
        } as SchemaEntry)
        .mockReturnValueOnce({
          uuid: 'child_3',
          type: AdvancedFieldType.complex,
          uriBFLite: 'uri_3',
        } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          uri_1: ['test literal'],
          uri_2: ['test_uri'],
          srsId: 'test_srs_id',
        },
      ]);
    });

    it('processes multiple values for the same child correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'value 1' }, { label: 'value 2' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.literal,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ uri_1: ['value 1', 'value 2'] }]);
    });

    it('processes multiple values for the same repeatable child correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1_0', 'child_1_1', 'child_1_2'],
      } as SchemaEntry;
      const userValues = {
        child_1_0: {
          contents: [{ label: 'value 1' }],
        },
        child_1_1: {
          contents: [{ label: 'value 2' }],
        },
        child_1_2: {
          contents: [{ label: 'value 3' }, { label: 'value 4' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockImplementation(uuid => {
        switch (uuid) {
          case 'child_1_0':
            return {
              uuid: 'child_1_0',
              type: AdvancedFieldType.literal,
              uriBFLite: 'uri_1',
              constraints: {
                repeatable: true,
              },
            } as SchemaEntry;
          case 'child_1_1':
            return {
              uuid: 'child_1_1',
              type: AdvancedFieldType.literal,
              uriBFLite: 'uri_1',
              constraints: {
                repeatable: true,
              },
            } as SchemaEntry;
          case 'child_1_2':
          default:
            return {
              uuid: 'child_1_2',
              type: AdvancedFieldType.literal,
              uriBFLite: 'uri_1',
              constraints: {
                repeatable: true,
              },
            } as SchemaEntry;
        }
      });

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ uri_1: ['value 1', 'value 2', 'value 3', 'value 4'] }]);
    });

    it('processes multiple children with multiple values correctly', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1', 'child_2'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [
            { label: 'child_1 value 1', meta: { uri: 'test_uri_1' } },
            { label: 'child_1 value 2', meta: { uri: 'test_uri_2' } },
          ],
        },
        child_2: {
          contents: [
            { label: 'child_2 value 1', meta: { uri: 'test_uri_3' } },
            { label: 'child_2 value 2', meta: { uri: 'test_uri_4' } },
          ],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          uri_2: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry
        .mockReturnValueOnce({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_1',
        } as SchemaEntry)
        .mockReturnValueOnce({
          uuid: 'child_2',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_2',
        } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          uri_1: ['child_1 value 1', 'child_1 value 2'],
          uri_2: ['child_2 value 1', 'child_2 value 2'],
        },
      ]);
    });

    it('skips child entries with invalid types', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1', 'child_2'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'valid value' }],
        },
        child_2: {
          contents: [{ label: 'invalid value' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          uri_2: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry
        .mockReturnValueOnce({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_1',
        } as SchemaEntry)
        .mockReturnValueOnce({
          uuid: 'child_2',
          type: 'invalid_type' as unknown as AdvancedFieldType,
          uriBFLite: 'uri_2',
        } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ uri_1: ['valid value'] }]);
    });

    it('skips child entries with no matching record schema properties', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1', 'child_2'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'value 1' }],
        },
        child_2: {
          contents: [{ label: 'value 2' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.array,
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry
        .mockReturnValueOnce({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_1',
        } as SchemaEntry)
        .mockReturnValueOnce({
          uuid: 'child_2',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_2',
        } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ uri_1: ['value 1'] }]);
    });

    it('filters out empty results from processed values', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: '' }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.literal,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
    });

    it('handles mapped values for simple type properties', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_1'],
      } as SchemaEntry;
      const userValues = {
        child_1: {
          contents: [{ label: 'test label', meta: { uri: 'test_uri' } }],
        },
      } as unknown as UserValues;
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
            options: {
              mappedValues: {
                mapped_key: { uri: 'test_uri' },
              },
            },
          },
        },
      } as RecordSchemaEntry;

      mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
        uuid: 'child_1',
        type: AdvancedFieldType.simple,
        uriBFLite: 'uri_1',
      } as SchemaEntry);

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([{ uri_1: ['mapped_key'] }]);
    });

    describe('when processing group entries with default values', () => {
      const profileSchemaEntry = {
        type: AdvancedFieldType.group,
        uuid: 'test_uuid',
        children: ['child_with_default', 'linked_child'],
      } as SchemaEntry;

      it('handles default values for child entries when linked property has values', () => {
        const userValues = {
          linked_child: {
            contents: [{ label: 'linked value' }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            default_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                defaultValue: 'default_value_uri',
                linkedProperty: 'linked_uri',
              },
            },
            linked_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;
        mockGetSchemaEntry();

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([
          {
            default_uri: ['default_value_uri'],
            linked_uri: ['linked value'],
          },
        ]);
      });

      it('does not set default values when linked property has no values', () => {
        const userValues = {} as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            default_uri: {
              type: RecordSchemaEntryType.string,
              options: {
                defaultValue: 'default_value_uri',
                linkedProperty: 'linked_uri',
              },
            },
            linked_uri: { type: RecordSchemaEntryType.string },
          },
        } as RecordSchemaEntry;
        mockGetSchemaEntry();

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([]);
      });

      it('ignores default values when child entry already has user values', () => {
        const userValues = {
          child_with_default: {
            contents: [{ label: 'existing value', meta: { uri: 'existing_uri' } }],
          },
          linked_child: {
            contents: [{ label: 'linked value' }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            default_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                defaultValue: 'default_value_uri',
                linkedProperty: 'linked_uri',
              },
            },
            linked_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;
        mockGetSchemaEntry();

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([
          {
            default_uri: ['existing_uri'],
            linked_uri: ['linked value'],
          },
        ]);
      });

      it('does not use default values when options are missing linkedProperty', () => {
        const userValues = {
          linked_child: {
            contents: [{ label: 'linked value' }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            default_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                defaultValue: 'default_value_uri',
              },
            },
            linked_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;
        mockGetSchemaEntry();

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([
          {
            linked_uri: ['linked value'],
          },
        ]);
      });
    });

    describe('getUserValues', () => {
      it('returns user values directly when there is no linked property', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'test value' }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;

        mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_1',
        } as SchemaEntry);

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([{ uri_1: ['test value'] }]);
      });

      it('returns empty array when entry has no user values and no linked property', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1'],
        } as SchemaEntry;
        const userValues = {} as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;

        mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_1',
        } as SchemaEntry);

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([]);
      });

      it('returns user values when linked property has values', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1', 'linked_child'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'dependent value', meta: { uri: 'dependent_uri' } }],
          },
          linked_child: {
            contents: [{ label: 'linked value' }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                linkedProperty: 'linked_uri',
              },
            },
            linked_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;

        mockGetSchemaEntryWithLinked();

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([
          {
            uri_1: ['dependent_uri'],
            linked_uri: ['linked value'],
          },
        ]);
      });

      it('returns empty array when linked property has no values', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1', 'linked_child'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'dependent value', meta: { uri: 'dependent_uri' } }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                linkedProperty: 'linked_uri',
              },
            },
            linked_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;

        mockGetSchemaEntryWithLinked();

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([]);
      });

      it('handles missing childEntry gracefully', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'test value' }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;

        mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_1',
        } as SchemaEntry);

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([{ uri_1: ['test value'] }]);
      });
    });

    describe('getLinkedPropertyDependency', () => {
      it('returns hasLink false when childEntry is undefined', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
        } as SchemaEntry;
        const userValues = {} as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {},
        } as RecordSchemaEntry;

        processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(mockProfileSchemaManager.getSchemaEntry).not.toHaveBeenCalled();
      });

      it('returns hasLink false when childEntry has no uriBFLite', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1'],
        } as SchemaEntry;
        const userValues = {} as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {},
        } as RecordSchemaEntry;

        mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
        } as SchemaEntry);

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([]);
      });

      it('returns hasLink true with linked property info when linkedProperty exists', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1', 'linked_child'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'value', meta: { uri: 'uri' } }],
          },
          linked_child: {
            contents: [{ label: 'linked' }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                linkedProperty: 'linked_uri',
              },
            },
            linked_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;

        mockGetSchemaEntryWithLinked();

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([
          {
            uri_1: ['uri'],
            linked_uri: ['linked'],
          },
        ]);
      });

      it('returns hasLink false when linkedProperty is not defined', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'value' }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;

        mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
          uuid: 'child_1',
          type: AdvancedFieldType.literal,
          uriBFLite: 'uri_1',
        } as SchemaEntry);

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([{ uri_1: ['value'] }]);
      });
    });

    describe('getLinkedEntryValues', () => {
      it('returns values when linked entry exists in allChildren', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1', 'linked_child'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'value', meta: { uri: 'uri' } }],
          },
          linked_child: {
            contents: [{ label: 'linked value 1' }, { label: 'linked value 2' }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                linkedProperty: 'linked_uri',
              },
            },
            linked_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;

        mockGetSchemaEntryWithLinked();

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([
          {
            uri_1: ['uri'],
            linked_uri: ['linked value 1', 'linked value 2'],
          },
        ]);
      });

      it('returns empty array when linked entry is not found', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'value', meta: { uri: 'uri' } }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                linkedProperty: 'non_existent_uri',
              },
            },
          },
        } as RecordSchemaEntry;

        mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
          uuid: 'child_1',
          type: AdvancedFieldType.simple,
          uriBFLite: 'uri_1',
        } as SchemaEntry);

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([]);
      });

      it('returns empty array when linked entry has no values', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1', 'linked_child'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'value', meta: { uri: 'uri' } }],
          },
          linked_child: {
            contents: [],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                linkedProperty: 'linked_uri',
              },
            },
            linked_uri: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
            },
          },
        } as RecordSchemaEntry;

        mockGetSchemaEntryWithLinked();

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([]);
      });

      it('handles undefined allChildren parameter', () => {
        const profileSchemaEntry = {
          type: AdvancedFieldType.group,
          uuid: 'test_uuid',
          children: ['child_1'],
        } as SchemaEntry;
        const userValues = {
          child_1: {
            contents: [{ label: 'value', meta: { uri: 'uri' } }],
          },
        } as unknown as UserValues;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
          properties: {
            uri_1: {
              type: RecordSchemaEntryType.array,
              value: RecordSchemaEntryType.string,
              options: {
                linkedProperty: 'linked_uri',
              },
            },
          },
        } as RecordSchemaEntry;

        mockProfileSchemaManager.getSchemaEntry.mockReturnValue({
          uuid: 'child_1',
          type: AdvancedFieldType.simple,
          uriBFLite: 'uri_1',
        } as SchemaEntry);

        const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

        expect(result).toEqual([]);
      });
    });
  });

  describe('applyConditionalProperties', () => {
    it('filters properties based on sourceType when conditionalProperties is defined', () => {
      const recordSchemaProperty = {
        type: RecordSchemaEntryType.object,
        properties: {
          [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
          [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
          [BFLITE_URIS.IDENTIFIER_LCCN]: { type: RecordSchemaEntryType.string },
        },
        options: {
          conditionalProperties: {
            libraryOfCongress: [BFLITE_URIS.LABEL, BFLITE_URIS.LINK],
            local: [BFLITE_URIS.IDENTIFIER_LCCN],
          },
        },
      } as RecordSchemaEntry;

      const value = {
        label: 'Test Hub',
        meta: { sourceType: 'libraryOfCongress', uri: 'http://test.uri' },
      } as UserValueContents;

      const result = processor['applyConditionalProperties'](recordSchemaProperty, value);

      expect(result.properties).toEqual({
        [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
        [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
      });
    });

    it('uses defaultSourceType when sourceType is not in value', () => {
      const recordSchemaProperty = {
        type: RecordSchemaEntryType.object,
        properties: {
          [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
          [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
          [BFLITE_URIS.IDENTIFIER_LCCN]: { type: RecordSchemaEntryType.string },
        },
        options: {
          conditionalProperties: {
            libraryOfCongress: [BFLITE_URIS.LABEL, BFLITE_URIS.LINK],
            local: [BFLITE_URIS.IDENTIFIER_LCCN],
          },
          defaultSourceType: 'local',
        },
      } as RecordSchemaEntry;

      const value = {
        label: 'Test Hub',
      } as UserValueContents;

      const result = processor['applyConditionalProperties'](recordSchemaProperty, value);

      expect(result.properties).toEqual({
        [BFLITE_URIS.IDENTIFIER_LCCN]: { type: RecordSchemaEntryType.string },
      });
    });

    it('returns original schema when conditionalProperties is not defined', () => {
      const recordSchemaProperty = {
        type: RecordSchemaEntryType.object,
        properties: {
          [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
          [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      const value = {
        label: 'Test Hub',
        meta: { sourceType: 'libraryOfCongress' },
      } as UserValueContents;

      const result = processor['applyConditionalProperties'](recordSchemaProperty, value);

      expect(result).toBe(recordSchemaProperty);
    });

    it('returns original schema when properties is not defined', () => {
      const recordSchemaProperty = {
        type: RecordSchemaEntryType.object,
        options: {
          conditionalProperties: {
            libraryOfCongress: [BFLITE_URIS.LABEL],
          },
        },
      } as RecordSchemaEntry;

      const value = {
        label: 'Test Hub',
        meta: { sourceType: 'libraryOfCongress' },
      } as UserValueContents;

      const result = processor['applyConditionalProperties'](recordSchemaProperty, value);

      expect(result).toBe(recordSchemaProperty);
    });

    it('returns original schema when sourceType is not found', () => {
      const recordSchemaProperty = {
        type: RecordSchemaEntryType.object,
        properties: {
          [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
          [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
        },
        options: {
          conditionalProperties: {
            libraryOfCongress: [BFLITE_URIS.LABEL, BFLITE_URIS.LINK],
          },
        },
      } as RecordSchemaEntry;

      const value = {
        label: 'Test Hub',
      } as UserValueContents;

      const result = processor['applyConditionalProperties'](recordSchemaProperty, value);

      expect(result).toBe(recordSchemaProperty);
    });

    it('warns and returns original schema when sourceType is unknown', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const recordSchemaProperty = {
        type: RecordSchemaEntryType.object,
        properties: {
          [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
          [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
        },
        options: {
          conditionalProperties: {
            libraryOfCongress: [BFLITE_URIS.LABEL, BFLITE_URIS.LINK],
          },
        },
      } as RecordSchemaEntry;

      const value = {
        label: 'Test Hub',
        meta: { sourceType: 'unknownSource' },
      } as UserValueContents;

      const result = processor['applyConditionalProperties'](recordSchemaProperty, value);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown sourceType: unknownSource, using all properties');
      expect(result).toBe(recordSchemaProperty);
      consoleWarnSpy.mockRestore();
    });
  });
});
