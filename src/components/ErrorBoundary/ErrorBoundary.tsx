import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: log the error using Error service
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="errorBoundary">
          <h1>An error occurred. Please, reload the page.</h1>
        </div>
      );
    }

    return this.props.children;
  }
}
