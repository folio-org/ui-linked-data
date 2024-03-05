import { render, screen, fireEvent } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import { LiteralField } from '@components/LiteralField';

const uuid = uuidv4();
const onChangeFn = jest.fn();

const { getByTestId } = screen;

describe('Literal Field', () => {
  function renderComponent() {
    render(<LiteralField uuid={uuid} onChange={onChangeFn} />);
  }

  test('triggers handleOnChange', () => {
    const event = {
      target: {
        value: 'test',
      },
    };

    renderComponent();
    fireEvent.change(getByTestId("literal-field"), event);

    expect(onChangeFn).toHaveBeenCalledWith(uuid, [{ label: event.target.value }]);
  });
});
