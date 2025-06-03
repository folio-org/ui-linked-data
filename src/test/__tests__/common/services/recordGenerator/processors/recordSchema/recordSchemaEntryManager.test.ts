import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { RecordSchemaEntryManager } from '@common/services/recordGenerator/processors/recordSchema/recordSchemaEntryManager';
import { ProfileSchemaManager } from '@common/services/recordGenerator/profileSchemaManager';
import { ValueProcessor } from '@common/services/recordGenerator/processors/value/valueProcessor';
import { ProfileSchemaProcessorManager } from '@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager';
import { ArrayEntryProcessor } from '@common/services/recordGenerator/processors/recordSchema/arrayEntryProcessor';
import { ObjectEntryProcessor } from '@common/services/recordGenerator/processors/recordSchema/objectEntryProcessor';
import { SimpleEntryProcessor } from '@common/services/recordGenerator/processors/recordSchema/simpleEntryProcessor';
import { ValueOptions } from '@common/services/recordGenerator/types/value.types';

jest.mock('@common/services/recordGenerator/processors/value/valueProcessor');
jest.mock('@common/services/recordGenerator/profileSchemaManager');
jest.mock('@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager');
jest.mock('@common/services/recordGenerator/processors/recordSchema/arrayEntryProcessor');
jest.mock('@common/services/recordGenerator/processors/recordSchema/objectEntryProcessor');
jest.mock('@common/services/recordGenerator/processors/recordSchema/simpleEntryProcessor');

