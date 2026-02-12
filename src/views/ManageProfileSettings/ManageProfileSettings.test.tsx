import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { fetchPreferredProfiles, fetchProfile, fetchProfileSettings, fetchProfiles } from '@/common/api/profiles.api';
import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { ManageProfileSettings } from './ManageProfileSettings';

jest.mock('@/common/api/profiles.api', () => ({
  fetchProfiles: jest.fn(),
  fetchPreferredProfiles: jest.fn(),
  fetchProfile: jest.fn(),
  fetchProfileSettings: jest.fn(),
}));

const renderComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <BrowserRouter>
      <IntlProvider locale="en">
        <QueryClientProvider client={queryClient}>
          <ManageProfileSettings />
        </QueryClientProvider>
      </IntlProvider>
    </BrowserRouter>,
  );
};

describe('ManageProfileSettings', () => {
  const mockProfiles = [
    {
      id: 'one-profile',
      name: 'One Profile',
      resourceTypeURL: BFLITE_URIS.INSTANCE,
    },
    {
      id: 'two-profile',
      name: 'Two Profile',
      resourceTypeURL: BFLITE_URIS.INSTANCE,
    },
  ];
  const mockPreferredProfiles = [
    {
      id: 'one-profile',
      name: 'One Profile',
      resourceTypeURL: BFLITE_URIS.INSTANCE,
    },
  ];
  const mockProfile = [
    {
      id: 'one-profile',
      displayName: 'Test Profile',
      type: AdvancedFieldType.block,
      children: ['test:child'],
    },
    {
      id: 'test:child',
      type: AdvancedFieldType.literal,
      displayName: 'Child',
    },
  ];
  const mockProfileSettings = {
    active: true,
    children: [
      {
        id: 'test:child',
        visible: true,
        order: 1,
      },
    ],
  };

  beforeEach(() => {
    (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);
    (fetchPreferredProfiles as jest.Mock).mockResolvedValue(mockPreferredProfiles);
    (fetchProfile as jest.Mock).mockResolvedValue(mockProfile);
    (fetchProfileSettings as jest.Mock).mockResolvedValue(mockProfileSettings);
    renderComponent();
  });

  it('renders main component', () => {
    expect(screen.getByTestId('manage-profile-settings')).toBeInTheDocument();
  });

  it('renders profiles list', () => {
    waitFor(() => {
      expect(screen.getByTestId('profiles-list')).toBeInTheDocument();
    });
  });

  it('renders profile settings with an auto-selected profile', () => {
    waitFor(() => {
      expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
    });
  });

  describe('responsive display', () => {
    const setViewport = (width: number) => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
    };

    it('displays profiles list and settings editor side by side when viewport is wide enough', () => {
      setViewport(1400);

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toBeVisible();
        expect(screen.getByTestId('profile-settings')).toBeVisible();
      });
    });

    it('displays only profiles list when viewport is narrow', () => {
      setViewport(600);

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toBeVisible();
        expect(screen.getByTestId('profile-settings')).not.toBeVisible();
      });
    });

    it('displays only settings editor after selecting a profile from list when viewport is narrow', () => {
      setViewport(600);

      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).not.toBeVisible();
        expect(screen.getByTestId('profile-settings')).toBeVisible();
      });
    });

    it('displays only profile list after returning from settings when viewport is narrow', () => {
      setViewport(600);

      fireEvent.click(screen.getAllByTestId('resource-profile-item')[0]);
      fireEvent.click(screen.getByTestId('back-to-profiles-list'));

      waitFor(() => {
        expect(screen.getByTestId('profiles-list')).toBeVisible();
        expect(screen.getByTestId('profile-settings')).not.toBeVisible();
      });
    });
  });
});
