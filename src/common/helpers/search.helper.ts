import { SearchQueryParams } from '@common/constants/routes.constants';
import {
  SearchIdentifiers,
  AdvancedSearchQualifiers,
  AdvancedSearchSchema,
  TitleTypes,
} from '@common/constants/search.constants';
import { Row } from '@components/Table';
import { v4 as uuidv4 } from 'uuid';

export const findIdentifier = (id: SearchIdentifiers, identifiers?: { value?: string; type?: string }[]) =>
  identifiers?.find(({ type }) => type === id.toUpperCase())?.value;

export const getTitle = (titles: GenericStructDTO<TitleType>[] | undefined) => {
  const mainTitle = titles?.find(({ type }) => type === TitleTypes.Main)?.value;
  const subTitle = titles?.find(({ type }) => type === TitleTypes.Sub)?.value;
  return [mainTitle, subTitle].filter(t => !!t).join(' ');
};

export const formatItemSearchInstanceListData = (instanceList: InstanceAsSearchResultDTO[]): Row[] => {
  return instanceList.map(({ id, titles, identifiers, publications }) => {
    // TODO: at the moment, picking the first match/first item in list for display
    // this might change depending on requirements

    const selectedPublisher = publications?.find(({ name, date }) => name || date);

    return {
      __meta: {
        id,
        key: uuidv4(),
      },
      title: {
        label: getTitle(titles),
        className: 'title',
      },
      isbn: {
        label: findIdentifier(SearchIdentifiers.ISBN, identifiers),
        className: 'identifier',
      },
      lccn: {
        label: findIdentifier(SearchIdentifiers.LCCN, identifiers),
        className: 'identifier',
      },
      publisher: {
        label: selectedPublisher?.name,
        className: 'publisher',
      },
      pubDate: {
        label: selectedPublisher?.date,
        className: 'publication-date',
      },
    };
  });
  // .slice(0, __TEMP_RESULT_MAX_AMOUNT);
};

export const applyQualifierSyntaxToQuery = (query: string, qualifier: AdvancedSearchQualifiers) => {
  const normalizedQuery = normalizeQuery(query);

  if (qualifier === AdvancedSearchQualifiers.containsAll) {
    return ` all "${normalizedQuery}"`;
  } else if (qualifier === AdvancedSearchQualifiers.startsWith) {
    return ` all "${normalizedQuery}*"`;
  } else {
    return `=="${normalizedQuery}"`;
  }
};

export const formatRawQuery = (rawQuery: AdvancedSearchSchema) => {
  const queryWithFormatting = rawQuery.reduce((total, { operator, query, qualifier, index, rowIndex }) => {
    // check if all row's items are in place (1st row doesn't have an operator)
    const canReduce = (operator || rowIndex === 0) && query && qualifier && index;

    // if not, the row should be skipped
    if (!canReduce) return total;

    const queryWithQualifier = applyQualifierSyntaxToQuery(query, qualifier);
    const shouldApplyOperator = total.length;

    return (total += `${operator && shouldApplyOperator ? ` ${operator} ` : ''}${index}${queryWithQualifier}`);
  }, '');

  return `(${queryWithFormatting})`;
};

export const generateSearchParamsState = (query: string | null, searchBy?: SearchIdentifiers | null, offset = 0) => {
  const searchParamsState = {
    [SearchQueryParams.Query]: query,
    [SearchQueryParams.Offset]: offset,
  } as SearchParamsState;

  if (searchBy) {
    searchParamsState[SearchQueryParams.SearchBy] = searchBy;
  }

  return searchParamsState;
};

export const normalizeQuery = (query?: string | null) => {
  return query?.replaceAll(/['"/\\]/g, '\\$&');
};
