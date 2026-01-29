import { fireEvent, render, screen } from '@testing-library/react';

import { ModalUncontrolledAuthorities } from '@/components/ModalUncontrolledAuthorities';
import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';

describe('ModalUncontrolledAuthorities', () => {
  const props = {
    isOpen: true,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
    onClose: jest.fn(),
  };

  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    render(<ModalUncontrolledAuthorities {...props} />);
  });

  test('renders modal component with warning message', () => {
    expect(screen.getByTestId('modal-uncontrolled-authorities-warning')).toBeInTheDocument();
  });

  test('renders correct title', () => {
    expect(screen.getByText('ld.modal.uncontrolledAuthoritiesWarning.title')).toBeInTheDocument();
  });

  test('renders correct button labels', () => {
    expect(screen.getByText('ld.continue')).toBeInTheDocument();
    expect(screen.getByText('ld.cancel')).toBeInTheDocument();
  });

  test('triggers onSubmit when submit button is clicked', () => {
    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  test('triggers onCancel when cancel button is clicked', () => {
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  test('triggers onClose when overlay is clicked', () => {
    fireEvent.click(screen.getByTestId('modal-overlay'));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
