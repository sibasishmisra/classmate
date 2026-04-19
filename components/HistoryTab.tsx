'use client';

import type { TopicEntry } from '@/types';

interface HistoryTabProps {
  topic: TopicEntry;
  index: number;
  isActive?: boolean;
  onClick: (topic: TopicEntry) => void;
}

/**
 * HistoryTab Component
 * 
 * Displays an individual history entry as a notebook tab or bookmark.
 * Used within SessionHistory to show previous topics.
 * 
 * Features:
 * - Notebook tab aesthetic with nostalgic styling
 * - Displays topic title and timestamp
 * - Click handler to load cached entry
 * - Hover effects for interactivity
 * - Active state highlighting
 * 
 * Validates: Requirements 11.7
 * 
 * @param topic - The topic entry to display
 * @param index - The index/number of this topic in history
 * @param isActive - Whether this tab is currently active
 * @param onClick - Callback when the tab is clicked
 */
export default function HistoryTab({
  topic,
  index,
  isActive = false,
  onClick
}: HistoryTabProps) {
  const handleClick = () => {
    onClick(topic);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(topic);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const topicDate = new Date(date);
    const diffMs = now.getTime() - topicDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return topicDate.toLocaleDateString();
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        history-tab
        w-full text-left
        bg-paper-cream
        border border-ruled-line
        rounded-t-lg
        px-3 py-2
        transition-all duration-200
        hover:bg-paper-white hover:shadow-md hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2
        ${isActive ? 'active bg-paper-white border-accent-blue shadow-md -translate-y-0.5' : ''}
      `}
      aria-label={`Revisit topic: ${topic.topic}`}
      aria-pressed={isActive}
      role="tab"
      tabIndex={0}
      data-testid={`history-tab-${topic.id}`}
    >
      <div className="flex items-start gap-2">
        {/* Tab number/bookmark indicator */}
        <span 
          className="text-sm text-chalk-gray font-ui flex-shrink-0 mt-0.5"
          aria-hidden="true"
        >
          {index}.
        </span>
        
        <div className="flex-1 min-w-0">
          {/* Topic title */}
          <p className="text-sm font-medium text-ink-black font-body truncate">
            {topic.topic}
          </p>
          
          {/* Metadata: Level and timestamp */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-chalk-gray font-ui">
              Level {topic.level}
            </span>
            <span className="text-sm text-chalk-gray" aria-hidden="true">
              •
            </span>
            <span className="text-sm text-chalk-gray font-ui">
              {formatTimestamp(topic.timestamp)}
            </span>
          </div>
        </div>

        {/* Bookmark corner fold effect */}
        <div 
          className={`
            w-0 h-0 
            border-l-[8px] border-l-transparent
            border-t-[8px] 
            ${isActive ? 'border-t-accent-gold' : 'border-t-chalk-gray'}
            transition-colors duration-200
          `}
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
