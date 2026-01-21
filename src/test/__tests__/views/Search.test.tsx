import '@/test/__mocks__/common/helpers/pageScrolling.helper.mock';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore, useUIStore } from '@/store';
import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';
import * as BuildConstants from '@/common/constants/build.constants';
import * as FeatureConstants from '@/common/constants/feature.constants';
import { Search } from '@/views';
import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { ResourceType } from '@/common/constants/record.constants';

const mockIsEmbeddedMode = getMockedImportedConstant(BuildConstants, 'IS_EMBEDDED_MODE');
const mockIsNewSearchEnabled = getMockedImportedConstant(FeatureConstants, 'IS_NEW_SEARCH_ENABLED');
const mockSearchFiltersEnabled = getMockedImportedConstant(FeatureConstants, 'SEARCH_FILTERS_ENABLED');

mockIsEmbeddedMode(false);
mockIsNewSearchEnabled(false);
mockSearchFiltersEnabled(false);

const onCreateNewResource = jest.fn();
jest.mock('@/common/hooks/useNavigateToCreatePage', () => ({
  useNavigateToCreatePage: () => ({
    onCreateNewResource,
  }),
}));

const navigateToManageProfileSettings = jest.fn();
jest.mock('@/features/manageProfileSettings/hooks/useNavigateToManageProfileSettings', () => ({
  useNavigateToManageProfileSettings: () => ({
    navigateToManageProfileSettings,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>,
  );
};

describe('Search', () => {
  beforeEach(() => {
    queryClient.clear();
    renderWithProviders(<Search />);
  });

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

      const { unmount } = renderWithProviders(<Search />);

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

    test('calls navigateToManageProfileSettings when "Manage profile settings" option is clicked', () => {
      // Click the Actions dropdown button
      fireEvent.click(screen.getByTestId('search-view-actions-dropdown'));

      // Click the "Manage profile settings" option
      fireEvent.click(screen.getByTestId('search-view-actions-dropdown__option-ld.manageProfileSettings'));

      expect(navigateToManageProfileSettings).toHaveBeenCalled();
    });
  });
});
