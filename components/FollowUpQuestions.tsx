'use client';

import { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import SuccessCelebration from './SuccessCelebration';
import type { FollowUpQuestion, LearningLevel } from '@/types';

interface FollowUpQuestionsProps {
  questions: FollowUpQuestion[];
  level: LearningLevel;
  context: string;
}

/**
 * FollowUpQuestions Component
 * 
 * Renders exactly 2 QuestionCard components in a responsive layout.
 * Handles answer fetching via API and ensures both questions remain accessible.
 * 
 * Features:
 * - Renders exactly 2 QuestionCard components
 * - Handles answer fetching via API
 * - Both questions remain accessible when one is answered
 * - Side-by-side on desktop, stacked on mobile
 * - Responsive layout with nostalgic styling
 * 
 * Validates: Requirements 4.1, 4.2, 4.6
 * 
 * @param questions - Array of exactly 2 follow-up questions
 * @param level - The learning level for context
 * @param context - Original topic and explanation for API context
 */
export default function FollowUpQuestions({
  questions,
  level,
  context
}: FollowUpQuestionsProps) {
  // Maintain local state for questions to update answers
  const [localQuestions, setLocalQuestions] = useState<FollowUpQuestion[]>(questions);
  const [triggerCelebration, setTriggerCelebration] = useState(false);

  // Ensure we have exactly 2 questions
  if (!questions || questions.length !== 2) {
    console.warn('FollowUpQuestions expects exactly 2 questions');
    return null;
  }

  const handleAnswerFetched = (questionId: string, answer: string) => {
    setLocalQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === questionId
          ? { ...q, answer, isAnswered: true }
          : q
      )
    );
  };

  // Check if both questions have been answered and trigger celebration
  useEffect(() => {
    const bothAnswered = localQuestions.every(q => q.isAnswered);
    if (bothAnswered && !triggerCelebration) {
      setTriggerCelebration(true);
    }
  }, [localQuestions, triggerCelebration]);

  return (
    <div 
      className="follow-up-questions"
      data-testid="follow-up-questions"
      role="region"
      aria-label="Follow-up questions"
    >
      {/* Section Header */}
      <h3 className="text-xl font-semibold text-ink-black mb-6 text-center">
        Want to learn more?
      </h3>

      {/* Questions Grid - Side-by-side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {localQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            level={level}
            context={context}
            onAnswerFetched={handleAnswerFetched}
          />
        ))}
      </div>

      {/* Success Celebration Animation */}
      <SuccessCelebration 
        trigger={triggerCelebration}
        onComplete={() => {
          // Reset trigger after animation completes
          // This allows re-triggering if needed
        }}
      />
    </div>
  );
}