describe('RecordSchemaEntryManager', () => {
  let manager: RecordSchemaEntryManager;
  let mockValueProcessor: jest.Mocked<ValueProcessor>;
  let mockProfileSchemaManager: jest.Mocked<ProfileSchemaManager>;
  let mockProfileSchemaProcessorManager: jest.Mocked<ProfileSchemaProcessorManager>;
  let mockArrayEntryProcessor: jest.Mocked<ArrayEntryProcessor>;
  let mockObjectEntryProcessor: jest.Mocked<ObjectEntryProcessor>;
  let mockSimpleEntryProcessor: jest.Mocked<SimpleEntryProcessor>;

  beforeEach(() => {
    mockValueProcessor = new ValueProcessor() as jest.Mocked<ValueProcessor>;
    mockProfileSchemaManager = new ProfileSchemaManager() as jest.Mocked<ProfileSchemaManager>;
    mockProfileSchemaProcessorManager = new ProfileSchemaProcessorManager(
      mockProfileSchemaManager,
    ) as jest.Mocked<ProfileSchemaProcessorManager>;
    mockArrayEntryProcessor = {
      canProcess: jest.fn(),
      process: jest.fn(),
    } as unknown as jest.Mocked<ArrayEntryProcessor>;
    mockObjectEntryProcessor = {
      canProcess: jest.fn(),
      process: jest.fn(),
    } as unknown as jest.Mocked<ObjectEntryProcessor>;
    mockSimpleEntryProcessor = {
      canProcess: jest.fn(),
      process: jest.fn(),
    } as unknown as jest.Mocked<SimpleEntryProcessor>;

    (ArrayEntryProcessor as jest.Mock).mockImplementation(() => mockArrayEntryProcessor);
    (ObjectEntryProcessor as jest.Mock).mockImplementation(() => mockObjectEntryProcessor);
    (SimpleEntryProcessor as jest.Mock).mockImplementation(() => mockSimpleEntryProcessor);

    manager = new RecordSchemaEntryManager(
      mockValueProcessor,
      mockProfileSchemaProcessorManager,
      mockProfileSchemaManager,
    );
  });

  describe('constructor', () => {
    it('initializes processors correctly', () => {
      expect(ArrayEntryProcessor).toHaveBeenCalledWith(mockValueProcessor, mockProfileSchemaProcessorManager);
      expect(ObjectEntryProcessor).toHaveBeenCalledWith(mockValueProcessor, mockProfileSchemaManager, manager);
      expect(SimpleEntryProcessor).toHaveBeenCalledWith(mockValueProcessor);
    });
  });

  describe('processEntry', () => {
    it('uses correct processor for string type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const expectedOptions: ValueOptions = {
        hiddenWrapper: false,
      };
      const expectedResult = {
        value: ['test value'],
        options: expectedOptions,
      };

      mockSimpleEntryProcessor.canProcess.mockReturnValue(true);
      mockArrayEntryProcessor.canProcess.mockReturnValue(false);
      mockObjectEntryProcessor.canProcess.mockReturnValue(false);
      mockSimpleEntryProcessor.process.mockReturnValue(expectedResult);

      const result = manager.processEntry({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockSimpleEntryProcessor.canProcess).toHaveBeenCalledWith(recordSchemaEntry);
      expect(mockSimpleEntryProcessor.process).toHaveBeenCalledWith({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });
      expect(result).toEqual(expectedResult);
    });

    it('uses correct processor for array type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.array,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const expectedOptions: ValueOptions = {
        hiddenWrapper: false,
      };
      const expectedResult = {
        value: ['test value 1', 'test value 2'],
        options: expectedOptions,
      };

      mockSimpleEntryProcessor.canProcess.mockReturnValue(false);
      mockArrayEntryProcessor.canProcess.mockReturnValue(true);
      mockObjectEntryProcessor.canProcess.mockReturnValue(false);
      mockArrayEntryProcessor.process.mockReturnValue(expectedResult);

      const result = manager.processEntry({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockArrayEntryProcessor.canProcess).toHaveBeenCalledWith(recordSchemaEntry);
      expect(mockArrayEntryProcessor.process).toHaveBeenCalledWith({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });
      expect(result).toEqual(expectedResult);
    });

    it('uses correct processor for object type entry', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.object,
        fields: {
          field_1: { type: RecordSchemaEntryType.string },
        },
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;
      const userValues = {} as UserValues;
      const expectedOptions: ValueOptions = {
        hiddenWrapper: false,
      };
      const expectedResult = {
        value: { field_1: 'test value' },
        options: expectedOptions,
      };

      mockSimpleEntryProcessor.canProcess.mockReturnValue(false);
      mockArrayEntryProcessor.canProcess.mockReturnValue(false);
      mockObjectEntryProcessor.canProcess.mockReturnValue(true);
      mockObjectEntryProcessor.process.mockReturnValue(expectedResult);

      const result = manager.processEntry({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockObjectEntryProcessor.canProcess).toHaveBeenCalledWith(recordSchemaEntry);
      expect(mockObjectEntryProcessor.process).toHaveBeenCalledWith({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });
      expect(result).toEqual(expectedResult);
    });

    it('throws error when no processor is found for entry type', () => {
      const recordSchemaEntry = {
        type: 'unknown-type',
      } as unknown as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;
      const userValues = {} as UserValues;

      mockSimpleEntryProcessor.canProcess.mockReturnValue(false);
      mockArrayEntryProcessor.canProcess.mockReturnValue(false);
      mockObjectEntryProcessor.canProcess.mockReturnValue(false);

      expect(() => {
        manager.processEntry({
          recordSchemaEntry,
          profileSchemaEntry,
          userValues,
        });
      }).toThrow(`No processor found for entry type: unknown-type`);
    });
  });

  describe('processor selection priority', () => {
    it('checks processors in the correct order', () => {
      const recordSchemaEntry = {
        type: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;
      const profileSchemaEntry = {
        uuid: 'test-uuid',
      } as SchemaEntry;
      const userValues = {} as UserValues;

      mockArrayEntryProcessor.canProcess.mockReturnValue(true);
      mockObjectEntryProcessor.canProcess.mockReturnValue(true);
      mockSimpleEntryProcessor.canProcess.mockReturnValue(true);
      mockArrayEntryProcessor.process.mockReturnValue({
        value: [],
        options: {},
      });

      manager.processEntry({
        recordSchemaEntry,
        profileSchemaEntry,
        userValues,
      });

      expect(mockArrayEntryProcessor.process).toHaveBeenCalled();
      expect(mockObjectEntryProcessor.process).not.toHaveBeenCalled();
      expect(mockSimpleEntryProcessor.process).not.toHaveBeenCalled();
    });
  });
});
