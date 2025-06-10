import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { ObjectEntryProcessor } from '@common/services/recordGenerator/processors/recordSchema/objectEntryProcessor';
import { ValueProcessor } from '@common/services/recordGenerator/processors/value/valueProcessor';
import { ProfileSchemaManager } from '@common/services/recordGenerator/profileSchemaManager';
import { RecordSchemaEntryManager } from '@common/services/recordGenerator/processors/recordSchema/recordSchemaEntryManager';
import { ValueResult } from '@common/services/recordGenerator/types/value.types';

jest.mock('@common/services/recordGenerator/processors/value/valueProcessor');
jest.mock('@common/services/recordGenerator/profileSchemaManager');
jest.mock('@common/services/recordGenerator/processors/recordSchema/recordSchemaEntryManager');

describe('ObjectEntryProcessor', () => {
  let processor: ObjectEntryProcessor;
  let mockValueProcessor: jest.Mocked<ValueProcessor>;
  let mockProfileSchemaManager: jest.Mocked<ProfileSchemaManager>;
  let mockRecordSchemaEntryManager: jest.Mocked<RecordSchemaEntryManager>;

  beforeEach(() => {
    mockValueProcessor = new ValueProcessor() as jest.Mocked<ValueProcessor>;
    mockProfileSchemaManager = new ProfileSchemaManager() as jest.Mocked<ProfileSchemaManager>;
    mockRecordSchemaEntryManager = {
      processEntry: jest.fn(),
    } as unknown as jest.Mocked<RecordSchemaEntryManager>;
    processor = new ObjectEntryProcessor(mockValueProcessor, mockProfileSchemaManager, mockRecordSchemaEntryManager);
  });

  describe('canProcess', () => {
    it('returns true for object type entry with properties', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;

      const result = processor.canProcess(recordSchemaEntry);

      expect(result).toBe(true);
    });

    it('returns false for object type entry without properties', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: undefined,
      } as RecordSchemaEntry;

      const result = processor.canProcess(recordSchemaEntry);

      expect(result).toBe(false);
    });

    it('returns false for non-object type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;

      const result = processor.canProcess(recordSchemaEntry);

      expect(result).toBe(false);
    });
  });

  describe('process', () => {
    it('returns empty object when properties are not defined', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: undefined,
        options: {
          hiddenWrapper: true,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const expectedOptions = {
        hiddenWrapper: true,
      };
      const expectedResult = {
        value: {},
        options: expectedOptions,
      };

      mockValueProcessor.processSchemaValues.mockReturnValue(expectedResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith({}, expectedOptions);
      expect(result).toEqual(expectedResult);
    });

    it('processes object properties correctly', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_uri_1: { type: RecordSchemaEntryType.string },
          property_uri_2: { type: RecordSchemaEntryType.string },
        },
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        path: ['parent_1', 'child_1'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const childEntry_1 = { uuid: 'child_uuid_1' } as SchemaEntry;
      const childEntry_2 = { uuid: 'child_uuid_2' } as SchemaEntry;
      const childResult_1 = {
        value: 'string value 1',
        options: {},
      } as ValueResult;
      const childResult_2 = {
        value: 'string value 2',
        options: {},
      } as ValueResult;
      const expectedOptions = {
        hiddenWrapper: false,
      };
      const expectedProcessResult = {
        value: {
          property_uri_1: 'string value 1',
          property_uri_2: 'string value 2',
        },
        options: expectedOptions,
      };

      mockProfileSchemaManager.findSchemaEntriesByUriBFLite
        .mockReturnValueOnce([childEntry_1])
        .mockReturnValueOnce([childEntry_2]);
      mockRecordSchemaEntryManager.processEntry.mockReturnValueOnce(childResult_1).mockReturnValueOnce(childResult_2);
      mockValueProcessor.processSchemaValues.mockReturnValue(expectedProcessResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockProfileSchemaManager.findSchemaEntriesByUriBFLite).toHaveBeenCalledWith('property_uri_1', [
        'parent_1',
        'child_1',
      ]);
      expect(mockProfileSchemaManager.findSchemaEntriesByUriBFLite).toHaveBeenCalledWith('property_uri_2', [
        'parent_1',
        'child_1',
      ]);
      expect(mockRecordSchemaEntryManager.processEntry).toHaveBeenCalledWith({
        recordSchemaEntry: { type: RecordSchemaEntryType.string },
        userValues,
        profileSchemaEntry: childEntry_1,
      });
      expect(mockRecordSchemaEntryManager.processEntry).toHaveBeenCalledWith({
        recordSchemaEntry: { type: RecordSchemaEntryType.string },
        userValues,
        profileSchemaEntry: childEntry_2,
      });
      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith(
        {
          property_uri_1: 'string value 1',
          property_uri_2: 'string value 2',
        },
        expectedOptions,
      );
      expect(result).toEqual(expectedProcessResult);
    });

    it('handles empty child entries', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_uri_1: { type: RecordSchemaEntryType.string },
        },
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        path: ['parent_1', 'child_1'],
      } as SchemaEntry;
      const userValues = {} as UserValues;

      const expectedOptions = {
        hiddenWrapper: false,
      };
      const expectedProcessResult = {
        value: {},
        options: expectedOptions,
      };

      mockProfileSchemaManager.findSchemaEntriesByUriBFLite.mockReturnValue([]);
      mockValueProcessor.processSchemaValues.mockReturnValue(expectedProcessResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockProfileSchemaManager.findSchemaEntriesByUriBFLite).toHaveBeenCalledWith('property_uri_1', [
        'parent_1',
        'child_1',
      ]);
      expect(mockRecordSchemaEntryManager.processEntry).not.toHaveBeenCalled();
      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith({}, expectedOptions);
      expect(result).toEqual(expectedProcessResult);
    });

    it('handles null child result value', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_uri_1: { type: RecordSchemaEntryType.string },
        },
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        path: ['parent_1', 'child_1'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const childEntry_1 = { uuid: 'child_uuid_1' } as SchemaEntry;
      const childResult_1 = {
        value: null,
        options: {},
      };
      const expectedOptions = {
        hiddenWrapper: false,
      };
      const expectedProcessResult = {
        value: {},
        options: expectedOptions,
      };

      mockProfileSchemaManager.findSchemaEntriesByUriBFLite.mockReturnValueOnce([childEntry_1]);
      mockRecordSchemaEntryManager.processEntry.mockReturnValueOnce(childResult_1);
      mockValueProcessor.processSchemaValues.mockReturnValue(expectedProcessResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockProfileSchemaManager.findSchemaEntriesByUriBFLite).toHaveBeenCalledWith('property_uri_1', [
        'parent_1',
        'child_1',
      ]);
      expect(mockRecordSchemaEntryManager.processEntry).toHaveBeenCalledWith({
        recordSchemaEntry: { type: RecordSchemaEntryType.string },
        userValues,
        profileSchemaEntry: childEntry_1,
      });
      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith({}, expectedOptions);
      expect(result).toEqual(expectedProcessResult);
    });

    it('processes array property with hiddenWrapper option', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.object,
          },
        },
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        path: ['parent_1', 'child_1'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const childEntry_1 = { uuid: 'child_uuid_1' } as SchemaEntry;
      const childResult_1: ValueResult = {
        value: [{ nested_property: 'nested value' }],
        options: {
          hiddenWrapper: true,
        },
      };
      const expectedOptions = {
        hiddenWrapper: false,
      };
      const expectedProcessResult = {
        value: {
          nested_property: 'nested value',
        },
        options: expectedOptions,
      };

      mockProfileSchemaManager.findSchemaEntriesByUriBFLite.mockReturnValueOnce([childEntry_1]);
      mockRecordSchemaEntryManager.processEntry.mockReturnValueOnce(childResult_1);
      mockValueProcessor.processSchemaValues.mockReturnValue(expectedProcessResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockProfileSchemaManager.findSchemaEntriesByUriBFLite).toHaveBeenCalledWith('property_uri_1', [
        'parent_1',
        'child_1',
      ]);
      expect(mockRecordSchemaEntryManager.processEntry).toHaveBeenCalledWith({
        recordSchemaEntry: {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.object,
        },
        userValues,
        profileSchemaEntry: childEntry_1,
      });
      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith(
        {
          nested_property: 'nested value',
        },
        expectedOptions,
      );
      expect(result).toEqual(expectedProcessResult);
    });

    it('processes array property without hiddenWrapper option', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        path: ['parent_1', 'child_1'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const childEntry_1 = { uuid: 'child_uuid_1' } as SchemaEntry;
      const childResult_1: ValueResult = {
        value: ['value_1', 'value_2'],
        options: {
          hiddenWrapper: false,
        },
      };
      const expectedOptions = {
        hiddenWrapper: false,
      };
      const expectedProcessResult = {
        value: {
          property_uri_1: ['value_1', 'value_2'],
        },
        options: expectedOptions,
      };

      mockProfileSchemaManager.findSchemaEntriesByUriBFLite.mockReturnValueOnce([childEntry_1]);
      mockRecordSchemaEntryManager.processEntry.mockReturnValueOnce(childResult_1);
      mockValueProcessor.processSchemaValues.mockReturnValue(expectedProcessResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });
      expect(mockProfileSchemaManager.findSchemaEntriesByUriBFLite).toHaveBeenCalledWith('property_uri_1', [
        'parent_1',
        'child_1',
      ]);
      expect(mockRecordSchemaEntryManager.processEntry).toHaveBeenCalledWith({
        recordSchemaEntry: {
          type: RecordSchemaEntryType.array,
          value: RecordSchemaEntryType.string,
        },
        userValues,
        profileSchemaEntry: childEntry_1,
      });
      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith(
        {
          property_uri_1: ['value_1', 'value_2'],
        },
        expectedOptions,
      );
      expect(result).toEqual(expectedProcessResult);
    });

    it('merges array values correctly when property already exists', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        path: ['parent_1', 'child_1'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const childEntry_1 = { uuid: 'child_uuid_1' } as SchemaEntry;
      const childEntry_2 = { uuid: 'child_uuid_2' } as SchemaEntry;
      const childResult_1: ValueResult = {
        value: ['value_1', 'value_2'],
        options: {
          hiddenWrapper: false,
        },
      };
      const childResult_2: ValueResult = {
        value: ['value_3', 'value_4'],
        options: {
          hiddenWrapper: false,
        },
      };
      const expectedOptions = {
        hiddenWrapper: false,
      };
      const expectedProcessResult = {
        value: {
          property_uri_1: ['value_1', 'value_2', 'value_3', 'value_4'],
        },
        options: expectedOptions,
      };

      mockProfileSchemaManager.findSchemaEntriesByUriBFLite.mockReturnValueOnce([childEntry_1, childEntry_2]);

      mockRecordSchemaEntryManager.processEntry.mockReturnValueOnce(childResult_1).mockReturnValueOnce(childResult_2);

      mockValueProcessor.processSchemaValues.mockReturnValue(expectedProcessResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockProfileSchemaManager.findSchemaEntriesByUriBFLite).toHaveBeenCalledWith('property_uri_1', [
        'parent_1',
        'child_1',
      ]);
      expect(mockRecordSchemaEntryManager.processEntry).toHaveBeenCalledTimes(2);
      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith(
        {
          property_uri_1: ['value_1', 'value_2', 'value_3', 'value_4'],
        },
        expectedOptions,
      );
      expect(result).toEqual(expectedProcessResult);
    });

    it('handles non-array value in processRegularArray', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        path: ['parent_1', 'child_1'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const childEntry_1 = { uuid: 'child_uuid_1' } as SchemaEntry;
      const childResult_1: ValueResult = {
        value: 'not an array',
        options: {
          hiddenWrapper: false,
        },
      };
      const expectedOptions = {
        hiddenWrapper: false,
      };
      const expectedProcessResult = {
        value: {
          property_uri_1: ['not an array'],
        },
        options: expectedOptions,
      };

      mockProfileSchemaManager.findSchemaEntriesByUriBFLite.mockReturnValueOnce([childEntry_1]);
      mockRecordSchemaEntryManager.processEntry.mockReturnValueOnce(childResult_1);
      mockValueProcessor.processSchemaValues.mockReturnValue(expectedProcessResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith(
        {
          property_uri_1: ['not an array'],
        },
        expectedOptions,
      );
      expect(result).toEqual(expectedProcessResult);
    });

    it('handles non-object value in processHiddenWrapperArray', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.string,
          },
        },
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        path: ['parent_1', 'child_1'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const childEntry_1 = { uuid: 'child_uuid_1' } as SchemaEntry;
      const childResult_1: ValueResult = {
        value: ['simple string'],
        options: {
          hiddenWrapper: true,
        },
      };
      const expectedOptions = {
        hiddenWrapper: false,
      };
      const expectedProcessResult = {
        value: {},
        options: expectedOptions,
      };

      mockProfileSchemaManager.findSchemaEntriesByUriBFLite.mockReturnValueOnce([childEntry_1]);
      mockRecordSchemaEntryManager.processEntry.mockReturnValueOnce(childResult_1);
      mockValueProcessor.processSchemaValues.mockReturnValue(expectedProcessResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith({}, expectedOptions);
      expect(result).toEqual(expectedProcessResult);
    });

    it('merges existing values properly in processHiddenWrapperArray', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        properties: {
          property_uri_1: {
            type: RecordSchemaEntryType.array,
            value: RecordSchemaEntryType.object,
          },
        },
        options: {
          hiddenWrapper: false,
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
        path: ['parent_1', 'child_1'],
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const childEntry_1 = { uuid: 'child_uuid_1' } as SchemaEntry;
      const childEntry_2 = { uuid: 'child_uuid_2' } as SchemaEntry;
      const childResult_1: ValueResult = {
        value: [{ property1: 'value_1', property2: 'value_2' }],
        options: {
          hiddenWrapper: true,
        },
      };
      const childResult_2: ValueResult = {
        value: [{ property1: 'value_1-more', property3: 'value_3' }],
        options: {
          hiddenWrapper: true,
        },
      };
      const expectedOptions = {
        hiddenWrapper: false,
      };
      const expectedProcessResult = {
        value: {
          property1: 'value_1-more',
          property2: 'value_2',
          property3: 'value_3',
        },
        options: expectedOptions,
      };

      mockProfileSchemaManager.findSchemaEntriesByUriBFLite.mockReturnValueOnce([childEntry_1, childEntry_2]);
      mockRecordSchemaEntryManager.processEntry.mockReturnValueOnce(childResult_1).mockReturnValueOnce(childResult_2);
      mockValueProcessor.processSchemaValues.mockReturnValue(expectedProcessResult);

      const result = processor.process({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockProfileSchemaManager.findSchemaEntriesByUriBFLite).toHaveBeenCalledWith('property_uri_1', [
        'parent_1',
        'child_1',
      ]);
      expect(mockRecordSchemaEntryManager.processEntry).toHaveBeenCalledTimes(2);
      expect(mockValueProcessor.processSchemaValues).toHaveBeenCalledWith(
        {
          property1: 'value_1-more',
          property2: 'value_2',
          property3: 'value_3',
        },
        expectedOptions,
      );
      expect(result).toEqual(expectedProcessResult);
    });
  });
});
