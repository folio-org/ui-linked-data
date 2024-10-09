import { SearchableIndex } from '@common/constants/complexLookup.constants';
import { SEARCH_QUERY_VALUE_PARAM, SearchSegment } from '@common/constants/search.constants';

export const COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP: SearchableIndicesMap = {
  [SearchSegment.Search]: {
    [SearchableIndex.Keyword]: {
      query: `(keyword=="${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Identifier]: {
      query: `((identifiers.value=="${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}") and authRefType=="Authorized")`,
    },
    [SearchableIndex.LCCN]: {
      query: `lccn=="${SEARCH_QUERY_VALUE_PARAM}"`,
    },
    [SearchableIndex.PersonalName]: {
      query: `(personalName all "${SEARCH_QUERY_VALUE_PARAM}" or sftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}" or saftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.CorporateConferenceName]: {
      query: `(corporateName all "${SEARCH_QUERY_VALUE_PARAM}" or sftCorporateName all "${SEARCH_QUERY_VALUE_PARAM}" or saftCorporateName all "${SEARCH_QUERY_VALUE_PARAM}" or meetingName all "${SEARCH_QUERY_VALUE_PARAM}" or sftMeetingName all "${SEARCH_QUERY_VALUE_PARAM}" or saftMeetingName all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.GeographicName]: {
      query: `(geographicName all "${SEARCH_QUERY_VALUE_PARAM}" or sftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}" or saftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.NameTitle]: {
      query: `(personalNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftPersonalNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftPersonalNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or corporateNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftCorporateNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftCorporateNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or meetingNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftMeetingNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftMeetingNameTitle all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.UniformTitle]: {
      query: `(uniformTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftUniformTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftUniformTitle all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Subject]: {
      query: `(topicalTerm all "${SEARCH_QUERY_VALUE_PARAM}" or sftTopicalTerm all "${SEARCH_QUERY_VALUE_PARAM}" or saftTopicalTerm all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.ChildrenSubjectHeading]: {
      query: `((keyword all "${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Genre]: {
      query: `(genreTerm all "${SEARCH_QUERY_VALUE_PARAM}" or sftGenreTerm all "${SEARCH_QUERY_VALUE_PARAM}" or saftGenreTerm all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
  },
  [SearchSegment.Browse]: {
    [SearchableIndex.PersonalName]: {
      query: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Personal Name")`,
    },
    [SearchableIndex.CorporateConferenceName]: {
      query: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Conference Name" or "Corporate Name")`,
    },
    [SearchableIndex.GeographicName]: {
      query: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Geographic Name")`,
    },
    [SearchableIndex.NameTitle]: {
      query: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==true and headingType==("Conference Name" or "Corporate Name" or "Personal Name")`,
    },
    [SearchableIndex.UniformTitle]: {
      query: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Uniform Title")`,
    },
    [SearchableIndex.Subject]: {
      query: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Topical")`,
    },
    [SearchableIndex.Genre]: {
      query: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Genre")`,
    },
  },
};
