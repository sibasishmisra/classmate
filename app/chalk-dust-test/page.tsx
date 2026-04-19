/**
 * Chalk Dust Particle System Test Page
 * Visual demonstration of canvas-based particle effects
 */

'use client';

import { useRef } from 'react';
import { useChalkDust } from '@/lib/hooks/useChalkDust';
import ChalkDustButton from '@/components/ChalkDustButton';
import LevelCard from '@/components/LevelCard';
import type { LearningLevel } from '@/types';

export default function ChalkDustTestPage() {
  const testAreaRef = useRef<HTMLDivElement>(null);
  const { canvasRef, triggerChalkDust } = useChalkDust();

  const handleTestAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = testAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerChalkDust(x, y);
  };

  return (
    <div className="min-h-screen bg-paper-cream p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-ink-black mb-2">
            Chalk Dust Particle System Test
          </h1>
          <p className="text-chalk-gray">
            Canvas-based particle animations for nostalgic interactions
          </p>
        </header>

        {/* Test Area */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink-black">
            Interactive Test Area
          </h2>
          <div
            ref={testAreaRef}
            onClick={handleTestAreaClick}
            className="relative bg-chalkboard-black rounded-lg p-12 cursor-pointer border-2 border-chalk-gray"
            style={{ minHeight: '300px' }}
          >
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            />
            <div className="relative z-10 text-center">
              <p className="chalk-text text-xl">
                Click anywhere to create chalk dust particles!
              </p>
              <p className="chalk-text text-sm mt-4 opacity-75">
                Particles: 8 on desktop, 4 on mobile
              </p>
              <p className="chalk-text text-sm opacity-75">
                Respects prefers-reduced-motion
              </p>
            </div>
          </div>
        </section>

        {/* Level Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink-black">
            Level Cards with Chalk Dust
          </h2>
          <p className="text-chalk-gray">
            Hover over cards to see chalk dust effect
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <LevelCard
                key={level}
                level={level as LearningLevel}
                ageRange={`${8 + level}-${9 + level}`}
                onClick={() => console.log(`Level ${level} clicked`)}
              />
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink-black">
            Buttons with Chalk Dust
          </h2>
          <p className="text-chalk-gray">
            Click buttons to see chalk dust effect
          </p>
          <div className="flex flex-wrap gap-4">
            <ChalkDustButton
              className="submit-button"
              onClick={() => console.log('Button 1 clicked')}
            >
              Primary Button
            </ChalkDustButton>
            <ChalkDustButton
              className="submit-button"
              onClick={() => console.log('Button 2 clicked')}
            >
              Secondary Button
            </ChalkDustButton>
            <ChalkDustButton
              className="submit-button"
              disabled
            >
              Disabled Button
            </ChalkDustButton>
          </div>
        </section>

        {/* Implementation Details */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink-black">
            Implementation Details
          </h2>
          <div className="bg-white rounded-lg p-6 border border-ruled-line">
            <ul className="space-y-2 text-ink-black">
              <li>✅ Canvas-based particle animation</li>
              <li>✅ Triggers on level card hover and button clicks</li>
              <li>✅ 8 particles on desktop (≥768px)</li>
              <li>✅ 4 particles on mobile (&lt;768px)</li>
              <li>✅ Respects prefers-reduced-motion</li>
              <li>✅ Smooth 60fps animation with requestAnimationFrame</li>
              <li>✅ Gravity and velocity physics</li>
              <li>✅ Automatic cleanup when particles fade out</li>
            </ul>
          </div>
        </section>

        {/* Requirements Validation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink-black">
            Requirements Validation
          </h2>
          <div className="bg-white rounded-lg p-6 border border-ruled-line">
            <ul className="space-y-2 text-ink-black">
              <li>
                <strong>Requirement 6.3:</strong> Smooth transition effects within 50ms on hover
              </li>
              <li>
                <strong>Requirement 10.7:</strong> Animations respect prefers-reduced-motion
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
