'use client';

import React, { useState } from 'react';
import TypewriterText from './TypewriterText';

/**
 * Example usage of the TypewriterText component
 * 
 * This example demonstrates:
 * - Basic typewriter animation
 * - Custom speed control
 * - Completion callback
 * - Skip functionality
 * - Reduced motion support
 */
export default function TypewriterTextExample() {
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(30);
  const [currentExample, setCurrentExample] = useState(0);

  const examples = [
    {
      title: 'Short Text',
      text: 'The sky is blue!',
    },
    {
      title: 'Medium Explanation',
      text: 'The sky appears blue because of a phenomenon called Rayleigh scattering. When sunlight enters Earth\'s atmosphere, it collides with air molecules.',
    },
    {
      title: 'Multi-line Text',
      text: `Why is the sky blue?

The sky appears blue because of Rayleigh scattering.

When sunlight enters Earth's atmosphere, it collides with air molecules. Blue light has a shorter wavelength and gets scattered more than other colors.`,
    },
    {
      title: 'Long Explanation',
      text: 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar. This process is essential for life on Earth because it produces the oxygen we breathe and forms the base of the food chain. Plants have special structures called chloroplasts that contain chlorophyll, a green pigment that captures light energy.',
    },
  ];

  const handleComplete = () => {
    setIsComplete(true);
    console.log('Animation completed!');
  };

  const handleNextExample = () => {
    setIsComplete(false);
    setCurrentExample((prev) => (prev + 1) % examples.length);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
    setIsComplete(false);
    // Force re-render by changing example
    setCurrentExample((prev) => prev);
  };

  return (
    <div className="min-h-screen bg-paper-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-ui text-ink-black">
            TypewriterText Component Examples
          </h1>
          <p className="text-chalk-gray font-ui">
            Demonstrating typewriter animation with chalk text styling
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-paper p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="speed" className="block font-ui font-semibold text-ink-black">
              Animation Speed: {speed}ms per character
            </label>
            <input
              id="speed"
              type="range"
              min="10"
              max="100"
              step="10"
              value={speed}
              onChange={handleSpeedChange}
              className="w-full"
            />
            <p className="text-sm text-chalk-gray font-ui">
              Adjust the slider to change animation speed
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleNextExample}
              className="submit-button"
            >
              Next Example ({currentExample + 1}/{examples.length})
            </button>
            {isComplete && (
              <span className="flex items-center text-success-green font-ui font-semibold">
                ✓ Animation Complete
              </span>
            )}
          </div>
        </div>

        {/* Current Example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-ui text-ink-black">
            {examples[currentExample].title}
          </h2>

          {/* Chalkboard Display */}
          <div className="chalkboard rounded-lg p-8 min-h-[300px]">
            <TypewriterText
              key={`${currentExample}-${speed}`}
              text={examples[currentExample].text}
              speed={speed}
              onComplete={handleComplete}
              className="text-lg leading-relaxed"
            />
          </div>

          <p className="text-sm text-chalk-gray font-ui italic">
            💡 Tip: Click on the text to skip the animation
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-lg shadow-paper p-6 space-y-4">
          <h3 className="text-lg font-semibold font-ui text-ink-black">
            Component Features
          </h3>
          <ul className="space-y-2 font-ui text-ink-black">
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Character-by-character animation at configurable speed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Click anywhere to skip animation and show full text</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Respects prefers-reduced-motion (instant display)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Chalk text styling with cream color and text shadow</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Lora serif font for readability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Blinking cursor during animation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Completion callback support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Full accessibility with ARIA attributes</span>
            </li>
          </ul>
        </div>

        {/* Code Example */}
        <div className="bg-ink-black rounded-lg p-6 overflow-x-auto">
          <pre className="text-chalk-white font-mono text-sm">
            <code>{`<TypewriterText
  text="Your explanation text here..."
  speed={30}
  onComplete={() => console.log('Done!')}
  className="text-lg"
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
