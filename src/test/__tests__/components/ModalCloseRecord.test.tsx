import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';

describe('ModalCloseRecord', () => {
  const toggleIsOpen = jest.fn();
  const saveRecord = jest.fn();
  const discardRecord = jest.fn();

  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    render(
      <ModalCloseRecord
        isOpen={true}
        toggleIsOpen={toggleIsOpen}
        saveRecord={saveRecord}
        discardRecord={discardRecord}
      />,
    );
  });

  test('renders modal component', () => {
    expect(screen.getByTestId('modal-close-record-content')).toBeInTheDocument();
  });

  test('triggers "saveRecord" and "discardRecord" functions', async () => {
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    await waitFor(() => {
      expect(saveRecord).toHaveBeenCalledTimes(1);
      expect(discardRecord).toHaveBeenCalledTimes(1);
    });
  });

  test('triggers "discardRecord" function', () => {
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(discardRecord).toHaveBeenCalledTimes(1);
  });
});
