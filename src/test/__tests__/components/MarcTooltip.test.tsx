import { IntlProvider } from 'react-intl';

import { fireEvent, render, screen } from '@testing-library/react';

import { MarcMapping, MarcTooltip, MarcTooltipProps } from '@/components/MarcTooltip';

const renderMarcTooltip = (props: MarcTooltipProps) =>
  render(
    <IntlProvider locale="en">
      <MarcTooltip {...props} />
    </IntlProvider>,
  );

describe('MarcTooltip', () => {
  test('renders nothing if mapping is undefined', () => {
    renderMarcTooltip({ mapping: undefined });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('renders nothing if mapping is empty', () => {
    renderMarcTooltip({ mapping: {} });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('renders tooltip icon and content', async () => {
    const mapping: MarcMapping = {
      Title: '245 $a',
      Author: '100 $a',
    };

    renderMarcTooltip({ mapping });

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText('Title:')).toBeInTheDocument();
    expect(screen.getByText('245 $a')).toBeInTheDocument();
    expect(screen.getByText('Author:')).toBeInTheDocument();
    expect(screen.getByText('100 $a')).toBeInTheDocument();
  });

  test('applies custom className and htmlId', () => {
    const mapping: MarcMapping = { Title: '245 $a' };

    renderMarcTooltip({ mapping, className: 'custom-class', htmlId: 'custom-id' });

    const button = screen.getByRole('button');
    expect(button.parentElement).toHaveClass('custom-class');
    expect(button).toHaveAttribute('data-testid', expect.stringContaining('custom-id'));
  });
});
