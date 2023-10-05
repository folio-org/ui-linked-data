import { memo } from 'react';
import './DuplicateGroup.scss';

export const DuplicateGroup = memo(() => (
  <button data-testid="id-duplicate-group" className="duplicate-group">
    <span>+</span>
  </button>
));
