import { SearchableIndex, SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';
import { SEARCH_QUERY_VALUE_PARAM, SearchSegment } from '@common/constants/search.constants';

export const COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP: SearchableIndicesMap = {
  [SearchSegment.Search]: {
    [SearchableIndex.Keyword]: {
      [SearchableIndexQuerySelector.Query]: `(keyword=="${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Identifier]: {
      [SearchableIndexQuerySelector.Query]: `((identifiers.value=="${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}") and authRefType=="Authorized")`,
    },
    [SearchableIndex.LCCN]: {
      [SearchableIndexQuerySelector.Query]: `lccn=="${SEARCH_QUERY_VALUE_PARAM}"`,
    },
    [SearchableIndex.PersonalName]: {
      [SearchableIndexQuerySelector.Query]: `(personalName all "${SEARCH_QUERY_VALUE_PARAM}" or sftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}" or saftPersonalName all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.CorporateConferenceName]: {
      [SearchableIndexQuerySelector.Query]: `(corporateName all "${SEARCH_QUERY_VALUE_PARAM}" or sftCorporateName all "${SEARCH_QUERY_VALUE_PARAM}" or saftCorporateName all "${SEARCH_QUERY_VALUE_PARAM}" or meetingName all "${SEARCH_QUERY_VALUE_PARAM}" or sftMeetingName all "${SEARCH_QUERY_VALUE_PARAM}" or saftMeetingName all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.GeographicName]: {
      [SearchableIndexQuerySelector.Query]: `(geographicName all "${SEARCH_QUERY_VALUE_PARAM}" or sftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}" or saftGeographicName all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.NameTitle]: {
      [SearchableIndexQuerySelector.Query]: `(personalNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftPersonalNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftPersonalNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or corporateNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftCorporateNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftCorporateNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or meetingNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftMeetingNameTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftMeetingNameTitle all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.UniformTitle]: {
      [SearchableIndexQuerySelector.Query]: `(uniformTitle all "${SEARCH_QUERY_VALUE_PARAM}" or sftUniformTitle all "${SEARCH_QUERY_VALUE_PARAM}" or saftUniformTitle all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.Subject]: {
      [SearchableIndexQuerySelector.Query]: `(topicalTerm all "${SEARCH_QUERY_VALUE_PARAM}" or sftTopicalTerm all "${SEARCH_QUERY_VALUE_PARAM}" or saftTopicalTerm all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
    [SearchableIndex.ChildrenSubjectHeading]: {
      [SearchableIndexQuerySelector.Query]: `((keyword all "${SEARCH_QUERY_VALUE_PARAM}" or naturalId="${SEARCH_QUERY_VALUE_PARAM}") and subjectHeadings=="b")`,
    },
    [SearchableIndex.Genre]: {
      [SearchableIndexQuerySelector.Query]: `(genreTerm all "${SEARCH_QUERY_VALUE_PARAM}" or sftGenreTerm all "${SEARCH_QUERY_VALUE_PARAM}" or saftGenreTerm all "${SEARCH_QUERY_VALUE_PARAM}")`,
    },
  },
  [SearchSegment.Browse]: {
    [SearchableIndex.PersonalName]: {
      [SearchableIndexQuerySelector.Query]: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Personal Name")`,
      [SearchableIndexQuerySelector.Prev]: `headingRef<"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Personal Name")`,
      [SearchableIndexQuerySelector.Next]: `headingRef>"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Personal Name")`,
    },
    [SearchableIndex.CorporateConferenceName]: {
      [SearchableIndexQuerySelector.Query]: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Conference Name" or "Corporate Name")`,
      [SearchableIndexQuerySelector.Prev]: `headingRef<"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Conference Name" or "Corporate Name")`,
      [SearchableIndexQuerySelector.Next]: `headingRef>"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Conference Name" or "Corporate Name")`,
    },
    [SearchableIndex.GeographicName]: {
      [SearchableIndexQuerySelector.Query]: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Geographic Name")`,
      [SearchableIndexQuerySelector.Prev]: `headingRef<"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Geographic Name")`,
      [SearchableIndexQuerySelector.Next]: `headingRef>"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Geographic Name")`,
    },
    [SearchableIndex.NameTitle]: {
      [SearchableIndexQuerySelector.Query]: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==true and headingType==("Conference Name" or "Corporate Name" or "Personal Name")`,
      [SearchableIndexQuerySelector.Prev]: `headingRef<"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==true and headingType==("Conference Name" or "Corporate Name" or "Personal Name")`,
      [SearchableIndexQuerySelector.Next]: `headingRef>"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==true and headingType==("Conference Name" or "Corporate Name" or "Personal Name")`,
    },
    [SearchableIndex.UniformTitle]: {
      [SearchableIndexQuerySelector.Query]: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Uniform Title")`,
      [SearchableIndexQuerySelector.Prev]: `headingRef<"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Uniform Title")`,
      [SearchableIndexQuerySelector.Next]: `headingRef>"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Uniform Title")`,
    },
    [SearchableIndex.Subject]: {
      [SearchableIndexQuerySelector.Query]: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Topical")`,
      [SearchableIndexQuerySelector.Prev]: `headingRef<"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Topical")`,
      [SearchableIndexQuerySelector.Next]: `headingRef>"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Topical")`,
    },
    [SearchableIndex.Genre]: {
      [SearchableIndexQuerySelector.Query]: `(headingRef>="${SEARCH_QUERY_VALUE_PARAM}" or headingRef<"${SEARCH_QUERY_VALUE_PARAM}") and isTitleHeadingRef==false and headingType==("Genre")`,
      [SearchableIndexQuerySelector.Prev]: `headingRef<"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Genre")`,
      [SearchableIndexQuerySelector.Next]: `headingRef>"${SEARCH_QUERY_VALUE_PARAM}" and isTitleHeadingRef==false and headingType==("Genre")`,
    },
  },
};
