import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { RDANotesFormatter } from './RDANotesFormatter';

jest.mock('./BaseNotesFormatter', () => ({
  BaseNotesFormatter: ({ row, fieldKey }: { row: SearchResultsTableRow; fieldKey: string }) => (
    <div data-testid="base-notes-formatter" data-field-key={fieldKey}>
      {JSON.stringify(row)}
    </div>
  ),
}));

describe('RDANotesFormatter', () => {
  const defaultRow = {
    __meta: {
      id: 'test_id_123',
    },
    rda: {
      notes: ['Note 1', 'Note 2'],
    },
    hub: {
      label: 'Test Hub',
      uri: 'test_hub_url',
    },
  };

  test('renders BaseNotesFormatter with correct props', () => {
    const { getByTestId } = render(<RDANotesFormatter row={defaultRow} />);

    const baseFormatter = getByTestId('base-notes-formatter');
    expect(baseFormatter).toBeInTheDocument();
    expect(baseFormatter).toHaveAttribute('data-field-key', 'rda');
  });

  test('passes row data to BaseNotesFormatter', () => {
    const { getByTestId } = render(<RDANotesFormatter row={defaultRow} />);

    const baseFormatter = getByTestId('base-notes-formatter');
    expect(baseFormatter).toHaveTextContent(JSON.stringify(defaultRow));
  });

  test('works with different row data', () => {
    const customRow = {
      __meta: {
        id: 'custom_id_456',
      },
      rda: {
        notes: ['Custom note'],
        additionalData: 'test',
      },
      hub: {
        label: 'Custom Hub',
        uri: 'test_custom_url',
      },
    };

    const { getByTestId } = render(<RDANotesFormatter row={customRow} />);

    const baseFormatter = getByTestId('base-notes-formatter');
    expect(baseFormatter).toHaveAttribute('data-field-key', 'rda');
    expect(baseFormatter).toHaveTextContent(JSON.stringify(customRow));
  });

  test('handles empty row data', () => {
    const emptyRow = {
      __meta: {
        id: 'empty_id',
      },
    };

    const { getByTestId } = render(<RDANotesFormatter row={emptyRow} />);

    const baseFormatter = getByTestId('base-notes-formatter');
    expect(baseFormatter).toHaveAttribute('data-field-key', 'rda');
    expect(baseFormatter).toHaveTextContent(JSON.stringify(emptyRow));
  });

  describe('accessibility', () => {
    test.each([
      ['default row data', defaultRow],
      [
        'custom row data',
        {
          __meta: { id: 'custom_id_456' },
          rda: { notes: ['Custom note'], additionalData: 'test' },
          hub: { label: 'Custom Hub', uri: 'test_custom_url' },
        },
      ],
      ['empty row data', { __meta: { id: 'empty_id' } }],
    ])('has no accessibility violations when %s', async (_description, row) => {
      const { container } = render(<RDANotesFormatter row={row} />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
