import { fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { AdvancedSearchModal } from '@components/AdvancedSearchModal';
import { createModalContainer } from '@src/test/__mocks__/common/misc/createModalContainer.mock';
import * as SearchHelper from '@common/helpers/search.helper';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useUIStore } from '@src/store';

const setSearchParams = jest.fn();
const clearValues = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [{}, setSearchParams],
}));

describe('AdvancedSearchModal', () => {
  beforeAll(() => {
    createModalContainer();
  });

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: { isAdvancedSearchOpen: true },
      },
    ]);

    return render(
      <RecoilRoot>
        <RouterProvider
          router={createMemoryRouter([
            {
              path: '/',
              element: <AdvancedSearchModal clearValues={clearValues} />,
            },
          ])}
        />
      </RecoilRoot>,
    );
  });

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
    const searchParams = {
      [SearchQueryParams.Query]: '(lccn all "testValue" not title all "testValue*")',
    };
    const spyGenerateSearchParamsState = jest
      .spyOn(SearchHelper, 'generateSearchParamsState')
      .mockReturnValue(searchParams);

    fireEvent.change(screen.getByTestId('text-input-0'), inputEvent);
    fireEvent.change(screen.getByTestId('text-input-1'), inputEvent);
    fireEvent.change(screen.getByTestId('select-operators-1'), { target: { value: 'not' } });
    fireEvent.change(screen.getByTestId('select-qualifiers-1'), { target: { value: 'startsWith' } });
    fireEvent.change(screen.getByTestId('select-identifiers-1'), { target: { value: 'title' } });

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    expect(spyGenerateSearchParamsState).toHaveBeenCalledWith('(lccn all "testValue" not title all "testValue*")');
    expect(setSearchParams).toHaveBeenCalledWith(searchParams);
  });
});
