import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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

  test('renders TableFlex component', () => {
    render(<TableFlex header={header} data={data} onRowClick={onRowClick} onHeaderCellClick={onHeaderCellClick} />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('th-name')).toHaveTextContent('Name');
    expect(screen.getByTestId('th-age')).toHaveTextContent('Age');
    expect(screen.getAllByTestId('table-row')).toHaveLength(2);
  });

  test('calls onHeaderCellClick when header cell is clicked', () => {
    render(<TableFlex header={header} data={data} onRowClick={onRowClick} onHeaderCellClick={onHeaderCellClick} />);

    fireEvent.click(screen.getByTestId('th-name'));

    expect(onHeaderCellClick).toHaveBeenCalledWith({ name: header.name });
  });

  test('calls onRowClick when row is clicked', () => {
    render(<TableFlex header={header} data={data} onRowClick={onRowClick} onHeaderCellClick={onHeaderCellClick} />);

    fireEvent.click(screen.getAllByTestId('table-row')[0]);

    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});
