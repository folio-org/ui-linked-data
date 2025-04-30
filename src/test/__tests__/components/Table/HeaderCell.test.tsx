import { render, screen, fireEvent } from '@testing-library/react';
import { Cell } from '@components/Table';
import { HeaderCell } from '@components/Table/HeaderCell';

describe('HeaderCell', () => {
  const defaultProps = {
    elementType: 'th' as const,
    cellKey: 'test',
    header: { test: 'value' } as Cell,
    label: 'Test Header',
  };

  const renderHeaderCell = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };

    return render(<HeaderCell {...mergedProps} />);
  };

  const getHeaderCell = (testId = `${defaultProps.elementType}-${defaultProps.cellKey}`) => screen.getByTestId(testId);

  const getHeaderCellWrapper = () => getHeaderCell().querySelector('.table-header-contents-wrapper');

  const expectElementType = (elementType: 'th' | 'td') => {
    renderHeaderCell({ elementType });

    expect(getHeaderCell(`${elementType}-${defaultProps.cellKey}`).tagName).toBe(elementType.toUpperCase());
  };

  const expectLabel = (label: string | JSX.Element | undefined) => {
    renderHeaderCell({ label });

    if (typeof label === 'string') {
      expect(screen.getByText(label)).toBeInTheDocument();
    } else if (label === undefined) {
      expect(getHeaderCellWrapper()).toHaveTextContent('');
    } else {
      expect(screen.getByTestId('jsx-label')).toBeInTheDocument();
    }
  };

  const expectClickBehavior = (onHeaderCellClick?: jest.Mock) => {
    renderHeaderCell({ onHeaderCellClick });

    fireEvent.click(getHeaderCell());

    if (onHeaderCellClick) {
      expect(onHeaderCellClick).toHaveBeenCalledWith({ test: 'value' });
    }
  };

  const expectStyling = (props: any, expectedClass: string) => {
    renderHeaderCell(props);

    expect(getHeaderCell()).toHaveClass(expectedClass);
  };

  describe('rendering and styling', () => {
    test('renders as th element by default', () => {
      expectElementType('th');
    });

    test('renders as td when specified', () => {
      expectElementType('td');
    });

    test('displays the label text', () => {
      expectLabel('Test Header');
    });

    test('renders JSX Element label', () => {
      const jsxLabel = <span data-testid="jsx-label">JSX Label</span>;

      expectLabel(jsxLabel);
    });

    test('renders empty when no label provided', () => {
      expectLabel(undefined);
    });

    test('applies clickable class when onHeaderCellClick is provided', () => {
      expectStyling({ onHeaderCellClick: () => {} }, 'clickable');
    });

    test('applies custom className', () => {
      expectStyling({ className: 'custom-class' }, 'custom-class');
    });

    test('has table-header-contents-wrapper class on inner div', () => {
      renderHeaderCell();

      expect(getHeaderCell().firstChild).toHaveClass('table-header-contents-wrapper');
    });
  });

  describe('click handling', () => {
    test('calls onHeaderCellClick with correct data when clicked', () => {
      expectClickBehavior(jest.fn());
    });

    test('does not throw when clicked without onHeaderCellClick', () => {
      expect(() => expectClickBehavior()).not.toThrow();
    });
  });
});
