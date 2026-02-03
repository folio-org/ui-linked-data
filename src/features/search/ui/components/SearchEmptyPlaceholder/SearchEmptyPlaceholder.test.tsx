import { render, screen } from '@testing-library/react';

import { SearchEmptyPlaceholder } from './SearchEmptyPlaceholder';

jest.mock('@/assets/general-search.svg?react', () => ({
  __esModule: true,
  default: () => <div data-testid="general-search-icon">GeneralSearchIcon</div>,
}));

describe('SearchEmptyPlaceholder', () => {
  test('renders with custom labelId', () => {
    render(<SearchEmptyPlaceholder labelId="ld.enterSearchCriteria" />);

    expect(screen.getByTestId('general-search-icon')).toBeInTheDocument();
    expect(screen.getByText('ld.enterSearchCriteria')).toBeInTheDocument();
  });

  test('renders with custom className', () => {
    const { container } = render(<SearchEmptyPlaceholder className="custom-class" />);

    const placeholderDiv = container.querySelector('.empty-placeholder');
    expect(placeholderDiv).toHaveClass('custom-class');
  });

  test('renders with both labelId and className', () => {
    const { container } = render(<SearchEmptyPlaceholder labelId="ld.noResults" className="custom-empty" />);

    expect(screen.getByTestId('general-search-icon')).toBeInTheDocument();
    expect(screen.getByText('ld.noResults')).toBeInTheDocument();

    const placeholderDiv = container.querySelector('.empty-placeholder');
    expect(placeholderDiv).toHaveClass('custom-empty');
  });

  test('applies default empty-placeholder className', () => {
    const { container } = render(<SearchEmptyPlaceholder />);

    const placeholderDiv = container.querySelector('.empty-placeholder');
    expect(placeholderDiv).toBeInTheDocument();
  });
});
