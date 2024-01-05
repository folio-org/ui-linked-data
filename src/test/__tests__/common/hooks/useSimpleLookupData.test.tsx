import { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';
import { act, renderHook } from '@testing-library/react';
import { useSimpleLookupData } from '@common/hooks/useSimpleLookupData';
import * as ApiHelper from '@common/helpers/api.helper';
import * as LookupOptionsHelper from '@common/helpers/formatLookupOptions.helper';
import state from '@state';

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
  const getWrapper =
    (initialLookupData: Record<string, MultiselectOption[]>) =>
    ({ children }: { children: ReactNode }) => (
      <RecoilRoot initializeState={snapshot => snapshot.set(state.config.lookupData, initialLookupData)}>
        {children}
      </RecoilRoot>
    );

  test('getLookupData - returns an array with lookup options', () => {
    const saveLookupData = jest.fn();
    const { result } = renderHook(() => useSimpleLookupData(lookupData, saveLookupData), {
      wrapper: getWrapper(lookupData),
    });

    result.current.getLookupData();

    expect(result.current.getLookupData()).toEqual(lookupData);
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
      const saveLookupData = jest.fn();

      const { result } = renderHook(() => useSimpleLookupData({}, saveLookupData), {
        wrapper: getWrapper({}),
      });

      const resultData = await act(async () => result.current.loadLookupData(uri));

      expect(spyFormatLookupOptions).toHaveBeenCalledWith(loadedData, uri);
      expect(saveLookupData).toHaveBeenCalled();
      expect(resultData).toEqual(testData);
    });

    test('returns null', async () => {
      jest.spyOn(ApiHelper, 'loadSimpleLookup').mockResolvedValue(undefined);

      const { result } = renderHook(useSimpleLookupData, {
        wrapper: getWrapper({}),
      });

      const resultData = await result.current.loadLookupData(uri);

      expect(resultData).toBeNull();
    });

    test('throws an error', async () => {
      const errorMessage = 'Error message';
      jest.spyOn(ApiHelper, 'loadSimpleLookup').mockRejectedValue(errorMessage);

      const { result } = renderHook(useSimpleLookupData, {
        wrapper: getWrapper({}),
      });

      try {
        await result.current.loadLookupData(uri);
      } catch (error: unknown) {
        expect((error as Error).message).toBe(errorMessage);
      }
    });
  });
});
