import { fireEvent, render, screen } from '@testing-library/react';

import { AuthorityLabelFormatter } from './AuthorityLabelFormatter';

describe('AuthorityLabelFormatter', () => {
  const makeRow = (label: string, id = 'auth-1'): SearchResultsTableRow => ({
    __meta: { id, key: id, isAnchor: false },
    label: { label },
  });

  it('renders an empty span when title is absent', () => {
    const { container } = render(<AuthorityLabelFormatter row={makeRow('')} />);

    expect(container.querySelector('span')).toBeInTheDocument();
    expect(container.querySelector('span')).toBeEmptyDOMElement();
  });

  it('renders a button with the title text when title is present', () => {
    render(<AuthorityLabelFormatter row={makeRow('Shakespeare, William', 'auth-42')} />);

    const button = screen.getByRole('button', { name: 'Shakespeare, William' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('authority-link');
  });

  it('sets correct data-testid based on row id', () => {
    render(<AuthorityLabelFormatter row={makeRow('Some Title', 'auth-99')} />);

    expect(screen.getByTestId('authority-preview-link-auth-99')).toBeInTheDocument();
  });

  it('button is clickable without errors', () => {
    render(<AuthorityLabelFormatter row={makeRow('Clickable Title', 'auth-1')} />);

    const button = screen.getByRole('button');
    expect(() => fireEvent.click(button)).not.toThrow();
  });
});
