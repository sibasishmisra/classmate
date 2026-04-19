/**
 * LevelCard Component Usage Example
 * 
 * This file demonstrates how to use the LevelCard component
 * in the ClassMate.info application.
 */

'use client';

import { useState } from 'react';
import LevelCard from './LevelCard';
import type { LearningLevel } from '@/types';

export default function LevelCardExample() {
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel | null>(null);

  const levels: Array<{ level: LearningLevel; ageRange: string }> = [
    { level: 1, ageRange: '9-10' },
    { level: 2, ageRange: '10-11' },
    { level: 3, ageRange: '11-12' },
    { level: 4, ageRange: '12-13' },
    { level: 5, ageRange: '13-14' },
    { level: 6, ageRange: '14+' },
  ];

  const handleLevelSelect = (level: LearningLevel) => {
    setSelectedLevel(level);
    console.log(`Selected level: ${level}`);
  };

  return (
    <div className="min-h-screen bg-paper-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-ink-black mb-8 text-center font-ui">
          Select Your Learning Level
        </h1>
        
        {/* Level Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {levels.map(({ level, ageRange }) => (
            <LevelCard
              key={level}
              level={level}
              ageRange={ageRange}
              selected={selectedLevel === level}
              onClick={handleLevelSelect}
            />
          ))}
        </div>

        {/* Selected Level Display */}
        {selectedLevel && (
          <div className="text-center p-6 bg-paper-cream rounded-lg border-2 border-ruled-line">
            <p className="text-lg font-body text-ink-black">
              You selected <strong>Level {selectedLevel}</strong> for ages{' '}
              <strong>{levels.find(l => l.level === selectedLevel)?.ageRange}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
