import { fireEvent, render, screen } from '@testing-library/react';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';

const toggleIsOpen = jest.fn();
const clearValues = jest.fn();
const submitSearch = jest.fn();

describe('AdvancedSearchModal', () => {
  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => render(<AdvancedSearchModal clearValues={clearValues} submitSearch={submitSearch} />));

  test('toggles isOpen', () => {
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(toggleIsOpen).toHaveBeenCalled();
  });
});
