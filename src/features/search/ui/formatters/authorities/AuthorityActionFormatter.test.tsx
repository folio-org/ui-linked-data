import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { AuthorityActionFormatter } from './AuthorityActionFormatter';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

const makeRow = (id: string, isLD: boolean): SearchResultsTableRow => ({
  __meta: { id, key: id, isAnchor: false, isLD },
  label: { label: 'Some Authority' },
});

describe('AuthorityActionFormatter', () => {
  const mockOnEdit = jest.fn();
  const mockOnImport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LD authority (isLD: true)', () => {
    it('renders an Edit button', () => {
      render(<AuthorityActionFormatter row={makeRow('ld-1', true)} onEdit={mockOnEdit} onImport={mockOnImport} />);

      const button = screen.getByTestId('authority-edit-ld-1');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('authority-action-button');
      expect(button).toHaveTextContent('ld.edit');
    });

    it('calls onEdit with the id when the Edit button is clicked', () => {
      render(<AuthorityActionFormatter row={makeRow('ld-2', true)} onEdit={mockOnEdit} onImport={mockOnImport} />);

      fireEvent.click(screen.getByTestId('authority-edit-ld-2'));

      expect(mockOnEdit).toHaveBeenCalledWith('ld-2');
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnImport).not.toHaveBeenCalled();
    });

    it('does not render an Import button', () => {
      render(<AuthorityActionFormatter row={makeRow('ld-3', true)} onEdit={mockOnEdit} />);

      expect(screen.queryByTestId('authority-import-ld-3')).not.toBeInTheDocument();
    });
  });

  describe('MARC authority (isLD: false)', () => {
    it('renders an Import/Edit button', () => {
      render(<AuthorityActionFormatter row={makeRow('marc-1', false)} onEdit={mockOnEdit} onImport={mockOnImport} />);

      const button = screen.getByTestId('authority-import-marc-1');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('authority-action-button');
      expect(button).toHaveTextContent('ld.import.edit');
    });

    it('calls onImport with the id when the Import button is clicked', () => {
      render(<AuthorityActionFormatter row={makeRow('marc-2', false)} onEdit={mockOnEdit} onImport={mockOnImport} />);

      fireEvent.click(screen.getByTestId('authority-import-marc-2'));

      expect(mockOnImport).toHaveBeenCalledWith('marc-2');
      expect(mockOnImport).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('does not render an Edit button', () => {
      render(<AuthorityActionFormatter row={makeRow('marc-3', false)} onImport={mockOnImport} />);

      expect(screen.queryByTestId('authority-edit-marc-3')).not.toBeInTheDocument();
    });
  });

  it('does not throw when onEdit is not provided for an LD entry', () => {
    render(<AuthorityActionFormatter row={makeRow('ld-safe', true)} />);

    expect(() => fireEvent.click(screen.getByTestId('authority-edit-ld-safe'))).not.toThrow();
  });

  it('does not throw when onImport is not provided for a MARC entry', () => {
    render(<AuthorityActionFormatter row={makeRow('marc-safe', false)} />);

    expect(() => fireEvent.click(screen.getByTestId('authority-import-marc-safe'))).not.toThrow();
  });

  describe('accessibility', () => {
    test.each([
      ['LD authority with edit button', { row: makeRow('ld-1', true), onEdit: mockOnEdit, onImport: mockOnImport }],
      ['LD authority without import button', { row: makeRow('ld-3', true), onEdit: mockOnEdit }],
      [
        'MARC authority with import/edit button',
        { row: makeRow('marc-1', false), onEdit: mockOnEdit, onImport: mockOnImport },
      ],
      ['MARC authority without edit button', { row: makeRow('marc-3', false), onImport: mockOnImport }],
    ])('has no accessibility violations when %s', async (_description, props) => {
      const { container } = render(<AuthorityActionFormatter {...props} />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
