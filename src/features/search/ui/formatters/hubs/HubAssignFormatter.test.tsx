import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { HubAssignFormatter } from './HubAssignFormatter';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

describe('HubAssignFormatter', () => {
  const mockOnAssign = jest.fn();

  const defaultRow = {
    __meta: {
      id: 'test_id_123',
      isLocal: false,
    },
    hub: {
      label: 'Test Hub Label',
      uri: 'test_hub_url',
    },
  };

  test('renders import/assign button for external hub', () => {
    render(<HubAssignFormatter row={defaultRow} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('ld.importAssign');
  });

  test('renders assign button for local hub', () => {
    const localRow = {
      ...defaultRow,
      __meta: {
        ...defaultRow.__meta,
        isLocal: true,
      },
    };

    render(<HubAssignFormatter row={localRow} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('ld.assign');
  });

  test('has correct test id', () => {
    render(<HubAssignFormatter row={defaultRow} onAssign={mockOnAssign} />);

    const button = screen.getByTestId('assign-button-test_id_123');
    expect(button).toBeInTheDocument();
  });

  test('calls onAssign with libraryOfCongress sourceType for external hub', () => {
    render(<HubAssignFormatter row={defaultRow} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    button.click();

    expect(mockOnAssign).toHaveBeenCalledWith(
      {
        id: 'test_id_123',
        title: 'Test Hub Label',
        uri: 'test_hub_url',
        sourceType: 'libraryOfCongress',
      },
      true,
    );
  });

  test('calls onAssign with local sourceType for local hub', () => {
    const localRow = {
      ...defaultRow,
      __meta: {
        ...defaultRow.__meta,
        isLocal: true,
      },
    };

    render(<HubAssignFormatter row={localRow} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    button.click();

    expect(mockOnAssign).toHaveBeenCalledWith(
      {
        id: 'test_id_123',
        title: 'Test Hub Label',
        uri: 'test_hub_url',
        sourceType: 'local',
      },
      true,
    );
  });

  test('handles empty label', () => {
    const rowWithEmptyLabel = {
      ...defaultRow,
      hub: {
        ...defaultRow.hub,
        label: '',
      },
    };

    render(<HubAssignFormatter row={rowWithEmptyLabel} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    button.click();

    expect(mockOnAssign).toHaveBeenCalledWith(
      {
        id: 'test_id_123',
        title: '',
        uri: 'test_hub_url',
        sourceType: 'libraryOfCongress',
      },
      true,
    );
  });

  test('handles empty URI', () => {
    const rowWithEmptyUri = {
      ...defaultRow,
      hub: {
        ...defaultRow.hub,
        uri: '',
      },
    };

    render(<HubAssignFormatter row={rowWithEmptyUri} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    button.click();

    expect(mockOnAssign).toHaveBeenCalledWith(
      {
        id: 'test_id_123',
        title: 'Test Hub Label',
        uri: '',
        sourceType: 'libraryOfCongress',
      },
      true,
    );
  });

  test('handles missing hub data', () => {
    const rowWithoutHub = {
      __meta: {
        id: 'test_id_456',
        isLocal: false,
      },
      hub: {
        label: undefined,
        uri: undefined,
      },
    };

    render(<HubAssignFormatter row={rowWithoutHub} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    button.click();

    expect(mockOnAssign).toHaveBeenCalledWith(
      {
        id: 'test_id_456',
        title: '',
        uri: '',
        sourceType: 'libraryOfCongress',
      },
      true,
    );
  });

  describe('accessibility', () => {
    test.each([
      ['external hub', defaultRow],
      ['local hub', { ...defaultRow, __meta: { ...defaultRow.__meta, isLocal: true } }],
    ])('has no accessibility violations when %s', async (_description, row) => {
      const { container } = render(<HubAssignFormatter row={row} onAssign={mockOnAssign} />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
