// Legacy
export { Search as LegacySearch } from './Search.legacy';

// New compound components
import { Search as SearchRoot } from './Search';
import { SearchContent as Content, SearchContentContainer as ContentContainer } from '../SearchContent';
import { SearchControlPane as ControlPane } from '../SearchControlPane';
import { RootControls } from '../SearchControls/RootControls';
import { Segment } from '../SearchControls/Segment';
import { SegmentGroup } from '../SearchControls/SegmentGroup';
import { SegmentContent } from '../SearchControls/SegmentContent';
import { QueryInput } from '../SearchControls/QueryInput';
import { SearchBySelect } from '../SearchControls/SearchBySelect';
import { SubmitButton } from '../SearchControls/SubmitButton';
import { ResetButton } from '../SearchControls/ResetButton';
import { InputsWrapper } from '../SearchControls/InputsWrapper';
import { MetaControls } from '../SearchControls/MetaControls';
import { SearchResults as Results } from '../SearchResults';

const Controls = Object.assign(RootControls, {
  // Props-based segment components
  Segment,
  SegmentGroup,
  SegmentContent,
  // Input components
  InputsWrapper,
  SubmitButton,
  ResetButton,
  QueryInput,
  SearchBySelect,
  MetaControls,
});

// Main compound component
export const Search = Object.assign(SearchRoot, {
  Controls,
  Content,
  ControlPane,
  ContentContainer,
  Results,
});
