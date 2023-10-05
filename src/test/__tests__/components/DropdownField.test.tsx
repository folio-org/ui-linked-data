import '@src/test/__mocks__/lib/react-select.mock';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropdownField } from '@components/DropdownField';

describe('Dropdown Field', () => {
  const options = [{ label: 'test label', value: 'testValue', uri: 'testUri' }];
  const uuid = 'testUuid';
  const onChangeFn = jest.fn();
  const label = 'test name';

  const { getByTestId, queryByTestId } = screen;

  function renderComponent(labelText: string = label) {
    render(<DropdownField options={options} name={labelText} uuid={uuid} onChange={onChangeFn} value={options[0]} />);
  }

  test('renders Dropdown Field component with label', () => {
    renderComponent();

    expect(getByTestId('dropdown-field')).toBeInTheDocument();
    expect(getByTestId('dropdown-field-label')).toBeInTheDocument();
    expect(getByTestId('mock-select')).toBeInTheDocument();
  });

  test('renders Dropdown Field component without label', () => {
    renderComponent('');

    expect(getByTestId('dropdown-field')).toBeInTheDocument();
    expect(queryByTestId('dropdown-field-label')).not.toBeInTheDocument();
  });

  test('triggers onChange', () => {
    const event = {
      target: {
        value: 'testValue',
      },
    };

    renderComponent();
    fireEvent.change(getByTestId('mock-select'), event);

    expect(onChangeFn).toHaveBeenCalledWith(options[0], uuid, true);
  });
});
