import { render, screen } from '@testing-library/react';
import { HubSourceFormatter } from './HubSourceFormatter';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

describe('HubSourceFormatter', () => {
  it('renders source label with FormattedMessage when label is a string', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token_1',
        key: 'key_1',
        isAnchor: false,
      },
      hub: {
        label: 'Test Hub',
        uri: 'http://example.com/hub_1',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress',
        className: 'hub-source',
      },
    };

    render(<HubSourceFormatter row={mockRow} />);

    const sourceElement = screen.getByTestId('hub-source-token_1');
    expect(sourceElement).toBeInTheDocument();
    expect(sourceElement).toHaveClass('hub-source');
    expect(sourceElement).toHaveTextContent('ld.source.libraryOfCongress');
  });

  it('renders source label with local source translation key', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token_2',
        key: 'key_2',
        isAnchor: false,
      },
      hub: {
        label: 'Local Hub',
        uri: 'http://example.com/hub_2',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress.local',
        className: 'hub-source',
      },
    };

    render(<HubSourceFormatter row={mockRow} />);

    const sourceElement = screen.getByTestId('hub-source-token_2');
    expect(sourceElement).toHaveTextContent('ld.source.libraryOfCongress.local');
  });

  it('renders non-string label directly', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token_3',
        key: 'key_3',
        isAnchor: false,
      },
      hub: {
        label: 'Test Hub',
        uri: 'http://example.com/hub_3',
        className: 'hub-title',
      },
      source: {
        label: <span>Custom Label</span>,
        className: 'hub-source',
      },
    };

    render(<HubSourceFormatter row={mockRow} />);

    const sourceElement = screen.getByTestId('hub-source-token_3');
    expect(sourceElement).toBeInTheDocument();
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('renders with correct test id based on row meta id', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'unique-test-id',
        key: 'key4',
        isAnchor: false,
      },
      hub: {
        label: 'Test Hub',
        uri: 'http://example.com/hub_4',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.test',
        className: 'hub-source',
      },
    };

    render(<HubSourceFormatter row={mockRow} />);

    expect(screen.getByTestId('hub-source-unique-test-id')).toBeInTheDocument();
  });
});
