import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FriendlyErrorDisplay from '../FriendlyErrorDisplay';

describe('FriendlyErrorDisplay', () => {
  it('should render with title and message', () => {
    render(
      <FriendlyErrorDisplay
        title="Test Error"
        message="This is a test error message"
      />
    );

    expect(screen.getByText('Test Error')).toBeInTheDocument();
    expect(screen.getByText('This is a test error message')).toBeInTheDocument();
  });

  it('should display default icon when no icon provided', () => {
    render(
      <FriendlyErrorDisplay
        title="Test Error"
        message="Test message"
      />
    );

    const icon = screen.getByRole('img', { name: 'Error icon' });
    expect(icon).toHaveTextContent('📝');
  });

  it('should display custom icon when provided', () => {
    render(
      <FriendlyErrorDisplay
        title="Network Error"
        message="Can't reach the classroom"
        icon="📡"
      />
    );

    const icon = screen.getByRole('img', { name: 'Error icon' });
    expect(icon).toHaveTextContent('📡');
  });

  it('should render action buttons', () => {
    const mockRetry = jest.fn();
    const mockGoBack = jest.fn();

    render(
      <FriendlyErrorDisplay
        title="Test Error"
        message="Test message"
        actions={[
          { label: 'Try Again', onClick: mockRetry },
          { label: 'Go Back', onClick: mockGoBack }
        ]}
      />
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('should call action onClick handlers', () => {
    const mockRetry = jest.fn();
    const mockGoBack = jest.fn();

    render(
      <FriendlyErrorDisplay
        title="Test Error"
        message="Test message"
        actions={[
          { label: 'Try Again', onClick: mockRetry },
          { label: 'Go Back', onClick: mockGoBack }
        ]}
      />
    );

    fireEvent.click(screen.getByText('Try Again'));
    expect(mockRetry).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Go Back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('should render without actions', () => {
    render(
      <FriendlyErrorDisplay
        title="Test Error"
        message="Test message"
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <FriendlyErrorDisplay
        title="Test Error"
        message="Test message"
      />
    );

    const errorDisplay = screen.getByTestId('friendly-error-display');
    expect(errorDisplay).toHaveAttribute('role', 'alert');
    expect(errorDisplay).toHaveAttribute('aria-live', 'assertive');
    expect(errorDisplay).toHaveAttribute('aria-atomic', 'true');
  });

  it('should apply default style', () => {
    render(
      <FriendlyErrorDisplay
        title="Test Error"
        message="Test message"
        style="default"
      />
    );

    const errorDisplay = screen.getByTestId('friendly-error-display');
    expect(errorDisplay).toHaveStyle({ border: '2px dashed var(--error-red)' });
  });

  it('should apply gentle-redirect style', () => {
    render(
      <FriendlyErrorDisplay
        title="Let's learn about something else"
        message="That topic isn't quite right"
        style="gentle-redirect"
      />
    );

    const errorDisplay = screen.getByTestId('friendly-error-display');
    expect(errorDisplay).toHaveStyle({ border: '2px dashed var(--accent-blue)' });
  });

  it('should have minimum touch target size for buttons', () => {
    const mockAction = jest.fn();

    render(
      <FriendlyErrorDisplay
        title="Test Error"
        message="Test message"
        actions={[{ label: 'Try Again', onClick: mockAction }]}
      />
    );

    const button = screen.getByText('Try Again');
    const styles = window.getComputedStyle(button);
    
    // Check inline styles
    expect(button).toHaveStyle({ minHeight: '44px', minWidth: '44px' });
  });

  describe('Network Error Scenario', () => {
    it('should display network error with appropriate styling', () => {
      const mockRetry = jest.fn();
      const mockGoBack = jest.fn();

      render(
        <FriendlyErrorDisplay
          title="Can't reach the classroom right now"
          message="Check your internet connection and try again."
          icon="📡"
          actions={[
            { label: 'Try Again', onClick: mockRetry },
            { label: 'Go Back', onClick: mockGoBack }
          ]}
        />
      );

      expect(screen.getByText("Can't reach the classroom right now")).toBeInTheDocument();
      expect(screen.getByText('Check your internet connection and try again.')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Error icon' })).toHaveTextContent('📡');
    });
  });

  describe('API Error Scenarios', () => {
    it('should display rate limit error', () => {
      render(
        <FriendlyErrorDisplay
          title="The classroom is full right now"
          message="Too many students learning at once! Try again in 60 seconds."
          icon="⏰"
        />
      );

      expect(screen.getByText('The classroom is full right now')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Error icon' })).toHaveTextContent('⏰');
    });

    it('should display service unavailable error', () => {
      render(
        <FriendlyErrorDisplay
          title="School's temporarily closed"
          message="The service is under maintenance. Check back soon!"
          icon="🔧"
        />
      );

      expect(screen.getByText("School's temporarily closed")).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Error icon' })).toHaveTextContent('🔧');
    });
  });

  describe('Content Safety Error Scenario', () => {
    it('should display content safety error with gentle-redirect style', () => {
      const mockClearAndFocus = jest.fn();

      render(
        <FriendlyErrorDisplay
          title="Let's learn about something else"
          message="That topic isn't quite right for our classroom. Try asking about something different!"
          icon="📚"
          style="gentle-redirect"
          actions={[
            { label: 'Try Another Topic', onClick: mockClearAndFocus }
          ]}
        />
      );

      expect(screen.getByText("Let's learn about something else")).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Error icon' })).toHaveTextContent('📚');
      
      const errorDisplay = screen.getByTestId('friendly-error-display');
      expect(errorDisplay).toHaveStyle({ border: '2px dashed var(--accent-blue)' });
    });
  });
});
