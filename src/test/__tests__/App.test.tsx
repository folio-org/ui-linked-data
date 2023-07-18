import { App } from '../../App';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('App', () => {
  beforeEach(() => render(<App okapi={{ token: 'token', tenant: 'tenant', url: 'url' }} />))

  test('renders Nav component', () => {
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  test('renders Main (default) component', () => {
    expect(screen.getByTestId('main')).toBeInTheDocument();
  });
})
