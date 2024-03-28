import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModalCloseRecord } from '@components/ModalCloseRecord';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';

describe('ModalCloseRecord', () => {
  const onCancel = jest.fn();
  const onSubmit = jest.fn();
  const onClose = jest.fn();

  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    render(
      <ModalCloseRecord
        isOpen={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onClose={onClose}
      />,
    );
  });

  test('renders modal component', () => {
    expect(screen.getByTestId('modal-close-record-content')).toBeInTheDocument();
  });

  test('triggers onSubmit function', async () => {
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('triggers "onCancel" function', () => {
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
