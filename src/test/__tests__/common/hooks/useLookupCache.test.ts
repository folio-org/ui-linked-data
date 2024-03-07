import { act, renderHook } from '@testing-library/react';
import { useLookupCacheService } from '@common/hooks/useLookupCache.hook';
import { RecoilRoot } from 'recoil';

describe('useLookupCacheService', () => {
  test('sets a simple lookup value', () => {
    const { result } = renderHook(useLookupCacheService, {
      wrapper: RecoilRoot,
    });
    const key = 'testKey_1';
    const value = [
      {
        label: 'test label',
        __isNew__: true,
        value: {
          id: 'testId_1',
          label: 'test label',
          uri: 'testUri_1',
        },
      },
    ];
    const testResult = {
      testKey_1: value,
    };

    act(() => {
      result.current.save(key, value);
    });

    expect(result.current.getAll()).toEqual(testResult);
  });
});
