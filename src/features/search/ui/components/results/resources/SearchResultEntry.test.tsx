import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore, useUIStore } from '@/store';
import { SearchResultEntry } from './SearchResultEntry';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

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
      languages: ['eng'],
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
      subjects: ['Subject'],
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
          editionStatements: ['Edition 1'],
        },
      ],
    },
  ],
};

const mockProps = itemSearchMockData.content[0];

describe('SearchResultEntry', () => {
  describe('with instances', () => {
    beforeEach(() => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            data: [],
            query: '',
            searchBy: 'keyword',
            selectedInstances: [],
            setSelectedInstances: jest.fn(),
          },
        },
        {
          store: useUIStore,
          state: {
            isSearchPaneCollapsed: false,
          },
        },
      ]);

      render(
        <BrowserRouter>
          <SearchResultEntry {...(mockProps as unknown as WorkAsSearchResultDTO)} />
        </BrowserRouter>,
      );
    });

    const { getByText, getByTestId, findByText } = screen;

    test('renders instances as a table', () => {
      const expectedTitle = [mockProps.instances[0].titles[0].value, mockProps.instances[0].titles[1].value].join(' ');
      expect(getByText(expectedTitle)).toBeInTheDocument();
    });

    test('renders works as a table', () => {
      const expectedTitle = [mockProps.titles[0].value, mockProps.titles[1].value].join(' ');
      expect(getByText(expectedTitle)).toBeInTheDocument();
    });

    test('closes and renders closed card placeholder', async () => {
      fireEvent.click(getByTestId('work-details-card-toggle'));

      expect(await findByText('ld.instances')).toBeInTheDocument();
    });

    test('navigates to edit section for the relevant ID', () => {
      fireEvent.click(getByTestId('edit-button__instanceId'));

      expect(mockedUsedNavigate).toHaveBeenCalledWith('/resources/instanceId/edit', {
        state: { isNavigatedFromLDE: true },
      });
    });
  });

  describe('without instances', () => {
    beforeEach(() => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            data: [],
            query: '',
            searchBy: 'keyword',
            selectedInstances: [],
            setSelectedInstances: jest.fn(),
          },
        },
        {
          store: useUIStore,
          state: {
            isSearchPaneCollapsed: false,
          },
        },
      ]);

      render(
        <BrowserRouter>
          <SearchResultEntry {...({ ...mockProps, instances: [] } as unknown as WorkAsSearchResultDTO)} />
        </BrowserRouter>,
      );
    });

    const { getByText } = screen;

    test('shows placeholder when there are no instances', () => {
      expect(getByText('ld.noInstancesAvailable')).toBeInTheDocument();
    });
  });
});
