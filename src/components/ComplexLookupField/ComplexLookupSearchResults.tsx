import { FC } from 'react';
import { TableFlex, type Row } from '@components/Table';
import { useComplexLookupSearchResults } from '@common/hooks/useComplexLookupSearchResults';

export type ComplexLookupSearchResultsProps = {
  onTitleClick?: (id: string, title?: string, headingType?: string) => void;
  tableConfig: SearchResultsTableConfig;
  searchResultsFormatter: (data: any[], sourceData?: SourceDataDTO) => Row[];
};

export const ComplexLookupSearchResults: FC<ComplexLookupSearchResultsProps> = ({
  onTitleClick,
  tableConfig,
  searchResultsFormatter,
}) => {
  const { listHeader, formattedData } = useComplexLookupSearchResults({
    onTitleClick,
    tableConfig,
    searchResultsFormatter,
  });

  return (
    <div className="search-result-list">
      <TableFlex header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
};
