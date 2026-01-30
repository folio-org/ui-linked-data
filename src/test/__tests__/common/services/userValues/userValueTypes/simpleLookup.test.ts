import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

import { waitFor } from '@testing-library/react';

import * as BibframeConstants from '@/common/constants/bibframeMapping.constants';
import { AdvancedFieldType as AdvancedFieldTypeEnum } from '@/common/constants/uiControls.constants';
import * as CommonHelper from '@/common/helpers/common.helper';
import { filterLookupOptionsByMappedValue, formatLookupOptions } from '@/common/helpers/lookupOptions.helper';
import { SimpleLookupUserValueService } from '@/common/services/userValues/userValueTypes';
import { IUserValueType } from '@/common/services/userValues/userValueTypes/userValueType.interface';

const mockBfliteUris = getMockedImportedConstant(BibframeConstants, 'BFLITE_URIS');
mockBfliteUris({
  NAME: 'http://bibfra.me/vocab/lite/name',
  LABEL: 'http://bibfra.me/vocab/lite/label',
  TERM: 'http://bibfra.me/vocab/lite/term',
  LINK: 'testLinkUri',
});

const mockBfliteTypesMap = getMockedImportedConstant(BibframeConstants, 'BFLITE_TYPES_MAP');
mockBfliteTypesMap({
  testGroupUri_1: {
    data: {
      testItemUri_1: {
        uri: 'mappedUri_1',
      },
    },
    fields: {
      testFieldUri_1: {
        data: {
          testItemUri_2: {
            uri: 'mappedUri_2',
          },
        },
      },
    },
  },
});

const mockDefaultGroupValues = getMockedImportedConstant(BibframeConstants, 'DEFAULT_GROUP_VALUES');
mockDefaultGroupValues({
  testGroupUri_2: {
    value: 'defaultItemUri_1',
  },
});

jest.mock('@/common/helpers/lookupOptions.helper', () => ({
  filterLookupOptionsByMappedValue: jest.fn(),
  formatLookupOptions: jest.fn(),
}));

