// Legacy components
export { SearchControls as LegacySearchControls } from './legacy/SearchControls';
export { SearchSegments } from './legacy/SearchSegments';

// New compound components
// Usage in auto mode: SearchControls.InputsWrapper automatically renders SearchBySelect and QueryInput based on config
// Usage in custom mode: <SearchControls.InputsWrapper><YourCustomComponents /></SearchControls.InputsWrapper>
import { Segments } from './Segments';
import { QueryInput } from './QueryInput';
import { SearchBySelect } from './SearchBySelect';
import { SubmitButton } from './SubmitButton';
import { ResetButton } from './ResetButton';
import { InputsWrapper } from './InputsWrapper';
import { MetaControls } from './MetaControls';

export const SearchControls = {
  Segments,
  QueryInput,
  SearchBySelect,
  SubmitButton,
  ResetButton,
  InputsWrapper,
  MetaControls,
};
