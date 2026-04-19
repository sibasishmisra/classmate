'use client';

import { useState, useEffect } from 'react';
import NotebookTextarea from './NotebookTextarea';
import ChalkDustButton from './ChalkDustButton';
import { validateTopicInput } from '@/lib/validation';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
  maxLength?: number;
  initialValue?: string;
}

export default function TopicInput({
  onSubmit,
  isLoading,
  maxLength = 500,
  initialValue = ''
}: TopicInputProps) {
  const [topic, setTopic] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  // Update topic when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setTopic(initialValue);
    }
  }, [initialValue]);

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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-0">
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
            className="text-error-red text-xs sm:text-sm font-ui px-3 sm:px-4 py-2 bg-red-50 border-l-4 border-error-red rounded mx-2 sm:mx-0"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Submit button with vintage school styling */}
        <div className="flex justify-end px-2 sm:px-0">
          <ChalkDustButton
            type="submit"
            disabled={!isValid || isLoading}
            className="submit-button min-h-[48px] min-w-[120px] sm:min-h-[44px] sm:min-w-[44px] touch-manipulation text-sm sm:text-base px-6 sm:px-6 py-3 sm:py-2"
            aria-label={isLoading ? 'Submitting topic...' : 'Submit topic'}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="chalk-spinner inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 border-transparent border-t-current rounded-full animate-spin" aria-hidden="true" />
                <span className="text-sm sm:text-base">Learning...</span>
              </span>
            ) : (
              <span className="text-sm sm:text-base font-semibold">Ask ClassMate</span>
            )}
          </ChalkDustButton>
        </div>
      </div>
    </form>
  );
}
