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
  minWidth?: number;
  maxWidth?: number;
  formatter?: ({
    row,
    formatMessage,
    onAssign,
    onTitleClick,
  }: {
    row: SearchResultsTableRow;
    formatMessage?: AbstractIntlFormatter;
    onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
    onTitleClick?: (id: string) => void;
  }) => React.JSX.Element;
};

type SearchResultsTableConfig = {
  columns: Record<string, TableColumn>;
};
