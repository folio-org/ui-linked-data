import { act, fireEvent, render, screen } from '@testing-library/react';

import { ModalWarning } from '@/components/ProfileSelectionManager/ModalWarning';
import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';

describe('ModalWarning', () => {
  const props = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeAll(() => {
    createModalContainer();
  });

  test('renders null when isOpen is false', () => {
    const updatedProps = { ...props, isOpen: false };

    const { container } = render(<ModalWarning {...updatedProps} />);

    expect(container.firstChild).toBeNull();
  });

  test('renders ModalWarning component when isOpen is true', () => {
    render(<ModalWarning {...props} />);

    expect(screen.getByTestId('modal-profile-warning')).toBeInTheDocument();
  });

  test('displays the warning message', () => {
    render(<ModalWarning {...props} />);

    expect(screen.getByText('ld.modal.chooseProfileWarning.message')).toBeInTheDocument();
  });

  test('has no cancel button', () => {
    render(<ModalWarning {...props} />);

    expect(screen.queryByTestId('modal-button-cancel')).not.toBeInTheDocument();
  });

  test('has no submit button', () => {
    render(<ModalWarning {...props} />);

    expect(screen.queryByTestId('modal-button-submit')).not.toBeInTheDocument();
  });

  test('calls onClose when overlay is clicked', () => {
    render(<ModalWarning {...props} />);

    fireEvent.click(screen.getByTestId('modal-overlay'));

    expect(props.onClose).toHaveBeenCalled();
  });

  test('calls onClose when Escape key is pressed', () => {
    render(<ModalWarning {...props} />);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(props.onClose).toHaveBeenCalled();
  });
});
