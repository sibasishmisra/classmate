import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TypewriterText from '../TypewriterText';

// Mock matchMedia for reduced motion testing
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('TypewriterText Component', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
    // Default: motion is NOT reduced
    mockMatchMedia(false);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render with empty text initially during animation', () => {
      render(<TypewriterText text="Hello World" />);
      
      const container = screen.getByRole('article');
      expect(container).toBeInTheDocument();
      // Initially empty or just starting
      expect(container.textContent).toBe('');
    });

    it('should apply chalk-text styling class', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      expect(container).toHaveClass('chalk-text');
    });

    it('should apply typewriter class', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      expect(container).toHaveClass('typewriter');
    });

    it('should apply custom className if provided', () => {
      render(<TypewriterText text="Test" className="custom-class" />);
      
      const container = screen.getByRole('article');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Typewriter Animation (30ms per character)', () => {
    it('should display text character by character at 30ms intervals', async () => {
      const text = 'Hello';
      render(<TypewriterText text={text} speed={30} />);
      
      const container = screen.getByRole('article');
      
      // Initially empty
      expect(container.textContent).toBe('');
      
      // After 30ms: 'H'
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('H');
      });
      
      // After 60ms: 'He'
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('He');
      });
      
      // After 90ms: 'Hel'
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('Hel');
      });
      
      // After 120ms: 'Hell'
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('Hell');
      });
      
      // After 150ms: 'Hello'
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('Hello');
      });
    });

    it('should use default speed of 30ms when not specified', async () => {
      const text = 'Hi';
      render(<TypewriterText text={text} />);
      
      const container = screen.getByRole('article');
      
      // After 30ms: 'H'
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('H');
      });
      
      // After 60ms: 'Hi'
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('Hi');
      });
    });

    it('should display cursor during animation', () => {
      render(<TypewriterText text="Test" />);
      
      const cursor = document.querySelector('.typewriter-cursor');
      expect(cursor).toBeInTheDocument();
    });

    it('should remove cursor when animation completes', async () => {
      const text = 'Hi';
      render(<TypewriterText text={text} speed={30} />);
      
      // Complete the animation
      jest.advanceTimersByTime(30 * text.length);
      
      await waitFor(() => {
        const cursor = document.querySelector('.typewriter-cursor');
        expect(cursor).not.toBeInTheDocument();
      });
    });
  });

  describe('Skip Animation by Clicking', () => {
    it('should display full text immediately when clicked', async () => {
      const text = 'Hello World';
      render(<TypewriterText text={text} speed={30} />);
      
      const container = screen.getByRole('article');
      
      // Start animation
      jest.advanceTimersByTime(30);
      
      // Click to skip
      fireEvent.click(container);
      
      await waitFor(() => {
        expect(container.textContent).toContain(text);
      });
    });

    it('should call onComplete callback when skipped', async () => {
      const onComplete = jest.fn();
      const text = 'Test';
      render(<TypewriterText text={text} onComplete={onComplete} />);
      
      const container = screen.getByRole('article');
      
      // Click to skip
      fireEvent.click(container);
      
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });

    it('should remove cursor when skipped', async () => {
      const text = 'Test';
      render(<TypewriterText text={text} />);
      
      const container = screen.getByRole('article');
      
      // Click to skip
      fireEvent.click(container);
      
      await waitFor(() => {
        const cursor = document.querySelector('.typewriter-cursor');
        expect(cursor).not.toBeInTheDocument();
      });
    });

    it('should have cursor-pointer class during animation', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      expect(container).toHaveClass('cursor-pointer');
    });

    it('should not have cursor-pointer class after completion', async () => {
      const text = 'Hi';
      render(<TypewriterText text={text} speed={30} />);
      
      const container = screen.getByRole('article');
      
      // Complete animation
      jest.advanceTimersByTime(30 * text.length);
      
      await waitFor(() => {
        expect(container).not.toHaveClass('cursor-pointer');
      });
    });
  });

  describe('Prefers-Reduced-Motion Support', () => {
    it('should display full text immediately when prefers-reduced-motion is true', () => {
      mockMatchMedia(true);
      
      const text = 'Hello World';
      render(<TypewriterText text={text} />);
      
      const container = screen.getByRole('article');
      
      // Text should appear immediately
      expect(container.textContent).toBe(text);
    });

    it('should not display cursor when prefers-reduced-motion is true', () => {
      mockMatchMedia(true);
      
      render(<TypewriterText text="Test" />);
      
      const cursor = document.querySelector('.typewriter-cursor');
      expect(cursor).not.toBeInTheDocument();
    });

    it('should call onComplete immediately when prefers-reduced-motion is true', () => {
      mockMatchMedia(true);
      
      const onComplete = jest.fn();
      render(<TypewriterText text="Test" onComplete={onComplete} />);
      
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should not animate when prefers-reduced-motion is true', async () => {
      mockMatchMedia(true);
      
      const text = 'Hello';
      render(<TypewriterText text={text} />);
      
      const container = screen.getByRole('article');
      
      // Text should be complete immediately, no animation
      expect(container.textContent).toBe(text);
      
      // Advance timers - text should not change
      jest.advanceTimersByTime(1000);
      
      expect(container.textContent).toBe(text);
    });
  });

  describe('Chalk Text Styling', () => {
    it('should apply chalk-text class for cream color and text shadow', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      expect(container).toHaveClass('chalk-text');
    });

    it('should use Lora serif font via chalk-text class', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      // chalk-text class applies Lora font family
      expect(container).toHaveClass('chalk-text');
    });
  });

  describe('Text Wrapping and Formatting', () => {
    it('should preserve whitespace with pre-wrap', () => {
      const { container } = render(<TypewriterText text="Line 1\nLine 2" />);
      
      const textContainer = container.querySelector('[role="article"]');
      expect(textContainer).toHaveStyle({ whiteSpace: 'pre-wrap' });
    });

    it('should wrap words with word-wrap', () => {
      const { container } = render(<TypewriterText text="Test" />);
      
      const textContainer = container.querySelector('[role="article"]');
      expect(textContainer).toHaveStyle({ wordWrap: 'break-word' });
    });

    it('should handle multi-line text correctly', async () => {
      const text = 'Line 1\nLine 2\nLine 3';
      render(<TypewriterText text={text} speed={10} />);
      
      // Complete animation
      jest.advanceTimersByTime(10 * text.length);
      
      const container = screen.getByRole('article');
      await waitFor(() => {
        expect(container.textContent).toBe(text);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have role="article" for semantic meaning', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      expect(container).toBeInTheDocument();
    });

    it('should have aria-label for screen readers', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      expect(container).toHaveAttribute('aria-label', 'Explanation text');
    });

    it('should have aria-live="polite" for dynamic content', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('should hide cursor from screen readers with aria-hidden', () => {
      render(<TypewriterText text="Test" />);
      
      const cursor = document.querySelector('.typewriter-cursor');
      expect(cursor).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Completion Callback', () => {
    it('should call onComplete when animation finishes', async () => {
      const onComplete = jest.fn();
      const text = 'Hi';
      render(<TypewriterText text={text} speed={30} onComplete={onComplete} />);
      
      // Complete animation
      jest.advanceTimersByTime(30 * text.length);
      
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call onComplete multiple times', async () => {
      const onComplete = jest.fn();
      const text = 'Hi';
      render(<TypewriterText text={text} speed={30} onComplete={onComplete} />);
      
      // Complete animation
      jest.advanceTimersByTime(30 * text.length);
      
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
      
      // Advance more time
      jest.advanceTimersByTime(1000);
      
      // Should still be called only once
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should work without onComplete callback', async () => {
      const text = 'Hi';
      
      // Should not throw error
      expect(() => {
        render(<TypewriterText text={text} speed={30} />);
        jest.advanceTimersByTime(30 * text.length);
      }).not.toThrow();
    });
  });

  describe('Text Change Handling', () => {
    it('should reset animation when text changes', async () => {
      const { rerender } = render(<TypewriterText text="First" speed={30} />);
      
      // Start first animation
      jest.advanceTimersByTime(60);
      
      const container = screen.getByRole('article');
      await waitFor(() => {
        expect(container.textContent).toContain('Fi');
      });
      
      // Change text
      rerender(<TypewriterText text="Second" speed={30} />);
      
      // Animation should reset
      await waitFor(() => {
        expect(container.textContent).toBe('');
      });
      
      // New animation should start
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('S');
      });
    });
  });

  describe('Requirements Validation', () => {
    it('validates Requirement 3.7: Lora serif font for body text', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      // chalk-text class applies Lora serif font
      expect(container).toHaveClass('chalk-text');
    });

    it('validates Requirement 3.8: Chalk-style text with cream color', () => {
      render(<TypewriterText text="Test" />);
      
      const container = screen.getByRole('article');
      // chalk-text class applies cream color (#f5f5dc) and text shadow
      expect(container).toHaveClass('chalk-text');
    });

    it('validates Requirement 6.5: Typewriter animation at 30ms per character', async () => {
      const text = 'Test';
      render(<TypewriterText text={text} speed={30} />);
      
      const container = screen.getByRole('article');
      
      // Verify timing
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('T');
      });
      
      jest.advanceTimersByTime(30);
      await waitFor(() => {
        expect(container.textContent).toContain('Te');
      });
    });

    it('validates Requirement 10.7: Respects prefers-reduced-motion', () => {
      mockMatchMedia(true);
      
      const text = 'Hello World';
      render(<TypewriterText text={text} />);
      
      const container = screen.getByRole('article');
      
      // Should display instantly with no animation
      expect(container.textContent).toBe(text);
    });
  });
});
