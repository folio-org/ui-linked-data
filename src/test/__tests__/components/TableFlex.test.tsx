import { render, screen, fireEvent } from '@testing-library/react';
import { TableFlex } from '@components/Table/TableFlex';

describe('TableFlex Component', () => {
  const header = {
    name: { label: 'Name', position: 1 },
    age: { label: 'Age', position: 2 },
  };

  const data = [
    { __meta: { id: 1, key: 'row_1' }, name: { label: 'John Doe' }, age: { label: '30' } },
    { __meta: { id: 2, key: 'row_2' }, name: { label: 'Jane Doe' }, age: { label: '25' } },
  ];

  const onRowClick = jest.fn();
  const onHeaderCellClick = jest.fn();

  beforeEach(() => {
    render(<TableFlex header={header} data={data} onRowClick={onRowClick} onHeaderCellClick={onHeaderCellClick} />);
  });

  test('renders TableFlex component', () => {
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('th-name')).toHaveTextContent('Name');
    expect(screen.getByTestId('th-age')).toHaveTextContent('Age');
    expect(screen.getAllByTestId('table-row')).toHaveLength(2);
  });

  test('calls onHeaderCellClick when header cell is clicked', () => {
    fireEvent.click(screen.getByTestId('th-name'));

    expect(onHeaderCellClick).toHaveBeenCalledWith({ name: header.name });
  });

  test('calls onRowClick when row is clicked', () => {
    fireEvent.click(screen.getAllByTestId('table-row')[0]);

    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  test('calls onHeaderCellClick when Enter key is pressed on header cell', () => {
    const headerCell = screen.getByTestId('th-name');
    headerCell.focus();

    fireEvent.keyDown(headerCell, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onHeaderCellClick).toHaveBeenCalledWith({ name: header.name });
  });

  test('calls onRowClick when Enter key is pressed on a table row', () => {
    const tableRow = screen.getAllByTestId('table-row')[0];
    tableRow.focus();

    fireEvent.keyDown(tableRow, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});
