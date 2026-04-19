'use client';

import { useRef } from 'react';
import type { LearningLevel } from '@/types';
import { useChalkDust } from '@/lib/hooks/useChalkDust';
import { triggerLightHaptic } from '@/lib/haptic-feedback';

interface LevelCardProps {
  level: LearningLevel;
  ageRange: string;
  selected?: boolean;
  onClick: (level: LearningLevel) => void;
}

export default function LevelCard({ level, ageRange, selected = false, onClick }: LevelCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const { canvasRef, triggerChalkDust } = useChalkDust();

  const createChalkDust = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    triggerChalkDust(x, y);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createChalkDust(e);
    
    // Trigger light haptic feedback on button press
    triggerLightHaptic();
    
    onClick(level);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Handle Enter and Space keys for keyboard navigation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      
      // Trigger light haptic feedback
      triggerLightHaptic();
      
      onClick(level);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selected) {
      createChalkDust(e);
    }
  };

  const handleMouseLeave = () => {
    // Mouse leave handler
  };

  return (
    <button
      ref={cardRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`level-card ${selected ? 'selected' : ''} relative min-h-[44px] min-w-[44px] touch-manipulation`}
      aria-label={`Select level ${level} for ages ${ageRange}`}
      aria-pressed={selected}
      type="button"
    >
      {/* Canvas for chalk dust particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-0">
        <div className="chalk-text text-xl sm:text-2xl font-bold">
          Level {level}
        </div>
        <div className="chalk-text text-xs sm:text-sm opacity-90">
          Age {ageRange}
        </div>
      </div>

      {/* Gold border indicator for selected state */}
      {selected && (
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: '0 0 0 3px var(--accent-gold)',
          }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
