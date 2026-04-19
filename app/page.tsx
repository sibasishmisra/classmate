'use client';

import { useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import TopicInput from '@/components/TopicInput';
import ExplanationDisplay from '@/components/ExplanationDisplay';
import FriendlyErrorDisplay from '@/components/FriendlyErrorDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSession } from '@/contexts/SessionContext';
import { soundManager, SOUND_IDS } from '@/lib/sound-manager';
import type { TopicEntry } from '@/types';

// Lazy load heavy components for better initial load performance
const FollowUpQuestions = lazy(() => import('@/components/FollowUpQuestions'));
const SessionHistory = lazy(() => import('@/components/SessionHistory'));
const SettingsPanel = lazy(() => import('@/components/SettingsPanel'));

// Fixed level: 5th grade (age 10-11)
const FIXED_LEVEL = 3; // Level 3 = Age 11 (5th grade)

export default function Home() {
  const {
    currentTopic,
    history,
    submitTopic,
    isLoading,
    error
  } = useSession();

  const [showExplanation, setShowExplanation] = useState(false);

  const handleTopicSubmit = async (topic: string) => {
    await submitTopic(topic, FIXED_LEVEL);
    setShowExplanation(true);
    // Play page turn sound when showing explanation
    soundManager.play(SOUND_IDS.PAGE_TURN);
  };

  const handleNewTopic = () => {
    setShowExplanation(false);
    // Play page turn sound when going back to topic input
    soundManager.play(SOUND_IDS.PAGE_TURN);
  };

  const handleHistorySelect = (topic: TopicEntry) => {
    // This will be implemented in a future task
    // For now, just show a placeholder
    console.log('Selected topic from history:', topic);
  };

  return (
    <main className="min-h-screen bg-paper-white" role="main">
      {/* Header */}
      <header className="bg-chalkboard-black text-chalk-white py-4 sm:py-6 px-3 sm:px-4 shadow-lg sticky top-0 z-50" role="banner">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-ui text-center md:text-left">
                ClassMate.info
              </h1>
              <p className="text-center md:text-left text-chalk-white mt-1 sm:mt-2 font-body text-xs sm:text-sm md:text-base opacity-90">
                Explain it like I'm in 5th grade 🎓
              </p>
            </div>
            <Link
              href="/faq"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 bg-accent-blue text-white rounded-lg font-ui font-medium hover:bg-opacity-90 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
              aria-label="View help and FAQ"
            >
              <span aria-hidden="true" className="text-base sm:text-lg">❓</span>
              <span className="hidden sm:inline">Help & FAQ</span>
              <span className="sm:hidden">Help</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Topic Input - Always visible when not showing explanation */}
            {!showExplanation && (
              <section className="mb-6 sm:mb-8" aria-labelledby="topic-input-heading">
                <div className="text-center mb-6 sm:mb-8 px-2">
                  <h2 id="topic-input-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink-black mb-3 sm:mb-4 font-ui">
                    What would you like to learn?
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-chalk-gray font-body max-w-2xl mx-auto">
                    Ask me anything! I'll explain it in a way that's easy to understand, 
                    just like you're in 5th grade. 📚
                  </p>
                </div>
                <TopicInput
                  onSubmit={handleTopicSubmit}
                  isLoading={isLoading}
                />
              </section>
            )}

            {/* Explanation Display */}
            {showExplanation && currentTopic && !error && (
              <section className="mb-6 sm:mb-8" aria-labelledby="explanation-heading" aria-live="polite">
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">🎓</span>
                    <p className="text-xs sm:text-sm text-chalk-gray font-ui">
                      Explained like you're in <span className="font-semibold text-ink-black">5th grade</span>
                    </p>
                  </div>
                  <button
                    onClick={handleNewTopic}
                    className="text-xs sm:text-sm font-semibold text-accent-blue hover:underline font-ui focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 rounded px-2 py-1 whitespace-nowrap"
                    aria-label="Ask another question"
                    type="button"
                  >
                    ✨ Ask Another Question
                  </button>
                </div>

                <h2 id="explanation-heading" className="sr-only">Explanation for {currentTopic.topic}</h2>
                <ExplanationDisplay
                  topic={currentTopic.topic}
                  level={currentTopic.level}
                  explanation={currentTopic.explanation}
                  isLoading={isLoading}
                />

                {/* Follow-Up Questions */}
                {currentTopic.followUpQuestions && currentTopic.followUpQuestions.length === 2 && (
                  <div className="mt-6 sm:mt-8">
                    <Suspense fallback={<LoadingSpinner size="md" variant="chalk" />}>
                      <FollowUpQuestions
                        questions={currentTopic.followUpQuestions}
                        level={currentTopic.level}
                        context={`Topic: ${currentTopic.topic}\n\nExplanation: ${currentTopic.explanation}`}
                      />
                    </Suspense>
                  </div>
                )}
              </section>
            )}

            {/* Error Display */}
            {error && (
              <section className="mb-6 sm:mb-8 px-2">
                <FriendlyErrorDisplay
                  title="Oops! Something went wrong"
                  message={error}
                  icon="🤔"
                  actions={[
                    {
                      label: 'Try Again',
                      onClick: handleNewTopic
                    }
                  ]}
                />
              </section>
            )}
          </div>

          {/* Sidebar: Session History & Settings */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <Suspense fallback={<LoadingSpinner size="sm" variant="paper" />}>
              <SessionHistory
                topics={history}
                onTopicSelect={handleHistorySelect}
              />
            </Suspense>
            
            {/* Settings Panel */}
            <Suspense fallback={<LoadingSpinner size="sm" variant="paper" />}>
              <SettingsPanel />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
