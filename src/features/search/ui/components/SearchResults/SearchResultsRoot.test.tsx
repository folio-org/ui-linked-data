import { render, screen } from '@testing-library/react';
import { SearchResultsRoot } from './SearchResultsRoot';

describe('SearchResultsRoot', () => {
  test('renders children within the component', () => {
    render(
      <SearchResultsRoot>
        <div data-testid="test-child">Test Results</div>
      </SearchResultsRoot>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Results')).toBeInTheDocument();
  });

  test('renders as fragment when no className provided', () => {
    const { container } = render(
      <SearchResultsRoot>
        <div>Content</div>
      </SearchResultsRoot>,
    );

    expect(container.firstChild).toContainHTML('Content');
  });

  test('applies custom className when provided', () => {
    const { container } = render(
      <SearchResultsRoot className="custom-class">
        <div>Content</div>
      </SearchResultsRoot>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  test('renders multiple children', () => {
    render(
      <SearchResultsRoot>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </SearchResultsRoot>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  test('renders with no children', () => {
    const { container } = render(<SearchResultsRoot />);

    expect(container.firstChild).toBeNull();
  });

  test('renders with multiple custom classes', () => {
    const { container } = render(
      <SearchResultsRoot className="class-one class-two">
        <div>Content</div>
      </SearchResultsRoot>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('class-one');
    expect(wrapper).toHaveClass('class-two');
  });
});
