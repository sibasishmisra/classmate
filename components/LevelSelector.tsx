'use client';

import LevelCard from './LevelCard';
import { soundManager, SOUND_IDS } from '@/lib/sound-manager';
import { triggerMediumHaptic } from '@/lib/haptic-feedback';
import type { LearningLevel } from '@/types';

interface LevelSelectorProps {
  onLevelSelect: (level: LearningLevel) => void;
  selectedLevel?: LearningLevel;
}

const LEVEL_DATA: Array<{ level: LearningLevel; ageRange: string }> = [
  { level: 1, ageRange: '9' },
  { level: 2, ageRange: '10' },
  { level: 3, ageRange: '11' },
  { level: 4, ageRange: '12' },
  { level: 5, ageRange: '13' },
  { level: 6, ageRange: '14' },
];

export default function LevelSelector({ onLevelSelect, selectedLevel }: LevelSelectorProps) {
  const handleLevelClick = (level: LearningLevel) => {
    // Play optional school bell sound
    soundManager.play(SOUND_IDS.BELL_SOFT);
    
    // Play page turn sound after a short delay
    setTimeout(() => {
      soundManager.play(SOUND_IDS.PAGE_TURN);
    }, 400); // Delay to play after bell sound
    
    // Trigger medium haptic feedback on mobile
    triggerMediumHaptic();
    
    // Call the parent callback
    onLevelSelect(level);
  };

  return (
    <div className="level-selector w-full max-w-4xl mx-auto px-4" role="group" aria-label="Learning level selection">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {LEVEL_DATA.map(({ level, ageRange }) => (
          <LevelCard
            key={level}
            level={level}
            ageRange={ageRange}
            selected={selectedLevel === level}
            onClick={handleLevelClick}
          />
        ))}
      </div>
    </div>
  );
}
