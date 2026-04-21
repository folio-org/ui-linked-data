import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';
import { SimpleEntryProcessor } from '@/common/services/recordGenerator/processors/recordSchema/simpleEntryProcessor';
import { ValueProcessor } from '@/common/services/recordGenerator/processors/value/valueProcessor';
import { ValueOptions } from '@/common/services/recordGenerator/types/value.types';

jest.mock('@/common/services/recordGenerator/processors/value/valueProcessor');

describe('SimpleEntryProcessor', () => {
  let processor: SimpleEntryProcessor;
  let mockValueProcessor: jest.Mocked<ValueProcessor>;
  let userValues: Record<string, any>;
  let selectedEntries: string[];

  beforeEach(() => {
    mockValueProcessor = new ValueProcessor() as jest.Mocked<ValueProcessor>;
    processor = new SimpleEntryProcessor(mockValueProcessor);
    userValues = {};
    selectedEntries = [];
  });

  describe('canProcess', () => {
    it('returns true for string type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;

      const result = processor.canProcess(recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns false for array type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
      } as RecordSchemaEntry;

      const result = processor.canProcess(recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for object type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
      } as RecordSchemaEntry;

      const result = processor.canProcess(recordSchemaEntry);

      expect(result).toBe(false);
    });
  });

  describe('process', () => {
    it('processes entry with default options', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [{ label: 'test value' }],
        },
      } as unknown as UserValues;
      const expectedOptions: ValueOptions = {
        hiddenWrapper: false,
      };
      const expectedResult = {
        value: ['test value'],
        options: expectedOptions,
      };

      mockValueProcessor.process.mockReturnValue(expectedResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
        selectedEntries,
      });

      expect(mockValueProcessor.process).toHaveBeenCalledWith([{ label: 'test value' }], expectedOptions);
      expect(result).toEqual(expectedResult);
    });

    it('processes entry with custom options', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
        options: {
          hiddenWrapper: true,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [{ label: 'test value' }],
        },
      } as unknown as UserValues;
      const expectedOptions: ValueOptions = {
        hiddenWrapper: true,
      };
      const expectedResult = {
        value: ['test value'],
        options: expectedOptions,
      };

      mockValueProcessor.process.mockReturnValue(expectedResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
        selectedEntries,
      });

      expect(mockValueProcessor.process).toHaveBeenCalledWith([{ label: 'test value' }], expectedOptions);
      expect(result).toEqual(expectedResult);
    });

    it('handles missing user values', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;

      const expectedOptions: ValueOptions = {
        hiddenWrapper: false,
      };
      const expectedResult = {
        value: [],
        options: expectedOptions,
      };

      mockValueProcessor.process.mockReturnValue(expectedResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
        selectedEntries,
      });

      expect(mockValueProcessor.process).toHaveBeenCalledWith([], expectedOptions);
      expect(result).toEqual(expectedResult);
    });

    it('handles entry with empty contents', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [],
        },
      } as unknown as UserValues;
      const expectedOptions: ValueOptions = {
        hiddenWrapper: false,
      };
      const expectedResult = {
        value: [],
        options: expectedOptions,
      };

      mockValueProcessor.process.mockReturnValue(expectedResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
        selectedEntries,
      });

      expect(mockValueProcessor.process).toHaveBeenCalledWith([], expectedOptions);
      expect(result).toEqual(expectedResult);
    });
  });
});
