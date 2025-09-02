import { act, fireEvent, render, screen } from '@testing-library/react';
import { Modal } from '@components/Modal';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';

describe('Modal', () => {
  const props = {
    isOpen: true,
    title: 'test modal',
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    onClose: jest.fn(),
  };

  beforeAll(() => {
    createModalContainer();
  });

  test('renders null', () => {
    const updatedProps = { ...props, isOpen: false };

    const { container } = render(<Modal {...updatedProps} />);

    expect(container.firstChild).toBeNull();
  });

  test('renders Modal component', () => {
    render(<Modal {...props} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  test('renders Modal with custom test id', () => {
    render(<Modal {...props} data-testid="custom-modal-id" />);

    expect(screen.getByTestId('custom-modal-id')).toBeInTheDocument();
  });

  test('renders submit button when not hidden', () => {
    render(<Modal {...props} submitButtonHidden={false} submitButtonLabel="Submit" />);

    expect(screen.getByTestId('modal-button-submit')).toBeInTheDocument();
    expect(screen.getByTestId('modal-button-submit')).toHaveTextContent('Submit');
  });

  test('renders Modal component without a cancel button', () => {
    const updatedProps = { ...props, cancelButtonHidden: true };

    render(<Modal {...updatedProps} />);

    expect(screen.queryByTestId('modal-cancel-button')).not.toBeInTheDocument();
  });

  describe('event handlers', () => {
    beforeEach(() => {
      render(<Modal {...props} />);
    });

    test('handle click on the overlay', () => {
      fireEvent.click(screen.getByTestId('modal-overlay'));

      expect(props.onClose).toHaveBeenCalled();
    });

    test('handle click on Submit button', () => {
      fireEvent.click(screen.getByTestId('modal-button-submit'));

      expect(props.onSubmit).toHaveBeenCalled();
    });

    test('handle click on Cancel button', () => {
      fireEvent.click(screen.getByTestId('modal-button-cancel'));

      expect(props.onCancel).toHaveBeenCalled();
    });

    test('handle press on Escape button', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      act(() => {
        window.dispatchEvent(event);
      });

      expect(props.onClose).toHaveBeenCalled();
    });
  });
});
