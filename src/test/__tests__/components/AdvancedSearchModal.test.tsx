import { fireEvent, render, screen } from '@testing-library/react';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';
import { RecoilRoot } from 'recoil';
import state from '@state';

const clearValues = jest.fn();
const submitSearch = jest.fn();

describe('AdvancedSearchModal', () => {
  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() =>
    render(
      <RecoilRoot initializeState={snapshot => snapshot.set(state.ui.isAdvancedSearchOpen, true)}>
        <AdvancedSearchModal clearValues={clearValues} submitSearch={submitSearch} />
      </RecoilRoot>,
    ),
  );

  test('toggles isOpen', () => {
    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  test('submits search with the correct values', () => {
    const inputEvent = {
      target: {
        value: 'testValue',
      },
    };

    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.change(screen.getByTestId('text-input-1'), inputEvent);
    fireEvent.change(screen.getByTestId('select-operators-1'), { target: { value: 'not' }})
    fireEvent.change(screen.getByTestId('select-qualifiers-1'), { target: { value: 'startsWith' }})
    fireEvent.change(screen.getByTestId('select-identifiers-1'), { target: { value: 'title' }})

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(submitSearch).toHaveBeenCalledWith('(lccn all "testValue" not title all "testValue*")');
  });
});
