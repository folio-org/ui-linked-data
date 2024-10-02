export enum SearchIdentifiers {
  LCCN = 'lccn',
  ISBN = 'isbn',
  TITLE = 'title',
  CONTRIBUTOR = 'contributor',
}

export enum SearchLimiterNames {
  PublishDate = 'publishDate',
  Format = 'format',
  Suppressed = 'suppressed',
}

export enum SearchLimiterNamesAuthority {
  AuthoritySource = 'sourceFileId',
  References = 'authRefType',
  Thesaurus = 'subjectHeadings',
  TypeOfHeading = 'headingType',
  DateCreated = 'metadata.createdDate',
  DateUpdated = 'metadata.updatedDate',
}

export enum PublishDate {
  AllTime = 'allTime',
  TwelveMonths = '12mos',
  FiveYears = '5yrs',
  TenYears = '10yrs',
}

export enum AuthorityType {
  All = 'allAuthorities',
  Pesron = 'person',
  Family = 'family',
  CorporateBody = 'corporateBody',
  Jurisdiction = 'jurisdiction',
  Conference = 'conference',
}

export enum SourceType {
  All = 'allSource',
  Authorized = 'authorized',
  Unauthorized = 'unauthorized',
}

export enum Format {
  Volume = 'volume',
  Ebook = 'ebook',
}

export enum Suppressed {
  All = 'all',
  Suppressed = 'suppressed',
  NotSuppressed = 'notSuppressed',
}

export enum TitleTypes {
  Main = 'Main',
  Sub = 'Sub',
}

export enum Classifications {
  DDC = 'ddc',
  LC = 'lc',
}

// TODO: here and below: uncomment once taken into development
export enum AdvancedSearchOperators {
  AND = 'and',
  // OR = 'or',
  NOT = 'not',
}

export enum AdvancedSearchQualifiers {
  containsAll = 'containsAll',
  startsWith = 'startsWith',
  exactPhrase = 'exactPhrase',
}

export type AdvancedSearchSchemaRow = {
  rowIndex?: number;
  operator?: AdvancedSearchOperators;
  query?: string;
  qualifier?: AdvancedSearchQualifiers;
  index?: SearchIdentifiers;
};

export const DEFAULT_SEARCH_LIMITERS = {
  [SearchLimiterNames.PublishDate]: PublishDate.AllTime,
  [SearchLimiterNames.Format]: [],
  [SearchLimiterNames.Suppressed]: Suppressed.All,
};

export type AdvancedSearchSchema = AdvancedSearchSchemaRow[];

export const SEARCH_RESULTS_LIMIT = 10;

export const SELECT_IDENTIFIERS = Object.values(SearchIdentifiers);

export const SELECT_OPERATORS = Object.values(AdvancedSearchOperators);

export const SELECT_QUALIFIERS = Object.values(AdvancedSearchQualifiers);

export const DEFAULT_SEARCH_BY = SearchIdentifiers.LCCN;

export const DEFAULT_ADVANCED_SEARCH_ROW_VALUE: AdvancedSearchSchemaRow = {
  operator: AdvancedSearchOperators.AND,
  qualifier: AdvancedSearchQualifiers.containsAll,
  index: SearchIdentifiers.LCCN,
};

export const DEFAULT_ADVANCED_SEARCH_QUERY: AdvancedSearchSchema = new Array(6)
  .fill(DEFAULT_ADVANCED_SEARCH_ROW_VALUE)
  .map((item, rowIndex) => ({ ...item, rowIndex, operator: rowIndex === 0 ? undefined : item.operator }));

export enum FiltersGroupCheckType {
  Single = 'single',
  Multi = 'multi',
  Lookup = 'lookup',
  DateRange = 'dateRange',
}

export enum FiltersType {
  Checkbox = 'checkbox',
  Radio = 'radio',
}

export enum SearchSegment {
  Search = 'search',
  Browse = 'browse',
}

export const DEFAULT_FACET_BY_SEGMENT_DATA = {
  query: '',
  searchBy: '',
  facets: {} as Limiters,
};

export const DEFAULT_FACET_BY_SEGMENT = {
  [SearchSegment.Search]: DEFAULT_FACET_BY_SEGMENT_DATA,
  [SearchSegment.Browse]: DEFAULT_FACET_BY_SEGMENT_DATA,
};

export enum References {
  ExcludeSeeFrom = 'Auth/Ref',
  ExcludeSeeFromAlso = 'Reference',
}
