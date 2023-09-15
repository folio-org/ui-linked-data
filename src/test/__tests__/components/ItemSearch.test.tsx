import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ItemSearch } from '@components/ItemSearch';
import { RecoilRoot } from 'recoil';
import { itemSearchMockData } from '../common/helpers/search.helper.test';
import { CommonStatus } from '@components/CommonStatus';
import * as searchApi from '@common/api/search.api';
import { BrowserRouter } from 'react-router-dom';

let getByIdentifierMock: jest.SpyInstance<Promise<any>, [id: string, query: string], any>;

const fetchRecord = jest.fn();

describe('Item Search', () => {
  const id = 'lccn';
  const event = {
    target: {
      value: 'test',
    },
  };

  const { getByTestId, findByText, findByTestId } = screen;

  beforeEach(() => {
    getByIdentifierMock = jest.spyOn(searchApi, 'getByIdentifier').mockImplementation(() => Promise.resolve(null));

    render(
      <RecoilRoot>
        <BrowserRouter>
          <CommonStatus />
          <ItemSearch fetchRecord={fetchRecord} />
        </BrowserRouter>
      </RecoilRoot>,
    );
  });

  test('renders Item Search component', () => {
    expect(getByTestId('id-search')).toBeInTheDocument();
  });

  test('triggers search control', async () => {
    const searchControl = getByTestId(id);

    fireEvent.click(searchControl);

    await waitFor(() => {
      expect(searchControl).toBeChecked();
    });
  });

  test('searches the selected identifier for query', async () => {
    const searchControl = getByTestId(id);

    fireEvent.click(searchControl);
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      expect(getByIdentifierMock).toHaveBeenCalledWith(id, event.target.value);
    });
  });

  test('returns message if the response is empty', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve({ ...itemSearchMockData, content: [] }));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    expect(await findByText('marva.search-no-rds-match')).toBeInTheDocument();
  });

  test('displays error notification if API call throws', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.reject(new Error()));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    expect(await findByText('marva.search-error-fetching')).toBeInTheDocument();
  });

  test('returns message if no search control selected', async () => {
    fireEvent.change(getByTestId('id-search-input'), event);

    expect(await findByText('marva.search-select-index')).toBeInTheDocument();
  });

  test('calls fetchRecord on action item edit button click', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve(itemSearchMockData));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      fireEvent.click(getByTestId('edit-button'));

      expect(fetchRecord).toHaveBeenCalled();
    });
  });

  test('calls fetchRecord on row click', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve(itemSearchMockData));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      fireEvent.click(getByTestId('table-row'));

      expect(fetchRecord).toHaveBeenCalled();
    });
  });

  test('returns out of fetchData if no query present', async () => {
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      expect(getByIdentifierMock).not.toHaveBeenCalled();
    });
  });

  test('swaps ISBN/LCCN cols with ISBN being first if querying by it', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve(itemSearchMockData));
    
    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    const lccnCol = await findByTestId('th-lccn');
    const isbnCol = await findByTestId('th-isbn');

    expect(lccnCol.compareDocumentPosition(isbnCol)).toBe(4);
  });
});