import { SearchResultEntry } from '@components/SearchResultEntry';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { itemSearchMockData } from './ItemSearch.test';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

const mockProps = itemSearchMockData.content[0];

describe('SearchResultEntry', () => {
  describe('with instances', () => {
    beforeEach(() =>
      render(
        <BrowserRouter>
          <SearchResultEntry {...(mockProps as WorkAsSearchResultDTO)} />
        </BrowserRouter>,
      ),
    );

    const { getByText, getByTestId, findByText } = screen;

    test('renders instances as a table', () => {
      expect(getByText(mockProps.instances[0].titles[0].value)).toBeInTheDocument();
    });

    test('closes and renders closed card placeholder', async () => {
      fireEvent.click(getByTestId('work-details-card-toggle'));

      expect(await findByText('marva.instances')).toBeInTheDocument();
    });

    test('navigates to edit section for the relevant ID', () => {
      fireEvent.click(getByTestId('edit-button-instanceId'));

      expect(mockedUsedNavigate).toHaveBeenCalledWith('/resources/instanceId/edit');
    });
  });

  describe('without instances', () => {
    beforeEach(() =>
      render(
        <BrowserRouter>
          <SearchResultEntry {...({ ...mockProps, instances: [] } as WorkAsSearchResultDTO)} />
        </BrowserRouter>,
      ),
    );

    const { getByText } = screen;

    test('shows placeholder when there are no instances', () => {
      expect(getByText('marva.noInstancesAvailable')).toBeInTheDocument();
    });
  });
});
