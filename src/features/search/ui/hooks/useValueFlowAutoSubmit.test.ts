import { renderHook } from '@testing-library/react';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';
import { useValueFlowAutoSubmit } from './useValueFlowAutoSubmit';

describe('useValueFlowAutoSubmit', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {},
      },
    ]);
  });

  describe('value flow', () => {
    it('auto-submits when committedValues has query', () => {
      useSearchStore.setState({
        committedValues: {
          segment: 'authorities:browse',
          query: 'test query',
          searchBy: '',
          offset: 0,
        },
      });

      renderHook(() =>
        useValueFlowAutoSubmit({
          flow: 'value',
          onSubmit: mockOnSubmit,
        }),
      );

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('does not auto-submit when query is empty', () => {
      useSearchStore.setState({
        committedValues: {
          segment: 'authorities:browse',
          query: '',
          searchBy: '',
          offset: 0,
        },
      });

      renderHook(() =>
        useValueFlowAutoSubmit({
          flow: 'value',
          onSubmit: mockOnSubmit,
        }),
      );

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('submits only once per query', () => {
      useSearchStore.setState({
        committedValues: {
          segment: 'authorities:browse',
          query: 'test',
          searchBy: '',
          offset: 0,
        },
      });

      const { rerender } = renderHook(() =>
        useValueFlowAutoSubmit({
          flow: 'value',
          onSubmit: mockOnSubmit,
        }),
      );

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);

      rerender();
      rerender();

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('resets and allows re-submission after query clears', () => {
      useSearchStore.setState({
        committedValues: {
          segment: 'authorities:browse',
          query: 'first',
          searchBy: '',
          offset: 0,
        },
      });

      const { rerender } = renderHook(() =>
        useValueFlowAutoSubmit({
          flow: 'value',
          onSubmit: mockOnSubmit,
        }),
      );

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);

      useSearchStore.setState({
        committedValues: {
          segment: 'authorities:browse',
          query: '',
          searchBy: '',
          offset: 0,
        },
      });
      rerender();

      useSearchStore.setState({
        committedValues: {
          segment: 'authorities:browse',
          query: 'second',
          searchBy: '',
          offset: 0,
        },
      });
      rerender();

      expect(mockOnSubmit).toHaveBeenCalledTimes(2);
    });
  });

  describe('non-value flow', () => {
    it('does not auto-submit in url flow', () => {
      useSearchStore.setState({
        committedValues: {
          segment: 'authorities:browse',
          query: 'test',
          searchBy: '',
          offset: 0,
        },
      });

      renderHook(() =>
        useValueFlowAutoSubmit({
          flow: 'url',
          onSubmit: mockOnSubmit,
        }),
      );

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('flow transitions', () => {
    it('auto-submits when switching to value flow', () => {
      useSearchStore.setState({
        committedValues: {
          segment: 'authorities:browse',
          query: 'test',
          searchBy: '',
          offset: 0,
        },
      });

      const { rerender } = renderHook(
        ({ flow }: { flow: 'url' | 'value' }) =>
          useValueFlowAutoSubmit({
            flow,
            onSubmit: mockOnSubmit,
          }),
        { initialProps: { flow: 'url' as 'url' | 'value' } },
      );

      expect(mockOnSubmit).not.toHaveBeenCalled();

      rerender({ flow: 'value' });

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
