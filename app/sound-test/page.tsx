'use client';

import { soundManager, SOUND_IDS } from '@/lib/sound-manager';
import { useEffect, useState } from 'react';

export default function SoundTestPage() {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [soundStatus, setSoundStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    // Force preload
    soundManager.preloadSounds();
    soundManager.enable();
    setIsPreloaded(true);
  }, []);

  const testSound = (soundId: string) => {
    console.log(`Testing sound: ${soundId}`);
    soundManager.play(soundId);
    setSoundStatus(prev => ({ ...prev, [soundId]: 'Playing...' }));
    setTimeout(() => {
      setSoundStatus(prev => ({ ...prev, [soundId]: 'Done' }));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">🔊 Sound Test Page</h1>
        
        <div className="mb-6">
          <p className="text-lg mb-2">
            Status: {isPreloaded ? '✅ Sounds Preloaded' : '⏳ Loading...'}
          </p>
          <p className="text-sm text-gray-600">
            Click any button below to test sounds. Make sure your volume is up!
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => testSound(SOUND_IDS.BELL_SOFT)}
            className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-left"
          >
            <div className="flex justify-between items-center">
              <span>🔔 Bell Soft</span>
              <span className="text-sm">{soundStatus[SOUND_IDS.BELL_SOFT] || ''}</span>
            </div>
          </button>

          <button
            onClick={() => testSound(SOUND_IDS.PAGE_TURN)}
            className="w-full px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-left"
          >
            <div className="flex justify-between items-center">
              <span>📄 Page Turn</span>
              <span className="text-sm">{soundStatus[SOUND_IDS.PAGE_TURN] || ''}</span>
            </div>
          </button>

          <button
            onClick={() => testSound(SOUND_IDS.CHALK_TAP)}
            className="w-full px-6 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-left"
          >
            <div className="flex justify-between items-center">
              <span>✏️ Chalk Tap</span>
              <span className="text-sm">{soundStatus[SOUND_IDS.CHALK_TAP] || ''}</span>
            </div>
          </button>

          <button
            onClick={() => testSound(SOUND_IDS.SUCCESS_CHIME)}
            className="w-full px-6 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-left"
          >
            <div className="flex justify-between items-center">
              <span>⭐ Success Chime</span>
              <span className="text-sm">{soundStatus[SOUND_IDS.SUCCESS_CHIME] || ''}</span>
            </div>
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold mb-2">Troubleshooting:</h2>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Check your device volume</li>
            <li>• Make sure browser isn't muted</li>
            <li>• Check browser console for errors (F12)</li>
            <li>• Try clicking a button to unlock audio</li>
          </ul>
        </div>

        <div className="mt-6">
          <a
            href="/"
            className="text-blue-500 hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
