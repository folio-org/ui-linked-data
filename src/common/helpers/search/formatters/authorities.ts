import { v4 as uuidv4 } from 'uuid';

export const formatAuthorityItem = (
  authoritiesList: AuthorityAsSearchResultDTO[],
  sourceData?: SourceDataDTO,
): SearchResultsTableRow[] =>
  authoritiesList?.map(({ id, authRefType, headingRef, headingType, sourceFileId }) => {
    const sourceLabel = sourceData?.find(({ id: sourceId }) => sourceId === sourceFileId)?.name ?? sourceFileId;

    return {
      __meta: {
        id,
        key: uuidv4(),
      },
      authorized: {
        label: authRefType,
      },
      title: {
        label: headingRef,
        className: 'title',
      },
      headingType: {
        label: headingType,
        className: 'heading-type',
      },
      authoritySource: {
        label: sourceLabel,
        className: 'authority-source',
      },
    };
  });
