import {
  DEFAULT_SEARCH_BY,
  DEFAULT_SEARCH_LIMITERS,
  PublishDate,
  SearchIdentifiers,
  SearchLimiterNames,
  Suppressed,
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

const limiters = atom<Record<SearchLimiterNames, any[] | Suppressed | PublishDate>>({
  key: 'search.limiters',
  default: DEFAULT_SEARCH_LIMITERS,
});

const navigationState = atom<SearchParamsState>({
  key: 'search.navigationState',
  default: {},
});

const forceRefresh = atom<boolean>({
  key: 'search.forceRefresh',
  default: false,
});

export default {
  query,
  message,
  index,
  data,
  limiters,
  navigationState,
  forceRefresh,
};
