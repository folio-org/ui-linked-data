import { render, screen, fireEvent } from '@testing-library/react';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { ProfileSelectionManager } from '@components/ProfileSelectionManager';
import { ROUTES } from '@common/constants/routes.constants';
import { useNavigationState, useProfileState, useUIState } from '@src/store';

const mockSetIsProfileSelectionModalOpen = jest.fn();
const mockNavigateToEditPage = jest.fn();

jest.mock('@common/hooks/useNavigateToEditPage', () => ({
  useNavigateToEditPage: () => ({
    navigateToEditPage: mockNavigateToEditPage,
  }),
}));

describe('ProfileSelectionManager', () => {
  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useUIState,
        state: {
          isProfileSelectionModalOpen: true,
          setIsProfileSelectionModalOpen: mockSetIsProfileSelectionModalOpen,
        },
      },
      {
        store: useProfileState,
        state: {
          availableProfiles: [
            { id: 'profile_1', name: 'Test Profile 1', resourceType: 'work' },
            { id: 'profile_2', name: 'Test Profile 2', resourceType: 'instance' },
          ],
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

  test('navigates to edit page with correct URL when profile is selected and submitted', () => {
    render(<ProfileSelectionManager />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'profile_2' } });
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(mockSetIsProfileSelectionModalOpen).toHaveBeenCalledWith(false);
    expect(mockNavigateToEditPage).toHaveBeenCalledWith(
      expect.stringContaining(`${ROUTES.RESOURCE_CREATE.uri}?sourceId=123&sourceType=test&profileId=profile_2`),
    );
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
});
