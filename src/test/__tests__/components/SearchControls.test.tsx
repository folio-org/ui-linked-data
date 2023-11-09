import { fireEvent, render, screen } from '@testing-library/react';
import { SearchControls } from '@components/SearchControls';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';

// TODO: remove router wrappings once <Link /> in <SearchTypeSelect /> is replaced with <Button />
describe('SearchControls', () => {
  const { getByTestId } = screen;
  const setSearchBy = jest.fn();
  const setQuery = jest.fn();
  const setMessage = jest.fn();
  const clearMessage = jest.fn();
  const submitSearch = jest.fn();

  const props = {
    searchBy: 'test search by' as SearchIdentifiers | null,
    query: 'test query',
    setSearchBy,
    setQuery,
    setMessage,
    clearMessage,
    submitSearch,
  };

  const inputElementId = 'id-search-input';
  const buttonElementId = 'id-search-button';

  test('renders "SearchControls" component', () => {
    render(
      <BrowserRouter>
        <RecoilRoot>
          <SearchControls {...props} />
        </RecoilRoot>
      </BrowserRouter>,
    );

    expect(getByTestId('id-search-controls')).toBeInTheDocument();
  });

  describe('input field', () => {
    function testInputField(componentProps: typeof props, value: string = '', assertCallback: () => void) {
      render(
        <BrowserRouter>
          <RecoilRoot>
            <SearchControls {...componentProps} />
          </RecoilRoot>
        </BrowserRouter>,
      );
      const inputElement = getByTestId(inputElementId);

      fireEvent.change(inputElement, { target: { value } });

      assertCallback();
    }

    test('invokes passed functions on the input change', () => {
      const updatedValue = 'updated value';
      const assertCallback = () => {
        expect(clearMessage).toHaveBeenCalled();
        expect(setQuery).toHaveBeenCalledWith(updatedValue);
      };

      testInputField(props, updatedValue, assertCallback);
    });

    test('invokes "setMessage" function', () => {
      const updatedProps = {
        ...props,
        searchBy: null,
      };
      const assertCallback = () => {
        expect(setMessage).toHaveBeenCalled();
      };

      testInputField(updatedProps, undefined, assertCallback);
    });
  });

  describe('Search button', () => {
    function testSearchButton(componentProps: typeof props, callTimes: number) {
      render(
        <BrowserRouter>
          <RecoilRoot>
            <SearchControls {...componentProps} />
          </RecoilRoot>
        </BrowserRouter>,
      );
      const buttonElement = getByTestId(buttonElementId);

      fireEvent.click(buttonElement);

      expect(submitSearch).toHaveBeenCalledTimes(callTimes);
    }

    test('invokes "fetchData" function', () => {
      testSearchButton(props, 1);
    });

    test("doesn't invoke 'fetchData' function", () => {
      testSearchButton(
        {
          ...props,
          searchBy: null,
        },
        0,
      );
    });
  });
});
