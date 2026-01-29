// New compound components
import type { FC } from 'react';

import type { SearchProviderProps as SearchRootProps } from '../../types/provider.types';
import { SearchContent as Content, SearchContentContainer as ContentContainer } from '../SearchContent';
import { SearchControlPane as ControlPane } from '../SearchControlPane';
import { InputsWrapper } from '../SearchControls/InputsWrapper';
import { MetaControls } from '../SearchControls/MetaControls';
import { QueryInput } from '../SearchControls/QueryInput';
import { ResetButton } from '../SearchControls/ResetButton';
import { RootControls } from '../SearchControls/RootControls';
import { SearchBySelect } from '../SearchControls/SearchBySelect';
import { Segment } from '../SearchControls/Segment';
import { SegmentContent } from '../SearchControls/SegmentContent';
import { SegmentGroup } from '../SearchControls/SegmentGroup';
import { SourceSelector } from '../SearchControls/SourceSelector';
import { SubmitButton } from '../SearchControls/SubmitButton';
import { SearchResults as Results } from '../SearchResults';
import { Search as SearchRoot } from './Search';

// Legacy
export { Search as LegacySearch } from './legacy/Search.legacy';

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
  SourceSelector,
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
