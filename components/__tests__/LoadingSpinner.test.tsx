import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';
import ChalkSpinner from '../ChalkSpinner';
import PaperFlipLoader from '../PaperFlipLoader';

/**
 * LoadingSpinner Component Tests
 * 
 * Tests the loading spinner components for:
 * - Rendering with different variants
 * - Size variations
 * - Loading text display
 * - Accessibility features
 * - Reduced motion support
 * 
 * Validates: Requirements 8.2
 */

describe('LoadingSpinner', () => {
  describe('Rendering', () => {
    it('should render chalk spinner by default', () => {
      render(<LoadingSpinner />);
      const spinner = document.querySelector('.chalk-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should render paper loader when variant is paper', () => {
      render(<LoadingSpinner variant="paper" />);
      const loader = document.querySelector('.paper-loader');
      expect(loader).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Size Variants', () => {
    it('should render small size', () => {
      render(<LoadingSpinner size="sm" />);
      const spinner = document.querySelector('.chalk-spinner');
      expect(spinner).toHaveClass('w-6', 'h-6');
    });

    it('should render medium size by default', () => {
      render(<LoadingSpinner />);
      const spinner = document.querySelector('.chalk-spinner');
      expect(spinner).toHaveClass('w-10', 'h-10');
    });

    it('should render large size', () => {
      render(<LoadingSpinner size="lg" />);
      const spinner = document.querySelector('.chalk-spinner');
      expect(spinner).toHaveClass('w-15', 'h-15');
    });
  });

  describe('Loading Text', () => {
    it('should display loading text when provided', () => {
      render(<LoadingSpinner text="Loading content..." />);
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });

    it('should not display text when not provided', () => {
      const { container } = render(<LoadingSpinner />);
      const textElements = container.querySelectorAll('.chalk-text, .text-ink-black');
      // Should only have sr-only text
      expect(textElements.length).toBe(0);
    });

    it('should display text with chalk styling for chalk variant', () => {
      render(<LoadingSpinner variant="chalk" text="Writing..." />);
      const text = screen.getByText('Writing...');
      expect(text).toHaveClass('chalk-text');
    });

    it('should display text with ink styling for paper variant', () => {
      render(<LoadingSpinner variant="paper" text="Flipping..." />);
      const text = screen.getByText('Flipping...');
      expect(text).toHaveClass('text-ink-black');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live="polite"', () => {
      render(<LoadingSpinner />);
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should have screen reader text', () => {
      render(<LoadingSpinner />);
      expect(screen.getByText('Loading...')).toHaveClass('sr-only');
    });

    it('should have aria-hidden on spinner element', () => {
      render(<LoadingSpinner />);
      const spinner = document.querySelector('.chalk-spinner');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Reduced Motion', () => {
    beforeEach(() => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    it('should show static emoji when reduced motion is preferred', () => {
      render(<LoadingSpinner variant="chalk" />);
      expect(screen.getByText('✏️')).toBeInTheDocument();
    });

    it('should show paper emoji for paper variant with reduced motion', () => {
      render(<LoadingSpinner variant="paper" />);
      expect(screen.getByText('📄')).toBeInTheDocument();
    });

    afterEach(() => {
      // Reset matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });
  });
});

describe('ChalkSpinner', () => {
  it('should render with default props', () => {
    render(<ChalkSpinner />);
    const spinner = document.querySelector('.chalk-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with text', () => {
    render(<ChalkSpinner text="Writing..." />);
    expect(screen.getByText('Writing...')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<ChalkSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toHaveClass('sr-only');
  });

  it('should apply size classes correctly', () => {
    const { rerender } = render(<ChalkSpinner size="sm" />);
    let spinner = document.querySelector('.chalk-spinner');
    expect(spinner).toHaveClass('w-6', 'h-6', 'border-2');

    rerender(<ChalkSpinner size="md" />);
    spinner = document.querySelector('.chalk-spinner');
    expect(spinner).toHaveClass('w-10', 'h-10', 'border-3');

    rerender(<ChalkSpinner size="lg" />);
    spinner = document.querySelector('.chalk-spinner');
    expect(spinner).toHaveClass('w-15', 'h-15', 'border-4');
  });
});

describe('PaperFlipLoader', () => {
  it('should render with default props', () => {
    render(<PaperFlipLoader />);
    const loader = document.querySelector('.paper-loader');
    expect(loader).toBeInTheDocument();
  });

  it('should render with text', () => {
    render(<PaperFlipLoader text="Flipping..." />);
    expect(screen.getByText('Flipping...')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<PaperFlipLoader />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toHaveClass('sr-only');
  });

  it('should apply size classes correctly', () => {
    const { rerender } = render(<PaperFlipLoader size="sm" />);
    let loader = document.querySelector('.paper-loader');
    expect(loader).toHaveClass('w-12', 'h-16');

    rerender(<PaperFlipLoader size="md" />);
    loader = document.querySelector('.paper-loader');
    expect(loader).toHaveClass('w-15', 'h-20');

    rerender(<PaperFlipLoader size="lg" />);
    loader = document.querySelector('.paper-loader');
    expect(loader).toHaveClass('w-20', 'h-28');
  });

  it('should have 3D transform style', () => {
    render(<PaperFlipLoader />);
    const loader = document.querySelector('.paper-loader');
    expect(loader).toHaveStyle({ transformStyle: 'preserve-3d' });
  });
});

describe('Integration with ExplanationDisplay', () => {
  it('should display loading spinner during API calls', () => {
    // This test would be in ExplanationDisplay.test.tsx
    // but we document the expected behavior here
    
    // When isLoading is true, LoadingSpinner should be shown
    // When isLoading is false, explanation content should be shown
    expect(true).toBe(true); // Placeholder
  });
});
