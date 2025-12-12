// Legacy
export { Search as LegacySearch } from './legacy/Search.legacy';

// New compound components
import { Search as SearchRoot } from './Search';
import type { SearchProviderProps as SearchRootProps } from '../../types/provider.types';
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
import type { FC } from 'react';

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

// Type the compound component properly
type SearchCompoundComponent = FC<SearchRootProps> & {
  Controls: typeof Controls;
  Content: typeof Content;
  ControlPane: typeof ControlPane;
  ContentContainer: typeof ContentContainer;
  Results: typeof Results;
};

// Main compound component
export const Search: SearchCompoundComponent = Object.assign(SearchRoot, {
  Controls,
  Content,
  ControlPane,
  ContentContainer,
  Results,
});

// Export the props type for consumers
export type { SearchProviderProps as SearchRootProps } from '../../types/provider.types';
