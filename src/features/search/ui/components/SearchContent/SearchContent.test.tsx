import { render, screen } from '@testing-library/react';

import { DOM_ELEMENTS } from '@/common/constants/domElementsIdentifiers.constants';

import { SearchContent } from './SearchContent';

describe('SearchContent', () => {
  test('renders children within the component', () => {
    render(
      <SearchContent>
        <div data-testid="test-child">Test Content</div>
      </SearchContent>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies correct className from DOM_ELEMENTS', () => {
    const { container } = render(
      <SearchContent>
        <div>Content</div>
      </SearchContent>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(DOM_ELEMENTS.classNames.itemSearchContent);
  });

  test('renders multiple children', () => {
    render(
      <SearchContent>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
        <div data-testid="child-3">Third Child</div>
      </SearchContent>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  test('renders with no children', () => {
    const { container } = render(<SearchContent>{null}</SearchContent>);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass(DOM_ELEMENTS.classNames.itemSearchContent);
  });
});
