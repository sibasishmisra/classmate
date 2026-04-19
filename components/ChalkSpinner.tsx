'use client';

/**
 * ChalkSpinner Component
 * 
 * A nostalgic loading spinner that simulates chalk writing on a chalkboard.
 * Uses a circular spinner with chalk-white color to match the school theme.
 * 
 * Features:
 * - Circular spinning animation
 * - Chalk-white color scheme
 * - Customizable size
 * - Accessible with ARIA labels
 * - Optional loading text
 * 
 * Validates: Requirements 8.2
 * 
 * @param size - Size variant: 'sm' (24px), 'md' (40px), 'lg' (60px)
 * @param className - Additional CSS classes
 * @param text - Optional loading text to display below spinner
 */

interface ChalkSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function ChalkSpinner({
  size = 'md',
  className = '',
  text
}: ChalkSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-15 h-15 border-4'
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`chalk-spinner ${sizeClasses[size]} border-transparent border-t-chalk-white rounded-full animate-spin`}
        aria-hidden="true"
      />
      {text && (
        <span className="chalk-text text-base font-ui">
          {text}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
