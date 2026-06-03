import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

import { waitFor } from '@testing-library/react';

import * as BibframeConstants from '@/common/constants/bibframeMapping.constants';
import { AdvancedFieldType as AdvancedFieldTypeEnum } from '@/common/constants/uiControls.constants';
import { filterLookupOptionsByMappedValue } from '@/common/helpers/lookupOptions.helper';
import { logger } from '@/common/services/logger';
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

jest.mock('@/common/services/logger', () => ({
  logger: { error: jest.fn() },
}));

jest.mock('@/common/helpers/lookupOptions.helper', () => ({
  filterLookupOptionsByMappedValue: jest.fn(),
}));

describe('SimpleLookupUserValueService', () => {
  const loadLookup = jest.fn();

  let simpleLookupUserValueService: IUserValueType;

  beforeEach(() => {
    simpleLookupUserValueService = new SimpleLookupUserValueService(loadLookup);
    (filterLookupOptionsByMappedValue as jest.Mock).mockReturnValue([]);
    loadLookup.mockResolvedValue([]);
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

  test('calls loadLookup with the provided URI and applies filterLookupOptionsByMappedValue', async () => {
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

    expect(loadLookup).toHaveBeenCalledWith('testUri_1');
    expect(filterLookupOptionsByMappedValue).toHaveBeenCalledWith([], 'testPropertyUri_1', 'testGroupUri_1');
  });

  test('uses loaded options to match in generateContentItem', async () => {
    const mockLoadedData = [
      {
        label: 'loaded option label',
        value: {
          label: 'basic loaded label',
          uri: 'testOptionUri_1',
        },
        __isNew__: false,
      },
    ];
    (filterLookupOptionsByMappedValue as jest.Mock).mockReturnValue(mockLoadedData);

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

    expect(result).toEqual({
      uuid: 'testUuid_1',
      contents: [
        {
          label: 'loaded option label',
          meta: {
            parentUri: 'testUri_1',
            type: 'simple',
            uri: 'testOptionUri_1',
            basicLabel: 'basic loaded label',
          },
        },
      ],
    });
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
    (filterLookupOptionsByMappedValue as jest.Mock).mockReturnValue([
      {
        label: 'Mapped Option',
        value: {
          label: 'Basic Label',
          uri: 'mappedUri_1',
        },
        __isNew__: false,
      },
    ]);

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
    (filterLookupOptionsByMappedValue as jest.Mock).mockReturnValue([
      {
        label: 'Field Mapped Option',
        value: {
          label: 'Field Basic Label',
          uri: 'mappedUri_2',
        },
        __isNew__: false,
      },
    ]);

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

  test('handles loadLookup returning empty and continues with record labels', async () => {
    loadLookup.mockResolvedValue([]);
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

    expect(loadLookup).toHaveBeenCalledWith('testUri_1');
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

  test('logs an error and continues when loadLookup throws', async () => {
    loadLookup.mockRejectedValue(new Error('Network error'));

    const data = {
      [BibframeConstants.BFLITE_URIS.LABEL]: ['fallback label'],
      testUriSelector_1: ['testOptionUri_1'],
    } as unknown as RecordBasic;
    const value = {
      data,
      uri: 'testUri_1',
      uuid: 'testUuid_err',
      uriSelector: 'testUriSelector_1',
      type: AdvancedFieldTypeEnum.simple as AdvancedFieldType,
    } as UserValueDTO;

    const result = await simpleLookupUserValueService.generate(value);

    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Lookup fetch failed'), expect.any(Error));
    expect(result.uuid).toBe('testUuid_err');
    expect(result.contents).toHaveLength(1);
    expect(result.contents?.[0].label).toBe('fallback label');
  });
});
