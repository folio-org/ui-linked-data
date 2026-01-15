import { render } from '@testing-library/react';
import { useComplexLookupSearchResults } from '@/features/complexLookup/hooks/useComplexLookupSearchResults';
import { TableFlex } from '@/components/Table';
import { ComplexLookupSearchResults } from './ComplexLookupSearchResults';

jest.mock('@/components/Table');
jest.mock('@/features/complexLookup/hooks/useComplexLookupSearchResults');
jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const listHeader = ['Column 1', 'Column 2'];
const formattedData = [
  { id: '1', values: ['Data 1', 'Data 2'] },
  { id: '2', values: ['Data 3', 'Data 4'] },
];

const onTitleClick = jest.fn();
const searchResultsFormatter = jest.fn();
const tableConfig = {} as SearchResultsTableConfig;

describe('ComplexLookupSearchResults', () => {
  it('renders "TableFlex" component with the required props', () => {
    (useComplexLookupSearchResults as jest.Mock).mockReturnValue({
      listHeader,
      formattedData,
    });
    (TableFlex as unknown as jest.Mock).mockReturnValue(<div>Mock TableFlex</div>);

    render(
      <ComplexLookupSearchResults
        onTitleClick={onTitleClick}
        tableConfig={tableConfig}
        searchResultsFormatter={searchResultsFormatter}
      />,
    );

    expect(TableFlex as unknown as jest.Mock).toHaveBeenCalledWith(
      { header: listHeader, data: formattedData, className: 'results-list' },
      undefined,
    );
  });
});
