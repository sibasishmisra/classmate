'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';
import FriendlyErrorDisplay from './FriendlyErrorDisplay';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary Component
 * 
 * Catches React errors and displays a friendly error message.
 * Provides a way to recover by reloading the page.
 * 
 * Validates: Requirements 9.5, 9.6, 9.7
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <FriendlyErrorDisplay
            title="Oops! Something unexpected happened"
            message="Don't worry, let's start fresh and try again!"
            icon="🔄"
            actions={[
              {
                label: 'Start Over',
                onClick: () => {
                  this.setState({ hasError: false });
                  window.location.href = '/';
                }
              }
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
