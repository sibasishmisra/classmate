'use client';

import { useState } from 'react';
import SuccessCelebration from './SuccessCelebration';

/**
 * Example usage of the SuccessCelebration component
 * 
 * This example demonstrates:
 * - Manual trigger via button
 * - Automatic re-trigger capability
 * - onComplete callback
 */
export default function SuccessCelebrationExample() {
  const [trigger, setTrigger] = useState(false);
  const [celebrationCount, setCelebrationCount] = useState(0);

  const handleTrigger = () => {
    setTrigger(true);
    setCelebrationCount(prev => prev + 1);
  };

  const handleComplete = () => {
    console.log('Celebration animation completed!');
    // Reset trigger to allow re-triggering
    setTrigger(false);
  };

  return (
    <div className="min-h-screen bg-paper-cream p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-ink-black mb-6">
          Success Celebration Example
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Trigger Celebration
          </h2>
          
          <p className="text-gray-700 mb-4">
            Click the button below to trigger the success celebration animation.
            The animation will play for 2 seconds with confetti-style school-themed elements.
          </p>

          <button
            onClick={handleTrigger}
            className="px-6 py-3 bg-accent-gold text-white font-semibold rounded-lg 
                     hover:bg-yellow-600 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2"
          >
            🎉 Celebrate!
          </button>

          <div className="mt-4 text-sm text-gray-600">
            Celebrations triggered: {celebrationCount}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Features
          </h2>
          
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">⭐</span>
              <span>School-themed confetti elements (⭐📚✏️🎓)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔊</span>
              <span>Plays success-chime sound (respects user settings)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">♿</span>
              <span>Respects prefers-reduced-motion preference</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🎯</span>
              <span>Non-blocking (pointer-events-none)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">⏱️</span>
              <span>2-second duration with fade-out</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Integration Example
          </h2>
          
          <p className="text-gray-700 mb-4">
            In the actual app, this celebration triggers automatically when both 
            follow-up questions are answered:
          </p>

          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// In FollowUpQuestions component
const [triggerCelebration, setTriggerCelebration] = useState(false);

useEffect(() => {
  const bothAnswered = localQuestions.every(q => q.isAnswered);
  if (bothAnswered && !triggerCelebration) {
    setTriggerCelebration(true);
  }
}, [localQuestions, triggerCelebration]);

return (
  <div>
    {/* Question cards */}
    <SuccessCelebration trigger={triggerCelebration} />
  </div>
);`}
          </pre>
        </div>
      </div>

      {/* Success Celebration Component */}
      <SuccessCelebration 
        trigger={trigger}
        onComplete={handleComplete}
      />
    </div>
  );
}
