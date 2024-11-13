import { useRecoilValue } from 'recoil';
import { renderHook } from '@testing-library/react';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { useComplexLookupSearchResults } from '@common/hooks/useComplexLookupSearchResults';
import { ComplexLookupSearchResultsProps } from '@components/ComplexLookupField/ComplexLookupSearchResults';
import { Row } from '@components/Table';

jest.mock('recoil');
jest.mock('@common/hooks/useSearchContext', () => ({
  useSearchContext: jest.fn(),
}));

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
    (useRecoilValue as jest.Mock).mockReturnValueOnce(data).mockReturnValueOnce(sourceData);
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
