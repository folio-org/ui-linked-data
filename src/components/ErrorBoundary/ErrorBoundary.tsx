import { Component, ErrorInfo, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

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
          <h1>
            <FormattedMessage id="marva.app-fail" />
          </h1>
        </div>
      );
    }

    return this.props.children;
  }
}
