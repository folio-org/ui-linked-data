import { fireEvent, render, screen } from '@testing-library/react';

import { ROUTES } from '@/common/constants/routes.constants';
import { ProfileSelectionManager } from '@/components/ProfileSelectionManager';
import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useInputsState, useNavigationState, useProfileState, useUIState } from '@/store';
import { useStatusState } from '@/store/selectors';

const mockSetIsProfileSelectionModalOpen = jest.fn();
const mockNavigateToEditPage = jest.fn();
const mockChangeRecordProfile = jest.fn().mockResolvedValue(undefined);
const mockGetRecordProfileId = jest.fn();

jest.mock('@/common/hooks/useNavigateToEditPage', () => ({
  useNavigateToEditPage: () => ({
    navigateToEditPage: mockNavigateToEditPage,
  }),
}));
jest.mock('@/common/hooks/useRecordControls', () => ({
  useRecordControls: () => ({
    changeRecordProfile: mockChangeRecordProfile,
  }),
}));
jest.mock('@/common/helpers/record.helper', () => ({
  getRecordProfileId: () => mockGetRecordProfileId(),
}));

describe('ProfileSelectionManager', () => {
  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'set',
            resourceTypeURL: 'work',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
            instance: [{ id: 'profile_3', name: 'Test Profile 2', resourceTypeURL: 'instance' }],
          },
        },
      },
      {
        store: useNavigationState,
        state: {
          queryParams: { sourceId: '123', sourceType: 'test' },
        },
      },
    ]);

    createModalContainer();
  });

  test('renders ModalChooseProfile with correct props', () => {
    render(<ProfileSelectionManager />);

    // Verify the modal is rendered
    expect(screen.getByTestId('modal-choose-profile-content')).toBeInTheDocument();

    // Verify select has correct options from availableProfiles
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Test Profile 1');
    expect(options[1]).toHaveTextContent('Test Profile 2');
  });

  test('closes modal when Cancel is clicked', () => {
    render(<ProfileSelectionManager />);

    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(mockSetIsProfileSelectionModalOpen).toHaveBeenCalledWith(false);
  });

  test('closes modal when clicking overlay', () => {
    render(<ProfileSelectionManager />);

    fireEvent.click(screen.getByTestId('modal-overlay'));

    expect(mockSetIsProfileSelectionModalOpen).toHaveBeenCalledWith(false);
  });

  test('navigates to edit page with correct URL when profile is selected and action is "set"', () => {
    render(<ProfileSelectionManager />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'profile_2' } });
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(mockSetIsProfileSelectionModalOpen).toHaveBeenCalledWith(false);
    expect(mockNavigateToEditPage).toHaveBeenCalledWith(
      expect.stringContaining(`${ROUTES.RESOURCE_CREATE.uri}?sourceId=123&sourceType=test&profileId=profile_2`),
    );
    expect(mockChangeRecordProfile).not.toHaveBeenCalled();
  });

  test('calls changeRecordProfile when profile is selected and action is "change"', async () => {
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'change',
            resourceTypeURL: 'instance',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
            instance: [{ id: 'profile_3', name: 'Test Profile 3', resourceTypeURL: 'instance' }],
          },
        },
      },
      {
        store: useNavigationState,
        state: {
          queryParams: { sourceId: '123', sourceType: 'test' },
        },
      },
    ]);

    render(<ProfileSelectionManager />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'profile_3' } });
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(mockChangeRecordProfile).toHaveBeenCalledWith({ profileId: 'profile_3' });
    expect(mockSetIsProfileSelectionModalOpen).toHaveBeenCalledWith(false);
    expect(mockNavigateToEditPage).not.toHaveBeenCalled();
  });

  test('does not render modal when isProfileSelectionModalOpen is false', () => {
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: false,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
        },
      },
    ]);

    const { container } = render(<ProfileSelectionManager />);

    expect(container.firstChild).toBeNull();
  });

  test('sets selectedProfileId to null when profileSelectionType.action is "set"', () => {
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'set',
            resourceTypeURL: 'work',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
          },
        },
      },
    ]);

    render(<ProfileSelectionManager />);

    expect(screen.getByRole('combobox')).not.toHaveValue('profile_2');
  });

  test('sets selectedProfileId from record when profileSelectionType.action is "change"', () => {
    mockGetRecordProfileId.mockReturnValue('profile_2');

    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'change',
            resourceTypeURL: 'work',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
          },
        },
      },
      {
        store: useInputsState,
        state: {
          record: { profileId: 'profile_2' },
        },
      },
    ]);

    render(<ProfileSelectionManager />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('profile_2');
  });

  test('resets selectedProfileId to null when modal is closed', async () => {
    mockGetRecordProfileId.mockReturnValue('profile_2');

    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'change',
            resourceTypeURL: 'work',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
          },
        },
      },
      {
        store: useInputsState,
        state: {
          record: { profileId: 'profile_2' },
        },
      },
    ]);

    const { unmount } = render(<ProfileSelectionManager />);

    // Verify profile is selected initially
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('profile_2');

    // Close the modal
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(mockSetIsProfileSelectionModalOpen).toHaveBeenCalledWith(false);

    // Clean up the first render
    unmount();

    // Re-open modal with action 'set'
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'set',
            resourceTypeURL: 'work',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
          },
        },
      },
      {
        store: useInputsState,
        state: {
          record: { profileId: 'profile_2' },
        },
      },
    ]);

    // Render again to simulate reopening the modal
    render(<ProfileSelectionManager />);

    // No profile should be selected after reopening with 'set' action
    const newSelectElement = screen.getByRole('combobox');
    expect(newSelectElement).not.toHaveValue('profile_2');
  });

  test('updates selectedProfileId when record changes', () => {
    // Initial render with record that has profileId 'profile_1'
    mockGetRecordProfileId.mockReturnValue('profile_1');

    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'change',
            resourceTypeURL: 'work',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
          },
        },
      },
      {
        store: useInputsState,
        state: {
          record: { profileId: 'profile_1' },
        },
      },
    ]);

    const { rerender } = render(<ProfileSelectionManager />);

    // Initially profile_1 should be selected
    expect(screen.getByRole('combobox')).toHaveValue('profile_1');

    // Change the record but keep other dependencies the same
    mockGetRecordProfileId.mockReturnValue('profile_2');

    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'change',
            resourceTypeURL: 'work',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
          },
        },
      },
      {
        store: useInputsState,
        state: {
          record: { profileId: 'profile_2' },
        },
      },
    ]);

    rerender(<ProfileSelectionManager />);

    expect(screen.getByRole('combobox')).toHaveValue('profile_2');
  });

  test('renders ModalWarning when isEditedRecordChange is true', () => {
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'change',
            resourceTypeURL: 'work',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
          },
        },
      },
      {
        store: useStatusState,
        state: {
          isRecordEdited: true,
        },
      },
    ]);

    render(<ProfileSelectionManager />);

    // ModalChooseProfile should not be visible
    expect(screen.queryByTestId('modal-choose-profile-content')).not.toBeInTheDocument();
    // ModalWarning should be visible (by test id)
    expect(screen.getByTestId('modal-profile-warning')).toBeInTheDocument();
  });

  test('does not render ModalWarning when isEditedRecordChange is false', () => {
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
          profileSelectionType: {
            action: 'change',
            resourceTypeURL: 'work',
          },
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: {
            work: [
              { id: 'profile_1', name: 'Test Profile 1', resourceTypeURL: 'work' },
              { id: 'profile_2', name: 'Test Profile 2', resourceTypeURL: 'work' },
            ],
          },
        },
      },
      {
        store: useStatusState,
        state: {
          isRecordEdited: false,
        },
      },
    ]);

    render(<ProfileSelectionManager />);

    // ModalChooseProfile should be visible
    expect(screen.getByTestId('modal-choose-profile-content')).toBeInTheDocument();
    // ModalWarning should not be visible
    expect(screen.queryByTestId('modal-profile-warning')).not.toBeInTheDocument();
  });
});
