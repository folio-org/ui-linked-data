import '@src/test/__mocks__/common/hooks/useRecordControls.mock';
import '@src/test/__mocks__/common/hooks/usePagination.mock';
import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getPageMetadata, getCurrentPageNumber } from '@src/test/__mocks__/common/hooks/usePagination.mock';
import { ItemSearch } from '@components/ItemSearch';
import { CommonStatus } from '@components/CommonStatus';
import * as searchApi from '@common/api/search.api';
import { Edit } from '@views';

let getByIdentifierMock: jest.SpyInstance<
  Promise<any>,
  [id: string, query: string, offset?: string, limit?: string],
  any
>;

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

export const itemSearchMockData = {
  searchQuery: 'isbn=12345*',
  content: [
    {
      id: 'workId',
      titles: [
        {
          value: 'Work Title Value',
          type: 'Main',
        },
        {
          value: 'Work Sub Title Value',
          type: 'Sub',
        },
        {
          value: 'Work Parallel Title Value',
          type: 'Main Parallel',
        },
      ],
      contributors: [
        {
          name: 'John Doe',
          type: 'Person',
          isCreator: true,
        },
      ],
      languages: [
        {
          value: 'eng',
        },
      ],
      classifications: [
        {
          number: '1234',
          source: 'ddc',
        },
      ],
      publications: [
        {
          name: 'name Name',
          date: '2022',
        },
      ],
      subjects: [
        {
          value: 'Subject',
        },
      ],
      instances: [
        {
          id: 'instanceId',
          titles: [
            {
              value: 'Instance Title Value',
              type: 'Main',
            },
            {
              value: 'Instance Sub Title Value',
              type: 'Sub',
            },
            {
              value: 'Instance Parallel Title Value',
              type: 'Sub Parallel',
            },
          ],
          identifiers: [
            {
              value: '12345678901234567',
              type: 'ISBN',
            },
          ],
          contributors: [
            {
              name: 'John Doe',
              type: 'Person',
              isCreator: true,
            },
          ],
          publications: [
            {
              name: 'name Name',
              date: '2022',
            },
          ],
          editionStatements: [
            {
              value: 'Edition 1',
            },
          ],
        },
      ],
    },
  ],
};

describe('Item Search', () => {
  const id = 'lccn';
  const event = {
    target: {
      value: '1234-1',
    },
  };

  const { getByTestId, findByText } = screen;

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
            <Route path="/" element={<ItemSearch />} />
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

  test('renders the results', async () => {
    getByIdentifierMock.mockReturnValueOnce(Promise.resolve(itemSearchMockData));

    fireEvent.click(getByTestId(id));
    fireEvent.change(getByTestId('id-search-input'), event);
    fireEvent.click(getByTestId('id-search-button'));

    expect(await findByText('John Doe')).toBeInTheDocument();
  });

  test("returns out of fetchData if query is subject to validation and doesn't pass validations", async () => {
    fireEvent.change(getByTestId('id-search-input'), { target: { value: 'sm1f4a123' } });
    fireEvent.click(getByTestId('id-search-button'));

    await waitFor(() => {
      expect(getByIdentifierMock).not.toHaveBeenCalled();
    });
  });
});
