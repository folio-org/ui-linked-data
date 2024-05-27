import { fireEvent, render, screen } from '@testing-library/react';
import { DuplicateGroup } from '@components/DuplicateGroup';

describe('DuplicateGroup', () => {
  const { getByTestId, queryByTestId } = screen;
  const onClick = jest.fn();

  function renderComponent(hasDeleteButton = true) {
    render(<DuplicateGroup onClick={onClick} hasDeleteButton={hasDeleteButton} />);
  }

  test('renders DuplicateGroup component', () => {
    renderComponent();

    expect(getByTestId('id-duplicate-group')).toBeInTheDocument();
    expect(getByTestId('id-delete-duplicate-group')).toBeInTheDocument();
  });

  test('renders DuplicateGroup component without "Delete" button', () => {
    renderComponent(false);

    expect(queryByTestId('id-delete-duplicate-group')).not.toBeInTheDocument();
  });

  test('invokes passed "onClick" function', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('id-duplicate-group'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
