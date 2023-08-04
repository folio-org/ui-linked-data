import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@components/ErrorBoundary';

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
});
