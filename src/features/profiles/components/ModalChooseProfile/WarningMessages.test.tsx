import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import * as profileSelectionHelper from '@/common/helpers/profileSelection.helper';

import { WarningMessages } from './WarningMessages';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span data-testid={`formatted-message-${id}`}>{id}</span>,
}));

jest.mock('@/common/helpers/profileSelection.helper', () => ({
  getWarningByProfileNames: jest.fn(),
}));

describe('WarningMessages', () => {
  const mockProfileSelectionType = {
    action: 'change',
    resourceTypeURL: 'work' as ResourceTypeURL,
  } as const;

  const mockProfiles = [
    { id: '1', name: 'Monograph', resourceType: 'work' },
    { id: '2', name: 'Serials', resourceType: 'work' },
    { id: '3', name: 'Rare Books', resourceType: 'work' },
  ];

  it('should render warning messages when warnings exist', () => {
    const mockWarnings = ['ld.warning.message1', 'ld.warning.message2'];
    (profileSelectionHelper.getWarningByProfileNames as jest.Mock).mockReturnValue(mockWarnings);

    render(
      <WarningMessages
        profileSelectionType={mockProfileSelectionType}
        profiles={mockProfiles}
        selectedProfileId="1"
        selectedValue="2"
      />,
    );

    expect(screen.getByTestId('formatted-message-ld.modal.chooseResourceProfile.warningTitle')).toBeInTheDocument();
    expect(screen.getByTestId('formatted-message-ld.warning.message1')).toBeInTheDocument();
    expect(screen.getByTestId('formatted-message-ld.warning.message2')).toBeInTheDocument();
    expect(profileSelectionHelper.getWarningByProfileNames).toHaveBeenCalledWith('work', 'Monograph', 'Serials');
  });

  it('should not render warnings when there are no warnings', () => {
    (profileSelectionHelper.getWarningByProfileNames as jest.Mock).mockReturnValue(null);

    const { container } = render(
      <WarningMessages
        profileSelectionType={mockProfileSelectionType}
        profiles={mockProfiles}
        selectedProfileId="1"
        selectedValue="2"
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render warnings when action is not change', () => {
    const { container } = render(
      <WarningMessages
        profileSelectionType={{ ...mockProfileSelectionType, action: 'set' }}
        profiles={mockProfiles}
        selectedProfileId="1"
        selectedValue="2"
      />,
    );

    expect(container.firstChild).toBeNull();

    expect(profileSelectionHelper.getWarningByProfileNames).not.toHaveBeenCalled();
  });

  it('should not render warnings when selectedProfileId and selectedValue are the same', () => {
    const { container } = render(
      <WarningMessages
        profileSelectionType={mockProfileSelectionType}
        profiles={mockProfiles}
        selectedProfileId="1"
        selectedValue="1"
      />,
    );

    expect(container.firstChild).toBeNull();

    expect(profileSelectionHelper.getWarningByProfileNames).not.toHaveBeenCalled();
  });

  it('should not render warnings when selectedProfileId is null', () => {
    const { container } = render(
      <WarningMessages
        profileSelectionType={mockProfileSelectionType}
        profiles={mockProfiles}
        selectedProfileId={null}
        selectedValue="2"
      />,
    );

    expect(container.firstChild).toBeNull();

    expect(profileSelectionHelper.getWarningByProfileNames).not.toHaveBeenCalled();
  });

  it('should not render warnings when profiles are not found', () => {
    (profileSelectionHelper.getWarningByProfileNames as jest.Mock).mockReturnValue([]);

    const { container } = render(
      <WarningMessages
        profileSelectionType={mockProfileSelectionType}
        profiles={[]}
        selectedProfileId="1"
        selectedValue="2"
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render warnings with multiple warning messages', () => {
    const mockWarnings = ['ld.warning.message_1', 'ld.warning.message_2', 'ld.warning.message_3'];
    (profileSelectionHelper.getWarningByProfileNames as jest.Mock).mockReturnValue(mockWarnings);

    render(
      <WarningMessages
        profileSelectionType={mockProfileSelectionType}
        profiles={mockProfiles}
        selectedProfileId="1"
        selectedValue="3"
      />,
    );

    expect(screen.getByTestId('formatted-message-ld.modal.chooseResourceProfile.warningTitle')).toBeInTheDocument();
    expect(screen.getByTestId('formatted-message-ld.warning.message_1')).toBeInTheDocument();
    expect(screen.getByTestId('formatted-message-ld.warning.message_2')).toBeInTheDocument();
    expect(screen.getByTestId('formatted-message-ld.warning.message_3')).toBeInTheDocument();
    expect(profileSelectionHelper.getWarningByProfileNames).toHaveBeenCalledWith('work', 'Monograph', 'Rare Books');
  });

  describe('accessibility', () => {
    test.each([
      [
        'warnings exist',
        () => (profileSelectionHelper.getWarningByProfileNames as jest.Mock).mockReturnValue(['ld.warning.message1']),
        {
          profileSelectionType: mockProfileSelectionType,
          profiles: mockProfiles,
          selectedProfileId: '1',
          selectedValue: '2',
        },
      ],
      [
        'no warnings',
        () => (profileSelectionHelper.getWarningByProfileNames as jest.Mock).mockReturnValue(null),
        {
          profileSelectionType: mockProfileSelectionType,
          profiles: mockProfiles,
          selectedProfileId: '1',
          selectedValue: '2',
        },
      ],
      [
        'action is not change',
        () => {},
        {
          profileSelectionType: { ...mockProfileSelectionType, action: 'set' as ProfileSelectionActionType },
          profiles: mockProfiles,
          selectedProfileId: '1',
          selectedValue: '2',
        },
      ],
      [
        'selectedProfileId and selectedValue are the same',
        () => {},
        {
          profileSelectionType: mockProfileSelectionType,
          profiles: mockProfiles,
          selectedProfileId: '1',
          selectedValue: '1',
        },
      ],
      [
        'selectedProfileId is null',
        () => {},
        {
          profileSelectionType: mockProfileSelectionType,
          profiles: mockProfiles,
          selectedProfileId: null,
          selectedValue: '2',
        },
      ],
      [
        'profiles are not found',
        () => (profileSelectionHelper.getWarningByProfileNames as jest.Mock).mockReturnValue([]),
        {
          profileSelectionType: mockProfileSelectionType,
          profiles: [] as ProfileDTO[],
          selectedProfileId: '1',
          selectedValue: '2',
        },
      ],
      [
        'multiple warning messages',
        () =>
          (profileSelectionHelper.getWarningByProfileNames as jest.Mock).mockReturnValue([
            'ld.warning.message_1',
            'ld.warning.message_2',
            'ld.warning.message_3',
          ]),
        {
          profileSelectionType: mockProfileSelectionType,
          profiles: mockProfiles,
          selectedProfileId: '1',
          selectedValue: '3',
        },
      ],
    ])('has no accessibility violations when %s', async (_description, setup, props) => {
      setup();

      const { container } = render(<WarningMessages {...props} />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
