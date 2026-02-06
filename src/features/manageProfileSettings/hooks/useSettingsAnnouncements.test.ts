import { Active, Over } from '@dnd-kit/core';
import { renderHook } from '@testing-library/react';

import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';
import { useSettingsAnnouncements } from './useSettingsAnnouncements';

describe('useSettingsAnnouncements', () => {
  const profile = [
    {
      id: 'test:profile',
      displayNane: 'Test Profile',
      type: AdvancedFieldType.block,
      children: ['test:childA', 'test:childB'],
    },
    {
      id: 'test:childA',
      displayName: 'A',
      type: AdvancedFieldType.literal,
    },
    {
      id: 'test:childB',
      displayName: 'B',
      type: AdvancedFieldType.literal,
    },
  ] as Profile;

  const active = {
    id: 'test:childA',
    rect: {
      current: {
        initial: null,
        translated: null,
      },
    },
  } as Active;

  const over = {
    id: 'test:childB',
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

  const overWithData = {
    id: 'test:childB',
    rect: {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    disabled: false,
    data: {
      current: {
        sortable: {
          containerId: ComponentType.selected,
        },
      },
    },
  } as Over;

  const listFromId = () => {
    return ComponentType.selected;
  };

  const plainArgs = {
    profile,
    startingList: ComponentType.unused,
    components: [],
    listFromId,
  };

  it('does not announce for drag start', () => {
    const { result } = renderHook(() => useSettingsAnnouncements(plainArgs));

    const announce = result.current.announcements.onDragStart({ active });

    expect(announce).toBeUndefined();
  });

  it('does not announce for drag over', () => {
    const { result } = renderHook(() => useSettingsAnnouncements(plainArgs));

    const announce = result.current.announcements.onDragOver({ active, over });

    expect(announce).toBeUndefined();
  });

  it('does not announce for drag cancel', () => {
    const { result } = renderHook(() => useSettingsAnnouncements(plainArgs));

    const announce = result.current.announcements.onDragCancel({ active, over });

    expect(announce).toBeUndefined();
  });

  it('announces for moving from unused to selected on drag end', () => {
    const { result } = renderHook(() =>
      useSettingsAnnouncements({
        profile,
        startingList: ComponentType.unused,
        components: [
          {
            id: 'test:childB',
            name: 'B',
          },
        ],
        listFromId: () => {
          return ComponentType.selected;
        },
      }),
    );

    const announce = result.current.announcements.onDragEnd({ active, over });

    expect(announce).toBe('ld.profileSettings.announce.movedToSelected');
  });

  it('announces for moving from unused to selected with data on drag end', () => {
    const { result } = renderHook(() =>
      useSettingsAnnouncements({
        profile,
        startingList: ComponentType.unused,
        components: [
          {
            id: 'test:childB',
            name: 'B',
          },
        ],
        listFromId: () => {
          return ComponentType.selected;
        },
      }),
    );

    const announce = result.current.announcements.onDragEnd({ active, over: overWithData });

    expect(announce).toBe('ld.profileSettings.announce.movedToSelected');
  });

  it('announces for moving within selected on drag end', () => {
    const { result } = renderHook(() =>
      useSettingsAnnouncements({
        profile,
        startingList: ComponentType.selected,
        components: [
          {
            id: 'test:childB',
            name: 'B',
          },
        ],
        listFromId: () => {
          return ComponentType.selected;
        },
      }),
    );

    const announce = result.current.announcements.onDragEnd({ active, over });

    expect(announce).toBe('ld.profileSettings.announce.reorderedSelected');
  });

  it('announces for moving selected to unused on drag end', () => {
    const { result } = renderHook(() =>
      useSettingsAnnouncements({
        profile,
        startingList: ComponentType.selected,
        components: [
          {
            id: 'test:childB',
            name: 'B',
          },
        ],
        listFromId: () => {
          return ComponentType.unused;
        },
      }),
    );

    const announce = result.current.announcements.onDragEnd({ active, over });

    expect(announce).toBe('ld.profileSettings.announce.movedToUnused');
  });

  it('does not announce for drag ending on unknown region', () => {
    const { result } = renderHook(() => useSettingsAnnouncements(plainArgs));

    const announce = result.current.announcements.onDragEnd({ active, over: null });

    expect(announce).toBeUndefined();
  });
});
