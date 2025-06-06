import { ProfileSchemaProcessorManager } from '@common/services/recordGenerator/processors/profileSchema/profileSchemaProcessorManager';
import { ProfileSchemaManager } from '@common/services/recordGenerator/profileSchemaManager';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import { GroupProcessor } from '@common/services/recordGenerator/processors/profileSchema/groupProcessor';
import { FlattenedDropdownProcessor } from '@common/services/recordGenerator/processors/profileSchema/flattenedDropdownProcessor';
import { DropdownProcessor } from '@common/services/recordGenerator/processors/profileSchema/dropdownProcessor';
import { UnwrappedDropdownOptionProcessor } from '@common/services/recordGenerator/processors/profileSchema/unwrappedDropdownOptionProcessor';
import { LookupProcessor } from '@common/services/recordGenerator/processors/profileSchema/lookupProcessor';

jest.mock('@common/services/recordGenerator/processors/profileSchema/groupProcessor');
jest.mock('@common/services/recordGenerator/processors/profileSchema/flattenedDropdownProcessor');
jest.mock('@common/services/recordGenerator/processors/profileSchema/dropdownProcessor');
jest.mock('@common/services/recordGenerator/processors/profileSchema/unwrappedDropdownOptionProcessor');
jest.mock('@common/services/recordGenerator/processors/profileSchema/lookupProcessor');

