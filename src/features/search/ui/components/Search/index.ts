// Legacy
export { Search as LegacySearch } from './Search.legacy';

// New compound components
import { Search as Root } from './Search';
import { SearchControls as Controls } from '../SearchControls/SearchControls';
import { SearchContent as Content, SearchContentContainer as ContentContainer } from '../SearchContent';
import { SearchControlPane as ControlPane } from '../SearchControlPane';
import { SearchPagination as Pagination } from '../SearchPagination';

export const Search = {
  Root,
  Controls,
  Content,
  ControlPane,
  ContentContainer,
  Pagination,
};
