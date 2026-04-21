import { renderHook } from '@testing-library/react';

import { useFormattedResults } from './useFormattedResults';
import { useHubsTableFormatter } from './useHubsTableFormatter';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: jest.fn(({ id }) => `formatted.${id}`),
  }),
}));

jest.mock('./useFormattedResults');

const mockUseFormattedResults = useFormattedResults as jest.Mock;

describe('useHubsTableFormatter', () => {
  const mockOnEdit = jest.fn();
  const mockOnImport = jest.fn();

  const mockFormattedResults: SearchResultsTableRow[] = [
    {
      __meta: {
        id: 'token1',
        key: 'key1',
        isAnchor: false,
        isLocal: true,
      },
      hub: {
        label: 'Test Hub 1',
        uri: 'http://example.com/hub_1',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress.local',
        className: 'hub-source',
      },
    },
    {
      __meta: {
        id: 'token2',
        key: 'key2',
        isAnchor: false,
        isLocal: false,
      },
      hub: {
        label: 'Test Hub 2',
        uri: 'http://example.com/hub_2',
        className: 'hub-title',
      },
      source: {
        label: 'ld.source.libraryOfCongress',
        className: 'hub-source',
      },
    },
  ];

  beforeEach(() => {
    mockUseFormattedResults.mockReturnValue(mockFormattedResults);
  });

  it('returns formatted data and list header', () => {
    const { result } = renderHook(() =>
      useHubsTableFormatter({
        onEdit: mockOnEdit,
        onImport: mockOnImport,
      }),
    );

    expect(result.current.formattedData).toBeDefined();
    expect(result.current.listHeader).toBeDefined();
    expect(result.current.formattedData).toHaveLength(2);
  });

  it('handles empty formatted results', () => {
    mockUseFormattedResults.mockReturnValue([]);

    const { result } = renderHook(() =>
      useHubsTableFormatter({
        onEdit: mockOnEdit,
        onImport: mockOnImport,
      }),
    );

    expect(result.current.formattedData).toEqual([]);
    expect(result.current.listHeader).toBeDefined();
  });

  it('handles undefined formatted results', () => {
    mockUseFormattedResults.mockReturnValue(undefined);

    const { result } = renderHook(() =>
      useHubsTableFormatter({
        onEdit: mockOnEdit,
        onImport: mockOnImport,
      }),
    );

    expect(result.current.formattedData).toEqual([]);
    expect(result.current.listHeader).toBeDefined();
  });

  it('applies column formatters to data', () => {
    const { result } = renderHook(() =>
      useHubsTableFormatter({
        onEdit: mockOnEdit,
        onImport: mockOnImport,
      }),
    );

    expect(result.current.formattedData).toBeDefined();
    expect(result.current.formattedData.length).toBeGreaterThan(0);
  });

  it('builds table header with formatted labels', () => {
    const { result } = renderHook(() =>
      useHubsTableFormatter({
        onEdit: mockOnEdit,
        onImport: mockOnImport,
      }),
    );

    expect(result.current.listHeader).toBeDefined();
    expect(typeof result.current.listHeader).toBe('object');
  });

  it('works without onEdit and onImport callbacks', () => {
    const { result } = renderHook(() => useHubsTableFormatter({}));

    expect(result.current.formattedData).toBeDefined();
    expect(result.current.listHeader).toBeDefined();
  });
});
