import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';
import { UNUSED_EMPTY_ID } from '../constants';
import { childrenDifference, componentFromId, getProfileChildren, getSettingsChildren, listFromId } from './children';

describe('children', () => {
  const profile = [
    {
      id: 'test:block',
      displayName: 'Test Profile',
      type: AdvancedFieldType.block,
      children: ['test:childA', 'test:childB', 'test:childC'],
    },
    {
      id: 'test:childA',
      displayName: 'A',
      type: AdvancedFieldType.simple,
    },
    {
      id: 'test:childB',
      displayName: 'B',
      type: AdvancedFieldType.literal,
    },
    {
      id: 'test:childC',
      displayName: 'C',
      type: AdvancedFieldType.complex,
    },
  ] as Profile;

  const settings = {
    active: true,
    children: [
      {
        id: 'test:childA',
        visible: true,
        order: 1,
      },
      {
        id: 'test:childC',
        visible: true,
        order: 2,
      },
      {
        id: 'test:childB',
        visible: false,
        order: 3,
      },
    ],
    missingFromSettings: [],
  } as ProfileSettingsWithDrift;

  describe('listFromId', () => {
    it('generates selected list name from selected container ID', () => {
      const list = listFromId('selected');

      expect(list).toEqual(ComponentType.selected);
    });

    it('generates unused list name from unused container ID', () => {
      const list = listFromId('unused');

      expect(list).toEqual(ComponentType.unused);
    });

    it('generates unused list name from empty unusedcontainer ID', () => {
      const list = listFromId(UNUSED_EMPTY_ID);

      expect(list).toEqual(ComponentType.unused);
    });
  });

  describe('componentFromId', () => {
    it('generates a component from an ID', () => {
      const component = componentFromId('test:childA', profile);

      expect(component).toBeDefined();
      expect(component?.id).toBe('test:childA');
      expect(component?.name).toBe('A');
      expect(component?.mandatory).toBe(false);
    });

    it('generates a component with a blank label for an unrecognized ID', () => {
      const component = componentFromId('test:unknown', profile);

      expect(component).not.toBeDefined();
    });

    it('follows profile constraint mandatory value', () => {
      const profileWithConstraints = [
        {
          id: 'test:block',
          displayName: 'Test Profile',
          type: AdvancedFieldType.block,
          children: ['test:childA', 'test:childB'],
        },
        {
          id: 'test:childA',
          displayName: 'A',
          type: AdvancedFieldType.simple,
          constraints: {
            mandatory: true,
          },
        },
        {
          id: 'test:childB',
          displayName: 'B',
          type: AdvancedFieldType.literal,
          constraints: {
            mandatory: false,
          },
        },
      ] as Profile;

      const componentA = componentFromId('test:childA', profileWithConstraints);
      expect(componentA?.id).toBe('test:childA');
      expect(componentA?.name).toBe('A');
      expect(componentA?.mandatory).toBe(true);
      const componentB = componentFromId('test:childB', profileWithConstraints);
      expect(componentB?.id).toBe('test:childB');
      expect(componentB?.name).toBe('B');
      expect(componentB?.mandatory).toBe(false);
    });
  });

  describe('getProfileChildren', () => {
    it('generates a list of block direct children from a profile', () => {
      const children = getProfileChildren(profile);

      expect(children.length).toBe(3);
      expect(children).toContainEqual({ id: 'test:childA', name: 'A', mandatory: false });
      expect(children).toContainEqual({ id: 'test:childB', name: 'B', mandatory: false });
      expect(children).toContainEqual({ id: 'test:childC', name: 'C', mandatory: false });
    });

    it('generates an empty list when no block is in the profile', () => {
      const children = getProfileChildren([
        {
          id: 'test:child',
          type: AdvancedFieldType.literal,
        },
      ] as Profile);

      expect(children.length).toBe(0);
    });

    it('generates an empty list when the profile block has no children', () => {
      const children = getProfileChildren([
        {
          id: 'test:empty',
          type: AdvancedFieldType.block,
          children: [],
        },
        {
          id: 'test:child',
          type: AdvancedFieldType.enumerated,
        },
      ] as Profile);

      expect(children.length).toBe(0);
    });
  });

  describe('getSettingsChildren', () => {
    it('generates a list of visible children from profile settings', () => {
      const children = getSettingsChildren(profile, settings);

      expect(children.length).toBe(2);
      expect(children).toContainEqual({ id: 'test:childA', name: 'A', mandatory: false });
      expect(children).toContainEqual({ id: 'test:childC', name: 'C', mandatory: false });
    });

    it('generates an empty list when profile settings has no visible children', () => {
      const children = getSettingsChildren(profile, {
        active: true,
        children: [
          {
            id: 'test:childA',
            visible: false,
            order: 1,
          },
          {
            id: 'test:childB',
            visible: false,
            order: 2,
          },
          {
            id: 'test:childC',
            visible: false,
            order: 3,
          },
        ],
        missingFromSettings: [],
      } as ProfileSettingsWithDrift);

      expect(children.length).toBe(0);
    });

    it('generates an empty list when profile settings has no children', () => {
      const children = getSettingsChildren(profile, {
        active: true,
        children: [],
        missingFromSettings: [],
      } as ProfileSettingsWithDrift);

      expect(children.length).toBe(0);
    });

    it('generates a partial list when some profile settings are not in the profile', () => {
      const children = getSettingsChildren(profile, {
        active: true,
        children: [
          {
            id: 'test:childA',
            visible: true,
            order: 1,
          },
          {
            id: 'test:childB',
            visible: true,
            order: 2,
          },
          {
            id: 'test:childD',
            visible: true,
            order: 3,
          },
        ],
        missingFromSettings: [],
      } as ProfileSettingsWithDrift);

      expect(children.length).toBe(2);
      expect(children).toContainEqual({ id: 'test:childA', name: 'A', mandatory: false });
      expect(children).toContainEqual({ id: 'test:childB', name: 'B', mandatory: false });
      expect(children).not.toContainEqual({ id: 'test:childD', name: 'D', mandatory: false });
    });

    it('defers to mandatory constraint', () => {
      const profileWithConstraints = [
        {
          id: 'test:block',
          displayName: 'Test Profile',
          type: AdvancedFieldType.block,
          children: ['test:childA', 'test:childB'],
        },
        {
          id: 'test:childA',
          displayName: 'A',
          type: AdvancedFieldType.simple,
          constraints: {
            mandatory: true,
          },
        },
        {
          id: 'test:childB',
          displayName: 'B',
          type: AdvancedFieldType.literal,
          constraints: {
            mandatory: false,
          },
        },
      ] as Profile;
      const children = getSettingsChildren(profileWithConstraints, {
        active: true,
        children: [
          {
            id: 'test:childA',
            visible: false,
            order: 1,
          },
          {
            id: 'test:childB',
            visible: false,
            order: 2,
          },
        ],
        missingFromSettings: [],
      } as ProfileSettingsWithDrift);

      expect(children.length).toBe(1);
      expect(children).toContainEqual({ id: 'test:childA', name: 'A', mandatory: true });
    });
  });

  describe('childrenDifference', () => {
    it('generates a list of children in the profile and not in the settings', () => {
      const profileChildren = getProfileChildren(profile);
      const settingsChildren = getSettingsChildren(profile, settings);
      const difference = childrenDifference(profileChildren, settingsChildren);

      expect(difference.length).toBe(1);
      expect(difference).toContainEqual({ id: 'test:childB', name: 'B', mandatory: false });
    });

    it('generates the same profile list when settings are empty', () => {
      const profileChildren = getProfileChildren(profile);
      const settingsChildren = getSettingsChildren(profile, {
        active: true,
        children: [],
        missingFromSettings: [],
      } as ProfileSettingsWithDrift);
      const difference = childrenDifference(profileChildren, settingsChildren);

      expect(difference.length).toBe(3);
    });

    it('generates an empty list when there is no set-wise difference', () => {
      const profileChildren = getProfileChildren(profile);
      const settingsChildren = getSettingsChildren(profile, {
        active: true,
        children: [
          {
            id: 'test:childC',
            visible: true,
            order: 1,
          },
          {
            id: 'test:childB',
            visible: true,
            order: 2,
          },
          {
            id: 'test:childA',
            visible: true,
            order: 3,
          },
        ],
        missingFromSettings: [],
      } as ProfileSettingsWithDrift);
      const difference = childrenDifference(profileChildren, settingsChildren);

      expect(difference.length).toBe(0);
    });

    it('ignores children in settings but not in the profile', () => {
      const profileChildren = getProfileChildren(profile);
      const settingsChildren = getSettingsChildren(profile, {
        active: true,
        children: [
          {
            id: 'test:childC',
            visible: true,
            order: 1,
          },
          {
            id: 'test:childA',
            visible: true,
            order: 2,
          },
          {
            id: 'test:childD',
            visible: true,
            order: 3,
          },
          {
            id: 'test:childB',
            visible: false,
          },
        ],
        missingFromSettings: [],
      } as ProfileSettingsWithDrift);
      const difference = childrenDifference(profileChildren, settingsChildren);

      expect(difference.length).toBe(1);
      expect(difference).toContainEqual({ id: 'test:childB', name: 'B', mandatory: false });
    });
  });
});
