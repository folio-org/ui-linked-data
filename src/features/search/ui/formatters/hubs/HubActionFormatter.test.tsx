import { fireEvent, render, screen } from '@testing-library/react';

import { HubActionFormatter } from './HubActionFormatter';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

describe('HubActionFormatter', () => {
  const mockOnEdit = jest.fn();
  const mockOnImport = jest.fn();

  it('renders Edit button when isLocal is true', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token_1',
        key: 'key_1',
        isAnchor: false,
        isLocal: true,
      },
      hub: {
        label: 'Local Hub',
        uri: 'http://example.com/hub_1',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress.local',
        className: 'hub-source',
      },
    };

    render(<HubActionFormatter row={mockRow} onEdit={mockOnEdit} onImport={mockOnImport} />);

    const editButton = screen.getByTestId('hub-edit-token_1');
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass('hub-action-button');
    expect(editButton).toHaveTextContent('ld.edit');
  });

  it('calls onEdit with hub id when Edit button is clicked', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token_1',
        key: 'key_1',
        isAnchor: false,
        isLocal: true,
      },
      hub: {
        label: 'Local Hub',
        uri: 'http://example.com/hub_1',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress.local',
        className: 'hub-source',
      },
    };

    render(<HubActionFormatter row={mockRow} onEdit={mockOnEdit} onImport={mockOnImport} />);

    const editButton = screen.getByTestId('hub-edit-token_1');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith('token_1');
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnImport).not.toHaveBeenCalled();
  });

  it('renders Import/Edit button when isLocal is false', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token_2',
        key: 'key_2',
        isAnchor: false,
        isLocal: false,
      },
      hub: {
        label: 'Remote Hub',
        uri: 'http://example.com/hub_2',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress',
        className: 'hub-source',
      },
    };

    render(<HubActionFormatter row={mockRow} onEdit={mockOnEdit} onImport={mockOnImport} />);

    const importButton = screen.getByTestId('hub-import-token_2');
    expect(importButton).toBeInTheDocument();
    expect(importButton).toHaveClass('hub-action-button');
    expect(importButton).toHaveTextContent('ld.import.edit');
  });

  it('calls onImport with hub uri when Import button is clicked', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token_2',
        key: 'key_2',
        isAnchor: false,
        isLocal: false,
      },
      hub: {
        label: 'Remote Hub',
        uri: 'http://example.com/hub_2',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress',
        className: 'hub-source',
      },
    };

    render(<HubActionFormatter row={mockRow} onEdit={mockOnEdit} onImport={mockOnImport} />);

    const importButton = screen.getByTestId('hub-import-token_2');
    fireEvent.click(importButton);

    expect(mockOnImport).toHaveBeenCalledWith('http://example.com/hub_2');
    expect(mockOnImport).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('renders Import button when isLocal is undefined', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token_3',
        key: 'key_3',
        isAnchor: false,
      },
      hub: {
        label: 'Hub Without isLocal',
        uri: 'http://example.com/hub_3',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress',
        className: 'hub-source',
      },
    };

    render(<HubActionFormatter row={mockRow} onEdit={mockOnEdit} onImport={mockOnImport} />);

    const importButton = screen.getByTestId('hub-import-token_3');
    expect(importButton).toBeInTheDocument();
    expect(importButton).toHaveTextContent('ld.import.edit');
  });

  it('handles missing onEdit callback gracefully', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token_4',
        key: 'key_4',
        isAnchor: false,
        isLocal: true,
      },
      hub: {
        label: 'Local Hub',
        uri: 'http://example.com/hub_4',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress.local',
        className: 'hub-source',
      },
    };

    render(<HubActionFormatter row={mockRow} onImport={mockOnImport} />);

    const editButton = screen.getByTestId('hub-edit-token_4');
    fireEvent.click(editButton);

    // Should not throw error
    expect(editButton).toBeInTheDocument();
  });

  it('handles missing onImport callback gracefully', () => {
    const mockRow: SearchResultsTableRow = {
      __meta: {
        id: 'token5',
        key: 'key5',
        isAnchor: false,
        isLocal: false,
      },
      hub: {
        label: 'Remote Hub',
        uri: 'http://example.com/hub_5',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress',
        className: 'hub-source',
      },
    };

    render(<HubActionFormatter row={mockRow} onEdit={mockOnEdit} />);

    const importButton = screen.getByTestId('hub-import-token5');
    fireEvent.click(importButton);

    // Should not throw error
    expect(importButton).toBeInTheDocument();
  });
});
