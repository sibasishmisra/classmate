'use client';

interface ChalkboardSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ChalkboardSection Component
 * 
 * A container component that applies the nostalgic chalkboard aesthetic
 * with texture background, noise overlay, and radial gradient for depth.
 * 
 * Features:
 * - Chalkboard texture background (#1a1a1a)
 * - Subtle noise overlay for authenticity
 * - Radial gradient for visual depth
 * - WCAG 2.1 AA contrast compliance
 * 
 * @param children - Content to be displayed on the chalkboard
 * @param className - Additional CSS classes for customization
 */
export default function ChalkboardSection({ children, className = '' }: ChalkboardSectionProps) {
  return (
    <section
      className={`chalkboard ${className}`}
      role="region"
      aria-label="Chalkboard content area"
    >
      {children}
    </section>
  );
}
