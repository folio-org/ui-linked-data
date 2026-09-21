import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { ErrorBoundary } from '@/components/ErrorBoundary';

describe('Error Boundary', () => {
  test('renders Error Boundary component', () => {
    // TODO: mock Error service
    console.error = jest.fn();
    const ThrowError = () => {
      throw new Error('Test error boundary');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('errorBoundary')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    test('has no accessibility violations', async () => {
      console.error = jest.fn();
      const ThrowError = () => {
        throw new Error('Test error boundary');
      };

      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
