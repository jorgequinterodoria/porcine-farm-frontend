import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showRetry?: boolean;
  className?: string;
}

/**
 * Error boundary component for graceful error handling
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (import.meta.env.PROD) {
      // TODO: Integrate with error monitoring service
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center p-6 max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Algo salió mal
            </h2>
            
            <p className="text-gray-600 text-sm mb-6">
              Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
            </p>

            <div className="space-y-3">
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Ver detalles del error
                </summary>
                <div className="mt-3 p-3 bg-gray-50 rounded text-left">
                  <div className="text-xs font-mono text-gray-700 break-all">
                    {this.state.error?.message || 'Error desconocido'}
                  </div>
                  {import.meta.env.DEV && this.state.error?.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-500">
                        Stack trace
                      </summary>
                      <pre className="text-xs text-gray-600 mt-2 overflow-auto bg-gray-100 p-2 rounded">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </details>

              {this.props.showRetry && (
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Hook for handling async errors in function components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    console.error('Caught error:', error);
    setError(error);
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      // TODO: Integrate with error monitoring service
    }
  }, []);

  return { captureError, resetError, error };
};

/**
 * Simple hook for async operations with error handling
 */
export const useAsyncOperation = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { captureError } = useErrorHandler();

  const execute = React.useCallback(
    async <T,>(operation: () => Promise<T>): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await operation();
        setLoading(false);
        return result;
      } catch (err) {
        setLoading(false);
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        captureError(error);
        return null;
      }
    },
    [captureError]
  );

  return { execute, loading, error, resetError: () => setError(null) };
};