import { render, screen, fireEvent } from '@testing-library/react';
import { ModalDeleteRecord } from '@components/ModalDeleteRecord';

describe('ModalCloseRecord', () => {
  const toggleIsOpen = jest.fn();
  const deleteRecord = jest.fn();

  beforeEach(() => {
    render(<ModalDeleteRecord isOpen={true} toggleIsOpen={toggleIsOpen} deleteRecord={deleteRecord} />);
  });

  test('renders modal component', () => {
    expect(screen.getByTestId('modal-delete-record-content')).toBeInTheDocument();
  });

  test('triggers "deleteRecord" function', () => {
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(deleteRecord).toHaveBeenCalledTimes(1);
  });

  test('triggers "toggleIsOpen" function', () => {
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(toggleIsOpen).toHaveBeenCalledWith(false);
  });
});
