import { renderHook, act } from '@testing-library/react';
import { useNavigateToCreatePage } from '@common/hooks/useNavigateToCreatePage';
import { useNavigateToEditPage } from '@common/hooks/useNavigateToEditPage';
import { useProfileSelection } from '@common/hooks/useProfileSelection';
import { useNavigationState } from '@src/store';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { QueryParams, ROUTES } from '@common/constants/routes.constants';
import * as navigationHelper from '@common/helpers/navigation.helper';

jest.mock('@common/hooks/useNavigateToEditPage', () => ({
  useNavigateToEditPage: jest.fn(),
}));

jest.mock('@common/hooks/useProfileSelection', () => ({
  useProfileSelection: jest.fn(),
}));

jest.mock('@common/helpers/navigation.helper', () => ({
  generatePageURL: jest.fn(),
}));

describe('useNavigateToCreatePage', () => {
  const navigateToEditPage = jest.fn();
  const checkProfileAndProceed = jest.fn();
  const setQueryParams = jest.fn();
  const generatePageURLMock = jest.fn();

  const testResourceTypeURL = 'test-resource-type' as ResourceTypeURL;
  const testType = 'testType';
  const testRefId = 'testRefId';
  const testProfileId = 'testProfileId';
  const testNavigationState = { query: 'test-query' };
  const testURL = '/test-url';

  beforeEach(() => {
    (useNavigateToEditPage as jest.Mock).mockReturnValue({
      navigateToEditPage,
    });

    (useProfileSelection as jest.Mock).mockReturnValue({
      checkProfileAndProceed,
    });

    (navigationHelper.generatePageURL as jest.Mock).mockImplementation(generatePageURLMock);
    generatePageURLMock.mockReturnValue(testURL);

    setInitialGlobalState([
      {
        store: useNavigationState,
        state: {
          setQueryParams,
        },
      },
    ]);
  });

  describe('onCreateNewResource', () => {
    test('sets query params and calls checkProfileAndProceed with correct arguments', async () => {
      const { result } = renderHook(() => useNavigateToCreatePage());

      await act(async () => {
        result.current.onCreateNewResource({
          resourceTypeURL: testResourceTypeURL,
          queryParams: {
            type: testType,
            refId: testRefId,
          },
          navigationState: testNavigationState,
        });
      });

      expect(setQueryParams).toHaveBeenCalledWith({
        [QueryParams.Type]: testType,
        [QueryParams.Ref]: testRefId,
      });
      expect(checkProfileAndProceed).toHaveBeenCalledWith({
        resourceTypeURL: testResourceTypeURL,
        callback: expect.any(Function),
      });
    });

    test('does not set query params when type or refId are missing', async () => {
      const { result } = renderHook(() => useNavigateToCreatePage());

      await act(async () => {
        result.current.onCreateNewResource({
          resourceTypeURL: testResourceTypeURL,
          queryParams: {
            type: null,
            refId: testRefId,
          },
        });
      });

      expect(setQueryParams).not.toHaveBeenCalled();
      expect(checkProfileAndProceed).toHaveBeenCalledWith({
        resourceTypeURL: testResourceTypeURL,
        callback: expect.any(Function),
      });
    });
  });

  describe('handleProfileSelection', () => {
    test('navigates to correct URL with profile ID when type and refId are provided', async () => {
      const { result } = renderHook(() => useNavigateToCreatePage());

      await act(async () => {
        result.current.onCreateNewResource({
          resourceTypeURL: testResourceTypeURL,
          queryParams: {
            type: testType,
            refId: testRefId,
          },
          navigationState: testNavigationState,
        });
      });

      const callback = checkProfileAndProceed.mock.calls[0][0].callback;

      callback(testProfileId);
      expect(generatePageURLMock).toHaveBeenCalledWith({
        url: ROUTES.RESOURCE_CREATE.uri,
        queryParams: {
          [QueryParams.Type]: testType,
          [QueryParams.Ref]: testRefId,
        },
        profileId: testProfileId,
      });
      expect(navigateToEditPage).toHaveBeenCalledWith(testURL, testNavigationState);
    });

    test('does not navigate when type are missing', async () => {
      const { result } = renderHook(() => useNavigateToCreatePage());

      await act(async () => {
        result.current.onCreateNewResource({
          resourceTypeURL: testResourceTypeURL,
          queryParams: {
            type: null,
            refId: testRefId,
          },
        });
      });

      const callback = checkProfileAndProceed.mock.calls[0][0].callback;

      callback(testProfileId);
      expect(generatePageURLMock).not.toHaveBeenCalled();
      expect(navigateToEditPage).not.toHaveBeenCalled();
    });
  });

  describe('createQueryParams', () => {
    test('returns null when type are missing', async () => {
      const { result } = renderHook(() => useNavigateToCreatePage());

      await act(async () => {
        result.current.onCreateNewResource({
          resourceTypeURL: testResourceTypeURL,
          queryParams: {
            type: null,
            refId: testRefId,
          },
        });
      });

      expect(setQueryParams).not.toHaveBeenCalled();
    });

    test('creates query params object with type and refId', async () => {
      const { result } = renderHook(() => useNavigateToCreatePage());

      await act(async () => {
        result.current.onCreateNewResource({
          resourceTypeURL: testResourceTypeURL,
          queryParams: {
            type: testType,
            refId: testRefId,
          },
        });
      });

      expect(setQueryParams).toHaveBeenCalledWith({
        [QueryParams.Type]: testType,
        [QueryParams.Ref]: testRefId,
      });
    });
  });
});
