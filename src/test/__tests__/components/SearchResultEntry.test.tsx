import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchResultEntry } from '@components/SearchResultEntry';
import { itemSearchMockData } from './ItemSearch.test';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const mockProps = itemSearchMockData.content[0];

describe('SearchResultEntry', () => {
  describe('with instances', () => {
    beforeEach(() =>
      render(
        <BrowserRouter>
          <SearchResultEntry {...(mockProps as unknown as WorkAsSearchResultDTO)} />
        </BrowserRouter>,
      ),
    );

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

      expect(mockedUsedNavigate).toHaveBeenCalledWith('/resources/instanceId/edit', { state: {} });
    });
  });

  describe('without instances', () => {
    beforeEach(() =>
      render(
        <BrowserRouter>
          <SearchResultEntry {...({ ...mockProps, instances: [] } as unknown as WorkAsSearchResultDTO)} />
        </BrowserRouter>,
      ),
    );

    const { getByText } = screen;

    test('shows placeholder when there are no instances', () => {
      expect(getByText('ld.noInstancesAvailable')).toBeInTheDocument();
    });
  });
});
