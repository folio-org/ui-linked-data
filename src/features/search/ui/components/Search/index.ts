// Legacy
export { Search as LegacySearch } from './Search.legacy';

// New compound components
import { Search as Root } from './Search';
import { Controls } from './Controls';
import { Content } from './Content';

export const Search = {
  Root,
  Controls,
  Content,
};
