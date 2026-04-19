/**
 * ChalkDustCanvas component
 * Canvas overlay for chalk dust particle effects
 * Validates: Requirements 6.3, 10.7
 */

'use client';

import { useChalkDust } from '@/lib/hooks/useChalkDust';
import type { ChalkDustOptions } from '@/lib/chalk-dust-particles';

interface ChalkDustCanvasProps {
  className?: string;
  onTrigger?: (x: number, y: number, options?: ChalkDustOptions) => void;
}

/**
 * Canvas component for rendering chalk dust particles
 * Should be positioned absolutely over the parent element
 */
export default function ChalkDustCanvas({ className = '' }: ChalkDustCanvasProps) {
  const { canvasRef } = useChalkDust();

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}

export { useChalkDust };
