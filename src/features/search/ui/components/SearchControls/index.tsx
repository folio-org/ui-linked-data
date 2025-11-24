// Legacy components
export { SearchControls as LegacySearchControls } from './legacy/SearchControls';
export { SearchSegments } from './legacy/SearchSegments';

// New compound components
import { Root } from './Root';
import { Segments } from './Segments';
import { QueryInput } from './QueryInput';
import { SearchBySelect } from './SearchBySelect';
import { SubmitButton } from './SubmitButton';
import { ResetButton } from './ResetButton';

export const SearchControls = {
  Root,
  Segments,
  QueryInput,
  SearchBySelect,
  SubmitButton,
  ResetButton,
};
