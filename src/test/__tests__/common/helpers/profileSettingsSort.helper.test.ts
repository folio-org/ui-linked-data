import { sortProfileSettingsChildren } from '@/common/helpers/profileSettingsSort.helper';

describe('sortProfileSettingsChildren', () => {
  test.each([
    [
      'hidden in one',
      [
        { id: 'a', visible: true, order: 1 },
        { id: 'b', visible: false, order: 2 },
      ],
      [
        { id: 'a', visible: true, order: 1 },
        { id: 'b', visible: false, order: 2 },
      ],
    ],
    [
      'hidden in one with opposite ordering',
      [
        { id: 'a', visible: true, order: 2 },
        { id: 'b', visible: false, order: 1 },
      ],
      [
        { id: 'a', visible: true, order: 2 },
        { id: 'b', visible: false, order: 1 },
      ],
    ],
    [
      'both hidden',
      [
        { id: 'a', visible: false, order: 1 },
        { id: 'b', visible: false, order: 2 },
      ],
      [
        { id: 'a', visible: false, order: 1 },
        { id: 'b', visible: false, order: 2 },
      ],
    ],
    [
      'both hidden opposite ordering',
      [
        { id: 'a', visible: false, order: 2 },
        { id: 'b', visible: false, order: 1 },
      ],
      [
        { id: 'b', visible: false, order: 1 },
        { id: 'a', visible: false, order: 2 },
      ],
    ],
    [
      'maintain original ordering',
      [
        { id: 'a', visible: true, order: 1 },
        { id: 'b', visible: true, order: 2 },
      ],
      [
        { id: 'a', visible: true, order: 1 },
        { id: 'b', visible: true, order: 2 },
      ],
    ],
    [
      'opposite ordering',
      [
        { id: 'a', visible: true, order: 2 },
        { id: 'b', visible: true, order: 1 },
      ],
      [
        { id: 'b', visible: true, order: 1 },
        { id: 'a', visible: true, order: 2 },
      ],
    ],
  ])('%s', (_name, settingsChildren, expected) => {
    const settingsInput = {
      active: true,
      children: settingsChildren,
    };

    sortProfileSettingsChildren(settingsInput as ProfileSettings);
    expect(settingsChildren).toEqual(expected);
  });
});
