import { render, screen, fireEvent } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import { LiteralField } from '@components/LiteralField';

const displayName = 'displayName';
const uuid = uuidv4();
const onChangeFn = jest.fn();

const { getByTestId, getByPlaceholderText, queryByTestId } = screen;

describe('Literal Field', () => {
  function renderComponent(labelText: string = displayName) {
    render(<LiteralField displayName={labelText} uuid={uuid} onChange={onChangeFn} />);
  }

  test('renders Literal Field component with label', () => {
    renderComponent();

    expect(getByTestId('literal-field')).toBeInTheDocument();
    expect(queryByTestId('literal-field-label')).toBeInTheDocument();
  });

  test('renders Literal Field component without label', () => {
    renderComponent('');

    expect(getByTestId('literal-field')).toBeInTheDocument();
    expect(queryByTestId('literal-field-label')).not.toBeInTheDocument();
  });

  test('triggers handleOnChange', () => {
    const event = {
      target: {
        value: 'test',
      },
    };

    renderComponent();
    fireEvent.change(getByPlaceholderText(displayName), event);

    expect(onChangeFn).toHaveBeenCalledWith(uuid, [{ label: event.target.value }]);
  });
});
