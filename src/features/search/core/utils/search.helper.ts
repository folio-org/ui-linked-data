import { SearchQueryParams } from '@/common/constants/routes.constants';
import {
  AdvancedSearchQualifiers,
  AdvancedSearchSchema,
  SearchIdentifiers,
  TitleTypes,
} from '@/common/constants/search.constants';
import { Row } from '@/components/Table';

type CompositePrimitiveKeyPart = string | number | boolean | null | undefined;
type CompositeKeyPart = CompositePrimitiveKeyPart | ReadonlyArray<CompositePrimitiveKeyPart>;

export const normalizeKeyPart = (value: CompositePrimitiveKeyPart): string =>
  String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, ' ');

export const createCompositeKeyBuilder = () => {
  const occurrenceBySignature = new Map<string, number>();

  return (prefix: string, parts: CompositeKeyPart[]): string => {
    const normalizedParts = parts.map(part =>
      Array.isArray(part) ? part.map(normalizeKeyPart) : normalizeKeyPart(part as CompositePrimitiveKeyPart),
    );
    const signature = JSON.stringify(normalizedParts);
    const occurrence = occurrenceBySignature.get(signature) ?? 0;

    occurrenceBySignature.set(signature, occurrence + 1);

    return `${prefix}:${signature}#${occurrence}`;
  };
};

export const findIdentifier = (id: SearchIdentifiers, identifiers?: { value?: string; type?: string }[]) =>
  identifiers?.find(({ type }) => type === id.toUpperCase())?.value;

export const getTitle = (titles: GenericStructDTO<TitleType>[] | undefined) => {
  const mainTitle = titles?.find(({ type }) => type === TitleTypes.Main)?.value;
  const subTitle = titles?.find(({ type }) => type === TitleTypes.Sub)?.value;
  return [mainTitle, subTitle].filter(t => !!t).join(' ');
};

export const formatItemSearchInstanceListData = (instanceList: InstanceAsSearchResultDTO[]): Row[] => {
  const buildFallbackKey = createCompositeKeyBuilder();

  return instanceList.map(({ id, titles, identifiers, publications }) => {
    // at the moment, picking the first match/first item in list for display
    // this might change depending on requirements

    const selectedPublisher = publications?.find(({ name, date }) => name ?? date);
    const title = getTitle(titles);
    const isbn = findIdentifier(SearchIdentifiers.ISBN, identifiers);
    const lccn = findIdentifier(SearchIdentifiers.LCCN, identifiers);

    return {
      __meta: {
        id,
        key: id || buildFallbackKey('instance', [title, isbn, lccn, selectedPublisher?.name, selectedPublisher?.date]),
      },
      title: {
        label: title,
        className: 'title',
      },
      isbn: {
        label: isbn,
        className: 'identifier',
      },
      lccn: {
        label: lccn,
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
    const operatorString = operator && shouldApplyOperator ? ` ${operator} ` : '';

    total += operatorString + index + queryWithQualifier;

    return total;
  }, '');

  return `(${queryWithFormatting})`;
};

export const generateSearchParamsState = (
  query: string | null,
  searchBy?: SearchIdentifiers | null,
  offset = 0,
  segment?: string | null,
  source?: string | null,
) => {
  const searchParamsState = {
    [SearchQueryParams.Query]: query,
    [SearchQueryParams.Offset]: offset,
  } as SearchParamsState;

  if (searchBy) {
    searchParamsState[SearchQueryParams.SearchBy] = searchBy;
  }

  if (segment) {
    searchParamsState[SearchQueryParams.Segment] = segment;
  }

  if (source) {
    searchParamsState[SearchQueryParams.Source] = source;
  }

  return searchParamsState;
};

export const normalizeQuery = (query?: string | null) => {
  return query?.replaceAll(/['"/\\]/g, String.raw`\$&`);
};

export const removeBackslashes = (query?: string | null) => {
  if (!query) return '';

  return query
    .replaceAll(String.raw`\"`, '"') // replace escaped double quotes with double quotes
    .replaceAll(String.raw`\\`, '\\') // replace double backslashes with single
    .replaceAll(/([^\\])\\(?!\\)/g, '$1'); // remove single backslashes;
};
