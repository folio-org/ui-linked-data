import '@src/test/__mocks__/lib/react-select.mock';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropdownField } from '@components/DropdownField';

// TODO: enable/update unit tests once the edit section
// field components are stable
describe('Dropdown Field', () => {
  const options = [{ label: 'test label', value: 'testValue', uri: 'testUri' }];
  const uuid = 'testUuid';
  const onChangeFn = jest.fn();

  const { getByTestId } = screen;

  function renderComponent() {
    render(<DropdownField options={options} uuid={uuid} onChange={onChangeFn} value={options[0]} />);
  }

  test('triggers onChange', () => {
    const event = {
      target: {
        value: 'testValue',
      },
    };

    renderComponent();
    fireEvent.change(getByTestId('dropdown-field'), event);

    expect(onChangeFn).toHaveBeenCalledWith(options[0], uuid, true);
  });
});
