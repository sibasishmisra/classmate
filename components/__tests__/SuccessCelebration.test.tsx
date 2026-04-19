import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessCelebration from '../SuccessCelebration';
import { soundManager } from '@/lib/sound-manager';

// Mock the sound manager
jest.mock('@/lib/sound-manager', () => ({
  soundManager: {
    play: jest.fn(),
  },
  SOUND_IDS: {
    SUCCESS_CHIME: 'success-chime',
  },
}));

// Mock matchMedia for prefers-reduced-motion
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
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

describe('SuccessCelebration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMatchMedia(false); // Default: no reduced motion
  });

  it('should not render when trigger is false', () => {
    render(<SuccessCelebration trigger={false} />);
    expect(screen.queryByTestId('success-celebration')).not.toBeInTheDocument();
  });

  it('should render celebration elements when triggered', () => {
    render(<SuccessCelebration trigger={true} />);
    expect(screen.getByTestId('success-celebration')).toBeInTheDocument();
  });

  it('should play success chime sound when triggered', () => {
    render(<SuccessCelebration trigger={true} />);
    expect(soundManager.play).toHaveBeenCalledWith('success-chime');
  });

  it('should not render when prefers-reduced-motion is enabled', () => {
    mockMatchMedia(true); // Enable reduced motion
    render(<SuccessCelebration trigger={true} />);
    expect(screen.queryByTestId('success-celebration')).not.toBeInTheDocument();
  });

  it('should call onComplete callback after animation duration', async () => {
    const onComplete = jest.fn();
    render(<SuccessCelebration trigger={true} onComplete={onComplete} />);

    // Wait for animation to complete (2 seconds + buffer)
    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalled();
      },
      { timeout: 2500 }
    );
  });

  it('should have proper accessibility attributes', () => {
    render(<SuccessCelebration trigger={true} />);
    const celebration = screen.getByTestId('success-celebration');
    
    expect(celebration).toHaveAttribute('aria-live', 'polite');
    expect(celebration).toHaveAttribute('aria-label', 'Celebration animation');
  });

  it('should render school-themed emojis', () => {
    const { container } = render(<SuccessCelebration trigger={true} />);
    const celebration = container.querySelector('[data-testid="success-celebration"]');
    
    expect(celebration).toBeInTheDocument();
    // Check that celebration elements are rendered (emojis are in divs)
    const emojiElements = celebration?.querySelectorAll('div[aria-hidden="true"]');
    expect(emojiElements).toBeTruthy();
    expect(emojiElements!.length).toBeGreaterThan(0);
  });

  it('should be pointer-events-none to not block interactions', () => {
    render(<SuccessCelebration trigger={true} />);
    const celebration = screen.getByTestId('success-celebration');
    
    expect(celebration).toHaveClass('pointer-events-none');
  });

  it('should have z-50 to appear above other content', () => {
    render(<SuccessCelebration trigger={true} />);
    const celebration = screen.getByTestId('success-celebration');
    
    expect(celebration).toHaveClass('z-50');
  });
});
