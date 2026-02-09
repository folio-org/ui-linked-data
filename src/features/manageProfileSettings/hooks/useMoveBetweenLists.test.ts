import { act, useState } from 'react';

import { Active, Over } from '@dnd-kit/core';
import { renderHook } from '@testing-library/react';

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
    const unused = renderHook(() => useState([...mockUnused]));
    const selected = renderHook(() => useState([...mockSelected]));
    const { result } = renderHook(() =>
      useMoveBetweenLists({
        unused: unused.result.current[0],
        selected: selected.result.current[0],
        setUnused: unused.result.current[1],
        setSelected: selected.result.current[1],
      }),
    );
    const { moveUnusedToSelected } = result.current;

    act(() => moveUnusedToSelected(makeMockActive('unused:first'), makeMockOver('selected:first')));

    expect(unused.result.current[0].length).toBe(0);
    expect(selected.result.current[0].length).toBe(2);
  });

  it('move unused to empty selected', () => {
    const unused = renderHook(() => useState([...mockUnused]));
    const selected = renderHook(() => useState([] as ProfileSettingComponent[]));
    const { result } = renderHook(() =>
      useMoveBetweenLists({
        unused: unused.result.current[0],
        selected: selected.result.current[0],
        setUnused: unused.result.current[1],
        setSelected: selected.result.current[1],
      }),
    );
    const { moveUnusedToSelected } = result.current;

    act(() => moveUnusedToSelected(makeMockActive('unused:first'), makeMockOver('irrelevant')));

    expect(unused.result.current[0].length).toBe(0);
    expect(selected.result.current[0].length).toBe(1);
  });

  it('move selected to populated unused', () => {
    const unused = renderHook(() => useState([...mockUnused]));
    const selected = renderHook(() => useState([...mockSelected]));
    const { result } = renderHook(() =>
      useMoveBetweenLists({
        unused: unused.result.current[0],
        selected: selected.result.current[0],
        setUnused: unused.result.current[1],
        setSelected: selected.result.current[1],
      }),
    );
    const { moveSelectedToUnused } = result.current;

    act(() => moveSelectedToUnused(makeMockActive('selected:first'), makeMockOver('unused:first')));

    expect(unused.result.current[0].length).toBe(2);
    expect(selected.result.current[0].length).toBe(0);
  });

  it('move selected to end of populated unused container', () => {
    const unused = renderHook(() => useState([...mockUnused]));
    const selected = renderHook(() => useState([...mockSelected]));
    const { result } = renderHook(() =>
      useMoveBetweenLists({
        unused: unused.result.current[0],
        selected: selected.result.current[0],
        setUnused: unused.result.current[1],
        setSelected: selected.result.current[1],
      }),
    );
    const { moveSelectedToUnused } = result.current;

    act(() => moveSelectedToUnused(makeMockActive('selected:first'), makeMockOver('unused-container')));

    expect(unused.result.current[0].length).toBe(2);
    expect(selected.result.current[0].length).toBe(0);
    expect(unused.result.current[0][1]).toEqual({
      id: 'selected:first',
      name: 'First Selected',
    });
  });

  it('move selected to empty unused', () => {
    const unused = renderHook(() => useState([] as ProfileSettingComponent[]));
    const selected = renderHook(() => useState([...mockSelected]));
    const { result } = renderHook(() =>
      useMoveBetweenLists({
        unused: unused.result.current[0],
        selected: selected.result.current[0],
        setUnused: unused.result.current[1],
        setSelected: selected.result.current[1],
      }),
    );
    const { moveSelectedToUnused } = result.current;

    act(() => moveSelectedToUnused(makeMockActive('selected:first'), makeMockOver('irrelevant')));

    expect(unused.result.current[0].length).toBe(1);
    expect(selected.result.current[0].length).toBe(0);
  });

  it('no change for unrecognized drag element', () => {
    const unused = renderHook(() => useState([...mockUnused]));
    const selected = renderHook(() => useState([...mockSelected]));
    const { result } = renderHook(() =>
      useMoveBetweenLists({
        unused: unused.result.current[0],
        selected: selected.result.current[0],
        setUnused: unused.result.current[1],
        setSelected: selected.result.current[1],
      }),
    );
    const { moveSelectedToUnused } = result.current;

    act(() => moveSelectedToUnused(makeMockActive('unknown'), makeMockOver('irrelevant')));

    expect(unused.result.current[0].length).toBe(1);
    expect(selected.result.current[0].length).toBe(1);
  });
});
