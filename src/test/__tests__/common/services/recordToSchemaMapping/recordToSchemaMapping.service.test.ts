import { ISelectedEntries } from '@common/services/selectedEntries/selectedEntries.interface';
import { IUserValues } from '@common/services/userValues/userValues.interface';
import { SchemaWithDuplicatesService } from '@common/services/schema';
import { RecordToSchemaMappingService } from '@common/services/recordToSchemaMapping';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import * as FeatureConstants from '@common/constants/feature.constants';
import { StatusType } from '@common/constants/status.constants';
import { getLabelEntry, schema } from './data/schema.data';
import { updatedSchema, updatedSchemaWithRepeatableSubcomponents } from './data/updatedSchema.data';
import { mockInstanceTemplateMetadata, record, recordWithRepeatableSubcomponents } from './data/record.data';

const mockedNewBf2ToBFLiteMapping = getMockedImportedConstant(BibframeMappingConstants, 'NEW_BF2_TO_BFLITE_MAPPING');
const mockedBFLiteUris = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
const mockedCustomProfileEnabled = getMockedImportedConstant(FeatureConstants, 'CUSTOM_PROFILE_ENABLED');
mockedNewBf2ToBFLiteMapping({
  block_1: {
    uriBFLite_literal_1: {
      container: { bf2Uri: 'propertyURI_1' },
      fields: {
        uriBFLite_literal_1: { bf2Uri: 'propertyURI_1' },
      },
    },
    uriBFLite_simple_1: {
      container: { bf2Uri: 'bf2Uri_simple_1' },
      fields: {
        uriBFLite_simple_1: { bf2Uri: 'bf2Uri_simple_1' },
      },
    },
    uriBFLite_group_1: {
      container: { bf2Uri: 'propertyURI_2' },
      options: { uriBFLite_option_1: { bf2Uri: 'dropdownOptionResourceURI_1' } },
      fields: {
        uriBFLite_option_literal_1: { bf2Uri: 'dropdownOption_1_PropertyURI_1' },
      },
    },
  },
});
mockedBFLiteUris({ LINK: 'testLinkUri' });

const recordBlocks: RecordBlocksList = ['block_1'];
const selectedEntriesService: ISelectedEntries = {
  set: jest.fn(),
  get: jest.fn(),
  addNew: jest.fn(),
  addDuplicated: jest.fn(),
  remove: jest.fn(),
  removeMultiple: jest.fn(),
};
const repeatableFieldsService: SchemaWithDuplicatesService = {
  duplicateEntry: jest.fn(),
  get: jest.fn(),
} as unknown as SchemaWithDuplicatesService;
const userValuesService: IUserValues = {
  setValue: jest.fn(),
  set: jest.fn(),
  getAllValues: jest.fn(),
  getValue: jest.fn(),
};
const commonStatusService: ICommonStatus = {
  set: jest.fn(),
};

