'use client';

import { useState, useRef } from 'react';
import { useChalkDust } from '@/lib/hooks/useChalkDust';
import { triggerLightHaptic } from '@/lib/haptic-feedback';
import { soundManager, SOUND_IDS } from '@/lib/sound-manager';
import type { FollowUpQuestion, LearningLevel } from '@/types';

interface QuestionCardProps {
  question: FollowUpQuestion;
  level: LearningLevel;
  context: string;
  onAnswerFetched?: (questionId: string, answer: string) => void;
}

/**
 * QuestionCard Component
 * 
 * Displays a single follow-up question with interactive accordion-style expansion.
 * Features nostalgic styling with raised hand icon and hover effects.
 * 
 * Features:
 * - Raised hand icon (✋) in chalk style
 * - Hover effects: rotation and scale
 * - Click handler to fetch answer from API
 * - Accordion-style expansion for answer display
 * - Chalk styling and nostalgic elements
 * - Light haptic feedback on click
 * 
 * Validates: Requirements 4.2, 4.5, 6.6
 * 
 * @param question - The follow-up question object
 * @param level - The learning level for context
 * @param context - Original topic and explanation for API context
 * @param onAnswerFetched - Callback when answer is successfully fetched
 */
export default function QuestionCard({
  question,
  level,
  context,
  onAnswerFetched
}: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { canvasRef, triggerChalkDust } = useChalkDust();

  const handleClick = async (e?: React.MouseEvent<HTMLDivElement>) => {
    // Trigger light haptic feedback on mobile
    triggerLightHaptic();
    
    // Trigger chalk dust effect on click
    if (e) {
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        triggerChalkDust(x, y);
      }
    }
    // If already answered, just toggle expansion
    if (question.isAnswered && question.answer) {
      setIsExpanded(!isExpanded);
      return;
    }

    // If not answered, fetch the answer
    if (!isLoading) {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            question: question.question,
            context,
            level
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch answer');
        }

        const data = await response.json();
        
        // Update the question with the answer
        if (onAnswerFetched) {
          onAnswerFetched(question.id, data.answer);
        }
        
        // Play chalk tap sound when answer is received
        soundManager.play(SOUND_IDS.CHALK_TAP);
        
        setIsExpanded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`question-card ${isExpanded ? 'expanded' : ''} relative`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Follow-up question: ${question.question}`}
      data-testid="question-card"
    >
      {/* Canvas for chalk dust particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      {/* Question Header */}
      <div className="flex items-start gap-3 relative z-10">
        <span 
          className="text-2xl flex-shrink-0 transition-transform duration-200"
          style={{
            transform: isExpanded ? 'rotate(15deg)' : 'rotate(0deg)'
          }}
          aria-hidden="true"
        >
          ✋
        </span>
        <div className="flex-1">
          <p className="text-base text-ink-black font-medium leading-relaxed">
            {question.question}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div 
          className="mt-4 pt-4 border-t border-ruled-line"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 text-sm text-chalk-gray">
            <div className="animate-pulse">✏️</div>
            <span>Thinking...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div 
          className="mt-4 pt-4 border-t border-ruled-line"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-error-red">
            {error}
          </p>
        </div>
      )}

      {/* Answer Display (Accordion) */}
      {isExpanded && question.isAnswered && question.answer && !isLoading && (
        <div 
          className="mt-4 pt-4 border-t border-ruled-line animate-fade-in"
          role="region"
          aria-label="Answer"
        >
          <p className="text-sm text-ink-black leading-relaxed opacity-90">
            {question.answer}
          </p>
        </div>
      )}
    </div>
  );
}
