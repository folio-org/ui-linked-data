import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/hooks/usePagination.mock';
import { getPageMetadata, getCurrentPageNumber } from '@src/test/__mocks__/common/hooks/usePagination.mock';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { itemSearchMockData } from '../common/helpers/search.helper.test';
import { ItemSearch } from '@components/ItemSearch';
import { CommonStatus } from '@components/CommonStatus';
import * as searchApi from '@common/api/search.api';
import { Edit } from '@views';

let getByIdentifierMock: jest.SpyInstance<
  Promise<any>,
  [id: string, query: string, offset?: string, limit?: string],
  any
>;

const fetchRecord = jest.fn();

describe('Item Search', () => {
  const id = 'lccn';
  const event = {
    target: {
      value: '1234-1',
    },
  };

  const { getByTestId, findByText, findByTestId } = screen;

  beforeEach(() => {
    getByIdentifierMock = jest.spyOn(searchApi, 'getByIdentifier').mockImplementation(() => Promise.resolve(null));
    getPageMetadata.mockReturnValue({ totalElements: 2, totalPages: 1 });
    getCurrentPageNumber.mockReturnValue(1);

    window.history.pushState({}, '', '/');

    render(
      <RecoilRoot>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<ItemSearch fetchRecord={fetchRecord} />} />
            <Route path="/resources/:resourceId/edit" element={<Edit />} />
          </Routes>
          <CommonStatus />
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
      expect(getByIdentifierMock).toHaveBeenCalledWith(id, '1234000001', '0');
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

      expect(getByTestId('edit-page')).toBeInTheDocument();
    });
  });

  test('calls fetchRecord on row click', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve(itemSearchMockData));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      fireEvent.click(getByTestId('table-row'));

      expect(getByTestId('edit-page')).toBeInTheDocument();
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
