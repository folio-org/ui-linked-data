import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ItemSearch } from '@components/ItemSearch';
import { RecoilRoot } from 'recoil';
import { itemSearchMockData } from '../common/helpers/search.helper.test';
import { CommonStatus } from '@components/CommonStatus';
import * as searchApi from '@common/api/search.api';

let getByIdentifierMock: jest.SpyInstance<Promise<any>, [id: string, query: string], any>;

const fetchRecord = jest.fn();

describe('Item Search', () => {
  const id = 'lccn';
  const event = {
    target: {
      value: 'test',
    },
  };

  beforeEach(() => {
    getByIdentifierMock = jest.spyOn(searchApi, 'getByIdentifier').mockImplementation(() => Promise.resolve(null));

    render(
      <RecoilRoot>
        <CommonStatus />
        <ItemSearch fetchRecord={fetchRecord} />
      </RecoilRoot>,
    );
  });

  test('renders Item Search component', () => {
    expect(screen.getByTestId('id-search')).toBeInTheDocument();
  });

  test('triggers search control', async () => {
    const ctl = screen.getByTestId(id);

    fireEvent.click(ctl);
    await waitFor(() => {
      expect(ctl).toBeChecked();
    });
  });

  test('searches the selected identifier for query', async () => {
    const ctl = screen.getByTestId(id);

    fireEvent.click(ctl);
    fireEvent.change(screen.getByTestId('id-search-input'), event);
    fireEvent.click(screen.getByTestId('id-search-button'));

    await waitFor(() => {
      expect(getByIdentifierMock).toHaveBeenCalledWith(id, event.target.value);
    });
  });

  test('returns message if the response is empty', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve({ ...itemSearchMockData, content: [] }));

    fireEvent.change(screen.getByTestId('id-search-input'), event);
    fireEvent.click(screen.getByTestId('id-search-button'));

    await waitFor(() => {
      expect(screen.getByText('marva.search-no-rds-match')).toBeInTheDocument();
    });
  });

  test('displays error notification if API call throws', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.reject(new Error()));

    fireEvent.change(screen.getByTestId('id-search-input'), event);
    fireEvent.click(screen.getByTestId('id-search-button'));

    await waitFor(() => {
      expect(screen.getByText('marva.search-error-fetching')).toBeInTheDocument();
    });
  });

  test('calls fetchRecord on action item edit button click', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve(itemSearchMockData));

    fireEvent.change(screen.getByTestId('id-search-input'), event);
    fireEvent.click(screen.getByTestId('id-search-button'));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('edit-button'));

      expect(fetchRecord).toHaveBeenCalled();
    });
  });

  test('calls fetchRecord on row click', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve(itemSearchMockData));

    fireEvent.change(screen.getByTestId('id-search-input'), event);
    fireEvent.click(screen.getByTestId('id-search-button'));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('table-row'));

      expect(fetchRecord).toHaveBeenCalled();
    });
  });

  test('returns out of fetchData if no query present', async () => {
    fireEvent.click(screen.getByTestId('id-search-button'));

    await waitFor(() => {
      expect(getByIdentifierMock).not.toHaveBeenCalled();
    });
  });
});
