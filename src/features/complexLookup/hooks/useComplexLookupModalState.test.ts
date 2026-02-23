import { setInitialGlobalState } from '@/test/__mocks__/store';

import { renderHook } from '@testing-library/react';

import { useSearchStore } from '@/store';

import { useComplexLookupModalState } from './useComplexLookupModalState';

describe('useComplexLookupModalState', () => {
  const mockSetQuery = jest.fn();
  const mockResetQuery = jest.fn();
  const mockResetSearchBy = jest.fn();
  const mockSetNavigationState = jest.fn();
  const mockSetCommittedValues = jest.fn();
  const mockSetDraftBySegment = jest.fn();
  const mockResetDraftBySegment = jest.fn();
  const mockResetNavigationState = jest.fn();
  const mockResetCommittedValues = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          setQuery: mockSetQuery,
          resetQuery: mockResetQuery,
          resetSearchBy: mockResetSearchBy,
          setNavigationState: mockSetNavigationState,
          setCommittedValues: mockSetCommittedValues,
          setDraftBySegment: mockSetDraftBySegment,
          resetDraftBySegment: mockResetDraftBySegment,
          resetNavigationState: mockResetNavigationState,
          resetCommittedValues: mockResetCommittedValues,
        },
      },
    ]);
  });

  describe('when modal opens', () => {
    it('initializes navigation state with default segment', () => {
      renderHook(() =>
        useComplexLookupModalState({
          isOpen: true,
          assignedValue: { label: 'test' } as UserValueContents,
          defaultSegment: 'authorities:browse',
        }),
      );

      expect(mockSetNavigationState).toHaveBeenCalledWith({
        segment: 'authorities:browse',
      });
    });

    it('sets committed values with initial query', () => {
      renderHook(() =>
        useComplexLookupModalState({
          isOpen: true,
          assignedValue: { label: 'test query' } as UserValueContents,
          defaultSegment: 'authorities:browse',
        }),
      );

      expect(mockSetCommittedValues).toHaveBeenCalledWith({
        segment: 'authorities:browse',
        query: 'test query',
        searchBy: '',
        source: undefined,
        offset: 0,
      });
    });

    it('sets draft query and segment draft', () => {
      renderHook(() =>
        useComplexLookupModalState({
          isOpen: true,
          assignedValue: { label: 'test' } as UserValueContents,
          defaultSegment: 'authorities:browse',
        }),
      );

      expect(mockSetQuery).toHaveBeenCalledWith('test');
      expect(mockSetDraftBySegment).toHaveBeenCalledWith({
        'authorities:browse': {
          query: 'test',
          searchBy: '',
          source: undefined,
        },
      });
    });

    it('handles default source parameter', () => {
      renderHook(() =>
        useComplexLookupModalState({
          isOpen: true,
          assignedValue: { label: 'test' } as UserValueContents,
          defaultSegment: 'hubs',
          defaultSource: 'external',
        }),
      );

      expect(mockSetNavigationState).toHaveBeenCalledWith({
        segment: 'hubs',
        source: 'external',
      });
      expect(mockSetCommittedValues).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'external',
        }),
      );
    });

    it('resets drafts when no assigned value', () => {
      renderHook(() =>
        useComplexLookupModalState({
          isOpen: true,
          defaultSegment: 'authorities:browse',
        }),
      );

      expect(mockSetQuery).not.toHaveBeenCalled();
      expect(mockResetDraftBySegment).toHaveBeenCalled();
    });
  });

  describe('when modal closes', () => {
    it('resets all search state', () => {
      renderHook(() =>
        useComplexLookupModalState({
          isOpen: false,
          assignedValue: { label: 'test' } as UserValueContents,
          defaultSegment: 'authorities:browse',
        }),
      );

      expect(mockResetQuery).toHaveBeenCalled();
      expect(mockResetSearchBy).toHaveBeenCalled();
      expect(mockResetNavigationState).toHaveBeenCalled();
      expect(mockResetCommittedValues).toHaveBeenCalled();
      expect(mockResetDraftBySegment).toHaveBeenCalled();
    });

    it('does not set state when closed', () => {
      renderHook(() =>
        useComplexLookupModalState({
          isOpen: false,
          assignedValue: { label: 'test' } as UserValueContents,
          defaultSegment: 'authorities:browse',
        }),
      );

      expect(mockSetNavigationState).not.toHaveBeenCalled();
      expect(mockSetCommittedValues).not.toHaveBeenCalled();
      expect(mockSetQuery).not.toHaveBeenCalled();
    });
  });

  describe('state transitions', () => {
    it('reinitializes when assigned value changes', () => {
      const { rerender } = renderHook(
        ({ query }) =>
          useComplexLookupModalState({
            isOpen: true,
            assignedValue: { label: query } as UserValueContents,
            defaultSegment: 'authorities:browse',
          }),
        { initialProps: { query: 'first' } },
      );

      expect(mockSetQuery).toHaveBeenCalledWith('first');
      jest.clearAllMocks();

      rerender({ query: 'second' });

      expect(mockSetQuery).toHaveBeenCalledWith('second');
    });

    it('cleans up when closing', () => {
      const { rerender } = renderHook(
        ({ isOpen }) =>
          useComplexLookupModalState({
            isOpen,
            assignedValue: { label: 'test' } as UserValueContents,
            defaultSegment: 'authorities:browse',
          }),
        { initialProps: { isOpen: true } },
      );

      jest.clearAllMocks();
      rerender({ isOpen: false });

      expect(mockResetQuery).toHaveBeenCalled();
      expect(mockResetNavigationState).toHaveBeenCalled();
    });
  });
});
