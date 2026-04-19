/**
 * ChalkDustButton component
 * Button with canvas-based chalk dust particle effect on click
 * Validates: Requirements 6.3, 6.6, 10.7
 */

'use client';

import { useRef } from 'react';
import { useChalkDust } from '@/lib/hooks/useChalkDust';
import { triggerLightHaptic } from '@/lib/haptic-feedback';
import { soundManager, SOUND_IDS } from '@/lib/sound-manager';

interface ChalkDustButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * Button component with chalk dust particle effect
 * Triggers particles and haptic feedback on click
 */
export default function ChalkDustButton({
  children,
  className = '',
  onClick,
  ...props
}: ChalkDustButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { canvasRef, triggerChalkDust } = useChalkDust();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Play chalk tap sound
    soundManager.play(SOUND_IDS.CHALK_TAP);

    // Trigger chalk dust effect
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      triggerChalkDust(x, y);
    }

    // Trigger light haptic feedback on mobile
    triggerLightHaptic();

    // Call original onClick handler
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Handle Enter and Space keys for keyboard navigation
    if (e.key === 'Enter' || e.key === ' ') {
      // Trigger light haptic feedback
      triggerLightHaptic();
      
      // Trigger chalk dust effect at center of button
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        const x = rect.width / 2;
        const y = rect.height / 2;
        triggerChalkDust(x, y);
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      className={`relative ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {/* Canvas for chalk dust particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
