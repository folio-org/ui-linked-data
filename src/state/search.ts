import {
  DEFAULT_FACET_BY_SEGMENT,
  DEFAULT_SEARCH_BY,
  DEFAULT_SEARCH_LIMITERS,
  SearchIdentifiers,
} from '@common/constants/search.constants';
import { atom } from 'recoil';

const query = atom<string>({
  key: 'search.query',
  default: '',
});

const message = atom<string>({
  key: 'search.message',
  default: '',
});

const index = atom<SearchIdentifiers>({
  key: 'search.index',
  default: DEFAULT_SEARCH_BY,
});

const data = atom<null | WorkAsSearchResultDTO[]>({
  key: 'search.data',
  default: null,
});

const limiters = atom<Limiters>({
  key: 'search.limiters',
  default: DEFAULT_SEARCH_LIMITERS as Limiters,
});

const navigationState = atom<SearchParamsState>({
  key: 'search.navigationState',
  default: {},
});

const forceRefresh = atom<boolean>({
  key: 'search.forceRefresh',
  default: false,
});

const pageMetadata = atom<PageMetadata>({
  key: 'search.pageMetadata',
  default: { totalElements: 0, totalPages: 0 },
});

const facetsBySegments = atom<FacetsBySegments>({
  key: 'search.facetsBySegments',
  default: DEFAULT_FACET_BY_SEGMENT,
});

export default {
  query,
  message,
  index,
  data,
  limiters,
  navigationState,
  forceRefresh,
  pageMetadata,
  facetsBySegments,
};
