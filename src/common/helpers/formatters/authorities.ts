import { v4 as uuidv4 } from 'uuid';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { findIdentifier } from '@common/helpers/search.helper';

export const formatAuthorityItem = (
  authoritiesList: AuthorityAsSearchResultDTO[],
): SearchResultsTableRow[] =>
  authoritiesList.map(({ id, label, identifiers, type }) => ({
    __meta: {
      id,
      key: uuidv4(),
    },
    title: {
      label,
      className: 'title',
    },
    subclass: {
      label: type,
      className: 'subclass',
    },
    lccn: {
      label: findIdentifier(SearchIdentifiers.LCCN, identifiers),
      className: 'identifier',
    },
  }));
