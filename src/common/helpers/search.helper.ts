import { SearchQueryParams } from '@common/constants/routes.constants';
import {
  SearchIdentifiers,
  AdvancedSearchQualifiers,
  AdvancedSearchSchema,
  TitleTypes,
} from '@common/constants/search.constants';
import { Row } from '@components/Table';
import { v4 as uuidv4 } from 'uuid';

// const __TEMP_RESULT_MAX_AMOUNT = 10;

const findIdentifier = (id: SearchIdentifiers, identifiers?: { value?: string; type?: string }[]) =>
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
    const shouldApplyOperator = total.length;

    return (total += `${operator && shouldApplyOperator ? ` ${operator} ` : ''}${index}${queryWithQualifier}`);
  }, '');

  return `(${queryWithFormatting})`;
};

export const generateSearchParamsState = (query: string | null, searchBy?: SearchIdentifiers | null) => {
  const searchParamsState = {
    [SearchQueryParams.Query]: query,
  } as SearchParamsState;

  if (searchBy) {
    searchParamsState[SearchQueryParams.SearchBy] = searchBy;
  }

  return searchParamsState;
};
