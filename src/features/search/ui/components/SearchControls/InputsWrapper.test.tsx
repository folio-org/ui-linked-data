import { render, screen } from '@testing-library/react';

import { InputsWrapper } from './InputsWrapper';

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    mode: 'auto',
    activeUIConfig: {
      features: {
        hasSearchBy: true,
        hasQueryInput: true,
      },
    },
  }),
}));

jest.mock('./SearchBySelect', () => ({
  SearchBySelect: () => <select data-testid="search-by-select">SearchBy</select>,
}));

jest.mock('./QueryInput', () => ({
  QueryInput: () => <input data-testid="query-input" />,
}));

describe('InputsWrapper', () => {
  test('renders wrapper with inputs class', () => {
    const { container } = render(<InputsWrapper />);

    const wrapper = container.querySelector('.inputs');
    expect(wrapper).toBeInTheDocument();
  });

  test('renders SearchBySelect when hasSearchBy is true', () => {
    render(<InputsWrapper />);

    expect(screen.getByTestId('search-by-select')).toBeInTheDocument();
  });

  test('renders QueryInput when hasQueryInput is true', () => {
    render(<InputsWrapper />);

    expect(screen.getByTestId('query-input')).toBeInTheDocument();
  });

  test('renders both SearchBySelect and QueryInput in auto mode', () => {
    render(<InputsWrapper />);

    expect(screen.getByTestId('search-by-select')).toBeInTheDocument();
    expect(screen.getByTestId('query-input')).toBeInTheDocument();
  });

  test('wrapper has correct structure', () => {
    const { container } = render(<InputsWrapper />);

    const wrapper = container.querySelector('.inputs');
    expect(wrapper?.tagName).toBe('DIV');
  });
});
