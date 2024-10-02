type SearchResultsTableCell = {
  label?: string | React.JSX.Element;
  children?: React.JSX.Element;
  className?: string;
  position?: number;
  [x: string]: any;
};

type SearchResultsTableRow = Record<string, SearchResultsTableCell>;

type SearchResultsTableColumn = {
  label: string;
  position: number;
  className?: string;
  formatter?: (
    row: SearchResultsTableRow,
    formatMessage?: AbstractIntlFormatter,
    onAssign?: (data: ComplexLookupAssignRecordDTO) => void,
  ) => React.JSX.Element;
};

type SearchResultsTableConfig = {
  columns: Record<string, TableColumn>;
};
