import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useUIStore } from '@/store';
import { ControlPane } from './ControlPane';

jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

const renderWithIntl = (component: React.ReactNode) => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('ControlPane', () => {
  const mockSetIsSearchPaneCollapsed = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);
  });

  it('renders children when provided', () => {
    renderWithIntl(
      <ControlPane>
        <div data-testid="test-child">Test Child</div>
      </ControlPane>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    const label = 'Test Label';
    renderWithIntl(<ControlPane label={label} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders subLabel when showSubLabel is true', () => {
    const subLabel = <span>Test SubLabel</span>;
    renderWithIntl(<ControlPane label="Test Label" subLabel={subLabel} showSubLabel={true} />);

    expect(screen.getByText('Test SubLabel')).toBeInTheDocument();
  });

  it('does not render subLabel when showSubLabel is false', () => {
    const subLabel = <span>Test SubLabel</span>;
    renderWithIntl(<ControlPane subLabel={subLabel} showSubLabel={false} />);

    expect(screen.queryByText('Test SubLabel')).not.toBeInTheDocument();
  });

  it('renders close button when renderCloseButton is provided', () => {
    const renderCloseButton = () => <button data-testid="close-button">Close</button>;
    renderWithIntl(<ControlPane renderCloseButton={renderCloseButton} />);

    expect(screen.getByTestId('close-button')).toBeInTheDocument();
  });

  it('renders open button when pane is collapsed', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: true,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    renderWithIntl(<ControlPane />);

    const openButton = screen.getByRole('button');
    expect(openButton).toBeInTheDocument();
  });

  it('expands pane when open button is clicked', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: true,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    renderWithIntl(<ControlPane />);

    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);

    expect(mockSetIsSearchPaneCollapsed).toHaveBeenCalledWith(false);
  });

  it('does not render open button when pane is not collapsed', () => {
    renderWithIntl(<ControlPane />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders label as ReactElement', () => {
    const label = <span data-testid="custom-label">Custom Label</span>;
    renderWithIntl(<ControlPane label={label} />);

    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = renderWithIntl(<ControlPane label="Test" />);
    const controlPane = container.querySelector('.search-control-pane');

    expect(controlPane).toBeInTheDocument();
  });
});
