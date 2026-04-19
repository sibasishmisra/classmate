'use client';

import { useState } from 'react';
import NotebookTextarea from './NotebookTextarea';
import ChalkDustButton from './ChalkDustButton';
import { validateTopicInput } from '@/lib/validation';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
  maxLength?: number;
}

export default function TopicInput({
  onSubmit,
  isLoading,
  maxLength = 500
}: TopicInputProps) {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isValid = validateTopicInput(topic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError(null);

    // Validate before submission
    if (!validateTopicInput(topic)) {
      if (topic.length === 0) {
        setError('Please enter a topic to learn about!');
      } else {
        setError('Your topic is too long. Please keep it under 500 characters.');
      }
      return;
    }

    // Submit the topic
    onSubmit(topic);
  };

  const handleChange = (value: string) => {
    setTopic(value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <div className="space-y-3 sm:space-y-4">
        {/* Notebook Textarea */}
        <NotebookTextarea
          value={topic}
          onChange={handleChange}
          maxLength={maxLength}
          placeholder="What would you like to learn about today?"
          disabled={isLoading}
          onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        />

        {/* Inline validation error */}
        {error && (
          <div 
            className="text-error-red text-xs sm:text-sm font-ui px-3 sm:px-4 py-2 bg-red-50 border-l-4 border-error-red rounded"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Submit button with vintage school styling */}
        <div className="flex justify-end">
          <ChalkDustButton
            type="submit"
            disabled={!isValid || isLoading}
            className="submit-button min-h-[44px] min-w-[44px] touch-manipulation text-sm sm:text-base px-4 sm:px-6"
            aria-label={isLoading ? 'Submitting topic...' : 'Submit topic'}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="chalk-spinner inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 border-transparent border-t-current rounded-full animate-spin" aria-hidden="true" />
                <span className="text-sm sm:text-base">Learning...</span>
              </span>
            ) : (
              <span className="text-sm sm:text-base">Ask ClassMate</span>
            )}
          </ChalkDustButton>
        </div>
      </div>
    </form>
  );
}
