import { fireEvent, render, screen } from '@testing-library/react';
import { DuplicateGroup } from '@components/DuplicateGroup';

describe('DuplicateGroup', () => {
  const { getByTestId } = screen;
  const onClick = jest.fn();

  beforeEach(() => {
    render(<DuplicateGroup onClick={onClick} />);
  });

  test('renders DuplicateGroup component', () => {
    expect(getByTestId('id-duplicate-group')).toBeInTheDocument();
  });

  test('invokes passed "onClick" function', () => {
    fireEvent.click(screen.getByTestId('id-duplicate-group'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
