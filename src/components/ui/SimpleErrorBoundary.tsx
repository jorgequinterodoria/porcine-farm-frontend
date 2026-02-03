import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  showRetry?: boolean;
}

/**
 * Simple error boundary component for graceful error handling
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught an error:', error);
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      // TODO: Integrate with error monitoring service
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
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
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for handling errors in function components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    console.error('Caught error:', error);
    setError(error);
  }, []);

  return { captureError, resetError, error };
};

/**
 * Loading state hook
 */
export const useLoadingState = () => {
  const [loading, setLoading] = React.useState(false);

  const execute = React.useCallback(async <T,>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      const result = await operation();
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      throw error;
    }
  }, []);

  return { execute, loading, setLoading };
};