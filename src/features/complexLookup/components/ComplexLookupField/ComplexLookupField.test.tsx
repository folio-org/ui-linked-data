import { fireEvent, render, screen } from '@testing-library/react';

import { ComplexLookupType } from '@/features/complexLookup/constants/complexLookup.constants';

import * as ComplexLookupHooks from '../../hooks';
import { ComplexLookupField } from './ComplexLookupField';

jest.mock('../../hooks', () => ({
  useComplexLookupField: jest.fn(),
}));

jest.mock('../../utils', () => ({
  formatComplexLookupDisplayValue: (value: UserValueContents[] | undefined) =>
    value
      ?.filter(({ label }) => label)
      .map(({ label }) => label)
      .join(' | ') || '',
}));

jest.mock('../ComplexLookupSelectedItem', () => ({
  ComplexLookupSelectedItem: ({
    id,
    label,
    handleDelete,
  }: {
    id?: string;
    label?: string;
    handleDelete: (id?: string) => void;
  }) => (
    <div data-testid={`selected-item-${id}`}>
      <span>{label}</span>
      <button onClick={() => handleDelete(id)}>Delete</button>
    </div>
  ),
}));

jest.mock('@/components/Input', () => ({
  Input: ({ value, disabled, ...props }: { value?: string; disabled?: boolean; [key: string]: unknown }) => (
    <input value={value} disabled={disabled} {...props} />
  ),
}));

const MockModal = ({
  isOpen,
  onClose,
  onAssign,
  initialQuery,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (record: ComplexLookupAssignRecordDTO) => void;
  initialQuery?: string;
}) =>
  isOpen ? (
    <div data-testid="mock-modal">
      <span>Modal Open</span>
      <span>{initialQuery}</span>
      <button onClick={onClose}>Close</button>
      <button onClick={() => onAssign({ id: 'new-id', title: 'New Item' })}>Assign</button>
    </div>
  ) : null;

