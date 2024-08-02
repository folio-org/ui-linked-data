import { act, renderHook } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useSearchFilters } from '@common/hooks/useSearchFilters';
import { ChangeEvent, ReactNode } from 'react';
import state from '@state';

describe('useSearchFilters', () => {
  const getWrapper =
    (initialLookupData: Limiters = {} as Limiters) =>
    ({ children }: { children: ReactNode }) => (
      <RecoilRoot initializeState={snapshot => snapshot.set(state.search.limiters, initialLookupData)}>
        {children}
      </RecoilRoot>
    );

  const singlelimitersMock = {
    limiter_1: 'value_1',
    limiter_2: 'value_2',
  } as unknown as Limiters;

  test('onChangeLimiters - should update single limiter', () => {
    const testResult = { limiter_1: 'newValue', limiter_2: 'value_2' };
    const { result } = renderHook(useSearchFilters, { wrapper: getWrapper(singlelimitersMock) });

    const eventMock = {
      target: {
        id: 'newValue',
        name: 'limiter_1',
      },
    } as ChangeEvent<HTMLInputElement>;

    act(() => result.current?.onChangeLimiters(eventMock));

    expect(result.current.limiters).toEqual(testResult);
  });

  test('onChangeLimitersMulti - should update multiple limiters', () => {
    const limitersMock = {
      limiter_1: 'value_1',
      limiter_2: ['value_2'],
    } as unknown as Limiters;
    const testResult = {
      limiter_1: 'value_1',
      limiter_2: ['value_2', 'newValue'],
    };

    const { result } = renderHook(useSearchFilters, { wrapper: getWrapper(limitersMock) });

    const eventMock = {
      target: {
        id: 'newValue',
        name: 'limiter_2',
      },
    } as ChangeEvent<HTMLInputElement>;

    act(() => result.current.onChangeLimitersMulti(eventMock));

    expect(result.current.limiters).toEqual(testResult);
  });

  test('should not update limiters on onChange', () => {
    const { result } = renderHook(useSearchFilters, { wrapper: getWrapper(singlelimitersMock) });

    const eventMock = {
      target: {
        id: 'newValue',
        name: 'limiter_1',
      },
    } as ChangeEvent<HTMLInputElement>;

    result.current.onChange(eventMock);

    expect(result.current.limiters).toEqual(singlelimitersMock);
  });

  /*  test('should return limiters and onChange functions', () => {
    const { result } = renderHook(useSearchFilters, { wrapper: getWrapper(limitersMock) });

    expect(result.current.limiters).toBe(limitersMock);
    expect(result.current.onChangeLimiters).toBeInstanceOf(Function);
    expect(result.current.onChangeLimitersMulti).toBeInstanceOf(Function);
    expect(result.current.onChange).toBeInstanceOf(Function);
  }); */
});
