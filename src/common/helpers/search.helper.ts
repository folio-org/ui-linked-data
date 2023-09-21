import { ItemSearchResponse } from '@common/api/search.api';
import { Row } from '@components/Table';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { alphabeticSortLabel } from './common.helper';

const __TEMP_RESULT_MAX_AMOUNT = 10;

const findIdentifier = (id: SearchIdentifiers, identifiers?: { value?: string; type?: string }[]) =>
  identifiers?.find(({ type }) => type === id.toUpperCase())?.value;

export const formatKnownItemSearchData = (result: ItemSearchResponse): Row[] => {
  return result.content
    .map(({ id, title, contributors, publications, editionStatement, identifiers }) => ({
      isbn: {
        label: findIdentifier(SearchIdentifiers.ISBN, identifiers),
      },
      lccn: {
        label: findIdentifier(SearchIdentifiers.LCCN, identifiers),
      },
      title: {
        label: title,
      },
      author: {
        label: contributors?.map(({ name }) => name).join('; '),
      },
      date: {
        label: publications?.map(({ dateOfPublication }) => dateOfPublication).join('; '),
      },
      edition: {
        label: editionStatement,
      },
      __meta: {
        id,
      },
    }))
    .slice(0, __TEMP_RESULT_MAX_AMOUNT)
    .sort((a, b) => alphabeticSortLabel(b?.date, a?.date));
};
