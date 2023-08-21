import { App } from '@src/App';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  beforeEach(() => render(<App />));

  test('renders Nav component', () => {
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  test('renders Main (default) component', () => {
    expect(screen.getByTestId('main')).toBeInTheDocument();
  });
});
