export enum SearchableIndex {
  Keyword = 'keyword',
  Identifier = 'identifier',
  LCCN = 'lccn',
  ISBN = 'isbn',
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
  Title = 'title',
  Contributor = 'contributor',
}

export enum SearchableIndexQuerySelector {
  Query = 'query',
  Prev = 'prev',
  Next = 'next',
}
