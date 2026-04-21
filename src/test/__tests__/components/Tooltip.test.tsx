import { fireEvent, render, screen } from '@testing-library/react';

import { Tooltip } from '@/components/Tooltip';

describe('Tooltip', () => {
  const triggerContent = <span>Trigger</span>;
  const tooltipContent = <div>Tooltip Content</div>;
  const ariaLabelOpen = 'Show tooltip';
  const ariaLabelClose = 'Hide tooltip';

  test('renders trigger button', () => {
    render(
      <Tooltip
        content={tooltipContent}
        triggerContent={triggerContent}
        triggerOpenAriaLabel={ariaLabelOpen}
        triggerCloseAriaLabel={ariaLabelClose}
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabelOpen });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-testid', 'tooltip-trigger');
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });

  test('shows tooltip content on click', () => {
    render(
      <Tooltip
        content={tooltipContent}
        triggerContent={triggerContent}
        triggerOpenAriaLabel={ariaLabelOpen}
        triggerCloseAriaLabel={ariaLabelClose}
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabelOpen });

    fireEvent.click(button);
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-trigger__content')).toBeInTheDocument();
  });

  test('hides tooltip content on second click', () => {
    render(
      <Tooltip
        content={tooltipContent}
        triggerContent={triggerContent}
        triggerOpenAriaLabel={ariaLabelOpen}
        triggerCloseAriaLabel={ariaLabelClose}
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabelOpen });

    fireEvent.click(button);
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: ariaLabelClose }));
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });

  test('hides tooltip when clicking outside', () => {
    render(
      <div>
        <Tooltip
          content={tooltipContent}
          triggerContent={triggerContent}
          triggerOpenAriaLabel={ariaLabelOpen}
          triggerCloseAriaLabel={ariaLabelClose}
          data-testid="tooltip-trigger"
        />
        <button data-testid="outside">Outside</button>
      </div>,
    );

    const button = screen.getByRole('button', { name: ariaLabelOpen });

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
        triggerOpenAriaLabel={ariaLabelOpen}
        triggerCloseAriaLabel={ariaLabelClose}
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabelOpen });

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
        triggerOpenAriaLabel={ariaLabelOpen}
        triggerCloseAriaLabel={ariaLabelClose}
        className="custom-trigger"
        contentClassName="custom-content"
        data-testid="tooltip-trigger"
      />,
    );

    const button = screen.getByRole('button', { name: ariaLabelOpen });

    expect(button.parentElement).toHaveClass('custom-trigger');
    fireEvent.click(button);
    expect(screen.getByTestId('tooltip-trigger__content')).toHaveClass('custom-content');
  });
});
