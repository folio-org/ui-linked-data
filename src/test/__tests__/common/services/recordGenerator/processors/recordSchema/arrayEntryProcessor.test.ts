import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { ArrayEntryProcessor } from '@common/services/recordGenerator/processors/recordSchema/arrayEntryProcessor';
import { ProfileSchemaProcessorManager } from '@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager';
import { ProfileSchemaManager } from '@common/services/recordGenerator/profileSchemaManager';
import { ValueProcessor } from '@common/services/recordGenerator/processors/value/valueProcessor';
import { ValueOptions } from '@common/services/recordGenerator/types/value.types';

jest.mock('@common/services/recordGenerator/processors/value/valueProcessor');
jest.mock('@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager');
jest.mock('@common/services/recordGenerator/profileSchemaManager');

describe('ArrayEntryProcessor', () => {
  let processor: ArrayEntryProcessor;
  let mockValueProcessor: jest.Mocked<ValueProcessor>;
  let mockProfileSchemaManager: jest.Mocked<ProfileSchemaManager>;
  let mockProfileSchemaProcessorManager: jest.Mocked<ProfileSchemaProcessorManager>;

  beforeEach(() => {
    mockValueProcessor = new ValueProcessor() as jest.Mocked<ValueProcessor>;
    mockProfileSchemaManager = new ProfileSchemaManager() as jest.Mocked<ProfileSchemaManager>;
    mockProfileSchemaProcessorManager = new ProfileSchemaProcessorManager(
      mockProfileSchemaManager,
    ) as jest.Mocked<ProfileSchemaProcessorManager>;
    processor = new ArrayEntryProcessor(mockValueProcessor, mockProfileSchemaProcessorManager);
  });

  describe('canProcess', () => {
    it('returns true for array type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
      } as RecordSchemaEntry;

      const result = processor.canProcess(recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns false for string type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
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
    it('returns null value when profile schema entry has no type', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: undefined,
      } as SchemaEntry;
      const userValues = {} as UserValues;

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(result).toEqual({
        value: null,
        options: {},
      });
    });

    it('processes string array values correctly', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options: {
          hiddenWrapper: true,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: 'string',
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [{ label: 'value 1' }, { label: 'value 2' }],
        },
      } as unknown as UserValues;
      const expectedOptions: ValueOptions = {
        hiddenWrapper: true,
      };
      const expectedResult = {
        value: ['value 1', 'value 2'],
        options: expectedOptions,
      };

      mockValueProcessor.process.mockReturnValue(expectedResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockValueProcessor.process).toHaveBeenCalledWith(
        [{ label: 'value 1' }, { label: 'value 2' }],
        expectedOptions,
      );
      expect(result).toEqual(expectedResult);
    });

    it('processes schema array values correctly', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: 'object',
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const processedValues = { property_1: 'value 1', property_2: 'value 2' };
      const expectedOptions: ValueOptions = {
        hiddenWrapper: false,
      };
      const expectedResult = {
        value: processedValues,
        options: expectedOptions,
      };

      mockProfileSchemaProcessorManager.process.mockReturnValue(processedValues);
      mockValueProcessor.processSchemaValues.mockReturnValue(expectedResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockProfileSchemaProcessorManager.process).toHaveBeenCalledWith(
        profileSchemaEntry,
        recordSchemaEntry,
        userValues,
      );
      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith(processedValues, expectedOptions);
      expect(result).toEqual(expectedResult);
    });

    it('applies array value container correctly', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options: {
          hiddenWrapper: false,
          valueContainer: {
            property: 'wrapper',
            type: 'array',
          },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: 'string',
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [{ label: 'value 1' }, { label: 'value 2' }],
        },
      } as unknown as UserValues;

      const valueProcessorResult = {
        value: ['value 1', 'value 2'],
        options: { hiddenWrapper: false },
      };

      const expectedResult = {
        value: [{ wrapper: ['value 1'] }, { wrapper: ['value 2'] }],
        options: { hiddenWrapper: false },
      };

      mockValueProcessor.process.mockReturnValue(valueProcessorResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockValueProcessor.process).toHaveBeenCalledWith([{ label: 'value 1' }, { label: 'value 2' }], {
        hiddenWrapper: false,
      });
      expect(result).toEqual(expectedResult);
    });

    it('applies object value container correctly', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options: {
          hiddenWrapper: false,
          valueContainer: {
            property: 'wrapper',
            type: 'object',
          },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: 'string',
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [{ label: 'value 1' }, { label: 'value 2' }],
        },
      } as unknown as UserValues;

      const valueProcessorResult = {
        value: ['value 1', 'value 2'],
        options: { hiddenWrapper: false },
      };

      const expectedResult = {
        value: [{ wrapper: 'value 1' }, { wrapper: 'value 2' }],
        options: { hiddenWrapper: false },
      };

      mockValueProcessor.process.mockReturnValue(valueProcessorResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockValueProcessor.process).toHaveBeenCalledWith([{ label: 'value 1' }, { label: 'value 2' }], {
        hiddenWrapper: false,
      });
      expect(result).toEqual(expectedResult);
    });

    it('handles non-array value when applying container', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.object,
        options: {
          hiddenWrapper: false,
          valueContainer: {
            property: 'wrapper',
            type: 'array',
          },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: 'object',
      } as SchemaEntry;
      const userValues = {} as UserValues;

      const processedValues = { property_1: 'value 1' };
      const valueProcessorResult = {
        value: processedValues,
        options: { hiddenWrapper: false },
      };

      const expectedResult = {
        value: [{ wrapper: [{ property_1: 'value 1' }] }],
        options: { hiddenWrapper: false },
      };

      mockProfileSchemaProcessorManager.process.mockReturnValue(processedValues);
      mockValueProcessor.processSchemaValues.mockReturnValue(valueProcessorResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockProfileSchemaProcessorManager.process).toHaveBeenCalledWith(
        profileSchemaEntry,
        recordSchemaEntry,
        userValues,
      );
      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith(processedValues, { hiddenWrapper: false });
      expect(result).toEqual(expectedResult);
    });

    it('returns original result when container is not specified', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options: {
          hiddenWrapper: true,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: 'string',
      } as SchemaEntry;
      const userValues = {
        'test-uuid': {
          contents: [{ label: 'value 1' }],
        },
      } as unknown as UserValues;

      const expectedResult = {
        value: ['value 1'],
        options: { hiddenWrapper: true },
      };

      mockValueProcessor.process.mockReturnValue(expectedResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockValueProcessor.process).toHaveBeenCalledWith([{ label: 'value 1' }], { hiddenWrapper: true });
      expect(result).toEqual(expectedResult);
    });

    it('returns original result when value is null or undefined', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
        value: RecordSchemaEntryType.string,
        options: {
          hiddenWrapper: true,
          valueContainer: {
            property: 'wrapper',
            type: 'array',
          },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        type: 'string',
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const expectedResult = {
        value: null,
        options: { hiddenWrapper: true },
      };

      mockValueProcessor.process.mockReturnValue(
        expectedResult as unknown as { value: string[]; options: ValueOptions },
      );

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockValueProcessor.process).toHaveBeenCalledWith(undefined, { hiddenWrapper: true });
      expect(result).toEqual(expectedResult);
    });
  });
});
