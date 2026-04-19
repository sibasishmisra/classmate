'use client';

import { useState } from 'react';
import LevelSelector from './LevelSelector';
import type { LearningLevel } from '@/types';

/**
 * Example usage of the LevelSelector component
 * Demonstrates basic integration and state management
 */
export default function LevelSelectorExample() {
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel | undefined>();

  const handleLevelSelect = (level: LearningLevel) => {
    console.log('Level selected:', level);
    setSelectedLevel(level);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          LevelSelector Component Example
        </h1>

        {/* Display current selection */}
        <div className="text-center mb-8">
          {selectedLevel ? (
            <p className="text-xl text-white">
              Selected Level: <span className="text-yellow-400 font-bold">{selectedLevel}</span>
              {' '}(Age {8 + selectedLevel})
            </p>
          ) : (
            <p className="text-xl text-gray-400">
              No level selected yet
            </p>
          )}
        </div>

        {/* LevelSelector Component */}
        <LevelSelector
          onLevelSelect={handleLevelSelect}
          selectedLevel={selectedLevel}
        />

        {/* Reset button */}
        {selectedLevel && (
          <div className="text-center mt-8">
            <button
              onClick={() => setSelectedLevel(undefined)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset Selection
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Component Features:
          </h2>
          <ul className="text-gray-300 space-y-2">
            <li>✓ 6 level cards for ages 9-14</li>
            <li>✓ Responsive grid (2 cols mobile, 3 cols desktop)</li>
            <li>✓ Optional school bell sound on selection</li>
            <li>✓ Visual feedback with chalk dust particles</li>
            <li>✓ Selected state highlighting</li>
            <li>✓ Accessible keyboard navigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