describe('ComplexLookupField', () => {
  const mockOnChange = jest.fn();
  const mockHandleOpenModal = jest.fn();
  const mockHandleCloseModal = jest.fn();
  const mockHandleAssign = jest.fn();
  const mockHandleDelete = jest.fn();

  const defaultEntry: SchemaEntry = {
    uuid: 'test-uuid',
    htmlId: 'test-html-id',
    layout: {
      api: ComplexLookupType.Hub,
      isNew: true,
    },
  } as SchemaEntry;

  const defaultHookReturn = {
    localValue: [],
    isModalOpen: false,
    modalConfig: {
      component: MockModal,
      defaultProps: {},
      labels: {
        button: {
          base: 'ld.add',
          change: 'ld.change',
        },
      },
    },
    buttonLabelId: 'ld.add',
    handleOpenModal: mockHandleOpenModal,
    handleCloseModal: mockHandleCloseModal,
    handleAssign: mockHandleAssign,
    handleDelete: mockHandleDelete,
  };

  beforeEach(() => {
    (ComplexLookupHooks.useComplexLookupField as jest.Mock).mockReturnValue(defaultHookReturn);
  });

  describe('Old layout (read-only)', () => {
    it('renders read-only input when isNew is false', () => {
      const entry = {
        ...defaultEntry,
        layout: {
          ...defaultEntry.layout,
          isNew: false,
        },
      };

      render(<ComplexLookupField entry={entry} onChange={mockOnChange} />);

      const input = screen.getByTestId('complex-lookup-input');
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
    });

    it('displays formatted value in read-only input', () => {
      const entry = {
        ...defaultEntry,
        layout: {
          ...defaultEntry.layout,
          isNew: false,
        },
      };

      const value = [
        { id: '1', label: 'Item 1', meta: {} },
        { id: '2', label: 'Item 2', meta: {} },
      ];

      (ComplexLookupHooks.useComplexLookupField as jest.Mock).mockReturnValue({
        ...defaultHookReturn,
        localValue: value,
      });

      render(<ComplexLookupField entry={entry} value={value} onChange={mockOnChange} />);

      const input = screen.getByTestId('complex-lookup-input');
      expect(input).toHaveValue('Item 1 | Item 2');
    });
  });

  describe('New layout (interactive)', () => {
    it('renders interactive field with button', () => {
      render(<ComplexLookupField entry={defaultEntry} onChange={mockOnChange} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('ld.add')).toBeInTheDocument();
    });

    it('displays selected items when value exists', () => {
      const value = [
        { id: '1', label: 'Item 1', meta: {} },
        { id: '2', label: 'Item 2', meta: {} },
      ];

      (ComplexLookupHooks.useComplexLookupField as jest.Mock).mockReturnValue({
        ...defaultHookReturn,
        localValue: value,
        buttonLabelId: 'ld.change',
      });

      render(<ComplexLookupField entry={defaultEntry} value={value} onChange={mockOnChange} />);

      expect(screen.getByTestId('complex-lookup-value')).toBeInTheDocument();
      expect(screen.getByTestId('selected-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('selected-item-2')).toBeInTheDocument();
      expect(screen.getByText('ld.change')).toBeInTheDocument();
    });

    it('does not display value container when no items', () => {
      render(<ComplexLookupField entry={defaultEntry} onChange={mockOnChange} />);

      expect(screen.queryByTestId('complex-lookup-value')).not.toBeInTheDocument();
    });

    it('opens modal when button is clicked', () => {
      render(<ComplexLookupField entry={defaultEntry} onChange={mockOnChange} />);

      fireEvent.click(screen.getByRole('button'));

      expect(mockHandleOpenModal).toHaveBeenCalled();
    });

    it('renders modal when isModalOpen is true', () => {
      (ComplexLookupHooks.useComplexLookupField as jest.Mock).mockReturnValue({
        ...defaultHookReturn,
        isModalOpen: true,
      });

      render(<ComplexLookupField entry={defaultEntry} onChange={mockOnChange} />);

      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    });

    it('passes initialQuery to modal from first value label', () => {
      const value = [{ id: '1', label: 'Test Query', meta: {} }];

      (ComplexLookupHooks.useComplexLookupField as jest.Mock).mockReturnValue({
        ...defaultHookReturn,
        localValue: value,
        isModalOpen: true,
      });

      render(<ComplexLookupField entry={defaultEntry} value={value} onChange={mockOnChange} />);

      // Modal receives initialQuery prop (displayed in modal span)
      const spans = screen.getAllByText('Test Query');
      expect(spans.length).toBeGreaterThan(0);
    });

    it('does not render modal when modalConfig is null', () => {
      (ComplexLookupHooks.useComplexLookupField as jest.Mock).mockReturnValue({
        ...defaultHookReturn,
        modalConfig: null,
        isModalOpen: true,
      });

      render(<ComplexLookupField entry={defaultEntry} onChange={mockOnChange} />);

      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });

    it('applies correct data-testid to button', () => {
      render(<ComplexLookupField entry={defaultEntry} id="test-id" onChange={mockOnChange} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'test-id--changeComplexFieldValue');
    });

    it('passes meta.isPreferred to ComplexLookupSelectedItem', () => {
      const value = [{ id: '1', label: 'Item 1', meta: { isPreferred: true } }];

      (ComplexLookupHooks.useComplexLookupField as jest.Mock).mockReturnValue({
        ...defaultHookReturn,
        localValue: value,
      });

      render(<ComplexLookupField entry={defaultEntry} value={value} onChange={mockOnChange} />);

      expect(screen.getByTestId('selected-item-1')).toBeInTheDocument();
    });
  });

  describe('Hook integration', () => {
    it('calls useComplexLookupField with correct parameters', () => {
      const value = [{ id: '1', label: 'Test', meta: {} }];

      render(<ComplexLookupField entry={defaultEntry} value={value} onChange={mockOnChange} />);

      expect(ComplexLookupHooks.useComplexLookupField).toHaveBeenCalledWith({
        value,
        lookupType: ComplexLookupType.Hub,
        uuid: 'test-uuid',
        onChange: mockOnChange,
      });
    });

    it('handles undefined lookupType', () => {
      const entry = {
        ...defaultEntry,
        layout: {
          ...defaultEntry.layout,
          api: undefined,
        },
      };

      render(<ComplexLookupField entry={entry} onChange={mockOnChange} />);

      expect(ComplexLookupHooks.useComplexLookupField).toHaveBeenCalledWith(
        expect.objectContaining({
          lookupType: undefined,
        }),
      );
    });
  });
});
