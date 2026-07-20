import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { useManageProfileSettingsStore } from '@/store';

import { ProfileSettingsEditor } from './ProfileSettingsEditor';

describe('ProfileSettingsEditor', () => {
  const mockSetSettingsName = jest.fn();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ProfileSettingsEditor />
        </QueryClientProvider>
      </MemoryRouter>,
    );
  };

  afterEach(() => {
    queryClient.clear();
  });

  it('renders with no state', async () => {
    renderComponent();

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

    renderComponent();

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

    renderComponent();

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
                order: 2,
              },
            ],
          },
        },
      },
    ]);

    renderComponent();

    const unused = screen.getByTestId('unused-component-list');
    const selected = screen.getByTestId('selected-component-list');
    expect(within(unused).getByText('Child A')).toBeInTheDocument();
    expect(within(selected).getByText('1. Child B')).toBeInTheDocument();
    expect(screen.queryByText('ld.unusedComponents.allUsed')).not.toBeInTheDocument();
  });

  it('responds to settings name change', () => {
    const initialName = 'initial-name';
    const newName = 'new-name';
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          settingsName: initialName,
          setSettingsName: mockSetSettingsName,
        },
      },
    ]);

    renderComponent();

    const nameInput = screen.getByTestId('settings-name');
    expect(nameInput).toHaveValue(initialName);

    fireEvent.change(nameInput, { target: { value: newName } });

    waitFor(() => {
      expect(mockSetSettingsName).toHaveBeenCalledWith(newName);
    });
  });
});
