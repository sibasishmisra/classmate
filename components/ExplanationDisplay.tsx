'use client';

import { useState, useCallback, useRef } from 'react';
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

const AGE_RANGES: Record<LearningLevel, string> = {
  1: '9-10', 2: '10-11', 3: '11-12', 4: '12-13', 5: '13-14', 6: '14+'
};

export default function ExplanationDisplay({
  topic,
  level,
  explanation,
  followUpQuestions = [],
  isLoading = false,
  error = null,
  onQuestionClick
}: ExplanationDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);
  // Ref guards against the callback changing identity on re-render (prevents typewriter restart)
  const typingDoneRef = useRef(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(explanation);
    } catch {
      const el = document.createElement('textarea');
      el.value = explanation;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stable reference — empty deps means this never changes, so TypewriterText
  // useEffect won't re-run when ExplanationDisplay re-renders (e.g. on setCopied)
  const handleTypewriterComplete = useCallback(() => {
    if (!typingDoneRef.current) {
      typingDoneRef.current = true;
      setIsTypingDone(true);
      soundManager.play(SOUND_IDS.SUCCESS_CHIME);
    }
  }, []);

  if (isLoading) {
    return (
      <ChalkboardSection className="min-h-[400px] flex items-center justify-center p-8">
        <LoadingSpinner variant="chalk" size="lg" text="Writing on the chalkboard..." />
      </ChalkboardSection>
    );
  }

  if (error) {
    return (
      <ChalkboardSection className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md" role="alert" aria-live="assertive">
          <div className="chalk-text text-xl mb-4">Oops! Something went wrong</div>
          <div className="chalk-text text-base opacity-80">{error}</div>
          <div className="mt-6 text-4xl" aria-hidden="true">🤔</div>
        </div>
      </ChalkboardSection>
    );
  }

  return (
    <div
      className="explanation-display"
      data-testid="explanation-display"
      role="article"
      aria-label={`Explanation for ${topic}`}
    >
      {/* Topic Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-ink-black mb-2">{topic}</h2>
        <p className="text-sm text-chalk-gray">Explained for ages {AGE_RANGES[level]}</p>
      </div>

      {/* Chalkboard with copy button top-right */}
      <ChalkboardSection className="rounded-lg mb-8">
        {/* Toolbar: copy button flush to top-right */}
        <div className="flex justify-end px-4 pt-3 pb-0 min-h-[36px]">
          {isTypingDone && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-ui font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-chalk-white focus:ring-offset-1 focus:ring-offset-chalkboard-black"
              style={{
                background: copied ? 'rgba(16,185,129,0.25)' : 'rgba(245,245,220,0.12)',
                color: copied ? '#6ee7b7' : '#f5f5dc',
                border: copied
                  ? '1px solid rgba(16,185,129,0.5)'
                  : '1px solid rgba(245,245,220,0.25)',
              }}
              aria-label="Copy explanation to clipboard"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        {/* Explanation text */}
        <div className="px-8 pb-8 max-w-3xl mx-auto">
          <TypewriterText
            text={explanation}
            speed={30}
            className="text-lg leading-relaxed"
            onComplete={handleTypewriterComplete}
          />
        </div>
      </ChalkboardSection>

      {/* Follow-Up Questions */}
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
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">✋</span>
                  <p className="text-base text-ink-black font-medium">{question.question}</p>
                </div>
                {question.isAnswered && question.answer && (
                  <div className="mt-4 pt-4 border-t border-chalk-gray">
                    <p className="text-sm text-ink-black opacity-80">{question.answer}</p>
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
