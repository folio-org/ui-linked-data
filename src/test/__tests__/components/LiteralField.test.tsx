import { render, screen, fireEvent } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import { LiteralField } from '@components/LiteralField';

const displayName = 'displayName';
const uuid = uuidv4();
const onChangeFn = jest.fn();

describe('Literal Field', () => {
  beforeEach(() => render(<LiteralField displayName={displayName} uuid={uuid} onChange={onChangeFn} />));

  test('renders Literal Field component', () => {
    expect(screen.getByTestId('literal-field')).toBeInTheDocument();
  });

  test('triggers handleOnChange', () => {
    const event = {
      target: {
        value: 'test',
      },
    };

    fireEvent.change(screen.getByPlaceholderText(displayName), event);
    expect(onChangeFn).toHaveBeenCalledWith(uuid, [{ label: event.target.value }]);
  });
});
