import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { fetchProfiles } from '@common/api/profiles.api';
import { ManageProfileSettings } from '@/views';

jest.mock('@common/api/profiles.api', () => ({
  fetchProfiles: jest.fn(),
}));

const renderComponent = () => {    
  return render(
    <BrowserRouter>
      <ManageProfileSettings/>
    </BrowserRouter>
  );
};

describe('ManageProfileSettings', () => {
  const mockProfiles = [
    {
      id: 'one-profile',
      name: 'One Profile',
      resourceTypeURL: 'test-resource',
    },
    {
      id: 'two-profile',
      name: 'Two Profile',
      resourceTypeURL: 'test-resource',
    },
  ];

  beforeEach(() => {
    (fetchProfiles as jest.Mock).mockResolvedValue(mockProfiles);
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
