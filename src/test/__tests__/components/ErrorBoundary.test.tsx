import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from '../../../components/ErrorBoundary';

describe('Error Boundary', () => {
  test('renders Error Boundary component', () => {
    // Arrange
    // TODO: mock Error service
    console.error = jest.fn();
    const ThrowError = () => {
      throw new Error('Test error boundary');
    };

    // Act
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    // Assert
    expect(screen.getByTestId('errorBoundary')).toBeInTheDocument();
  });
});
