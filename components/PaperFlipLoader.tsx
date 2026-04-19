'use client';

/**
 * PaperFlipLoader Component
 * 
 * A nostalgic loading animation that simulates a notebook page flipping.
 * Creates a 3D flip effect with paper-cream colored element.
 * 
 * Features:
 * - 3D flip animation
 * - Paper texture aesthetic
 * - Customizable size
 * - Accessible with ARIA labels
 * - Optional loading text
 * 
 * Validates: Requirements 8.2
 * 
 * @param size - Size variant: 'sm', 'md', 'lg'
 * @param className - Additional CSS classes
 * @param text - Optional loading text to display below loader
 */

interface PaperFlipLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function PaperFlipLoader({
  size = 'md',
  className = '',
  text
}: PaperFlipLoaderProps) {
  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-15 h-20',
    lg: 'w-20 h-28'
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`paper-loader ${sizeClasses[size]} bg-paper-cream rounded border border-ruled-line shadow-paper`}
        style={{ transformStyle: 'preserve-3d' }}
        aria-hidden="true"
      />
      {text && (
        <span className="text-ink-black text-base font-ui">
          {text}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
