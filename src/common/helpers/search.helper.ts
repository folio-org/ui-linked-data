import { ItemSearchResponse } from '@common/api/search.api';
import { Row } from '@components/Table';
import { alphabeticSortLabel } from './common.helper';

const _TEMP_RESULT_MAX_AMOUNT = 10;

export const formatKnownItemSearchData = (result: ItemSearchResponse): Row[] | null =>
  result?.content
    ? result.content
        .map(({ id, title, authors, dateOfPublication, editionStatement }) => ({
          id: {
            label: result?.search_query && result.search_query.split('=').at(-1),
          },
          title: {
            label: title,
          },
          author: {
            label: authors?.map(({ name }) => name).join('; '),
          },
          date: {
            label: dateOfPublication,
          },
          edition: {
            label: editionStatement,
          },
          __meta: {
            id,
          }
        }))
        .slice(0, _TEMP_RESULT_MAX_AMOUNT)
        .sort((a, b) => alphabeticSortLabel(b?.date, a?.date))
    : null;
