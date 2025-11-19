export enum SearchableIndex {
  Keyword = 'keyword',
  Identifier = 'identifier',
  LCCN = 'lccn',
  PersonalName = 'personalName',
  CorporateConferenceName = 'corporateConferenceName',
  GeographicName = 'geographicName',
  NameTitle = 'nameTitle',
  UniformTitle = 'uniformTitle',
  Subject = 'subject',
  ChildrenSubjectHeading = 'childrenSubjectHeading',
  Genre = 'genre',
  HubNameLeftAnchored = 'hubNameLeftAnchored',
  HubNameKeyword = 'hubNameKeyword',
}

export enum SearchableIndexQuerySelector {
  Query = 'query',
  Prev = 'prev',
  Next = 'next',
}
