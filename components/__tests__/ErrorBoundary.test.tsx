import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    (console.error as jest.Mock).mockClear();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something unexpected happened')).toBeInTheDocument();
    expect(screen.getByText("Don't worry, let's start fresh and try again!")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Over' })).toBeInTheDocument();
  });

  it('displays friendly error display component', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('friendly-error-display')).toBeInTheDocument();
  });

  // Requirement 9.5: Log errors to browser console for debugging purposes
  it('logs errors to console when error is caught', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
    const errorCall = (console.error as jest.Mock).mock.calls.find(
      call => call[0] === 'ErrorBoundary caught an error:'
    );
    expect(errorCall).toBeDefined();
    expect(errorCall[1]).toBeInstanceOf(Error);
    expect(errorCall[1].message).toBe('Test error');
  });

  // Requirement 9.6: Provide clear, age-appropriate error messages
  it('displays age-appropriate error message', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check for friendly, encouraging language
    expect(screen.getByText('Oops! Something unexpected happened')).toBeInTheDocument();
    expect(screen.getByText("Don't worry, let's start fresh and try again!")).toBeInTheDocument();
    
    // Verify the message is encouraging and not technical
    const message = screen.getByText("Don't worry, let's start fresh and try again!");
    expect(message).toHaveClass('font-body');
  });

  // Requirement 9.6: Provide "Start Over" action
  it('provides Start Over action button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const startOverButton = screen.getByRole('button', { name: 'Start Over' });
    expect(startOverButton).toBeInTheDocument();
    expect(startOverButton).toBeEnabled();
    
    // Verify the button is clickable (doesn't throw)
    expect(() => fireEvent.click(startOverButton)).not.toThrow();
  });

  it('displays error icon', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check for the refresh/restart icon
    const icon = screen.getByRole('img', { name: 'Error icon' });
    expect(icon).toBeInTheDocument();
    expect(icon.textContent).toBe('🔄');
  });

  it('wraps error display in centered container', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const wrapper = container.querySelector('.min-h-screen.flex.items-center.justify-center');
    expect(wrapper).toBeInTheDocument();
  });
});
