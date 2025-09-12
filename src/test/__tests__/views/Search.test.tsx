import '@src/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { useSearchStore, useUIStore } from '@src/store';
import { Search } from '@views';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { ResourceType } from '@common/constants/record.constants';

jest.mock('@common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const onCreateNewResource = jest.fn();
jest.mock('@common/hooks/useNavigateToCreatePage', () => ({
  useNavigateToCreatePage: () => ({
    onCreateNewResource,
  }),
}));

describe('Search', () => {
  beforeEach(() =>
    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>,
    ),
  );

  test('renders Search component', () => {
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  test('renders child ItemSearch component', () => {
    expect(screen.getByTestId('id-search')).toBeInTheDocument();
  });

  describe('component unmount', () => {
    test('clears fullDisplayComponentType and selectedInstances on unmount', () => {
      const mockResetFullDisplayComponentType = jest.fn();
      const mockResetSelectedInstances = jest.fn();

      setInitialGlobalState([
        {
          store: useUIStore,
          state: {
            resetFullDisplayComponentType: mockResetFullDisplayComponentType,
          },
        },
        {
          store: useSearchStore,
          state: {
            resetSelectedInstances: mockResetSelectedInstances,
          },
        },
      ]);

      const { unmount } = render(
        <BrowserRouter>
          <Search />
        </BrowserRouter>,
      );

      unmount();

      expect(mockResetFullDisplayComponentType).toHaveBeenCalled();
      expect(mockResetSelectedInstances).toHaveBeenCalled();
    });
  });

  describe('Actions dropdown', () => {
    test('calls onCreateNewResource when "Create a new resource" option is clicked', () => {
      // Click the Actions dropdown button
      fireEvent.click(screen.getByTestId('search-view-actions-dropdown'));

      // Click the "Create a new resource" option
      fireEvent.click(screen.getByTestId('search-view-actions-dropdown__option-ld.newResource'));

      expect(onCreateNewResource).toHaveBeenCalledWith({
        resourceTypeURL: TYPE_URIS.WORK,
        queryParams: {
          type: ResourceType.work,
        },
      });
    });
  });
});