const mockAlphabeticSortLabel = getMockedImportedConstant(CommonHelper, 'alphabeticSortLabel');
mockAlphabeticSortLabel(() => 0);

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

    const result = await waitFor(() => simpleLookupUserValueService.generate(value));

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

  test('uses cached data when available', async () => {
    const mockCachedData = [
      {
        label: 'cached option label',
        value: {
          label: 'basic cached label',
          uri: 'testOptionUri_1',
        },
        __isNew__: false,
      },
    ];
    (cacheService.getById as jest.Mock).mockReturnValue(mockCachedData);
    const data = {
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(cacheService.getById).toHaveBeenCalledWith('testUri_1');
    expect(apiClient.loadSimpleLookupData).not.toHaveBeenCalled();
    expect(result).toEqual({
      uuid: 'testUuid_1',
      contents: [
        {
          label: 'cached option label',
          meta: {
            parentUri: 'testUri_1',
            type: 'simple',
            uri: 'testOptionUri_1',
            basicLabel: 'basic cached label',
          },
        },
      ],
    });
  });

  test('loads data when cache is empty', async () => {
    (cacheService.getById as jest.Mock).mockReturnValue(null);
    const mockApiResponse = { data: [{ name: 'Test Option' }] };
    const mockFormattedData = [
      {
        label: 'Test Option',
        value: { label: 'Test Option', uri: 'testOptionUri_1' },
        __isNew__: false,
      },
    ];

    (apiClient.loadSimpleLookupData as jest.Mock).mockResolvedValue(mockApiResponse);
    (formatLookupOptions as jest.Mock).mockReturnValue(mockFormattedData);
    (filterLookupOptionsByMappedValue as jest.Mock).mockReturnValue(mockFormattedData);

    const data = {
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;

    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
      propertyUri: 'testPropertyUri_1',
    } as UserValueDTO;

    await simpleLookupUserValueService.generate(value);

    expect(cacheService.getById).toHaveBeenCalledWith('testUri_1');
    expect(apiClient.loadSimpleLookupData).toHaveBeenCalledWith('testUri_1');
    expect(formatLookupOptions).toHaveBeenCalledWith(mockApiResponse, 'testUri_1');
    expect(filterLookupOptionsByMappedValue).toHaveBeenCalledWith(mockFormattedData, 'testPropertyUri_1', undefined);
    expect(cacheService.save).toHaveBeenCalledWith('testUri_1', mockFormattedData);
  });

  test('extracts label from NAME field when available', async () => {
    const data = {
      [BibframeConstants.BFLITE_URIS.NAME]: ['Name Field Value'],
      [BibframeConstants.BFLITE_URIS.LABEL]: ['Label Field Value'],
      [BibframeConstants.BFLITE_URIS.TERM]: ['Term Field Value'],
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(result.contents?.[0].label).toBe('Name Field Value');
  });

  test('extracts label from LABEL field when NAME is not available', async () => {
    const data = {
      [BibframeConstants.BFLITE_URIS.LABEL]: ['Label Field Value'],
      [BibframeConstants.BFLITE_URIS.TERM]: ['Term Field Value'],
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(result.contents?.[0].label).toBe('Label Field Value');
  });

  test('extracts label from TERM field when NAME and LABEL are not available', async () => {
    const data = {
      [BibframeConstants.BFLITE_URIS.TERM]: ['Term Field Value'],
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(result.contents?.[0].label).toBe('Term Field Value');
  });

  test('uses empty string as label when no label fields are available', async () => {
    const data = {
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(result.contents?.[0].label).toBe('');
  });

  test('applies mappedUri from BFLITE_TYPES_MAP data when item URI matches', async () => {
    const data = {
      testUriSelector_1: ['testItemUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
      groupUri: 'testGroupUri_1',
    } as UserValueDTO;
    const mockCachedData = [
      {
        label: 'Mapped Option',
        value: {
          label: 'Basic Label',
          uri: 'mappedUri_1',
        },
        __isNew__: false,
      },
    ];
    (cacheService.getById as jest.Mock).mockReturnValue(mockCachedData);

    const result = await simpleLookupUserValueService.generate(value);

    expect(result.contents?.[0].label).toBe('Mapped Option');
    expect(result.contents?.[0].meta?.basicLabel).toBe('Basic Label');
  });

  test('applies mappedUri from BFLITE_TYPES_MAP fields when field URI matches', async () => {
    const data = {
      testUriSelector_1: ['testItemUri_2'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
      groupUri: 'testGroupUri_1',
      fieldUri: 'testFieldUri_1',
    } as UserValueDTO;
    const mockCachedData = [
      {
        label: 'Field Mapped Option',
        value: {
          label: 'Field Basic Label',
          uri: 'mappedUri_2',
        },
        __isNew__: false,
      },
    ];
    (cacheService.getById as jest.Mock).mockReturnValue(mockCachedData);

    const result = await simpleLookupUserValueService.generate(value);

    expect(result.contents?.[0].label).toBe('Field Mapped Option');
    expect(result.contents?.[0].meta?.basicLabel).toBe('Field Basic Label');
  });

  test('skips items that match DEFAULT_GROUP_VALUES', async () => {
    const data = {
      testUriSelector_1: ['defaultItemUri_1'],
    } as unknown as RecordBasic;

    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
      groupUri: 'testGroupUri_2',
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(result.contents).toEqual([]);
  });

  test('handles loadData failure gracefully', async () => {
    (cacheService.getById as jest.Mock).mockReturnValue(null);
    (apiClient.loadSimpleLookupData as jest.Mock).mockResolvedValue(null);
    const data = {
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(cacheService.getById).toHaveBeenCalledWith('testUri_1');
    expect(apiClient.loadSimpleLookupData).toHaveBeenCalledWith('testUri_1');
    expect(formatLookupOptions).not.toHaveBeenCalled();
    expect(cacheService.save).not.toHaveBeenCalled();
    expect(result).toEqual({
      uuid: 'testUuid_1',
      contents: [
        {
          label: '',
          meta: {
            parentUri: 'testUri_1',
            type: 'simple',
            uri: 'testOptionUri_1',
          },
        },
      ],
    });
  });

  test('successfully loads and saves data', async () => {
    (cacheService.getById as jest.Mock).mockReturnValue(null);
    const mockApiResponse = { data: [{ name: 'Test Option' }] };
    const mockFormattedData = [
      {
        label: 'Test Option',
        value: { label: 'Test Option', uri: 'testOptionUri_1' },
        __isNew__: false,
      },
    ];

    (apiClient.loadSimpleLookupData as jest.Mock).mockResolvedValue(mockApiResponse);
    (formatLookupOptions as jest.Mock).mockReturnValue(mockFormattedData);
    (filterLookupOptionsByMappedValue as jest.Mock).mockReturnValue(mockFormattedData);

    const data = {
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
      propertyUri: 'testPropertyUri_1',
      groupUri: 'testGroupUri_1',
    } as UserValueDTO;

    await simpleLookupUserValueService.generate(value);

    expect(cacheService.save).toHaveBeenCalledWith('testUri_1', mockFormattedData);
  });

  test('handles api client throwing an error during load', async () => {
    (cacheService.getById as jest.Mock).mockReturnValue(null);
    const originalImplementation = apiClient.loadSimpleLookupData;
    (apiClient.loadSimpleLookupData as jest.Mock).mockImplementation(() => {
      return Promise.resolve(null); // Return null instead of throwing
    });

    const data = {
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(cacheService.getById).toHaveBeenCalledWith('testUri_1');
    expect(apiClient.loadSimpleLookupData).toHaveBeenCalledWith('testUri_1');
    expect(formatLookupOptions).not.toHaveBeenCalled();
    expect(cacheService.save).not.toHaveBeenCalled();
    expect(result.contents).toHaveLength(1);
    expect(result.contents?.[0].label).toBe('');

    (apiClient.loadSimpleLookupData as jest.Mock).mockImplementation(originalImplementation);
  });

  test('handles null or undefined values in various parameters', async () => {
    const data = {
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uriSelector: 'testUriSelector_1',
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(result.uuid).toBe('');
    expect(result.contents).toHaveLength(1);
  });

  test('generateContentItem uses item URI as label when necessary', async () => {
    (cacheService.getById as jest.Mock).mockReturnValue(null);
    const data = {
      testUriSelector_1: ['testItemUri_display'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_1',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
      groupUri: 'testGroupUri_1',
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(result.contents?.[0].label).toBe('testItemUri_display');
  });

  test('handles null uri in getCachedData', async () => {
    (cacheService.getById as jest.Mock).mockClear();
    const testInstance = new SimpleLookupUserValueService(apiClient, cacheService);
    const data = {
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uriSelector: 'testUriSelector_1',
    } as UserValueDTO;

    const result = await testInstance.generate(value);

    expect(result.contents).toBeDefined();
    expect(result.uuid).toBe('');
    expect(result.contents?.length).toBeGreaterThan(0);
  });

  test('saveLoadedData does nothing when loadedData or uri is undefined', async () => {
    (cacheService.getById as jest.Mock).mockReturnValue(null);
    (apiClient.loadSimpleLookupData as jest.Mock).mockResolvedValue(null);
    const data = {
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uriSelector: 'testUriSelector_1',
    } as UserValueDTO;

    await simpleLookupUserValueService.generate(value);

    expect(cacheService.save).not.toHaveBeenCalled();
  });
});
