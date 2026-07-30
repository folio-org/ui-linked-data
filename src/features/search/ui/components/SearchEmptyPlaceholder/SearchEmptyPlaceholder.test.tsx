import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

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

  describe('accessibility', () => {
    test.each([
      ['no props', {}],
      ['custom labelId', { labelId: 'ld.enterSearchCriteria' }],
      ['custom className', { className: 'custom-class' }],
      ['labelId and className', { labelId: 'ld.noResults', className: 'custom-empty' }],
    ])('has no accessibility violations when %s', async (_description, props) => {
      const { container } = render(<SearchEmptyPlaceholder {...props} />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
