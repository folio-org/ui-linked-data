import { renderHook } from '@testing-library/react';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchContext } from '@/features/search/ui';
import { Row } from '@/components/Table';
import { useSearchStore } from '@/store';
import { ComplexLookupSearchResultsProps } from '../components/ComplexLookupSearchResults/ComplexLookupSearchResults';
import { useComplexLookupSearchResults } from './useComplexLookupSearchResults';

jest.mock('@/features/search/ui/providers', () => ({
  useSearchContext: jest.fn(),
}));
jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const data = [
  {
    id: '1',
    name: { label: 'Item 1' },
    description: { label: 'Description 1' },
  },
];
const sourceData = [
  {
    id: '1',
    name: 'Item 1',
    description: 'Description 1',
  },
];
const tableConfig = {
  columns: {
    name: {
      label: 'name.label',
      position: 1,
      formatter: ({ row }: any) => row.name.label,
    },
    description: {
      label: 'description.label',
      position: 2,
    },
  },
};
const searchResultsFormatter = (data: Row[]) => data;

describe('useComplesLookupSearchResults', () => {
  beforeEach(() => {
    (useSearchContext as jest.Mock).mockReturnValue({
      onAssignRecord: jest.fn(),
    });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { data, sourceData },
      },
    ]);
  });

  it('returns "formattedData" and "listHeader"', () => {
    const props: ComplexLookupSearchResultsProps = {
      onTitleClick: jest.fn(),
      tableConfig,
      searchResultsFormatter,
    };

    const { result } = renderHook(() => useComplexLookupSearchResults(props));

    expect(result.current.formattedData).toEqual([
      {
        id: '1',
        name: {
          label: 'Item 1',
          children: 'Item 1',
        },
        description: {
          label: 'Description 1',
          children: 'Description 1',
        },
      },
    ]);

    expect(result.current.listHeader).toEqual({
      name: {
        label: 'name.label',
        position: 1,
        className: undefined,
      },
      description: {
        label: 'description.label',
        position: 2,
        className: undefined,
      },
    });
  });
});
