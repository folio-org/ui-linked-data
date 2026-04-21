import { fireEvent, render, screen } from '@testing-library/react';

import { Table } from '@/components/Table';

describe('Table', () => {
  const mockHeader = {
    id: {
      label: 'id-head',
    },
    title: {
      label: 'title-head',
    },
    nonExistent: {
      label: 'nonExistent',
    },
  };
  const mockData = [
    {
      __meta: {
        key: '123',
      },
      id: {
        label: 'id-cell',
      },
      title: {
        label: 'title-cell',
      },
    },
  ];
  const onHeaderCellClick = jest.fn();
  const onRowClick = jest.fn();

  beforeEach(() =>
    render(<Table header={mockHeader} data={mockData} onHeaderCellClick={onHeaderCellClick} onRowClick={onRowClick} />),
  );

  it('renders Table', () => {
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('renders header and calls onHeaderCellClick', () => {
    const headerCell = screen.getByText(mockHeader.id.label);

    expect(headerCell).toBeInTheDocument();

    fireEvent.click(headerCell);

    expect(onHeaderCellClick).toHaveBeenCalledWith({ id: mockHeader.id });
  });

  it('renders row and calls onRowClick', () => {
    const row = screen.getByText(mockData[0].id.label);

    expect(row).toBeInTheDocument();

    fireEvent.click(row);

    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders empty cell if no corresponding entry exists in data arg', () => {
    expect(screen.getByTestId(mockHeader.nonExistent.label)).toBeEmptyDOMElement();
  });
});
