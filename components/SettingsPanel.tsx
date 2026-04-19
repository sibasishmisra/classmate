'use client';

/**
 * SettingsPanel Component
 * 
 * Provides UI for toggling sound and animations settings.
 * Settings are persisted to localStorage via SettingsContext.
 * 
 * Features:
 * - Toggle sound effects on/off
 * - Toggle animations on/off
 * - Displays current reduced motion preference
 * - Nostalgic school-themed design
 * - Accessible with ARIA labels and keyboard navigation
 * 
 * Validates: Requirements 6.7
 */

import { useSettings } from '@/contexts/SettingsContext';

interface SettingsPanelProps {
  className?: string;
}

export default function SettingsPanel({ className = '' }: SettingsPanelProps) {
  const {
    soundEnabled,
    animationsEnabled,
    reducedMotion,
    toggleSound,
    toggleAnimations
  } = useSettings();

  return (
    <div 
      className={`settings-panel bg-paper-cream border-2 border-ruled-line rounded-lg p-6 shadow-paper ${className}`}
      role="region"
      aria-label="Settings"
    >
      {/* Header */}
      <h2 className="text-xl font-semibold text-ink-black mb-4 font-ui flex items-center gap-2">
        <span aria-hidden="true">⚙️</span>
        Settings
      </h2>

      {/* Settings Options */}
      <div className="space-y-4">
        {/* Sound Toggle */}
        <div className="flex items-center justify-between">
          <label 
            htmlFor="sound-toggle" 
            className="text-base text-ink-black font-ui cursor-pointer flex items-center gap-2"
          >
            <span aria-hidden="true">{soundEnabled ? '🔊' : '🔇'}</span>
            <span>Sound Effects</span>
          </label>
          <button
            id="sound-toggle"
            role="switch"
            aria-checked={soundEnabled}
            onClick={toggleSound}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2
              ${soundEnabled ? 'bg-accent-green' : 'bg-chalk-gray'}
            `}
            aria-label={`Sound effects are ${soundEnabled ? 'on' : 'off'}. Click to toggle.`}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}
              `}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Animations Toggle */}
        <div className="flex items-center justify-between">
          <label 
            htmlFor="animations-toggle" 
            className="text-base text-ink-black font-ui cursor-pointer flex items-center gap-2"
          >
            <span aria-hidden="true">{animationsEnabled ? '✨' : '⏸️'}</span>
            <span>Animations</span>
          </label>
          <button
            id="animations-toggle"
            role="switch"
            aria-checked={animationsEnabled}
            onClick={toggleAnimations}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2
              ${animationsEnabled ? 'bg-accent-green' : 'bg-chalk-gray'}
            `}
            aria-label={`Animations are ${animationsEnabled ? 'on' : 'off'}. Click to toggle.`}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${animationsEnabled ? 'translate-x-6' : 'translate-x-1'}
              `}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Reduced Motion Indicator (read-only) */}
        {reducedMotion && (
          <div className="mt-4 pt-4 border-t border-ruled-line">
            <p className="text-sm text-chalk-gray font-ui flex items-center gap-2">
              <span aria-hidden="true">ℹ️</span>
              <span>
                Your system prefers reduced motion. Animations are automatically minimized.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 pt-4 border-t border-ruled-line">
        <p className="text-xs text-chalk-gray font-ui">
          Your preferences are saved automatically and will persist across sessions.
        </p>
      </div>
    </div>
  );
}
