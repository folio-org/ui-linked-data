import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { fetchPreferredProfiles } from '@/common/api/profiles.api';
import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';

import { useManageProfileSettingsState, useProfileState } from '@/store';

import { DefaultProfileOption } from './DefaultProfileOption';

jest.mock('@/common/api/profiles.api', () => ({
  fetchPreferredProfiles: jest.fn(),
}));

describe('DefaultProfileOption', () => {
  const mockSetIsModified = jest.fn();

  const alphaIdProfile = {
    id: '2',
    name: 'Test Instance Two',
    resourceType: BFLITE_URIS.INSTANCE,
  };
  const numberIdProfile = {
    id: 2,
    name: 'Test Instance Two',
    resourceType: BFLITE_URIS.INSTANCE,
  };
  const mockProfile = {
    id: 'test-work-one',
    name: 'Test Work One',
    resourceType: BFLITE_URIS.WORK,
  };
  const mockPreferredProfiles = [alphaIdProfile, mockProfile];

  const renderComponent = (cached: boolean, selected: ProfileDTO) => {
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
        <DefaultProfileOption selectedProfile={selected} />
      </MemoryRouter>,
    );
  };

  it('renders when preferred profiles not cached', async () => {
    (fetchPreferredProfiles as jest.Mock).mockReturnValue(mockPreferredProfiles);

    renderComponent(false, mockProfile);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).toBeChecked();
    });
  });

  it('renders when preferred profiles are cached', async () => {
    renderComponent(true, mockProfile);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).toBeChecked();
    });
  });

  it('renders as unchecked when selected profile is not preferred', async () => {
    (fetchPreferredProfiles as jest.Mock).mockReturnValue([alphaIdProfile]);

    renderComponent(false, mockProfile);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).not.toBeChecked();
    });
  });

  it('renders as unchecked when no preferred profles', async () => {
    (fetchPreferredProfiles as jest.Mock).mockReturnValue([]);

    renderComponent(false, mockProfile);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).not.toBeChecked();
    });
  });

  it('updates preferred value through interaction', async () => {
    renderComponent(true, mockProfile);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).toBeChecked();
    });

    fireEvent.click(screen.getByTestId('type-default-setting'));

    await waitFor(() => {
      expect(mockSetIsModified).toHaveBeenCalledWith(true);
      expect(screen.getByTestId('type-default-setting')).not.toBeChecked();
    });
  });

  it('renders as unchecked when comparing selected number to cached string ID', async () => {
    renderComponent(true, numberIdProfile);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).not.toBeChecked();
    });
  });

  it('renders as checked when comparing selected number to fetched string ID', async () => {
    (fetchPreferredProfiles as jest.Mock).mockReturnValue([alphaIdProfile]);

    renderComponent(false, numberIdProfile);

    await waitFor(() => {
      expect(screen.getByTestId('type-default-setting')).toBeChecked();
    });
  });
});
