import { act, renderHook, waitFor } from '@testing-library/react';
import { useSimpleLookupData } from '@common/hooks/useSimpleLookupData';
import * as ApiHelper from '@common/helpers/api.helper';
import * as LookupOptionsHelper from '@common/helpers/lookupOptions.helper';
import {
  MockServicesProvider,
  lookupCacheService as mockLookupCacheService,
} from '@src/test/__mocks__/providers/ServicesProvider.mock';

const lookupData: Record<string, MultiselectOption[]> = {
  testKey_1: [
    {
      label: 'testLabel_1',
      __isNew__: true,
      value: {
        id: 'testId_1',
        label: 'testLabel_1',
        uri: 'testUri_1',
      },
    },
  ],
};

describe('useSimpleLookupData', () => {
  test('getLookupData - returns an array with lookup options', async () => {
    const saveLookupData = jest.fn();
    (mockLookupCacheService.getAll as jest.Mock).mockResolvedValue(lookupData);

    const { result } = renderHook(useSimpleLookupData, {
      wrapper: MockServicesProvider,
    });

    waitFor(() => {
      expect(result.current.getLookupData()).toEqual(lookupData);
    })
      .then(() => console.log('Lookup options recieved'))
      .catch(err => console.log(`Error while getting lookup options: ${err}`));
    expect(saveLookupData).not.toHaveBeenCalled();
  });

  describe('loadLookupData', () => {
    const uri = 'testUri';

    test('returns an array with formatted data', async () => {
      const loadedData = [
        {
          '@id': 'id_2',
          '@type': ['type_2'],
          '@testLabelUri': [
            {
              '@id': 'testId_2',
              '@value': 'value_2',
              '@language': 'lang_2',
              '@type': 'type_2',
            },
          ],
        },
        {
          '@id': 'id_1',
          '@type': ['type_1'],
          '@testLabelUri': [
            {
              '@id': 'testId_1',
              '@value': 'value_1',
              '@language': 'lang_1',
              '@type': 'type_1',
            },
          ],
        },
      ] as unknown as LoadSimpleLookupResponseItem[];
      const formattedData = [
        {
          __isNew__: false,
          label: 'value_2',
          value: {
            label: 'value_2',
            uri: 'id_2',
          },
        },
        {
          __isNew__: false,
          label: 'value_1',
          value: {
            label: 'value_1',
            uri: 'id_1',
          },
        },
      ];
      const testData = [
        {
          __isNew__: false,
          label: 'value_1',
          value: {
            label: 'value_1',
            uri: 'id_1',
          },
        },
        {
          __isNew__: false,
          label: 'value_2',
          value: {
            label: 'value_2',
            uri: 'id_2',
          },
        },
      ];
      jest.spyOn(ApiHelper, 'loadSimpleLookup').mockResolvedValue(loadedData);
      const spyFormatLookupOptions = jest
        .spyOn(LookupOptionsHelper, 'formatLookupOptions')
        .mockReturnValue(formattedData);
      (mockLookupCacheService.getAll as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(useSimpleLookupData, {
        wrapper: MockServicesProvider,
      });

      const resultData = await act(async () => result.current.loadLookupData(uri));

      expect(spyFormatLookupOptions).toHaveBeenCalledWith(loadedData, uri);
      expect(resultData).toEqual(testData);
    });

    test('returns null', async () => {
      jest.spyOn(ApiHelper, 'loadSimpleLookup').mockResolvedValue(undefined);
      (mockLookupCacheService.getAll as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(useSimpleLookupData, {
        wrapper: MockServicesProvider,
      });

      const resultData = await result.current.loadLookupData(uri);

      expect(resultData).toBeNull();
    });

    test('throws an error', async () => {
      const errorMessage = 'Error message';
      jest.spyOn(ApiHelper, 'loadSimpleLookup').mockRejectedValue(errorMessage);
      (mockLookupCacheService.getAll as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(useSimpleLookupData, {
        wrapper: MockServicesProvider,
      });

      try {
        await result.current.loadLookupData(uri);
      } catch (error: unknown) {
        expect((error as Error).message).toBe(errorMessage);
      }
    });
  });
});
