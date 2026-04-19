import React from 'react';
import QuestionCard from './QuestionCard';
import type { FollowUpQuestion } from '@/types';

/**
 * QuestionCard Component Examples
 * 
 * Demonstrates various states and use cases of the QuestionCard component.
 */

export default function QuestionCardExamples() {
  const unansweredQuestion: FollowUpQuestion = {
    id: 'q1',
    question: 'What would happen if Earth had no atmosphere?',
    isAnswered: false
  };

  const answeredQuestion: FollowUpQuestion = {
    id: 'q2',
    question: 'Why does the sky change colors at sunset?',
    isAnswered: true,
    answer: 'At sunset, sunlight travels through more of Earth\'s atmosphere. This longer path causes more blue light to scatter away, leaving the warmer colors like red, orange, and pink to reach our eyes. It\'s like the light is taking a longer journey through the air!'
  };

  const mockContext = `Original topic: Why is the sky blue?

Explanation: The sky appears blue because of something called "scattering." When sunlight enters Earth's atmosphere, it bumps into tiny air molecules. Blue light has shorter, smaller waves that bounce around more easily than other colors. So when you look up, you see all that bouncing blue light! It's like when you shine a flashlight through fog - the light spreads out in all directions.`;

  const handleAnswerFetched = (questionId: string, answer: string) => {
    console.log(`Answer fetched for question ${questionId}:`, answer);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink-black mb-8">
        QuestionCard Component Examples
      </h1>

      {/* Example 1: Unanswered Question */}
      <section>
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          1. Unanswered Question (Click to fetch answer)
        </h2>
        <QuestionCard
          question={unansweredQuestion}
          level={3}
          context={mockContext}
          onAnswerFetched={handleAnswerFetched}
        />
      </section>

      {/* Example 2: Answered Question */}
      <section>
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          2. Answered Question (Click to toggle)
        </h2>
        <QuestionCard
          question={answeredQuestion}
          level={3}
          context={mockContext}
          onAnswerFetched={handleAnswerFetched}
        />
      </section>

      {/* Example 3: Different Learning Levels */}
      <section>
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          3. Different Learning Levels
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-chalk-gray mb-2">Level 1 (Age 9-10)</p>
            <QuestionCard
              question={{
                id: 'q3',
                question: 'What makes clouds white?',
                isAnswered: false
              }}
              level={1}
              context={mockContext}
            />
          </div>
          <div>
            <p className="text-sm text-chalk-gray mb-2">Level 6 (Age 14+)</p>
            <QuestionCard
              question={{
                id: 'q4',
                question: 'How does Rayleigh scattering affect atmospheric optics?',
                isAnswered: false
              }}
              level={6}
              context={mockContext}
            />
          </div>
        </div>
      </section>

      {/* Example 4: Side by Side */}
      <section>
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          4. Side by Side Layout
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuestionCard
            question={unansweredQuestion}
            level={3}
            context={mockContext}
          />
          <QuestionCard
            question={answeredQuestion}
            level={3}
            context={mockContext}
          />
        </div>
      </section>

      {/* Usage Notes */}
      <section className="mt-12 p-6 bg-paper-cream rounded-lg">
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          Usage Notes
        </h2>
        <ul className="space-y-2 text-sm text-ink-black">
          <li>• Click on an unanswered question to fetch the answer from the API</li>
          <li>• Click on an answered question to toggle the answer visibility</li>
          <li>• The raised hand icon (✋) rotates when the question is expanded</li>
          <li>• Hover effects include rotation and scale transformations</li>
          <li>• Supports keyboard navigation with Enter and Space keys</li>
          <li>• Loading state shows "Thinking..." with animated pencil icon</li>
          <li>• Error states display friendly error messages</li>
          <li>• Accordion animation provides smooth expansion/collapse</li>
        </ul>
      </section>
    </div>
  );
}
