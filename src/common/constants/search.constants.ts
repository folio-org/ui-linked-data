export enum SearchIdentifiers {
  ISBN = 'isbn',
  LCCN = 'lccn',
  TITLE = 'title',
  CONTRIBUTOR = 'contributor',
}

export enum SearchDisplayIdentifiers {
  isbn = 'marva.isbn',
  lccn = 'marva.lccn',
  title = 'marva.title',
  contributor = 'marva.contributor',
}

export enum SearchLimiterNames {
  PublishDate = 'publishDate',
  Format = 'format',
  Suppressed = 'suppressed',
}

export enum PublishDate {
  AllTime = 'allTime',
  TwelveMonths = '12mos',
  FiveYears = '5yrs',
  TenYears = '10yrs',
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

export const DEFAULT_SEARCH_LIMITERS = {
  [SearchLimiterNames.PublishDate]: PublishDate.AllTime,
  [SearchLimiterNames.Format]: [],
  [SearchLimiterNames.Suppressed]: Suppressed.All,
}

export const DEFAULT_SEARCH_BY = SearchIdentifiers.LCCN;

export const SEARCH_RESULTS_LIMIT = 10;
