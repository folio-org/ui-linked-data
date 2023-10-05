import { render, screen } from '@testing-library/react';
import { DuplicateGroup } from '@components/DuplicateGroup';

describe('DuplicateGroup', () => {
  beforeEach(() => {
    render(<DuplicateGroup />);
  });

  test('renders DuplicateGroup component', () => {
    expect(screen.getByTestId('id-duplicate-group')).toBeInTheDocument();
  });
});
