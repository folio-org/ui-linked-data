import { ItemSearchResponse } from '@common/api/search.api';
import { SearchIdentifiers, AdvancedSearchQualifiers, AdvancedSearchSchema } from '@common/constants/search.constants';
import { Row } from '@components/Table';

const __TEMP_RESULT_MAX_AMOUNT = 10;

const findIdentifier = (id: SearchIdentifiers, identifiers?: { value?: string; type?: string }[]) =>
  identifiers?.find(({ type }) => type === id.toUpperCase())?.value;

export const formatKnownItemSearchData = (result: ItemSearchResponse): Row[] => {
  return result.content
    .map(({ id, titles, contributors, publications, editionStatement, identifiers }) => ({
      isbn: {
        label: findIdentifier(SearchIdentifiers.ISBN, identifiers),
      },
      lccn: {
        label: findIdentifier(SearchIdentifiers.LCCN, identifiers),
      },
      title: {
        label: titles?.map(({ value }) => value).join('; '),
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
    .slice(0, __TEMP_RESULT_MAX_AMOUNT);
};

export const applyQualifierSyntaxToQuery = (query: string, qualifier: AdvancedSearchQualifiers) => {
  if (qualifier === AdvancedSearchQualifiers.containsAll) {
    return ` all "${query}"`;
  } else if (qualifier === AdvancedSearchQualifiers.startsWith) {
    return ` all "${query}*"`;
  } else {
    return `=="${query}"`;
  }
};

export const formatRawQuery = (rawQuery: AdvancedSearchSchema) => {
  const queryWithFormatting = rawQuery.reduce((total, { operator, query, qualifier, index, rowIndex }) => {
    // check if all row's items are in place (1st row doesn't have an operator)
    const canReduce = (operator || rowIndex === 0) && query && qualifier && index;

    // if not, the row should be skipped
    if (!canReduce) return total;

    const queryWithQualifier = applyQualifierSyntaxToQuery(query, qualifier);

    return (total += `${operator ? ` ${operator}` : ''}${rowIndex === 0 ? '' : ' '}${index}${queryWithQualifier}`);
  }, '');

  return `(${queryWithFormatting})`;
};
