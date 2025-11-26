// Legacy
export { Search as LegacySearch } from './Search.legacy';

// New compound components
import { Search as SearchRoot } from './Search';
import { RootControls } from '../SearchControls/RootControls';
import { SearchContent as Content, SearchContentContainer as ContentContainer } from '../SearchContent';
import { SearchControlPane as ControlPane } from '../SearchControlPane';
import { SearchControls } from '../SearchControls';
import { SearchResults as Results } from '../SearchResults';

const Controls = Object.assign(RootControls, {
  Segments: SearchControls.Segments,
  InputsWrapper: SearchControls.InputsWrapper,
  SubmitButton: SearchControls.SubmitButton,
  ResetButton: SearchControls.ResetButton,
  QueryInput: SearchControls.QueryInput,
  SearchBySelect: SearchControls.SearchBySelect,
  MetaControls: SearchControls.MetaControls,
});

// Main compound component
export const Search = Object.assign(SearchRoot, {
  Controls,
  Content,
  ControlPane,
  ContentContainer,
  Results,
});
