import { SEARCH_QUERY_VALUE_PARAM, SearchSegment } from '@/common/constants/search.constants';
import { SearchableIndex, SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';

/**
 * CQL query templates for the LD (linked-data) authorities source.
 * - `keyword` / `lccn` / `identifier` search a single field.
 * - Type-based indices (person, organization, ...) constrain by `type` and match the label.
 *   The `sortby` clause is appended by the request builder, not baked into the templates.
 */
export const LD_AUTHORITIES_SEARCHABLE_INDICES_MAP: SearchableIndicesMap = {
  [SearchSegment.Search]: {
    [SearchableIndex.Keyword]: {
      [SearchableIndexQuerySelector.Query]: `(keyword all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Identifier]: {
      [SearchableIndexQuerySelector.Query]: `(lccn all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.LCCN]: {
      [SearchableIndexQuerySelector.Query]: `(lccn all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Concept]: {
      [SearchableIndexQuerySelector.Query]: `(type=="concept" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Family]: {
      [SearchableIndexQuerySelector.Query]: `(type=="family" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Form]: {
      [SearchableIndexQuerySelector.Query]: `(type=="form" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Jurisdiction]: {
      [SearchableIndexQuerySelector.Query]: `(type=="jurisdiction" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Meeting]: {
      [SearchableIndexQuerySelector.Query]: `(type=="meeting" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Organization]: {
      [SearchableIndexQuerySelector.Query]: `(type=="organization" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Person]: {
      [SearchableIndexQuerySelector.Query]: `(type=="person" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Place]: {
      [SearchableIndexQuerySelector.Query]: `(type=="place" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Subject]: {
      [SearchableIndexQuerySelector.Query]: `(type=="concept" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Temporal]: {
      [SearchableIndexQuerySelector.Query]: `(type=="temporal" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Topic]: {
      [SearchableIndexQuerySelector.Query]: `(type=="topic" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
  },
  [SearchSegment.Browse]: {},
};
