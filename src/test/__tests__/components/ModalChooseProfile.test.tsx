import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ModalChooseProfile } from '@/components/ModalChooseProfile';

const mockProfiles = [
  { id: 'profile_1', name: 'Test Profile 1', resourceType: 'http://bibfra.me/vocab/lite/Work' },
  { id: 'profile_2', name: 'Test Profile 2', resourceType: 'http://bibfra.me/vocab/lite/Instance' },
  { id: 'profile_3', name: 'Test Profile 3', resourceType: 'http://bibfra.me/vocab/lite/Work' },
];
const mockProfileSelectionType = {
  action: 'set',
  resourceTypeURL: 'http://bibfra.me/vocab/lite/Work' as ResourceTypeURL,
} as ProfileSelectionType;

describe('ModalChooseProfile', () => {
  const onCancel = jest.fn();
  const onSubmit = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    createModalContainer();
  });

  test('renders modal component with profile selection', () => {
    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
      />,
    );

    // Check that modal content is rendered
    expect(screen.getByTestId('modal-choose-profile-content')).toBeInTheDocument();

    // Check that the profile select is rendered with correct options
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // Check that the dropdown has all the profile options
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(mockProfiles.length);
    expect(options[0]).toHaveValue('profile_1');
    expect(options[1]).toHaveValue('profile_2');
    expect(options[2]).toHaveValue('profile_3');
  });

  test('selects the first profile by default', () => {
    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveValue('profile_1');
  });

  test('changes selected profile when user selects different option', () => {
    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
      />,
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'profile_2' } });

    expect(selectElement).toHaveValue('profile_2');
  });

  test('toggles the "set as default" checkbox', () => {
    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
      />,
    );

    const checkbox = screen.getByRole('checkbox');

    // Initially the checkbox should be unchecked
    expect(checkbox).not.toBeChecked();

    // Click the checkbox to check it
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Click again to uncheck
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('calls onSubmit with selected profile id when submit button is clicked', async () => {
    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
      />,
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'profile_2' } });
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('profile_2', false);
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
      />,
    );

    fireEvent.click(screen.getByTestId('modal-button-cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when modal is closed', () => {
    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
      />,
    );

    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(
      <ModalChooseProfile
        isOpen={false}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  test('calls onSubmit with correct profile id when form is submitted without manual selection', async () => {
    const { rerender } = render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={[]}
      />,
    );

    rerender(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
      />,
    );

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('profile_1', false);
      expect(onSubmit).not.toHaveBeenCalledWith('0');
      expect(onSubmit).not.toHaveBeenCalledWith(undefined);
    });
  });

  test('checkbox is checked when selected profile is in preferred profiles', () => {
    const preferredProfiles = [
      { id: 'profile_1', name: 'Test Profile 1', resourceType: 'http://bibfra.me/vocab/lite/Work' },
    ];

    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
        selectedProfileId="profile_1"
        preferredProfiles={preferredProfiles}
        resourceTypeURL="http://bibfra.me/vocab/lite/Work"
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('checkbox is unchecked when selected profile is not in preferred profiles', () => {
    const preferredProfiles = [
      { id: 'profile_2', name: 'Test Profile 2', resourceType: 'http://bibfra.me/vocab/lite/Instance' },
    ];

    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
        selectedProfileId="profile_1"
        preferredProfiles={preferredProfiles}
        resourceTypeURL="http://bibfra.me/vocab/lite/Work"
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('checkbox state updates when profile selection changes', () => {
    const preferredProfiles = [
      { id: 'profile_3', name: 'Test Profile 3', resourceType: 'http://bibfra.me/vocab/lite/Work' },
    ];

    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
        preferredProfiles={preferredProfiles}
        resourceTypeURL="http://bibfra.me/vocab/lite/Work"
      />,
    );

    const selectElement = screen.getByRole('combobox');
    const checkbox = screen.getByRole('checkbox');

    // Initially profile_1 is selected and not in preferred profiles
    expect(selectElement).toHaveValue('profile_1');
    expect(checkbox).not.toBeChecked();

    // Change to profile_3 which is in preferred profiles
    fireEvent.change(selectElement, { target: { value: 'profile_3' } });
    expect(selectElement).toHaveValue('profile_3');
    expect(checkbox).toBeChecked();

    // Change to profile_2 which is not in preferred profiles for this resourceType
    fireEvent.change(selectElement, { target: { value: 'profile_2' } });
    expect(selectElement).toHaveValue('profile_2');
    expect(checkbox).not.toBeChecked();
  });

  test('checkbox is unchecked when no preferred profiles provided', () => {
    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
        selectedProfileId="profile_1"
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('checkbox is unchecked when no resourceTypeURL provided', () => {
    const preferredProfiles = [
      { id: 'profile_1', name: 'Test Profile 1', resourceType: 'http://bibfra.me/vocab/lite/Work' },
    ];

    render(
      <ModalChooseProfile
        isOpen={true}
        profileSelectionType={mockProfileSelectionType}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
        profiles={mockProfiles}
        selectedProfileId="profile_1"
        preferredProfiles={preferredProfiles}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
});
