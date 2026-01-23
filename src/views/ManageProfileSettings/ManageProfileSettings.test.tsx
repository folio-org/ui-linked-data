import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { fetchPreferredProfiles, fetchProfile, fetchProfiles } from '@common/api/profiles.api';
import { ManageProfileSettings } from './ManageProfileSettings';

jest.mock('@common/api/profiles.api', () => ({
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

  beforeEach(() => {
    (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);
    (fetchPreferredProfiles as jest.Mock).mockResolvedValue(mockPreferredProfiles);
    (fetchProfile as jest.Mock).mockResolvedValue({});
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
});