describe('ProfileSchemaProcessorManager', () => {
  let manager: ProfileSchemaProcessorManager;
  let mockProfileSchemaManager: jest.Mocked<ProfileSchemaManager>;
  let mockGroupProcessor: jest.Mocked<GroupProcessor>;
  let mockFlattenedDropdownProcessor: jest.Mocked<FlattenedDropdownProcessor>;
  let mockDropdownProcessor: jest.Mocked<DropdownProcessor>;
  let mockUnwrappedDropdownOptionProcessor: jest.Mocked<UnwrappedDropdownOptionProcessor>;
  let mockLookupProcessor: jest.Mocked<LookupProcessor>;

  beforeEach(() => {
    mockProfileSchemaManager = new ProfileSchemaManager() as jest.Mocked<ProfileSchemaManager>;

    (GroupProcessor as jest.Mock).mockImplementation(() => {
      mockGroupProcessor = {
        canProcess: jest.fn(),
        process: jest.fn(),
      } as unknown as jest.Mocked<GroupProcessor>;
      return mockGroupProcessor;
    });

    (FlattenedDropdownProcessor as jest.Mock).mockImplementation(() => {
      mockFlattenedDropdownProcessor = {
        canProcess: jest.fn(),
        process: jest.fn(),
      } as unknown as jest.Mocked<FlattenedDropdownProcessor>;
      return mockFlattenedDropdownProcessor;
    });

    (DropdownProcessor as jest.Mock).mockImplementation(() => {
      mockDropdownProcessor = {
        canProcess: jest.fn(),
        process: jest.fn(),
      } as unknown as jest.Mocked<DropdownProcessor>;
      return mockDropdownProcessor;
    });

    (UnwrappedDropdownOptionProcessor as jest.Mock).mockImplementation(() => {
      mockUnwrappedDropdownOptionProcessor = {
        canProcess: jest.fn(),
        process: jest.fn(),
      } as unknown as jest.Mocked<UnwrappedDropdownOptionProcessor>;
      return mockUnwrappedDropdownOptionProcessor;
    });

    (LookupProcessor as jest.Mock).mockImplementation(() => {
      mockLookupProcessor = {
        canProcess: jest.fn(),
        process: jest.fn(),
      } as unknown as jest.Mocked<LookupProcessor>;
      return mockLookupProcessor;
    });

    manager = new ProfileSchemaProcessorManager(mockProfileSchemaManager);
  });

  describe('constructor', () => {
    it('initializes with all required processors', () => {
      expect(GroupProcessor).toHaveBeenCalledWith(mockProfileSchemaManager);
      expect(FlattenedDropdownProcessor).toHaveBeenCalledWith(
        mockProfileSchemaManager,
        expect.any(ProfileSchemaProcessorManager),
      );
      expect(DropdownProcessor).toHaveBeenCalledWith(
        mockProfileSchemaManager,
        expect.any(ProfileSchemaProcessorManager),
      );
      expect(UnwrappedDropdownOptionProcessor).toHaveBeenCalledWith(
        mockProfileSchemaManager,
        expect.any(ProfileSchemaProcessorManager),
      );
      expect(LookupProcessor).toHaveBeenCalled();
    });
  });

  describe('process', () => {
    let mockProfileSchemaEntry: SchemaEntry;
    let mockRecordSchemaEntry: RecordSchemaEntry;
    let mockUserValues: UserValues;
    let expectedResult: any[];

    beforeEach(() => {
      mockProfileSchemaEntry = {
        uuid: 'test-uuid',
        type: 'test-type',
      } as SchemaEntry;
      mockRecordSchemaEntry = {
        type: RecordSchemaEntryType.string,
      } as RecordSchemaEntry;
      mockUserValues = {
        'test-uuid': {
          contents: [{ label: 'test value' }],
        },
      } as unknown as UserValues;
      expectedResult = [{ value: 'processed value' }];
    });

    it('returns first processor result that can process the entry', () => {
      mockGroupProcessor.canProcess.mockReturnValue(false);
      mockFlattenedDropdownProcessor.canProcess.mockReturnValue(true);
      mockFlattenedDropdownProcessor.process.mockReturnValue(expectedResult);
      mockDropdownProcessor.canProcess.mockReturnValue(true);
      mockUnwrappedDropdownOptionProcessor.canProcess.mockReturnValue(true);
      mockLookupProcessor.canProcess.mockReturnValue(true);

      const result = manager.process(mockProfileSchemaEntry, mockRecordSchemaEntry, mockUserValues);

      expect(mockGroupProcessor.canProcess).toHaveBeenCalledWith(mockProfileSchemaEntry, mockRecordSchemaEntry);
      expect(mockFlattenedDropdownProcessor.canProcess).toHaveBeenCalledWith(
        mockProfileSchemaEntry,
        mockRecordSchemaEntry,
      );
      expect(mockFlattenedDropdownProcessor.process).toHaveBeenCalledWith(
        mockProfileSchemaEntry,
        mockUserValues,
        mockRecordSchemaEntry,
      );
      expect(mockDropdownProcessor.canProcess).not.toHaveBeenCalled();
      expect(mockUnwrappedDropdownOptionProcessor.canProcess).not.toHaveBeenCalled();
      expect(mockLookupProcessor.canProcess).not.toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('returns empty array when no processor can handle the entry', () => {
      mockGroupProcessor.canProcess.mockReturnValue(false);
      mockFlattenedDropdownProcessor.canProcess.mockReturnValue(false);
      mockDropdownProcessor.canProcess.mockReturnValue(false);
      mockUnwrappedDropdownOptionProcessor.canProcess.mockReturnValue(false);
      mockLookupProcessor.canProcess.mockReturnValue(false);

      const result = manager.process(mockProfileSchemaEntry, mockRecordSchemaEntry, mockUserValues);

      expect(mockGroupProcessor.canProcess).toHaveBeenCalledWith(mockProfileSchemaEntry, mockRecordSchemaEntry);
      expect(mockFlattenedDropdownProcessor.canProcess).toHaveBeenCalledWith(
        mockProfileSchemaEntry,
        mockRecordSchemaEntry,
      );
      expect(mockDropdownProcessor.canProcess).toHaveBeenCalledWith(mockProfileSchemaEntry, mockRecordSchemaEntry);
      expect(mockUnwrappedDropdownOptionProcessor.canProcess).toHaveBeenCalledWith(
        mockProfileSchemaEntry,
        mockRecordSchemaEntry,
      );
      expect(mockLookupProcessor.canProcess).toHaveBeenCalledWith(mockProfileSchemaEntry, mockRecordSchemaEntry);
      expect(result).toEqual([]);
    });

    it('checks processors in the correct order', () => {
      mockGroupProcessor.canProcess.mockReturnValue(false);
      mockFlattenedDropdownProcessor.canProcess.mockReturnValue(false);
      mockDropdownProcessor.canProcess.mockReturnValue(false);
      mockUnwrappedDropdownOptionProcessor.canProcess.mockReturnValue(false);
      mockLookupProcessor.canProcess.mockReturnValue(true);
      mockLookupProcessor.process.mockReturnValue(expectedResult);

      const result = manager.process(mockProfileSchemaEntry, mockRecordSchemaEntry, mockUserValues);

      expect(mockGroupProcessor.canProcess).toHaveBeenCalledWith(mockProfileSchemaEntry, mockRecordSchemaEntry);
      expect(mockFlattenedDropdownProcessor.canProcess).toHaveBeenCalledWith(
        mockProfileSchemaEntry,
        mockRecordSchemaEntry,
      );
      expect(mockDropdownProcessor.canProcess).toHaveBeenCalledWith(mockProfileSchemaEntry, mockRecordSchemaEntry);
      expect(mockUnwrappedDropdownOptionProcessor.canProcess).toHaveBeenCalledWith(
        mockProfileSchemaEntry,
        mockRecordSchemaEntry,
      );
      expect(mockLookupProcessor.canProcess).toHaveBeenCalledWith(mockProfileSchemaEntry, mockRecordSchemaEntry);
      expect(mockLookupProcessor.process).toHaveBeenCalledWith(
        mockProfileSchemaEntry,
        mockUserValues,
        mockRecordSchemaEntry,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
