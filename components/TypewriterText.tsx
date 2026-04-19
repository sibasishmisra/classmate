'use client';

import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
  className?: string;
}

export default function TypewriterText({
  text,
  speed = 30,
  onComplete,
  className = ''
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    setIsComplete(false);
    setIsSkipped(false);

    // If reduced motion is preferred, show all text immediately
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    // Typewriter animation
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete, prefersReducedMotion]);

  const handleSkip = () => {
    if (!isComplete && !isSkipped) {
      setDisplayedText(text);
      setIsComplete(true);
      setIsSkipped(true);
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleSkip}
      className={`chalk-text typewriter ${className} ${!isComplete ? 'cursor-pointer' : ''}`}
      role="article"
      aria-label="Explanation text"
      aria-live="polite"
      style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
    >
      {displayedText}
      {!isComplete && !prefersReducedMotion && (
        <span className="typewriter-cursor" aria-hidden="true" />
      )}
    </div>
  );
}
