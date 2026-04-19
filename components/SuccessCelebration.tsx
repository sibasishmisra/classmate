'use client';

import { useEffect, useRef, useState } from 'react';
import { soundManager, SOUND_IDS } from '@/lib/sound-manager';

interface SuccessCelebrationProps {
  /** Whether to trigger the celebration animation */
  trigger: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
}

interface CelebrationElement {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  opacity: number;
}

// School-themed celebration elements
const CELEBRATION_EMOJIS = ['⭐', '📚', '✏️', '🎓'];

/**
 * SuccessCelebration Component
 * 
 * Displays a confetti-style celebration animation with school-themed elements.
 * Triggered after viewing both follow-up questions.
 * 
 * Features:
 * - Confetti-style animation with school-themed elements (⭐📚✏️🎓)
 * - Triggers after viewing both follow-up questions
 * - Plays optional success-chime sound
 * - Respects prefers-reduced-motion
 * - Fades out after 2 seconds
 * 
 * Validates: Requirements 6.1
 * 
 * @param trigger - Whether to trigger the celebration
 * @param onComplete - Callback when animation completes
 */
export default function SuccessCelebration({
  trigger,
  onComplete
}: SuccessCelebrationProps) {
  const [isActive, setIsActive] = useState(false);
  const [elements, setElements] = useState<CelebrationElement[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    if (!trigger || prefersReducedMotion) return;

    // Play success chime sound
    soundManager.play(SOUND_IDS.SUCCESS_CHIME);

    // Create celebration elements
    const newElements: CelebrationElement[] = [];
    const elementCount = 20; // Number of confetti pieces

    for (let i = 0; i < elementCount; i++) {
      newElements.push({
        id: i,
        emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
        x: Math.random() * 100, // Percentage
        y: -10, // Start above viewport
        vx: (Math.random() - 0.5) * 2, // Horizontal velocity
        vy: Math.random() * 2 + 1, // Vertical velocity (downward)
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        scale: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
        opacity: 1
      });
    }

    setElements(newElements);
    setIsActive(true);
    startTimeRef.current = Date.now();

    // Start animation loop
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const duration = 2000; // 2 seconds

      if (elapsed >= duration) {
        // Animation complete
        setIsActive(false);
        setElements([]);
        if (onComplete) onComplete();
        return;
      }

      // Update element positions
      setElements(prevElements =>
        prevElements.map(el => ({
          ...el,
          x: el.x + el.vx * 0.5,
          y: el.y + el.vy,
          rotation: el.rotation + el.rotationSpeed,
          opacity: Math.max(0, 1 - elapsed / duration) // Fade out
        }))
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger, prefersReducedMotion, onComplete]);

  if (!isActive || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-live="polite"
      aria-label="Celebration animation"
      data-testid="success-celebration"
    >
      {elements.map(el => (
        <div
          key={el.id}
          className="absolute text-3xl"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            transform: `rotate(${el.rotation}deg) scale(${el.scale})`,
            opacity: el.opacity,
            transition: 'none'
          }}
          aria-hidden="true"
        >
          {el.emoji}
        </div>
      ))}
    </div>
  );
}
