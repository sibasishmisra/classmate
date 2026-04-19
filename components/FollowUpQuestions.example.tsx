import React from 'react';
import FollowUpQuestions from './FollowUpQuestions';
import type { FollowUpQuestion } from '@/types';

/**
 * FollowUpQuestions Component Examples
 * 
 * Demonstrates various states and use cases of the FollowUpQuestions component.
 */

export default function FollowUpQuestionsExamples() {
  const unansweredQuestions: FollowUpQuestion[] = [
    {
      id: 'q1',
      question: 'What would happen if Earth had no atmosphere?',
      isAnswered: false
    },
    {
      id: 'q2',
      question: 'Why does the sky change colors at sunset?',
      isAnswered: false
    }
  ];

  const partiallyAnsweredQuestions: FollowUpQuestion[] = [
    {
      id: 'q3',
      question: 'What would happen if Earth had no atmosphere?',
      isAnswered: true,
      answer: 'If Earth had no atmosphere, the sky would appear black like in space. There would be no air to scatter sunlight, so you would see stars even during the day! Also, there would be no protection from the sun\'s harmful rays, and no air to breathe.'
    },
    {
      id: 'q4',
      question: 'Why does the sky change colors at sunset?',
      isAnswered: false
    }
  ];

  const fullyAnsweredQuestions: FollowUpQuestion[] = [
    {
      id: 'q5',
      question: 'What would happen if Earth had no atmosphere?',
      isAnswered: true,
      answer: 'If Earth had no atmosphere, the sky would appear black like in space. There would be no air to scatter sunlight, so you would see stars even during the day!'
    },
    {
      id: 'q6',
      question: 'Why does the sky change colors at sunset?',
      isAnswered: true,
      answer: 'At sunset, sunlight travels through more of Earth\'s atmosphere. This longer path causes more blue light to scatter away, leaving the warmer colors like red, orange, and pink to reach our eyes.'
    }
  ];

  const mockContext = `Original topic: Why is the sky blue?

Explanation: The sky appears blue because of something called "scattering." When sunlight enters Earth's atmosphere, it bumps into tiny air molecules. Blue light has shorter, smaller waves that bounce around more easily than other colors. So when you look up, you see all that bouncing blue light! It's like when you shine a flashlight through fog - the light spreads out in all directions.`;

  return (
    <div className="p-8 space-y-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-ink-black mb-8">
        FollowUpQuestions Component Examples
      </h1>

      {/* Example 1: Both Questions Unanswered */}
      <section>
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          1. Both Questions Unanswered
        </h2>
        <p className="text-sm text-chalk-gray mb-4">
          Click on either question to fetch its answer. Both remain accessible.
        </p>
        <FollowUpQuestions
          questions={unansweredQuestions}
          level={3}
          context={mockContext}
        />
      </section>

      {/* Example 2: One Question Answered */}
      <section>
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          2. One Question Answered
        </h2>
        <p className="text-sm text-chalk-gray mb-4">
          The first question is answered and expanded. The second remains clickable.
        </p>
        <FollowUpQuestions
          questions={partiallyAnsweredQuestions}
          level={3}
          context={mockContext}
        />
      </section>

      {/* Example 3: Both Questions Answered */}
      <section>
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          3. Both Questions Answered
        </h2>
        <p className="text-sm text-chalk-gray mb-4">
          Both questions have been answered. Click to toggle their visibility.
        </p>
        <FollowUpQuestions
          questions={fullyAnsweredQuestions}
          level={3}
          context={mockContext}
        />
      </section>

      {/* Example 4: Different Learning Levels */}
      <section>
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          4. Different Learning Levels
        </h2>
        <div className="space-y-8">
          <div>
            <p className="text-sm text-chalk-gray mb-2">Level 1 (Age 9-10)</p>
            <FollowUpQuestions
              questions={[
                {
                  id: 'q7',
                  question: 'What makes clouds white?',
                  isAnswered: false
                },
                {
                  id: 'q8',
                  question: 'Why is water wet?',
                  isAnswered: false
                }
              ]}
              level={1}
              context={mockContext}
            />
          </div>
          <div>
            <p className="text-sm text-chalk-gray mb-2">Level 6 (Age 14+)</p>
            <FollowUpQuestions
              questions={[
                {
                  id: 'q9',
                  question: 'How does Rayleigh scattering affect atmospheric optics?',
                  isAnswered: false
                },
                {
                  id: 'q10',
                  question: 'What role does wavelength play in light dispersion?',
                  isAnswered: false
                }
              ]}
              level={6}
              context={mockContext}
            />
          </div>
        </div>
      </section>

      {/* Example 5: Mobile vs Desktop Layout */}
      <section>
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          5. Responsive Layout
        </h2>
        <p className="text-sm text-chalk-gray mb-4">
          On mobile (width &lt; 768px): Questions stack vertically<br />
          On desktop (width ≥ 768px): Questions appear side-by-side
        </p>
        <div className="border-2 border-dashed border-chalk-gray p-4 rounded-lg">
          <FollowUpQuestions
            questions={unansweredQuestions}
            level={3}
            context={mockContext}
          />
        </div>
        <p className="text-xs text-chalk-gray mt-2">
          Resize your browser window to see the responsive behavior
        </p>
      </section>

      {/* Usage Notes */}
      <section className="mt-12 p-6 bg-paper-cream rounded-lg">
        <h2 className="text-xl font-semibold text-ink-black mb-4">
          Usage Notes
        </h2>
        <ul className="space-y-2 text-sm text-ink-black">
          <li>• <strong>Exactly 2 Questions:</strong> Component expects exactly 2 questions. Returns null otherwise.</li>
          <li>• <strong>API Integration:</strong> Automatically fetches answers from /api/answer endpoint</li>
          <li>• <strong>State Management:</strong> Maintains local state for answered questions</li>
          <li>• <strong>Accessibility:</strong> Both questions remain accessible when one is answered (Requirement 4.6)</li>
          <li>• <strong>Responsive:</strong> Side-by-side on desktop, stacked on mobile</li>
          <li>• <strong>Context Passing:</strong> Passes original topic and explanation to API for contextual answers</li>
          <li>• <strong>Error Handling:</strong> Each question handles errors independently</li>
          <li>• <strong>Nostalgic Design:</strong> Raised hand icons, hover effects, chalk styling</li>
        </ul>
      </section>

      {/* Requirements Validation */}
      <section className="mt-8 p-6 bg-chalkboard-black rounded-lg">
        <h2 className="text-xl font-semibold chalk-text mb-4">
          Requirements Validation
        </h2>
        <ul className="space-y-2 text-sm chalk-text">
          <li>✓ <strong>Requirement 4.1:</strong> Generates exactly 2 follow-up questions</li>
          <li>✓ <strong>Requirement 4.2:</strong> Displays questions below explanation within 200ms</li>
          <li>✓ <strong>Requirement 4.6:</strong> Both questions remain accessible when one is answered</li>
        </ul>
      </section>
    </div>
  );
}
