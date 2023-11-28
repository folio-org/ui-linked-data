import { fireEvent, render, screen } from '@testing-library/react';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { createModalContainer } from '@src/test/__mocks__/components/Modal.mock';

const toggleIsOpen = jest.fn();

describe('AdvancedSearchModal', () => {
  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => render(<AdvancedSearchModal isOpen={true} toggleIsOpen={toggleIsOpen} />));

  test('toggles isOpen', () => {
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(toggleIsOpen).toHaveBeenCalled();
  });
});
