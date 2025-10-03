import { render, screen } from '@testing-library/react';
import { HubAssignFormatter } from '@components/ComplexLookupField/formatters/Hub/HubAssign';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

describe('HubAssignFormatter', () => {
  const mockOnAssign = jest.fn();

  const defaultRow = {
    __meta: {
      id: 'test_id_123',
    },
    hub: {
      label: 'Test Hub Label',
      uri: 'test_hub_url',
    },
  };

  test('renders assign button with correct text', () => {
    render(<HubAssignFormatter row={defaultRow} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('ld.assign');
  });

  test('has correct test id', () => {
    render(<HubAssignFormatter row={defaultRow} onAssign={mockOnAssign} />);

    const button = screen.getByTestId('assign-button-test_id_123');
    expect(button).toBeInTheDocument();
  });

  test('calls onAssign with correct data when clicked', () => {
    render(<HubAssignFormatter row={defaultRow} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    button.click();

    expect(mockOnAssign).toHaveBeenCalledWith({
      id: 'test_id_123',
      title: 'Test Hub Label',
      uri: 'test_hub_url',
    });
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

    expect(mockOnAssign).toHaveBeenCalledWith({
      id: 'test_id_123',
      title: '',
      uri: 'test_hub_url',
    });
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

    expect(mockOnAssign).toHaveBeenCalledWith({
      id: 'test_id_123',
      title: 'Test Hub Label',
      uri: '',
    });
  });

  test('handles missing hub data', () => {
    const rowWithoutHub = {
      __meta: {
        id: 'test_id_456',
      },
      hub: {
        label: undefined,
        uri: undefined,
      },
    };

    render(<HubAssignFormatter row={rowWithoutHub} onAssign={mockOnAssign} />);

    const button = screen.getByRole('button');
    button.click();

    expect(mockOnAssign).toHaveBeenCalledWith({
      id: 'test_id_456',
      title: '',
      uri: '',
    });
  });
});
