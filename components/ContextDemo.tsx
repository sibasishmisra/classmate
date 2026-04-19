'use client';

/**
 * Demo component to verify context providers work correctly
 * This can be used for manual testing during development
 */

import { useSession, useSettings } from '@/contexts';
import { soundManager, SOUND_IDS } from '@/lib/sound-manager';
import { useEffect } from 'react';

export function ContextDemo() {
  const { level, setLevel, history, isLoading, error } = useSession();
  const { soundEnabled, animationsEnabled, reducedMotion, toggleSound, toggleAnimations } = useSettings();

  // Preload sounds on mount
  useEffect(() => {
    soundManager.preloadSounds();
  }, []);

  // Sync sound manager with settings
  useEffect(() => {
    if (soundEnabled) {
      soundManager.enable();
    } else {
      soundManager.disable();
    }
  }, [soundEnabled]);

  return (
    <div className="p-8 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Session Context Demo</h2>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Current Level: {level || 'Not selected'}</p>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5, 6].map(l => (
                <button
                  key={l}
                  onClick={() => {
                    setLevel(l as any);
                    soundManager.play(SOUND_IDS.BELL_SOFT);
                  }}
                  className={`px-4 py-2 rounded ${
                    level === l
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Level {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold">History Count: {history.length}</p>
            <p className="text-sm text-gray-600">Max 10 entries</p>
          </div>

          <div>
            <p className="font-semibold">Loading: {isLoading ? 'Yes' : 'No'}</p>
            {error && <p className="text-red-500">Error: {error}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Settings Context Demo</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Sound Enabled:</span>
            <button
              onClick={() => {
                toggleSound();
                if (!soundEnabled) {
                  soundManager.play(SOUND_IDS.CHALK_TAP);
                }
              }}
              className={`px-4 py-2 rounded ${
                soundEnabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Animations Enabled:</span>
            <button
              onClick={toggleAnimations}
              className={`px-4 py-2 rounded ${
                animationsEnabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300'
              }`}
            >
              {animationsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Reduced Motion:</span>
            <span className={`px-4 py-2 rounded ${
              reducedMotion
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200'
            }`}>
              {reducedMotion ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Sound Manager Demo</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => soundManager.play(SOUND_IDS.BELL_SOFT)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Bell
          </button>
          <button
            onClick={() => soundManager.play(SOUND_IDS.PAGE_TURN)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Page Turn
          </button>
          <button
            onClick={() => soundManager.play(SOUND_IDS.CHALK_TAP)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Chalk Tap
          </button>
          <button
            onClick={() => soundManager.play(SOUND_IDS.SUCCESS_CHIME)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Success
          </button>
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          Note: Sound files need to be added to /public/sounds/ directory
        </p>
      </div>
    </div>
  );
}
