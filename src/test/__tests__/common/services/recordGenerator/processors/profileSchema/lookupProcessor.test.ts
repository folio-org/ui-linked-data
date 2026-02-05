import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { LookupProcessor } from '@/common/services/recordGenerator/processors/profileSchema/lookupProcessor';

describe('LookupProcessor', () => {
  let processor: LookupProcessor;
  let selectedEntries: string[];

  beforeEach(() => {
    processor = new LookupProcessor();
    selectedEntries = [];
  });

  describe('canProcess', () => {
    it('returns true for array type entry with object value and complex profile schema entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        type: AdvancedFieldType.complex,
      } as SchemaEntry;

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns true for array type entry with object value and simple profile schema entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        type: AdvancedFieldType.simple,
      } as SchemaEntry;

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns false for array type entry with string value', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        type: AdvancedFieldType.complex,
      } as SchemaEntry;

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for string type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        type: AdvancedFieldType.complex,
      } as SchemaEntry;

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for non-complex/simple profile schema entry type', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        type: 'other' as AdvancedFieldType,
      } as SchemaEntry;

      const result = processor.canProcess(profileSchemaEntry, recordSchemaEntry);

      expect(result).toBe(false);
    });
  });

  describe('process', () => {
    it('returns empty array when user values are empty', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          link: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {} as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
    });

    it('returns empty array when record schema entry has no properties', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: undefined,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [{ label: 'test value' }],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([]);
    });

    it('processes values with basicLabel for term and label properties', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          term: { type: RecordSchemaEntryType.string },
          labelProperty: { type: RecordSchemaEntryType.string },
          displayName: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              label: 'test value',
              meta: { basicLabel: 'Basic Label Value' },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          term: 'Basic Label Value',
          labelProperty: 'Basic Label Value',
          displayName: 'test value',
        },
      ]);
    });

    it('processes values with URI for code properties', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          code: { type: RecordSchemaEntryType.string },
          label: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              label: 'test value',
              meta: { uri: 'http://example.com/resource/123' },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          code: '123',
          label: 'test value',
        },
      ]);
    });

    it('uses label for code properties when uri is missing', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          code: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              label: 'test value',
              meta: { basicLabel: 'Basic Label Value' },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          code: 'test value',
        },
      ]);
    });

    it('uses empty string for code properties when uri and label are missing', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          code: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              meta: { basicLabel: 'Basic Label Value' },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          code: '',
        },
      ]);
    });

    it('uses label for general properties', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          general: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              label: 'test value',
              meta: { uri: 'http://example.com/resource/123' },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          general: 'test value',
        },
      ]);
    });

    it('uses empty string for general properties when label is missing', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          general: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              meta: { uri: 'http://example.com/resource/123' },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          general: '',
        },
      ]);
    });

    it('processes values with srsId property correctly when meta.srsId is present', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          srsId: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              id: 'record-id-123',
              label: 'test value',
              meta: { srsId: 'srs-123' },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          srsId: 'srs-123',
        },
      ]);
    });

    it('processes values with srsId property correctly when meta.srsId is not present', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          srsId: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              id: 'record-id-123',
              label: 'test value',
              meta: { uri: 'http://example.com/resource/123' },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          id: 'record-id-123',
        },
      ]);
    });

    it('processes multiple user value contents correctly', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          link: { type: RecordSchemaEntryType.string },
          term: { type: RecordSchemaEntryType.string },
          code: { type: RecordSchemaEntryType.string },
          general: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              label: 'value 1',
              meta: {
                uri: 'http://example.com/resource/1',
                basicLabel: 'Basic Label 1',
              },
            },
            {
              label: 'value 2',
              meta: {
                uri: 'http://example.com/resource/2',
                basicLabel: 'Basic Label 2',
              },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          link: 'http://example.com/resource/1',
          term: 'Basic Label 1',
          code: '1',
          general: 'value 1',
        },
        {
          link: 'http://example.com/resource/2',
          term: 'Basic Label 2',
          code: '2',
          general: 'value 2',
        },
      ]);
    });

    it('processes array-type properties correctly', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        properties: {
          arrayLabel: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          arrayLink: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
          stringLabel: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: AdvancedFieldType.complex,
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [
            {
              label: 'test value',
              meta: {
                uri: 'http://example.com/resource/1',
                basicLabel: 'Basic Label',
              },
            },
          ],
        },
      } as unknown as UserValues;

      const result = processor.process({ profileSchemaEntry, userValues, selectedEntries, recordSchemaEntry });

      expect(result).toEqual([
        {
          arrayLabel: ['Basic Label'],
          arrayLink: ['http://example.com/resource/1'],
          stringLabel: 'test value',
        },
      ]);
    });
  });
});
