'use client';

import HistoryTab from './HistoryTab';
import type { TopicEntry } from '@/types';

interface SessionHistoryProps {
  topics: TopicEntry[];
  currentTopicId?: string;
  onTopicSelect?: (topic: TopicEntry) => void;
}

/**
 * SessionHistory Component
 * 
 * Displays a sidebar/panel showing the last 10 topics from the current session.
 * Allows students to revisit previous explanations using HistoryTab components.
 * 
 * Features:
 * - Shows up to 10 most recent topics
 * - Notebook tab aesthetic via HistoryTab components
 * - Click to revisit cached explanations
 * - Highlights currently active topic
 * 
 * Validates: Requirements 11.1, 11.2, 11.3, 11.7
 * 
 * @param topics - Array of topic entries from session history (max 10)
 * @param currentTopicId - ID of the currently displayed topic
 * @param onTopicSelect - Callback when a topic is selected
 */
export default function SessionHistory({
  topics,
  currentTopicId,
  onTopicSelect
}: SessionHistoryProps) {
  // Limit to 10 most recent topics as per requirement 11.2
  const displayTopics = topics.slice(-10);

  if (displayTopics.length === 0) {
    return (
      <aside
        className="session-history bg-paper-cream border-2 border-chalk-gray rounded-lg p-4"
        data-testid="session-history"
        role="complementary"
        aria-label="Session history"
      >
        <h3 className="text-lg font-semibold text-ink-black mb-3 font-ui">
          📚 Your Learning Journey
        </h3>
        <p className="text-sm text-chalk-gray font-body">
          Your recent topics will appear here
        </p>
      </aside>
    );
  }

  // Display in reverse order (most recent first)
  const reversedTopics = [...displayTopics].reverse();

  return (
    <aside
      className="session-history bg-paper-cream border-2 border-chalk-gray rounded-lg p-4"
      data-testid="session-history"
      role="complementary"
      aria-label="Session history"
    >
      <h3 className="text-lg font-semibold text-ink-black mb-3 font-ui">
        📚 Your Learning Journey
      </h3>
      
      <div className="space-y-2" role="tablist">
        {reversedTopics.map((topic, index) => (
          <HistoryTab
            key={topic.id}
            topic={topic}
            index={displayTopics.length - index}
            isActive={topic.id === currentTopicId}
            onClick={onTopicSelect || (() => {})}
          />
        ))}
      </div>
    </aside>
  );
}
