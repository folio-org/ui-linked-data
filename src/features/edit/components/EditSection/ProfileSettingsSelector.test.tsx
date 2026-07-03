import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useProfileStore } from '@/store';

import { ProfileSettingsSelector } from './ProfileSettingsSelector';

const mockGetRecordProfileId = jest.fn();

jest.mock('@/common/helpers/record.helper', () => ({
  getRecordProfileId: () => mockGetRecordProfileId(),
}));

describe('ProfileSettingsSelector', () => {
  const mockProfileId = 'profile-id';
  const mockSetSelectedProfileSettingsId = jest.fn();

  const renderComponent = () => {
    setInitialGlobalState([
      {
        store: useProfileStore,
        state: {
          selectedProfileSettingsId: '32',
          setSelectedProfileSettingsId: mockSetSelectedProfileSettingsId,
        },
      },
    ]);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    queryClient.setQueryData(
      ['profileSettingsMeta', mockProfileId],
      [
        {
          id: 15,
          name: 'fifteen',
        },
        {
          id: 32,
          name: 'thirty-two',
        },
      ],
    );

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileSettingsSelector />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('renders the component', () => {
    renderComponent();

    expect(screen.getByTestId('profile-settings-selector-button')).toBeInTheDocument();
  });

  it('clicking button shows menu', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('profile-settings-selector-button'));

    expect(screen.getByTestId('profile-settings-selector-menu')).toBeInTheDocument();
  });

  it('profile setting currently in use is disabled', async () => {
    mockGetRecordProfileId.mockReturnValue(mockProfileId);

    renderComponent();

    fireEvent.click(screen.getByTestId('profile-settings-selector-button'));

    await waitFor(() => {
      expect(screen.getByText('thirty-two')).toBeDisabled();
    });
  });

  it('clicking a setting selects it', async () => {
    mockGetRecordProfileId.mockReturnValue(mockProfileId);

    renderComponent();

    fireEvent.click(screen.getByTestId('profile-settings-selector-button'));
    fireEvent.click(screen.getByText('fifteen'));

    await waitFor(() => {
      expect(screen.queryByTestId('profile-settings-selector-menu')).not.toBeInTheDocument();
      expect(mockSetSelectedProfileSettingsId).toHaveBeenCalledWith('15');
    });
  });
});
