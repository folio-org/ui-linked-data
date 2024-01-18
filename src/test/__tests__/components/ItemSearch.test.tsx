import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/hooks/usePagination.mock';
import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getPageMetadata, getCurrentPageNumber } from '@src/test/__mocks__/common/hooks/usePagination.mock';
import { scrollElementIntoView } from '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
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

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('Item Search', () => {
  const id = 'lccn';
  const event = {
    target: {
      value: '1234-1',
    },
  };

  const {
    getByTestId,
    findByText,
    // findByTestId
  } = screen;

  beforeEach(() => {
    getByIdentifierMock = (jest.spyOn(searchApi, 'getByIdentifier') as any).mockImplementation(() =>
      Promise.resolve(null),
    );
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
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('lccn');

    fireEvent.change(select, { target: { value: 'isbn' } });

    expect((screen.getByRole('option', { name: 'marva.isbn' }) as any).selected).toBe(true);
  });

  test('searches the selected identifier for query', async () => {
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      expect(getByIdentifierMock).toHaveBeenCalledWith({ offset: '0', query: '1234000001', searchBy: id });
    });
  });

  test('returns message if the response is empty', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve({ ...itemSearchMockData, content: [] }));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    expect(await findByText('marva.searchNoRdsMatch')).toBeInTheDocument();
  });

  test('calls fetchRecord and scrollElementIntoView on action item Preview button click', async () => {
    jest.useFakeTimers();

    getByIdentifierMock.mockReturnValueOnce(Promise.resolve(itemSearchMockData));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      fireEvent.click(getByTestId('preview-button'));

      expect(fetchRecord).toHaveBeenCalled();
      expect(scrollElementIntoView).toHaveBeenCalled();
    });

    jest.clearAllTimers();
  });

  test('navigates to Edit page on action item edit button click', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve(itemSearchMockData));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      fireEvent.click(getByTestId('edit-button'));

      expect(getByTestId('edit-page')).toBeInTheDocument();
    });
  });

  test('navigates to Edit page on row click', async () => {
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
});
