import { ItemSearchResponse } from '@common/api/search.api';
import { Row } from '@components/Table';
import { alphabeticSortLabel } from './common.helper';

const __TEMP_RESULT_MAX_AMOUNT = 10;
const QUERY_DELIMITER = '=';
const WILDCARD = '*';

export const formatKnownItemSearchData = (result: ItemSearchResponse): Row[] => {  
  return result.content
    .map(({ id, title, contributors, publications, editionStatement }) => ({
      id: {
        label: result?.search_query && result.search_query.split(QUERY_DELIMITER).at(-1)?.replace(WILDCARD, ''),
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
