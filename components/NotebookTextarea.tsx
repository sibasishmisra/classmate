'use client';

import { useState, useRef, useEffect } from 'react';

interface NotebookTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  onSubmit?: () => void;
}

export default function NotebookTextarea({
  value,
  onChange,
  maxLength = 500,
  placeholder = "What would you like to learn about today?",
  disabled = false,
  onSubmit
}: NotebookTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift), allow Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onSubmit && value.trim().length > 0 && !disabled) {
        onSubmit();
      }
    }
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.9;

  return (
    <div className="notebook-textarea-wrapper w-full">
      <div 
        className={`notebook-paper relative rounded-lg transition-all duration-200 ${
          isFocused ? 'shadow-paper' : ''
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[160px] bg-transparent border-none outline-none resize-none font-body text-ink-black text-base leading-8 placeholder:text-chalk-gray placeholder:italic placeholder:font-body"
          style={{
            paddingTop: '1.5rem',
            paddingBottom: '1.5rem',
            paddingRight: '1.5rem',
            lineHeight: '32px', // Match ruled line spacing
          }}
          aria-label="Enter your topic. Press Enter to submit, Shift+Enter for new line."
          aria-describedby="character-counter"
        />
        
        {/* Character counter in bottom-right corner */}
        <div 
          id="character-counter"
          className={`absolute bottom-4 right-4 text-sm font-ui transition-colors duration-200 ${
            isNearLimit ? 'text-warning-yellow font-semibold' : 'text-chalk-gray'
          }`}
          aria-live="polite"
        >
          {characterCount}/{maxLength}
        </div>
      </div>
    </div>
  );
}