describe('RecordToSchemaMappingService', () => {
  let service: RecordToSchemaMappingService;

  beforeEach(() => {
    service = new RecordToSchemaMappingService(
      selectedEntriesService,
      repeatableFieldsService,
      userValuesService,
      commonStatusService,
    );
  });

  test('returns updated schema', async () => {
    jest.spyOn(repeatableFieldsService, 'get').mockReturnValue(updatedSchema as Schema);

    await service.init({
      schema: schema as Schema,
      record: record as unknown as RecordEntry,
      recordBlocks,
    });

    expect(repeatableFieldsService.duplicateEntry).toHaveBeenCalledWith(
      getLabelEntry({
        uuid: 'testKey-3',
        uri: 'propertyURI_1',
        uriBFLite: 'uriBFLite_literal_1',
        displayName: 'Literal label 1',
        path: ['testKey-1', 'testKey-2', 'testKey-3'],
      }),
      true,
    );
    expect(repeatableFieldsService.get).toHaveBeenCalled();
    expect(selectedEntriesService.addNew).toHaveBeenCalledWith(undefined, 'testKey-7');
    expect(userValuesService.setValue).toHaveBeenCalledTimes(3);
    expect(service.get()).toEqual(updatedSchema);
  });

  test('calls "commonStatusService.set" method', async () => {
    const error = new Error();
    jest.spyOn(repeatableFieldsService, 'get').mockReturnValue(updatedSchema as Schema);
    jest.spyOn(RecordToSchemaMappingService.prototype as any, 'traverseEntries').mockRejectedValue(error);
    const spyLogError = jest
      .spyOn(console, 'error')
      .mockImplementation((message: any, error: Error) => ({ message, error }));

    await service.init({
      schema: schema as Schema,
      record: record as unknown as RecordEntry,
      recordBlocks,
    });

    expect(spyLogError).toHaveBeenCalledWith('Cannot apply a record to the schema:', error);
    expect(commonStatusService.set).toHaveBeenCalledWith('ld.recordMappingToSchema', StatusType.error);
  });

  describe('dropdown options handling', () => {
    beforeEach(() => {
      jest.spyOn(repeatableFieldsService, 'get').mockReturnValue(updatedSchema as Schema);
    });

    test('handles dropdown option when found in schema', async () => {
      const mockRecord = {
        block_1: {
          uriBFLite_group_1: [
            {
              uriBFLite_option_1: [
                {
                  uriBFLite_option_literal_1: ['test value'],
                },
              ],
            },
          ],
        },
      };

      await service.init({
        schema: schema as Schema,
        record: mockRecord as unknown as RecordEntry,
        recordBlocks: ['block_1'],
      });

      expect(selectedEntriesService.remove).toHaveBeenCalledWith('testKey-7');
      expect(selectedEntriesService.addNew).toHaveBeenCalledWith(undefined, 'testKey-7');
    });

    test('does not add dropdown option when not found in schema', async () => {
      const mockRecord = {
        block_1: {
          uriBFLite_group_1: [
            {
              nonexistent_option: [
                {
                  uriBFLite_option_literal_1: ['test value'],
                },
              ],
            },
          ],
        },
      };

      await service.init({
        schema: schema as Schema,
        record: mockRecord as unknown as RecordEntry,
        recordBlocks: ['block_1'],
      });

      expect(selectedEntriesService.addNew).not.toHaveBeenCalledWith(undefined, 'testKey-7');
      expect(selectedEntriesService.remove).toHaveBeenCalledWith('testKey-7');
    });

    test('handles dropdown option when CUSTOM_PROFILE_ENABLED is true', async () => {
      mockedCustomProfileEnabled(true);

      const mockRecord = {
        block_1: {
          uriBFLite_group_1: [
            {
              uriBFLite_option_1: 'test value',
            },
          ],
        },
      };

      await service.init({
        schema: schema as Schema,
        record: mockRecord as unknown as RecordEntry,
        recordBlocks: ['block_1'],
      });

      expect(selectedEntriesService.remove).toHaveBeenCalledWith('testKey-7');
      expect(selectedEntriesService.addNew).toHaveBeenCalledWith(undefined, 'testKey-7');
    });
  });

  test('returns updated schema with repeatable subcomponents', async () => {
    jest.spyOn(repeatableFieldsService, 'get').mockReturnValue(updatedSchemaWithRepeatableSubcomponents as Schema);

    service = new RecordToSchemaMappingService(
      selectedEntriesService,
      repeatableFieldsService,
      userValuesService,
      commonStatusService,
    );

    await service.init({
      schema: schema as Schema,
      record: recordWithRepeatableSubcomponents as unknown as RecordEntry,
      recordBlocks,
    });

    expect(repeatableFieldsService.duplicateEntry).toHaveBeenCalledTimes(2);
    expect(repeatableFieldsService.duplicateEntry).toHaveBeenCalledWith(
      getLabelEntry({
        uuid: 'testKey-9',
        uri: 'dropdownOption_1_PropertyURI_1',
        uriBFLite: 'uriBFLite_option_literal_1',
        displayName: 'Dropdown Option 1 Item 1',
        path: ['testKey-1', 'testKey-2', 'testKey-5', 'testKey-7', 'testKey-9'],
      }),
      true,
    );

    expect(repeatableFieldsService.get).toHaveBeenCalled();
    expect(selectedEntriesService.addNew).toHaveBeenCalledWith(undefined, 'testKey-7');
    expect(userValuesService.setValue).toHaveBeenCalledTimes(5);
    expect(service.get()).toEqual(updatedSchemaWithRepeatableSubcomponents);
  });

  test('applies template to resource', async () => {
    jest.spyOn(repeatableFieldsService, 'get').mockReturnValue(updatedSchema as Schema);

    service = new RecordToSchemaMappingService(
      selectedEntriesService,
      repeatableFieldsService,
      userValuesService,
      commonStatusService,
    );

    await service.init({
      schema: schema as Schema,
      record: record as unknown as RecordEntry,
      recordBlocks,
      templateMetadata: mockInstanceTemplateMetadata,
    });

    expect(userValuesService.setValue).toHaveBeenCalledWith(
      expect.objectContaining({ value: expect.objectContaining({ data: 'mockPrefix literal value 1' }) }),
    );
    expect(userValuesService.setValue).not.toHaveBeenCalledWith(
      expect.objectContaining({ value: expect.objectContaining({ data: 'unreachableMockPrefix' }) }),
    );
  });
});
