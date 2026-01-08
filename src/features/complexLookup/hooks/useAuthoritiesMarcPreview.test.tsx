import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useMarcPreviewStore } from '@/store';
import { useAuthoritiesMarcPreview } from './useAuthoritiesMarcPreview';
import { useMarcQuery } from './useMarcQuery';

jest.mock('./useMarcQuery');

describe('useAuthoritiesMarcPreview', () => {
  const mockSetComplexValue = jest.fn();
  const mockSetMetadata = jest.fn();
  const mockUseMarcQuery = useMarcQuery as jest.MockedFunction<typeof useMarcQuery>;
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return Wrapper;
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useMarcPreviewStore,
        state: {
          setComplexValue: mockSetComplexValue,
          setMetadata: mockSetMetadata,
        },
      },
    ]);

    mockUseMarcQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('triggers MARC query when loadMarcData is called', () => {
    const { result, rerender } = renderHook(
      () =>
        useAuthoritiesMarcPreview({
          endpointUrl: '/api/marc/:recordId',
          isMarcPreviewOpen: true,
        }),
      { wrapper: createWrapper() },
    );

    result.current.loadMarcData('record-123', 'Test Title', 'Personal Name');
    rerender();

    expect(mockUseMarcQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        recordId: 'record-123',
        endpointUrl: '/api/marc/:recordId',
        enabled: true,
      }),
    );
  });

  it('updates store when MARC data is loaded', async () => {
    const mockMarcData = {
      id: 'marc-123',
      matchedId: 'srs-456',
      parsedRecord: { id: 'parsed-123', content: { leader: '00000nam', fields: [] } },
    } as unknown as MarcDTO;

    const { result, rerender } = renderHook(
      () =>
        useAuthoritiesMarcPreview({
          endpointUrl: '/api/marc/:recordId',
          isMarcPreviewOpen: true,
        }),
      { wrapper: createWrapper() },
    );

    result.current.loadMarcData('record-123', 'Test Title', 'Personal Name');
    rerender();

    mockUseMarcQuery.mockReturnValue({
      data: mockMarcData,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
    rerender();

    await waitFor(() => {
      expect(mockSetComplexValue).toHaveBeenCalledWith(mockMarcData);
    });

    expect(mockSetMetadata).toHaveBeenCalledWith({
      baseId: 'record-123',
      marcId: 'marc-123',
      srsId: 'srs-456',
      title: 'Test Title',
      headingType: 'Personal Name',
    });
  });

  it('resets preview state', () => {
    const { result, rerender } = renderHook(
      () =>
        useAuthoritiesMarcPreview({
          endpointUrl: '/api/marc/:recordId',
          isMarcPreviewOpen: true,
        }),
      { wrapper: createWrapper() },
    );

    result.current.loadMarcData('record-123', 'Title', 'Type');
    rerender();

    result.current.resetPreview();
    rerender();

    expect(mockUseMarcQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        recordId: undefined,
      }),
    );
  });

  it('does not load when title or headingType is missing', () => {
    const { result } = renderHook(
      () =>
        useAuthoritiesMarcPreview({
          endpointUrl: '/api/marc/:recordId',
          isMarcPreviewOpen: true,
        }),
      { wrapper: createWrapper() },
    );

    result.current.loadMarcData('record-123', undefined, 'Type');

    expect(mockUseMarcQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        recordId: undefined,
      }),
    );
  });

  it('returns loading state from useMarcQuery', () => {
    mockUseMarcQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(
      () =>
        useAuthoritiesMarcPreview({
          endpointUrl: '/api/marc/:recordId',
          isMarcPreviewOpen: true,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);
  });

  it('disables query when preview is closed', () => {
    const { result, rerender } = renderHook(
      () =>
        useAuthoritiesMarcPreview({
          endpointUrl: '/api/marc/:recordId',
          isMarcPreviewOpen: false,
        }),
      { wrapper: createWrapper() },
    );

    result.current.loadMarcData('record-123', 'Title', 'Type');
    rerender();

    expect(mockUseMarcQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });
});
