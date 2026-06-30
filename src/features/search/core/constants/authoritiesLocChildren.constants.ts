import { SEARCH_QUERY_VALUE_PARAM, SearchSegment } from '@/common/constants/search.constants';
import { SearchableIndex, SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';

export const AUTHORITIES_LOC_CHILDREN_SEARCHABLE_INDICES_MAP: SearchableIndicesMap = {
  [SearchSegment.Search]: {
    [SearchableIndex.Keyword]: {
      [SearchableIndexQuerySelector.Query]: `((keyword=="${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Identifier]: {
      [SearchableIndexQuerySelector.Query]: `(((identifiers.value=="${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}") and authRefType=="Authorized") and subjectHeadings=="b")`,
    },
    [SearchableIndex.LCCN]: {
      [SearchableIndexQuerySelector.Query]: `(lccn=="${SEARCH_QUERY_VALUE_PARAM}" and subjectHeadings=="b")`,
    },
    [SearchableIndex.PersonalName]: {
      [SearchableIndexQuerySelector.Query]: `((personalName all "${SEARCH_QUERY_VALUE_PARAM}" or sftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}" or saftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.CorporateConferenceName]: {
      [SearchableIndexQuerySelector.Query]: `((corporateName all "${SEARCH_QUERY_VALUE_PARAM}" or sftCorporateName all "${SEARCH_QUERY_VALUE_PARAM}" or saftCorporateName all "${SEARCH_QUERY_VALUE_PARAM}" or meetingName all "${SEARCH_QUERY_VALUE_PARAM}" or sftMeetingName all "${SEARCH_QUERY_VALUE_PARAM}" or saftMeetingName all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.GeographicName]: {
      [SearchableIndexQuerySelector.Query]: `((geographicName all "${SEARCH_QUERY_VALUE_PARAM}" or sftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}" or saftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.NameTitle]: {
      [SearchableIndexQuerySelector.Query]: `((personalNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftPersonalNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftPersonalNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or corporateNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftCorporateNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftCorporateNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or meetingNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftMeetingNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftMeetingNameTitle all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.UniformTitle]: {
      [SearchableIndexQuerySelector.Query]: `((uniformTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftUniformTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftUniformTitle all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Subject]: {
      [SearchableIndexQuerySelector.Query]: `((topicalTerm all "${SEARCH_QUERY_VALUE_PARAM}" or sftTopicalTerm all "${SEARCH_QUERY_VALUE_PARAM}" or saftTopicalTerm all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.ChildrenSubjectHeading]: {
      [SearchableIndexQuerySelector.Query]: `((keyword all "${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Genre]: {
      [SearchableIndexQuerySelector.Query]: `((genreTerm all "${SEARCH_QUERY_VALUE_PARAM}" or sftGenreTerm all "${SEARCH_QUERY_VALUE_PARAM}" or saftGenreTerm all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b"`,
    },
    // Combined authority page options
    [SearchableIndex.Person]: {
      [SearchableIndexQuerySelector.Query]: `((personalName all "${SEARCH_QUERY_VALUE_PARAM}" or sftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}" or saftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Family]: {
      [SearchableIndexQuerySelector.Query]: `((personalName all "${SEARCH_QUERY_VALUE_PARAM}" or sftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}" or saftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Organization]: {
      [SearchableIndexQuerySelector.Query]: `((corporateName all "${SEARCH_QUERY_VALUE_PARAM}" or sftCorporateName all "${SEARCH_QUERY_VALUE_PARAM}" or saftCorporateName all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Meeting]: {
      [SearchableIndexQuerySelector.Query]: `((meetingName all "${SEARCH_QUERY_VALUE_PARAM}" or sftMeetingName all "${SEARCH_QUERY_VALUE_PARAM}" or saftMeetingName all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Place]: {
      [SearchableIndexQuerySelector.Query]: `((geographicName all "${SEARCH_QUERY_VALUE_PARAM}" or sftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}" or saftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Form]: {
      [SearchableIndexQuerySelector.Query]: `((genreTerm all "${SEARCH_QUERY_VALUE_PARAM}" or sftGenreTerm all "${SEARCH_QUERY_VALUE_PARAM}" or saftGenreTerm all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Concept]: {
      [SearchableIndexQuerySelector.Query]: `((keyword all "${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Topic]: {
      [SearchableIndexQuerySelector.Query]: `((topicalTerm all "${SEARCH_QUERY_VALUE_PARAM}" or sftTopicalTerm all "${SEARCH_QUERY_VALUE_PARAM}" or saftTopicalTerm all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Temporal]: {
      [SearchableIndexQuerySelector.Query]: `((keyword all "${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Jurisdiction]: {
      [SearchableIndexQuerySelector.Query]: `((geographicName all "${SEARCH_QUERY_VALUE_PARAM}" or sftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}" or saftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
  },
  // TODO: change the type to get rid of this old "Search" and "Browse" structure.
  [SearchSegment.Browse]: {},
};
