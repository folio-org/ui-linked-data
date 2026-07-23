import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import { ModalCloseRecord } from './ModalCloseRecord';

describe('ModalCloseRecord', () => {
  const onCancel = jest.fn();
  const onSubmit = jest.fn();
  const onClose = jest.fn();

  let container: HTMLElement;

  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    ({ container } = render(
      <ModalCloseRecord isOpen={true} onCancel={onCancel} onSubmit={onSubmit} onClose={onClose} />,
    ));
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

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
