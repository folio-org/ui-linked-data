import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { render, screen, within } from '@testing-library/react';

import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { useManageProfileSettingsStore } from '@/store';

import { ProfileSettingsEditor } from './ProfileSettingsEditor';

describe('ProfileSettingsEditor', () => {
  it('renders with no state', async () => {
    render(
      <MemoryRouter>
        <ProfileSettingsEditor />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('profile-settings-editor')).toBeInTheDocument();
  });

  it('renders with inactive settings', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          fullProfile: [
            {
              id: 'profile',
              type: AdvancedFieldType.block,
              displayName: 'Profile',
              children: ['child'],
            },
            {
              id: 'child',
              type: AdvancedFieldType.simple,
              displayName: 'Child',
            },
          ],
          profileSettings: {
            active: false,
            children: [],
          },
        },
      },
    ]);

    render(
      <MemoryRouter>
        <ProfileSettingsEditor />
      </MemoryRouter>,
    );

    const section = screen.getByTestId('selected-component-list');
    expect(within(section).getByText('1. Child')).toBeInTheDocument();
    expect(screen.getByText('ld.unusedComponents.allUsed')).toBeInTheDocument();
  });

  it('renders with active settings but none in use', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          fullProfile: [
            {
              id: 'profile',
              type: AdvancedFieldType.block,
              displayName: 'Profile',
              children: ['child'],
            },
            {
              id: 'child',
              type: AdvancedFieldType.simple,
              displayName: 'Child',
            },
          ],
          profileSettings: {
            active: true,
            children: [
              {
                id: 'child',
                visible: false,
              },
            ],
          },
        },
      },
    ]);

    render(
      <MemoryRouter>
        <ProfileSettingsEditor />
      </MemoryRouter>,
    );

    const section = screen.getByTestId('unused-component-list');
    expect(within(section).getByText('Child')).toBeInTheDocument();
    expect(screen.queryByText('ld.unusedComponents.allUsed')).not.toBeInTheDocument();
  });

  it('renders with active settings with some in use', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          fullProfile: [
            {
              id: 'profile',
              type: AdvancedFieldType.block,
              displayName: 'Profile',
              children: ['childA', 'childB'],
            },
            {
              id: 'childA',
              type: AdvancedFieldType.simple,
              displayName: 'Child A',
            },
            {
              id: 'childB',
              type: AdvancedFieldType.simple,
              displayName: 'Child B',
            },
          ],
          profileSettings: {
            active: true,
            children: [
              {
                id: 'childB',
                visible: true,
                order: 1,
              },
              {
                id: 'childA',
                visible: false,
              },
            ],
          },
        },
      },
    ]);

    render(
      <MemoryRouter>
        <ProfileSettingsEditor />
      </MemoryRouter>,
    );

    const unused = screen.getByTestId('unused-component-list');
    const selected = screen.getByTestId('selected-component-list');
    expect(within(unused).getByText('Child A')).toBeInTheDocument();
    expect(within(selected).getByText('1. Child B')).toBeInTheDocument();
    expect(screen.queryByText('ld.unusedComponents.allUsed')).not.toBeInTheDocument();
  });
});
