import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { AdvancedFieldType as AdvancedFieldTypeEnum } from '@/common/constants/uiControls.constants';
import { UserValuesService } from '@/common/services/userValues';
import { IUserValues } from '@/common/services/userValues/userValues.interface';

jest.mock('@/common/services/userValues/userValueTypes/simpleLookup.ts', () => ({
  SimpleLookupUserValueService: class SimpleLookupUserValueService {
    private generatedValue?: UserValue;

    constructor() {
      this.generatedValue = undefined;
    }

    generate({ data, uuid, uri, type, fieldUri }: UserValueDTO) {
      const typedData = data as RecordBasic;

      this.generatedValue = {
        uuid: uuid || '',
        contents: [
          {
            label: typedData[BFLITE_URIS.LABEL]?.[0] || '',
            meta: {
              parentUri: uri,
              uri: fieldUri,
              type,
            },
          },
        ],
      };

      return this.generatedValue;
    }
  },
}));

describe('UserValuesService', () => {
  const apiClient = { loadSimpleLookupData: jest.fn() } as unknown as IApiClient;
  const cacheService = { save: jest.fn(), getAll: jest.fn(), getById: jest.fn() } as unknown as ILookupCacheService;

  let userValuesService: IUserValues;

  beforeEach(() => {
    userValuesService = new UserValuesService({}, apiClient, cacheService);
  });

  test('sets a user value for Literal field', async () => {
    const testResult = {
      testKey_1: {
        contents: [{ label: 'test literal value 1' }],
        uuid: 'testKey_1',
      },
    };

    await userValuesService.setValue({
      type: AdvancedFieldTypeEnum.literal as AdvancedFieldType,
      key: 'testKey_1',
      value: {
        data: 'test literal value 1',
        uuid: 'testUuid_1',
      },
    });
    const result = userValuesService.getAllValues();

    expect(result).toEqual(testResult);
  });

  test('sets a user value for Simple lookup field', async () => {
    const testResult = {
      testKey_2: {
        contents: [
          {
            label: 'test simple value 1',
            meta: {
              parentUri: 'testUri_1',
              type: 'simple',
              uri: 'testFieldUri_1',
            },
          },
        ],
        uuid: 'testKey_2',
      },
    };

    await userValuesService.setValue({
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
      key: 'testKey_2',
      value: {
        data: {
          [BFLITE_URIS.LABEL]: ['test simple value 1'],
          testKey_2: ['test simple value 2'],
        },
        uuid: 'testUuid_1',
        uri: 'testUri_1',
        type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
        fieldUri: 'testFieldUri_1',
      },
    });
    const result = userValuesService.getAllValues();

    expect(result).toEqual(testResult);
  });

  test('sets a user value for Enumerated field', async () => {
    const testResult = {
      testKey_2: {
        contents: [
          {
            label: 'testValue_1',
            meta: {
              basicLabel: 'testValue_1',
              type: 'enumerated',
              uri: 'testValue_1',
            },
          },
        ],
        uuid: 'testKey_2',
      },
    };

    await userValuesService.setValue({
      type: AdvancedFieldTypeEnum.enumerated as AdvancedFieldType,
      key: 'testKey_2',
      value: {
        data: 'testValue_1',
        uuid: 'testUuid_1',
        type: AdvancedFieldTypeEnum.enumerated as AdvancedFieldType,
      },
    });
    const result = userValuesService.getAllValues();

    expect(result).toEqual(testResult);
  });

  test('sets a user value for Complex lookup field', async () => {
    const testResult = {
      testKey_1: {
        contents: [
          {
            id: 'testId_1',
            label: 'test complex value 1',
            meta: {
              type: AdvancedFieldTypeEnum.complex,
            },
          },
        ],
        uuid: 'testKey_1',
      },
    };

    await userValuesService.setValue({
      type: AdvancedFieldTypeEnum.complex as AdvancedFieldType,
      key: 'testKey_1',
      value: {
        id: 'testId_1',
        data: ['test complex value 1'],
        uuid: 'testUuid_1',
        type: AdvancedFieldTypeEnum.complex as AdvancedFieldType,
      },
    });
    const result = userValuesService.getAllValues();

    expect(result).toEqual(testResult);
  });
});
