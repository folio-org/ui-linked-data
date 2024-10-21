import { v4 as uuidv4 } from 'uuid';

export const formatAuthorityItem = (
  authoritiesList: AuthorityAsSearchResultDTO[] | AuthorityAsBrowseResultDTO[],
  sourceData?: SourceDataDTO,
): SearchResultsTableRow[] =>
  authoritiesList?.map(authorityEntry => {
    const selectedEntry = (authorityEntry.authority ?? authorityEntry) as AuthorityAsSearchResultDTO;
    const { id = '', authRefType = '', headingRef = '', headingType = '', sourceFileId = '' } = selectedEntry;
    const sourceLabel = sourceData?.find(({ id: sourceId }) => sourceId === sourceFileId)?.name ?? sourceFileId;
    const { isAnchor } = authorityEntry;

    return {
      __meta: {
        id,
        key: uuidv4(),
        isAnchor,
      },
      authorized: {
        label: authRefType,
      },
      title: {
        label: headingRef,
        className: 'title',
      },
      subclass: {
        label: headingType,
        className: 'heading-type',
      },
      authoritySource: {
        label: sourceLabel,
        className: 'authority-source',
      },
    };
  });
