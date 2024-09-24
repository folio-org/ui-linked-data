import { fireEvent, render, screen } from '@testing-library/react';
import { DuplicateGroup } from '@components/DuplicateGroup';

describe('DuplicateGroup', () => {
  const { getByTestId, queryByTestId } = screen;
  const onClick = jest.fn();

  function renderComponent(hasDeleteButton = true) {
    render(<DuplicateGroup onClick={onClick} hasDeleteButton={hasDeleteButton} htmlId="mockHtmlId" />);
  }

  test('renders DuplicateGroup component', () => {
    renderComponent();

    expect(getByTestId('mockHtmlId--addDuplicate')).toBeInTheDocument();
    expect(getByTestId('mockHtmlId--removeDuplicate')).toBeInTheDocument();
  });

  test('renders DuplicateGroup component without "Delete" button', () => {
    renderComponent(false);

    expect(queryByTestId('mockHtmlId--removeDuplicate')).not.toBeInTheDocument();
  });

  test('invokes passed "onClick" function', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('mockHtmlId--addDuplicate'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
