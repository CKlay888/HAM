'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Error Message */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              😵 页面出错了
            </h2>
            <p className="text-gray-500 mb-6">
              别担心，这不是你的问题。请尝试刷新页面或稍后再试。
            </p>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-700 text-sm font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:opacity-90"
              >
                重试
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Simple error display component
interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ 
  title = '加载失败', 
  message = '请稍后重试',
  onRetry 
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-5xl mb-4">😵</div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
        >
          重试
        </button>
      )}
    </div>
  );
}
