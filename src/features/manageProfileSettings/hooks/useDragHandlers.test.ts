import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { renderHook } from '@testing-library/react';

import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';
import { useDragHandlers } from './useDragHandlers';

const mockMoveUnusedToSelected = jest.fn();
const mockMoveSelectedToUnused = jest.fn();
jest.mock('./useMoveBetweenLists', () => ({
  useMoveBetweenLists: () => {
    return {
      moveUnusedToSelected: mockMoveUnusedToSelected,
      moveSelectedToUnused: mockMoveSelectedToUnused,
    };
  },
}));

describe('useDragHandlers', () => {
  const listFromIdSelected = () => {
    return ComponentType.selected;
  };
  const listFromIdUnused = () => {
    return ComponentType.unused;
  };
  const mockCancelDrag = jest.fn();
  const mockStartDrag = jest.fn();
  const mockEndDrag = jest.fn();
  const mockSetStartingList = jest.fn();
  const mockSetSelected = jest.fn();
  const mockSetUnused = jest.fn();

  const makeDragEvent = (hasOver: boolean, activeContainer: string, overContainer: string) => {
    const dragEvent = {
      active: {
        id: 'active',
        data: {
          current: {
            sortable: {
              containerId: activeContainer,
            },
          },
        },
        rect: {
          current: {
            initial: null,
            translated: null,
          },
        },
      },
      activatorEvent: {},
    };
    if (hasOver) {
      // @ts-expect-error: avoid typing complaints for simplest way to simulate events
      dragEvent.over = {
        id: 'over',
        data: {
          current: {
            sortable: {
              containerId: overContainer,
            },
          },
        },
        rect: {
          current: {
            initial: null,
            translated: null,
          },
        },
      };
    }
    return dragEvent;
  };

  it('sets state for drag start', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.unused,
        listFromId: listFromIdSelected,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragStart(
      makeDragEvent(false, ComponentType.unused, ComponentType.selected) as unknown as DragStartEvent,
    );

    expect(mockStartDrag).toHaveBeenCalled();
  });

  it('set state for drag cancel', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.unused,
        listFromId: listFromIdSelected,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragCancel();

    expect(mockCancelDrag).toHaveBeenCalled();
  });

  it('switches from unused to selected on dragging unused over selected', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.unused,
        listFromId: listFromIdSelected,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragOver(
      makeDragEvent(true, ComponentType.unused, ComponentType.selected) as unknown as DragOverEvent,
    );

    expect(mockMoveUnusedToSelected).toHaveBeenCalled();
  });

  it('switches from selected to unused on dragging selected over unused', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.selected,
        listFromId: listFromIdUnused,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragOver(
      makeDragEvent(true, ComponentType.selected, ComponentType.unused) as unknown as DragOverEvent,
    );

    expect(mockMoveSelectedToUnused).toHaveBeenCalled();
  });

  it('does not switch lists dragging selected over selected', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.selected,
        listFromId: listFromIdSelected,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragOver(
      makeDragEvent(true, ComponentType.selected, ComponentType.selected) as unknown as DragOverEvent,
    );

    expect(mockMoveSelectedToUnused).not.toHaveBeenCalled();
    expect(mockMoveUnusedToSelected).not.toHaveBeenCalled();
  });

  it('does not switch lists dragging unused over unused', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.unused,
        listFromId: listFromIdUnused,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragOver(
      makeDragEvent(true, ComponentType.unused, ComponentType.unused) as unknown as DragOverEvent,
    );

    expect(mockMoveSelectedToUnused).not.toHaveBeenCalled();
    expect(mockMoveUnusedToSelected).not.toHaveBeenCalled();
  });

  it('does not do anything when dragging over undroppable regions', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.unused,
        listFromId: listFromIdUnused,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragOver(
      makeDragEvent(false, ComponentType.unused, ComponentType.unused) as unknown as DragOverEvent,
    );

    expect(mockMoveSelectedToUnused).not.toHaveBeenCalled();
    expect(mockMoveUnusedToSelected).not.toHaveBeenCalled();
  });

  it('reorders selected on drag end for selected and sets state', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.selected,
        listFromId: listFromIdSelected,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragEnd(
      makeDragEvent(true, ComponentType.selected, ComponentType.selected) as unknown as DragEndEvent,
    );

    expect(mockSetSelected).toHaveBeenCalled();
  });

  it('reorders unused on drag end for unused and sets state', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.unused,
        listFromId: listFromIdUnused,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragEnd(
      makeDragEvent(true, ComponentType.unused, ComponentType.unused) as unknown as DragEndEvent,
    );

    expect(mockSetUnused).toHaveBeenCalled();
  });

  it('does not reorder on drag end for undroppable regions and sets state', () => {
    const { result } = renderHook(() =>
      useDragHandlers({
        startingList: ComponentType.unused,
        listFromId: listFromIdUnused,
        cancelDrag: mockCancelDrag,
        startDrag: mockStartDrag,
        endDrag: mockEndDrag,
        setStartingList: mockSetStartingList,
        setSelected: mockSetSelected,
        setUnused: mockSetUnused,
      }),
    );

    result.current.handleDragEnd(
      makeDragEvent(false, ComponentType.unused, ComponentType.unused) as unknown as DragEndEvent,
    );

    expect(mockSetSelected).not.toHaveBeenCalled();
    expect(mockSetUnused).not.toHaveBeenCalled();
  });
});
