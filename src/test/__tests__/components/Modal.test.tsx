import { act, fireEvent, render, screen } from '@testing-library/react';
import { Modal } from '@components/Modal';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';

describe('Modal', () => {
  const props = {
    id: 'test',
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

    expect(screen.getByText('test modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toHaveAttribute('id', 'modal-test');
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
