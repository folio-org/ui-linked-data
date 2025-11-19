import { render, screen } from '@testing-library/react';
import { HubLinkFormatter } from '@/features/complexLookup/formatters/Hub/HubLink';

describe('HubLinkFormatter', () => {
  const defaultRow = {
    __meta: {
      id: 'test_id_123',
    },
    hub: {
      label: 'Test Hub Label',
      uri: 'test_hub_url',
    },
  };

  test('renders link when both title and URI are present', () => {
    render(<HubLinkFormatter row={defaultRow} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Test Hub Label');
    expect(link).toHaveAttribute('href', 'test_hub_url');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('has correct CSS class and test id', () => {
    render(<HubLinkFormatter row={defaultRow} />);

    const link = screen.getByTestId('hub-link-test_id_123');
    expect(link).toHaveClass('hub-link');
  });

  test('renders span when title is missing', () => {
    const rowWithoutTitle = {
      ...defaultRow,
      hub: {
        label: '',
        uri: 'test_hub_url',
      },
    };

    const { container } = render(<HubLinkFormatter row={rowWithoutTitle} />);

    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span?.tagName.toLowerCase()).toBe('span');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('renders span when URI is missing', () => {
    const rowWithoutUri = {
      ...defaultRow,
      hub: {
        label: 'Test Hub Label',
        uri: '',
      },
    };

    render(<HubLinkFormatter row={rowWithoutUri} />);

    const span = screen.getByText('Test Hub Label');
    expect(span.tagName.toLowerCase()).toBe('span');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('renders span when both title and URI are missing', () => {
    const rowWithoutData = {
      ...defaultRow,
      hub: {
        label: '',
        uri: '',
      },
    };

    const { container } = render(<HubLinkFormatter row={rowWithoutData} />);

    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span?.tagName.toLowerCase()).toBe('span');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('handles undefined hub data', () => {
    const rowWithUndefinedHub = {
      ...defaultRow,
      hub: {
        label: undefined,
        uri: undefined,
      },
    };

    const { container } = render(<HubLinkFormatter row={rowWithUndefinedHub} />);

    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span?.tagName.toLowerCase()).toBe('span');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('renders title only in span when URI is undefined but title exists', () => {
    const rowWithTitleOnly = {
      ...defaultRow,
      hub: {
        label: 'Title Only',
        uri: undefined,
      },
    };

    render(<HubLinkFormatter row={rowWithTitleOnly} />);

    const span = screen.getByText('Title Only');
    expect(span.tagName.toLowerCase()).toBe('span');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('creates link when URI exists but title is undefined', () => {
    const rowWithUriOnly = {
      ...defaultRow,
      hub: {
        label: undefined,
        uri: 'test_hub_url_2',
      },
    };

    const { container } = render(<HubLinkFormatter row={rowWithUriOnly} />);

    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span?.tagName.toLowerCase()).toBe('span');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
