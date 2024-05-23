import { ItemSearch } from '@components/ItemSearch';
import './Search.scss';

export const Search = () => (
  <div className="search" data-testid="search" id="ld-search-container">
    <ItemSearch /* fetchRecord={fetchRecord} */ />
  </div>
);
