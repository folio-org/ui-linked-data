import { render, screen, fireEvent } from '@testing-library/react';
import { InstanceSelectCtlFormatter } from './InstanceSelectCtlFormatter';
import type { Row } from '@/components/Table';

describe('InstanceSelectCtlFormatter', () => {
  const formatMessage = jest.fn((descriptor, values) => {
    if (descriptor.id === 'ld.aria.table.selectRow') {
      return `Select row for ${values?.title}`;
    }
    return descriptor.id;
  });

  const onToggleSelect = jest.fn();

  const mockRow: Row = {
    title: { label: 'Test Instance' },
    __meta: { id: '123', key: 'key-123' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders checkbox input', () => {
    render(
      <InstanceSelectCtlFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onToggleSelect={onToggleSelect}
        selectedInstances={[]}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  test('checkbox is unchecked when instance is not selected', () => {
    render(
      <InstanceSelectCtlFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onToggleSelect={onToggleSelect}
        selectedInstances={['456', '789']}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveProperty('checked', false);
  });

  test('checkbox is checked when instance is selected', () => {
    render(
      <InstanceSelectCtlFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onToggleSelect={onToggleSelect}
        selectedInstances={['456', '123', '789']}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveProperty('checked', true);
  });

  test('calls onToggleSelect with correct parameters when checked', () => {
    render(
      <InstanceSelectCtlFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onToggleSelect={onToggleSelect}
        selectedInstances={[]}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onToggleSelect).toHaveBeenCalledTimes(1);
    expect(onToggleSelect).toHaveBeenCalledWith('123', true);
  });

  test('calls onToggleSelect with correct parameters when unchecked', () => {
    render(
      <InstanceSelectCtlFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onToggleSelect={onToggleSelect}
        selectedInstances={['123']}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onToggleSelect).toHaveBeenCalledTimes(1);
    expect(onToggleSelect).toHaveBeenCalledWith('123', false);
  });

  test('renders checkbox with correct id', () => {
    render(
      <InstanceSelectCtlFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onToggleSelect={onToggleSelect}
        selectedInstances={[]}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'row-select-ctl-key-123');
  });

  test('renders within container with correct class', () => {
    const { container } = render(
      <InstanceSelectCtlFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onToggleSelect={onToggleSelect}
        selectedInstances={[]}
      />,
    );

    expect(container.firstChild).toHaveClass('row-select-container');
  });
});
