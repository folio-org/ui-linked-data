import { ItemSearch } from '@components/ItemSearch';
import './Search.scss';

export const Search = () => (
  <div className="search" data-testid="search">
    <ItemSearch /* fetchRecord={fetchRecord} */ />
  </div>
);
