import { AdvancedFieldType as AdvancedFieldTypeEnum } from '@common/constants/uiControls.constants';
import { SimpleLookupUserValueService } from '@common/services/userValues/userValueTypes';
import { IUserValueType } from '@common/services/userValues/userValueTypes/userValueType.interface';

describe('SimpleLookupUserValueService', () => {
  const apiClient = { loadSimpleLookupData: jest.fn() } as unknown as IApiClient;
  const cacheService = { save: jest.fn(), getAll: jest.fn(), getById: jest.fn() } as unknown as ILookupCacheService;

  let simpleLookupUserValueService: IUserValueType;

  beforeEach(() => {
    simpleLookupUserValueService = new SimpleLookupUserValueService(apiClient, cacheService);
  });

  async function testSimpleLookupUserValue(data: RecordBasic | RecordBasic[], testResult: UserValue) {
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      labelSelector: 'testLabelSelector_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
      propertyUri: 'testPropertyUri_1',
      groupUri: 'testGroupUri_1',
      fieldUri: 'testFieldUri_1',
    } as UserValueDTO;

    await simpleLookupUserValueService.generate(value);
    const result = simpleLookupUserValueService.getValue();

    expect(result).toEqual(testResult);
  }

  test('generates user value for a single data item', () => {
    const data = {
      testLabelSelector_1: ['test simple lookup label 1'],
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          label: 'test simple lookup label 1',
          meta: {
            parentUri: 'testUri_1',
            type: 'simple',
            uri: 'testOptionUri_1',
          },
        },
      ],
    };

    testSimpleLookupUserValue(data, testResult);
  });

  test('generates user value for an array of data items', () => {
    const data = [
      {
        testLabelSelector_1: ['test simple lookup label 1'],
        testUriSelector_1: ['testOptionUri_1'],
      },
      {
        testLabelSelector_1: ['test simple lookup label 2'],
        testUriSelector_1: ['testOptionUri_2'],
      },
    ] as unknown as RecordBasic[];
    const testResult = {
      uuid: 'testUuid_1',
      contents: [
        {
          label: 'test simple lookup label 1',
          meta: {
            parentUri: 'testUri_1',
            type: 'simple',
            uri: 'testOptionUri_1',
          },
        },
        {
          label: 'test simple lookup label 2',
          meta: {
            parentUri: 'testUri_1',
            type: 'simple',
            uri: 'testOptionUri_2',
          },
        },
      ],
    };

    testSimpleLookupUserValue(data, testResult);
  });
});
