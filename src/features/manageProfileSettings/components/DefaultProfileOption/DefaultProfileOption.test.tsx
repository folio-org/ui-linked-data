import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useManageProfileSettingsState, useProfileState } from '@/store';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { DefaultProfileOption } from './DefaultProfileOption';
import { fetchPreferredProfiles } from '@/common/api/profiles.api';
import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';

jest.mock('@common/api/profiles.api', () => ({
  fetchPreferredProfiles: jest.fn(),
}));

describe('DefaultProfileOption', () => {
  const mockSetIsModified = jest.fn();

  const mockProfile = {
    id: 'test-work-one',
    name: 'Test Work One',
    resourceType: BFLITE_URIS.WORK,
  };
  const mockPreferredProfiles = [
    {
      id: 'test-instance-two',
      name: 'Test Instance Two',
      resourceType: BFLITE_URIS.INSTANCE,
    },
    mockProfile,
  ];

  const renderComponent = (cached: boolean) => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          setIsModified: mockSetIsModified,
        },
      },
      {
        store: useProfileState,
        state: {
          preferredProfiles: cached ? mockPreferredProfiles : null,
        },
      },
    ]);

    return render(
      <MemoryRouter>
        <DefaultProfileOption selectedProfile={mockProfile} />
      </MemoryRouter>,
    );
  };

  it('renders when preferred profiles not cached', async () => {
    (fetchPreferredProfiles as jest.Mock).mockReturnValue(mockPreferredProfiles);

    renderComponent(false);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).toBeChecked();
    });
  });

  it('renders when preferred profiles are cached', async () => {
    renderComponent(true);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).toBeChecked();
    });
  });

  it('renders as unchecked when selected profile is not preferred', async () => {
    (fetchPreferredProfiles as jest.Mock).mockReturnValue([
      {
        id: 'test-instance-two',
        name: 'Test Instance Two',
        resourceType: BFLITE_URIS.INSTANCE,
      },
    ]);

    renderComponent(false);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).not.toBeChecked();
    });
  });

  it('renders as unchecked when no preferred profles', async () => {
    (fetchPreferredProfiles as jest.Mock).mockReturnValue([]);

    renderComponent(false);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).not.toBeChecked();
    });
  });

  it('updates preferred value through interaction', async () => {
    renderComponent(true);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).toBeChecked();
    });

    fireEvent.click(screen.getByTestId('type-default-setting'));

    await waitFor(() => {
      expect(mockSetIsModified).toHaveBeenCalledWith(true);
      expect(screen.getByTestId('type-default-setting')).not.toBeChecked();
    });
  });
});
