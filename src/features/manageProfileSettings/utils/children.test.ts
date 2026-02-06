import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { childrenDifference, componentFromId, getProfileChildren, getSettingsChildren } from './children';

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
      },
    ],
    missingFromSettings: [],
  } as ProfileSettingsWithDrift;

  describe('componentFromId', () => {
    it('generates a component from an ID', () => {
      const component = componentFromId('test:childA', profile);

      expect(component.id).toBe('test:childA');
      expect(component.name).toBe('A');
    });

    it('generates a component with a blank label for an unrecognized ID', () => {
      const component = componentFromId('test:unknown', profile);

      expect(component.id).toBe('test:unknown');
      expect(component.name).toBe('');
    });
  });

  describe('getProfileChildren', () => {
    it('generates a list of block direct children from a profile', () => {
      const children = getProfileChildren(profile);

      expect(children.length).toBe(3);
      expect(children).toContainEqual({ id: 'test:childA', name: 'A' });
      expect(children).toContainEqual({ id: 'test:childB', name: 'B' });
      expect(children).toContainEqual({ id: 'test:childC', name: 'C' });
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
      expect(children).toContainEqual({ id: 'test:childA', name: 'A' });
      expect(children).toContainEqual({ id: 'test:childC', name: 'C' });
    });

    it('generates an empty list when profile settings has no visible children', () => {
      const children = getSettingsChildren(profile, {
        active: true,
        children: [
          {
            id: 'test:childA',
            visible: false,
          },
          {
            id: 'test:childB',
            visible: false,
          },
          {
            id: 'test:childC',
            visible: false,
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
  });

  describe('childrenDifference', () => {
    it('generates a list of children in the profile and not in the settings', () => {
      const profileChildren = getProfileChildren(profile);
      const settingsChildren = getSettingsChildren(profile, settings);
      const difference = childrenDifference(profileChildren, settingsChildren);

      expect(difference.length).toBe(1);
      expect(difference).toContainEqual({ id: 'test:childB', name: 'B' });
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
      expect(difference).toContainEqual({ id: 'test:childB', name: 'B' });
    });
  });
});
