import { Pagination } from '@components/Pagination';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Pagination', () => {
  const onPrevPageClick = jest.fn();
  const onNextPageClick = jest.fn();
  const props = { onPrevPageClick, onNextPageClick };

  const { getByTestId } = screen;

  test('renders Pagination component', () => {
    render(<Pagination {...props} currentPage={0} totalPages={2} />);

    expect(getByTestId('pagination')).toBeInTheDocument();
  });

  test('backward button is disabled and forward button is enabled', () => {
    render(<Pagination {...props} currentPage={0} totalPages={2} />);

    expect(getByTestId('backward-button')).toBeDisabled();
    expect(getByTestId('forward-button')).not.toBeDisabled();
  });

  test('forward button is disabled and backward button is enabled', () => {
    render(<Pagination {...props} currentPage={1} totalPages={2} />);

    expect(getByTestId('forward-button')).toBeDisabled();
    expect(getByTestId('backward-button')).not.toBeDisabled();
  });

  test('calls onPrevPageClick handler', () => {
    render(<Pagination {...props} currentPage={1} totalPages={2} />);

    fireEvent.click(getByTestId('backward-button'));

    expect(onPrevPageClick).toHaveBeenCalled();
  });

  test('calls onNextPageClick handler', () => {
    render(<Pagination {...props} currentPage={0} totalPages={2} />);

    fireEvent.click(getByTestId('forward-button'));

    expect(onNextPageClick).toHaveBeenCalled();
  });
});
