import { sortProfileSettingsChildren } from '@/common/helpers/profileSettingsSort.helper';

describe('sortProfileSettingsChildren', () => {
  test.each([
    ['visibility and order both undefined', [{ id: 'a' }, { id: 'b' }], [{ id: 'a' }, { id: 'b' }]],
    [
      'visible and defined in first only',
      [{ id: 'a' }, { id: 'b', visible: true }],
      [{ id: 'b', visible: true }, { id: 'a' }],
    ],
    [
      'visible and defined in second only',
      [{ id: 'a', visible: true }, { id: 'b' }],
      [{ id: 'a', visible: true }, { id: 'b' }],
    ],
    [
      'visible and defined in both',
      [
        { id: 'a', visible: true },
        { id: 'b', visible: true },
      ],
      [
        { id: 'a', visible: true },
        { id: 'b', visible: true },
      ],
    ],
    [
      'hidden in first and defined in both',
      [
        { id: 'a', visible: false },
        { id: 'b', visible: true },
      ],
      [
        { id: 'b', visible: true },
        { id: 'a', visible: false },
      ],
    ],
    [
      'hidden in second and defined in both',
      [
        { id: 'a', visible: true },
        { id: 'b', visible: false },
      ],
      [
        { id: 'a', visible: true },
        { id: 'b', visible: false },
      ],
    ],
    [
      'hidden in both',
      [
        { id: 'a', visible: false },
        { id: 'b', visible: false },
      ],
      [
        { id: 'a', visible: false },
        { id: 'b', visible: false },
      ],
    ],
    [
      'order only in first',
      [
        { id: 'a', visible: true, order: 1 },
        { id: 'b', visible: true },
      ],
      [
        { id: 'a', visible: true, order: 1 },
        { id: 'b', visible: true },
      ],
    ],
    [
      'order only in second',
      [
        { id: 'a', visible: true },
        { id: 'b', visible: true, order: 1 },
      ],
      [
        { id: 'b', visible: true, order: 1 },
        { id: 'a', visible: true },
      ],
    ],
    [
      'order in both',
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
