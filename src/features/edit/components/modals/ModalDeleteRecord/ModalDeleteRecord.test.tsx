import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';

import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { ModalDeleteRecord } from './ModalDeleteRecord';

describe('ModalDeleteRecord', () => {
  const toggleIsOpen = jest.fn();
  const deleteRecord = jest.fn();

  let container: HTMLElement;

  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    ({ container } = render(
      <ModalDeleteRecord isOpen={true} toggleIsOpen={toggleIsOpen} deleteRecord={deleteRecord} />,
    ));
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

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
