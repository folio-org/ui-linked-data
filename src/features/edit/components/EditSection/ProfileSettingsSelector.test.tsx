import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import { useProfileStore } from '@/store';

import { ProfileSettingsSelector } from './ProfileSettingsSelector';

const mockGetRecordProfileId = jest.fn();

jest.mock('@/common/helpers/record.helper', () => ({
  getRecordProfileId: () => mockGetRecordProfileId(),
}));

describe('ProfileSettingsSelector', () => {
  const mockProfileId = 'profile-id';
  const mockSetSelectedProfileSettingsId = jest.fn();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const renderComponent = (withOptions: boolean) => {
    setInitialGlobalState([
      {
        store: useProfileStore,
        state: {
          selectedProfileSettingsId: '32',
          setSelectedProfileSettingsId: mockSetSelectedProfileSettingsId,
        },
      },
    ]);

    queryClient.setQueryData(
      ['profileSettingsMeta', mockProfileId],
      withOptions
        ? [
            {
              id: 15,
              name: 'fifteen',
            },
            {
              id: 32,
              name: 'thirty-two',
            },
          ]
        : [],
    );

    queryClient.setQueryData(['preferredProfileSettings', mockProfileId], [{ profileId: mockProfileId, id: 15 }]);

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileSettingsSelector />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  afterEach(() => {
    queryClient?.clear();
  });

  it('renders the component', () => {
    mockGetRecordProfileId.mockReturnValue(mockProfileId);

    renderComponent(true);

    expect(screen.getByTestId('profile-settings-selector-button')).toBeInTheDocument();
  });

  it('does not render the component when no options', () => {
    mockGetRecordProfileId.mockReturnValue(mockProfileId);

    renderComponent(false);

    expect(screen.queryByTestId('profile-settings-selector-button')).not.toBeInTheDocument();
  });

  it('clicking button shows menu', () => {
    mockGetRecordProfileId.mockReturnValue(mockProfileId);

    renderComponent(true);

    fireEvent.click(screen.getByTestId('profile-settings-selector-button'));

    expect(screen.getByTestId('profile-settings-selector-menu')).toBeInTheDocument();
  });

  it('profile setting currently in use is disabled', async () => {
    mockGetRecordProfileId.mockReturnValue(mockProfileId);

    renderComponent(true);

    fireEvent.click(screen.getByTestId('profile-settings-selector-button'));

    await waitFor(() => {
      expect(screen.getByText('thirty-two')).toBeDisabled();
    });
  });

  it('preferred profile setting shows a label', async () => {
    mockGetRecordProfileId.mockReturnValue(mockProfileId);

    renderComponent(true);

    fireEvent.click(screen.getByTestId('profile-settings-selector-button'));

    await waitFor(() => {
      expect(screen.getByText('ld.preferred')).toBeInTheDocument();
    });
  });

  it('clicking a setting selects it', async () => {
    mockGetRecordProfileId.mockReturnValue(mockProfileId);

    renderComponent(true);

    fireEvent.click(screen.getByTestId('profile-settings-selector-button'));
    fireEvent.click(screen.getByText('fifteen'));

    await waitFor(() => {
      expect(screen.queryByTestId('profile-settings-selector-menu')).not.toBeInTheDocument();
      expect(mockSetSelectedProfileSettingsId).toHaveBeenCalledWith('15');
    });
  });

  describe('accessibility', () => {
    test.each([
      ['with options', true],
      ['without options', false],
    ])('has no accessibility violations when %s', async (_description, withOptions) => {
      mockGetRecordProfileId.mockReturnValue(mockProfileId);

      const { container } = renderComponent(withOptions);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
