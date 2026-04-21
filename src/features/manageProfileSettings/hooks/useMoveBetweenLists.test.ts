import { setInitialGlobalState } from '@/test/__mocks__/store';

import { act } from 'react';

import { Active, Over } from '@dnd-kit/core';
import { renderHook, waitFor } from '@testing-library/react';

import { useManageProfileSettingsStore } from '@/store';

import { useMoveBetweenLists } from './useMoveBetweenLists';

describe('useMoveBetweenLists', () => {
  const mockUnused = [
    {
      id: 'unused:first',
      name: 'First Unused',
    },
  ] as ProfileSettingComponent[];

  const mockSelected = [
    {
      id: 'selected:first',
      name: 'First Selected',
    },
  ] as ProfileSettingComponent[];

  const mockSetUnused = jest.fn();
  const mockSetSelected = jest.fn();

  const makeMockActive = (id: string) => {
    return {
      id,
      rect: {
        current: {
          initial: null,
          translated: null,
        },
      },
    } as Active;
  };

  const makeMockOver = (id: string) => {
    return {
      id,
      rect: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      disabled: false,
      data: {},
    } as Over;
  };

  it('move unused to populated selected', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          unusedComponents: [...mockUnused],
          selectedComponents: [...mockSelected],
          setUnusedComponents: mockSetUnused,
          setSelectedComponents: mockSetSelected,
        },
      },
    ]);
    const { result } = renderHook(() => useMoveBetweenLists());
    const { moveUnusedToSelected } = result.current;

    act(() => moveUnusedToSelected(makeMockActive('unused:first'), makeMockOver('selected:first')));

    waitFor(() => {
      expect(mockSetUnused).toHaveBeenCalledWith(Array(0));
      expect(mockSetSelected).toHaveBeenCalledWith(Array(2).fill(expect.anything()));
    });
  });

  it('move unused to empty selected', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          unusedComponents: [...mockUnused],
          selectedComponents: [],
          setUnusedComponents: mockSetUnused,
          setSelectedComponents: mockSetSelected,
        },
      },
    ]);
    const { result } = renderHook(() => useMoveBetweenLists());
    const { moveUnusedToSelected } = result.current;

    act(() => moveUnusedToSelected(makeMockActive('unused:first'), makeMockOver('irrelevant')));

    waitFor(() => {
      expect(mockSetUnused).toHaveBeenLastCalledWith(Array(0));
      expect(mockSetSelected).toHaveBeenCalledWith(Array(1).fill(expect.anything()));
    });
  });

  it('move selected to populated unused', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          unusedComponents: [...mockUnused],
          selectedComponents: [...mockSelected],
          setUnusedComponents: mockSetUnused,
          setSelectedComponents: mockSetSelected,
        },
      },
    ]);
    const { result } = renderHook(() => useMoveBetweenLists());
    const { moveSelectedToUnused } = result.current;

    act(() => moveSelectedToUnused(makeMockActive('selected:first'), makeMockOver('unused:first')));

    waitFor(() => {
      expect(mockSetUnused).toHaveBeenLastCalledWith(Array(2).fill(expect.anything()));
      expect(mockSetSelected).toHaveBeenCalledWith(Array(0));
    });
  });

  it('move selected to end of populated unused container', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          unusedComponents: [...mockUnused],
          selectedComponents: [...mockSelected],
          setUnusedComponents: mockSetUnused,
          setSelectedComponents: mockSetSelected,
        },
      },
    ]);
    const { result } = renderHook(() => useMoveBetweenLists());
    const { moveSelectedToUnused } = result.current;

    act(() => moveSelectedToUnused(makeMockActive('selected:first'), makeMockOver('unused-container')));

    waitFor(() => {
      expect(mockSetUnused).toHaveBeenLastCalledWith(Array(2).fill(expect.anything()));
      expect(mockSetSelected).toHaveBeenCalledWith(Array(0));
      expect(mockSetUnused.mock.calls[0][0][1]).toEqual({
        id: 'selected:first',
        name: 'First Selected',
      });
    });
  });

  it('move selected to empty unused', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          unusedComponents: [],
          selectedComponents: [...mockSelected],
          setUnusedComponents: mockSetUnused,
          setSelectedComponents: mockSetSelected,
        },
      },
    ]);
    const { result } = renderHook(() => useMoveBetweenLists());
    const { moveSelectedToUnused } = result.current;

    act(() => moveSelectedToUnused(makeMockActive('selected:first'), makeMockOver('irrelevant')));

    waitFor(() => {
      expect(mockSetUnused).toHaveBeenLastCalledWith(Array(1).fill(expect.anything()));
      expect(mockSetSelected).toHaveBeenCalledWith(Array(0));
    });
  });

  it('no change for unrecognized drag element', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          unusedComponents: [],
          selectedComponents: [...mockSelected],
          setUnusedComponents: mockSetUnused,
          setSelectedComponents: mockSetSelected,
        },
      },
    ]);
    const { result } = renderHook(() => useMoveBetweenLists());
    const { moveSelectedToUnused } = result.current;

    act(() => moveSelectedToUnused(makeMockActive('unknown'), makeMockOver('irrelevant')));

    waitFor(() => {
      expect(mockSetUnused).toHaveBeenLastCalledWith(Array(1).fill(expect.anything()));
      expect(mockSetSelected).toHaveBeenLastCalledWith(Array(1).fill(expect.anything()));
    });
  });

  it('move by ID from selected to populated unused', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          unusedComponents: [...mockUnused],
          selectedComponents: [...mockSelected],
          setUnusedComponents: mockSetUnused,
          setSelectedComponents: mockSetSelected,
        },
      },
    ]);
    const { result } = renderHook(() => useMoveBetweenLists());
    const { makeMoveComponentIdToUnused } = result.current;

    const moveComponentIdToUnused = makeMoveComponentIdToUnused('selected:first');

    act(() => moveComponentIdToUnused());

    waitFor(() => {
      expect(mockSetUnused).toHaveBeenLastCalledWith(Array(2).fill(expect.anything()));
      expect(mockSetSelected).toHaveBeenLastCalledWith(Array(0));
    });
  });

  it('move by ID from unused to populated selected', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          unusedComponents: [...mockUnused],
          selectedComponents: [...mockSelected],
          setUnusedComponents: mockSetUnused,
          setSelectedComponents: mockSetSelected,
        },
      },
    ]);
    const { result } = renderHook(() => useMoveBetweenLists());
    const { makeMoveComponentIdToSelected } = result.current;
    const moveComponentIdToSelected = makeMoveComponentIdToSelected('unused:first');

    act(() => moveComponentIdToSelected());

    waitFor(() => {
      expect(mockSetUnused).toHaveBeenLastCalledWith(Array(0));
      expect(mockSetSelected).toHaveBeenLastCalledWith(Array(2).fill(expect.anything()));
    });
  });
});
