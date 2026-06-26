import { SEARCH_QUERY_VALUE_PARAM, SearchSegment } from '@/common/constants/search.constants';
import { SearchableIndex, SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';

/**
 * CQL query templates for the LD (linked-data) authorities source.
 * - `keyword` / `lccn` / `identifier` search a single field.
 * - Type-based indices (person, organization, ...) constrain by `type` and match the label.
 *   The `sortby` clause is appended by the request builder, not baked into the templates.
 */

const typeLabelEntry = (type: string) => ({
  [SearchableIndexQuerySelector.Query]: `(type=="${type}" and label all "${SEARCH_QUERY_VALUE_PARAM}")`,
});

export const LD_AUTHORITIES_SEARCHABLE_INDICES_MAP: SearchableIndicesMap = {
  [SearchSegment.Search]: {
    [SearchableIndex.Keyword]: {
      [SearchableIndexQuerySelector.Query]: `(keyword all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    // Identifier intentionally uses the same lccn query as LCCN
    [SearchableIndex.Identifier]: {
      [SearchableIndexQuerySelector.Query]: `(lccn all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.LCCN]: {
      [SearchableIndexQuerySelector.Query]: `(lccn all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Concept]: typeLabelEntry('concept'),
    [SearchableIndex.Family]: typeLabelEntry('family'),
    [SearchableIndex.Form]: typeLabelEntry('form'),
    [SearchableIndex.Jurisdiction]: typeLabelEntry('jurisdiction'),
    [SearchableIndex.Meeting]: typeLabelEntry('meeting'),
    [SearchableIndex.Organization]: typeLabelEntry('organization'),
    [SearchableIndex.Person]: typeLabelEntry('person'),
    [SearchableIndex.Place]: typeLabelEntry('place'),
    [SearchableIndex.Subject]: typeLabelEntry('subject'),
    [SearchableIndex.Temporal]: typeLabelEntry('temporal'),
    [SearchableIndex.Topic]: typeLabelEntry('topic'),
  },
  [SearchSegment.Browse]: {},
};
