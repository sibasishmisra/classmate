'use client';

import ChalkboardSection from './ChalkboardSection';
import TypewriterText from './TypewriterText';
import LoadingSpinner from './LoadingSpinner';
import { soundManager, SOUND_IDS } from '@/lib/sound-manager';
import type { LearningLevel, FollowUpQuestion } from '@/types';

interface ExplanationDisplayProps {
  topic: string;
  level: LearningLevel;
  explanation: string;
  followUpQuestions?: FollowUpQuestion[];
  isLoading?: boolean;
  error?: string | null;
  onQuestionClick?: (questionId: string) => void;
}

/**
 * ExplanationDisplay Component
 * 
 * Displays AI-generated explanations with nostalgic chalkboard aesthetic.
 * Integrates ChalkboardSection and TypewriterText for animated text display.
 * 
 * Features:
 * - Chalkboard background with chalk-style text
 * - Typewriter animation for explanation text
 * - Topic and level display
 * - Follow-up questions (placeholder for now)
 * - Loading and error state handling
 * 
 * Validates: Requirements 3.3, 3.7, 3.8
 * 
 * @param topic - The topic being explained
 * @param level - The learning level (1-6)
 * @param explanation - The AI-generated explanation text
 * @param followUpQuestions - Optional array of follow-up questions
 * @param isLoading - Loading state indicator
 * @param error - Error message if any
 * @param onQuestionClick - Callback when a follow-up question is clicked
 */
export default function ExplanationDisplay({
  topic,
  level,
  explanation,
  followUpQuestions = [],
  isLoading = false,
  error = null,
  onQuestionClick
}: ExplanationDisplayProps) {
  // Handle loading state
  if (isLoading) {
    return (
      <ChalkboardSection className="min-h-[400px] flex items-center justify-center p-8">
        <LoadingSpinner 
          variant="chalk" 
          size="lg" 
          text="Writing on the chalkboard..."
        />
      </ChalkboardSection>
    );
  }

  // Handle error state
  if (error) {
    return (
      <ChalkboardSection className="min-h-[400px] flex items-center justify-center p-8">
        <div 
          className="text-center max-w-md"
          role="alert"
          aria-live="assertive"
        >
          <div className="chalk-text text-xl mb-4">
            Oops! Something went wrong
          </div>
          <div className="chalk-text text-base opacity-80">
            {error}
          </div>
          <div className="mt-6 text-4xl" aria-hidden="true">
            🤔
          </div>
        </div>
      </ChalkboardSection>
    );
  }

  // Get age range for display
  const getAgeRange = (level: LearningLevel): string => {
    const ageRanges: Record<LearningLevel, string> = {
      1: '9-10',
      2: '10-11',
      3: '11-12',
      4: '12-13',
      5: '13-14',
      6: '14+'
    };
    return ageRanges[level];
  };

  // Handle typewriter completion - play success sound
  const handleTypewriterComplete = () => {
    soundManager.play(SOUND_IDS.SUCCESS_CHIME);
  };

  return (
    <div className="explanation-display" data-testid="explanation-display" role="article" aria-label={`Explanation for ${topic}`}>
      {/* Topic Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-ink-black mb-2">
          {topic}
        </h2>
        <p className="text-sm text-chalk-gray">
          Explained for ages {getAgeRange(level)}
        </p>
      </div>

      {/* Explanation Content */}
      <ChalkboardSection className="p-8 rounded-lg mb-8">
        <div className="max-w-3xl mx-auto">
          <TypewriterText
            text={explanation}
            speed={30}
            className="text-lg leading-relaxed"
            onComplete={handleTypewriterComplete}
          />
        </div>
      </ChalkboardSection>

      {/* Follow-Up Questions Placeholder */}
      {followUpQuestions && followUpQuestions.length > 0 && (
        <div 
          className="follow-up-questions mt-8"
          data-testid="follow-up-questions"
          role="region"
          aria-label="Follow-up questions"
        >
          <h3 className="text-xl font-semibold text-ink-black mb-4 text-center">
            Want to learn more?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {followUpQuestions.map((question) => (
              <div
                key={question.id}
                className="follow-up-question-card p-4 bg-paper-cream rounded-lg border-2 border-chalk-gray hover:border-ink-black transition-colors cursor-pointer"
                onClick={() => onQuestionClick?.(question.id)}
                role="button"
                tabIndex={0}
                aria-label={`Follow-up question: ${question.question}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onQuestionClick?.(question.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">
                    ✋
                  </span>
                  <p className="text-base text-ink-black font-medium">
                    {question.question}
                  </p>
                </div>
                {question.isAnswered && question.answer && (
                  <div className="mt-4 pt-4 border-t border-chalk-gray">
                    <p className="text-sm text-ink-black opacity-80">
                      {question.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
