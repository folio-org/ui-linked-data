import { act, useState } from 'react';

import { renderHook } from '@testing-library/react';

import { useNudge } from './useNudge';

const mockAnnounce = jest.fn();
jest.mock('@dnd-kit/accessibility', () => {
  const actual = jest.requireActual('@dnd-kit/accessibility');
  return {
    ...actual,
    useAnnouncement: () => {
      return {
        announce: mockAnnounce,
        announcement: '',
      };
    },
  };
});

describe('useNudge', () => {
  const mockSelected = [
    {
      id: 'test:childA',
      name: 'A',
    },
    {
      id: 'test:childB',
      name: 'B',
    },
  ] as ProfileSettingComponent[];

  it('makeMoveDown returns a function that announces and reorders downward', async () => {
    const state = renderHook(() => useState(mockSelected));
    const { result } = renderHook(() => useNudge({ setSelected: state.result.current[1] }));

    const moveDown = result.current.makeMoveDown(0, 'A');
    act(() => moveDown());

    expect(state.result.current[0][1]).toEqual({ id: 'test:childA', name: 'A' });
    expect(mockAnnounce).toHaveBeenCalled();
  });

  it('makeMoveUp returns a function that announces and reorders upnward', async () => {
    const state = renderHook(() => useState(mockSelected));
    const { result } = renderHook(() => useNudge({ setSelected: state.result.current[1] }));

    const moveUp = result.current.makeMoveUp(1, 'B');
    act(() => moveUp());

    expect(state.result.current[0][0]).toEqual({ id: 'test:childB', name: 'B' });
    expect(mockAnnounce).toHaveBeenCalled();
  });
});
