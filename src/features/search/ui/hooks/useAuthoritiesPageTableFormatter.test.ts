import { renderHook } from '@testing-library/react';

import { useAuthoritiesPageTableFormatter } from './useAuthoritiesPageTableFormatter';
import { useFormattedResults } from './useFormattedResults';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: jest.fn(({ id }: { id: string }) => `formatted.${id}`),
  }),
}));

jest.mock('./useFormattedResults');

const mockUseFormattedResults = useFormattedResults as jest.Mock;

const mockFormattedResults: SearchResultsTableRow[] = [
  {
    __meta: { id: 'auth-1', key: 'key-1', isAnchor: false, isLD: true },
    label: { label: 'Shakespeare, William', className: 'title' },
    type: { label: 'Person' },
    identifiers: { label: 'n78095332' },
    authorized: { label: 'Authorized' },
    source: { label: 'ld.source.linkedData' },
  },
  {
    __meta: { id: 'auth-2', key: 'key-2', isAnchor: false, isLD: false },
    label: { label: 'Some MARC Heading', className: 'title' },
    type: { label: 'Topic' },
    identifiers: { label: 'sh85122557' },
    authorized: { label: 'Reference' },
    source: { label: 'LC Name Authority File' },
  },
];

describe('useAuthoritiesPageTableFormatter', () => {
  const mockOnEdit = jest.fn();
  const mockOnImport = jest.fn();

  beforeEach(() => {
    mockUseFormattedResults.mockReturnValue(mockFormattedResults);
  });

  it('returns formattedData and listHeader', () => {
    const { result } = renderHook(() =>
      useAuthoritiesPageTableFormatter({ onEdit: mockOnEdit, onImport: mockOnImport }),
    );

    expect(result.current.formattedData).toBeDefined();
    expect(result.current.listHeader).toBeDefined();
    expect(result.current.formattedData).toHaveLength(2);
  });

  it('passes notSpecifiedLabel option to useFormattedResults', () => {
    renderHook(() => useAuthoritiesPageTableFormatter({ onEdit: mockOnEdit, onImport: mockOnImport }));

    expect(mockUseFormattedResults).toHaveBeenCalledWith(
      expect.objectContaining({ notSpecifiedLabel: expect.any(String) }),
    );
  });

  it('returns empty formattedData when useFormattedResults returns empty array', () => {
    mockUseFormattedResults.mockReturnValue([]);

    const { result } = renderHook(() => useAuthoritiesPageTableFormatter({}));

    expect(result.current.formattedData).toEqual([]);
  });

  it('returns empty formattedData when useFormattedResults returns undefined', () => {
    mockUseFormattedResults.mockReturnValue(undefined);

    const { result } = renderHook(() => useAuthoritiesPageTableFormatter({}));

    expect(result.current.formattedData).toEqual([]);
  });

  it('builds a table header object', () => {
    const { result } = renderHook(() => useAuthoritiesPageTableFormatter({}));

    expect(typeof result.current.listHeader).toBe('object');
    expect(result.current.listHeader).not.toBeNull();
  });

  it('works without callbacks', () => {
    const { result } = renderHook(() => useAuthoritiesPageTableFormatter({}));

    expect(result.current.formattedData).toBeDefined();
    expect(result.current.listHeader).toBeDefined();
  });
});
