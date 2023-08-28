import '@src/test/__mocks__/lib/react-select.mock';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropdownField } from '@components/DropdownField';

describe('Dropdown Field', () => {
  const options = [{ label: 'test label', value: 'testValue', uri: 'testUri' }];
  const uuid = 'testUuid';
  const onChangeFn = jest.fn();

  beforeEach(() => {
    render(<DropdownField options={options} name={'test name'} uuid={uuid} onChange={onChangeFn} value={options[0]} />);
  });

  test('renders Literal Field component', () => {
    expect(screen.getByTestId('dropdown-field')).toBeInTheDocument();
    expect(screen.getByTestId('mock-select')).toBeInTheDocument();
  });

  test('triggers onChange', () => {
    const event = {
      target: {
        value: 'testValue',
      },
    };

    fireEvent.change(screen.getByTestId('mock-select'), event);

    expect(onChangeFn).toHaveBeenCalledWith(options[0], uuid, true);
  });
});
