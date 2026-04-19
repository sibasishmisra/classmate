'use client';

import ChalkSpinner from './ChalkSpinner';
import PaperFlipLoader from './PaperFlipLoader';

/**
 * LoadingSpinner Component
 * 
 * A unified loading spinner component that provides themed loading animations
 * for API calls and other async operations. Supports two nostalgic variants:
 * - chalk: Chalk writing spinner (default)
 * - paper: Paper flip loader
 * 
 * Features:
 * - Multiple animation variants
 * - Customizable size
 * - Optional loading text
 * - Accessible with ARIA labels
 * - Respects reduced motion preferences
 * 
 * Validates: Requirements 8.2
 * 
 * @param variant - Animation type: 'chalk' or 'paper'
 * @param size - Size variant: 'sm', 'md', 'lg'
 * @param text - Optional loading text
 * @param className - Additional CSS classes
 */

interface LoadingSpinnerProps {
  variant?: 'chalk' | 'paper';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  variant = 'chalk',
  size = 'md',
  text,
  className = ''
}: LoadingSpinnerProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If reduced motion is preferred, show static indicator
  if (prefersReducedMotion) {
    return (
      <div 
        className={`flex flex-col items-center justify-center gap-3 ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="text-4xl" aria-hidden="true">
          {variant === 'chalk' ? '✏️' : '📄'}
        </div>
        {text && (
          <span className="text-base font-ui text-ink-black">
            {text}
          </span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Render appropriate spinner variant
  if (variant === 'paper') {
    return <PaperFlipLoader size={size} text={text} className={className} />;
  }

  return <ChalkSpinner size={size} text={text} className={className} />;
}
