import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  const triggerContent = <span>Trigger</span>;
  const tooltipContent = <div>Tooltip Content</div>;
  const ariaLabel = 'Show tooltip';

  test('renders trigger button', () => {
    render(
      <Tooltip
        content={tooltipContent}
        triggerContent={triggerContent}
        triggerAriaLabel={ariaLabel}
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabel });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-testid', 'tooltip-trigger');
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });

  test('shows tooltip content on click', () => {
    render(
      <Tooltip
        content={tooltipContent}
        triggerContent={triggerContent}
        triggerAriaLabel={ariaLabel}
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabel });

    fireEvent.click(button);
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-trigger__content')).toBeInTheDocument();
  });

  test('hides tooltip content on second click', () => {
    render(
      <Tooltip
        content={tooltipContent}
        triggerContent={triggerContent}
        triggerAriaLabel={ariaLabel}
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabel });

    fireEvent.click(button);
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });

  test('hides tooltip when clicking outside', () => {
    render(
      <div>
        <Tooltip
          content={tooltipContent}
          triggerContent={triggerContent}
          triggerAriaLabel={ariaLabel}
          data-testid="tooltip-trigger"
        />
        <button data-testid="outside">Outside</button>
      </div>,
    );

    const button = screen.getByRole('button', { name: ariaLabel });

    fireEvent.click(button);
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });

  test('hides tooltip on Escape key', () => {
    render(
      <Tooltip
        content={tooltipContent}
        triggerContent={triggerContent}
        triggerAriaLabel={ariaLabel}
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabel });

    fireEvent.click(button);
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });

  test('applies custom class names', () => {
    render(
      <Tooltip
        content={tooltipContent}
        triggerContent={triggerContent}
        triggerAriaLabel={ariaLabel}
        className="custom-trigger"
        contentClassName="custom-content"
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabel });

    expect(button.parentElement).toHaveClass('custom-trigger');
    fireEvent.click(button);
    expect(screen.getByTestId('tooltip-trigger__content')).toHaveClass('custom-content');
  });
});
