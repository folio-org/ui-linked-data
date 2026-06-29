import { render, screen } from '@testing-library/react';

import { AuthoritySourceFormatter } from './AuthoritySourceFormatter';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

const makeRow = (overrides: Partial<SearchResultsTableRow> = {}): SearchResultsTableRow => ({
  __meta: { id: 'auth-1', key: 'key-1', isAnchor: false, isLD: false, ...overrides.__meta },
  source: { label: '' },
  ...overrides,
});

describe('AuthoritySourceFormatter', () => {
  it('renders nothing visible when label is empty', () => {
    const { container } = render(<AuthoritySourceFormatter row={makeRow()} />);

    expect(container.querySelector('span')).toBeInTheDocument();
    expect(container.querySelector('span')).toBeEmptyDOMElement();
  });

  it('renders FormattedMessage for LD authorities', () => {
    const row = makeRow({
      __meta: { id: 'ld-1', key: 'k', isAnchor: false, isLD: true },
      source: { label: 'ld.source.linkedData' },
    });

    render(<AuthoritySourceFormatter row={row} />);

    expect(screen.getByText('ld.source.linkedData')).toBeInTheDocument();
  });

  it('renders plain text for MARC authorities', () => {
    const row = makeRow({
      __meta: { id: 'marc-1', key: 'k', isAnchor: false, isLD: false },
      source: { label: 'LC Name Authority File' },
    });

    render(<AuthoritySourceFormatter row={row} />);

    expect(screen.getByText('LC Name Authority File')).toBeInTheDocument();
  });

  it('renders a plain span (not FormattedMessage) for MARC authorities', () => {
    const row = makeRow({
      __meta: { id: 'marc-2', key: 'k', isAnchor: false, isLD: false },
      source: { label: 'MeSH' },
    });

    const { container } = render(<AuthoritySourceFormatter row={row} />);

    expect(container.querySelector('span')).toHaveTextContent('MeSH');
  });
});
