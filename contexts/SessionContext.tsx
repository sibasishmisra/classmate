'use client';

/**
 * SessionContext provider for ClassMate.info
 * Manages learning session state, topic history, and API interactions
 * Validates: Requirements 1.2, 1.6, 11.1, 11.2, 11.3
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  LearningLevel,
  LearningSession,
  TopicEntry,
  ExplainResponse,
  AnswerResponse
} from '@/types';
import { persistSession, loadSession, clearSession as clearStoredSession } from '@/lib/session-storage';

interface SessionContextValue {
  level: LearningLevel | null;
  currentTopic: TopicEntry | null;
  history: TopicEntry[];
  setLevel: (level: LearningLevel) => void;
  submitTopic: (topic: string) => Promise<void>;
  answerFollowUp: (questionId: string) => Promise<void>;
  clearSession: () => void;
  isLoading: boolean;
  error: string | null;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<LearningSession>(() => {
    // Try to load session from localStorage on mount
    if (typeof window !== 'undefined') {
      const loaded = loadSession();
      if (loaded) return loaded;
    }
    
    // Default session
    return {
      id: crypto.randomUUID(),
      level: null,
      topics: [],
      createdAt: new Date(),
      settings: {
        soundEnabled: true,
        animationsEnabled: true,
        reducedMotion: false
      }
    };
  });

  const [currentTopic, setCurrentTopic] = useState<TopicEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist session to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      persistSession(session);
    }
  }, [session]);

  const setLevel = useCallback((level: LearningLevel) => {
    setSession(prev => ({
      ...prev,
      level
    }));
  }, []);

  const submitTopic = useCallback(async (topic: string, level?: LearningLevel) => {
    // Use provided level or session level (for fixed level mode)
    const targetLevel = level || session.level;
    
    if (!targetLevel) {
      setError('Please select a learning level first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          level: targetLevel
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch explanation');
      }

      const data: ExplainResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Create new topic entry
      const newTopic: TopicEntry = {
        id: crypto.randomUUID(),
        topic,
        explanation: data.explanation,
        followUpQuestions: data.followUpQuestions,
        timestamp: new Date(),
        level: targetLevel
      };

      // Update session with new topic
      setSession(prev => {
        const updatedTopics = [...prev.topics, newTopic];
        // Keep only last 10 topics
        const limitedTopics = updatedTopics.slice(-10);
        
        return {
          ...prev,
          level: targetLevel, // Update level in session
          topics: limitedTopics
        };
      });

      setCurrentTopic(newTopic);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error submitting topic:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session.level]);

  const answerFollowUp = useCallback(async (questionId: string) => {
    if (!currentTopic) {
      setError('No active topic');
      return;
    }

    const question = currentTopic.followUpQuestions.find(q => q.id === questionId);
    if (!question) {
      setError('Question not found');
      return;
    }

    // If already answered, don't fetch again
    if (question.isAnswered && question.answer) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          context: `Topic: ${currentTopic.topic}\n\nExplanation: ${currentTopic.explanation}`,
          level: currentTopic.level
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch answer');
      }

      const data: AnswerResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Update the question with the answer
      const updatedTopic: TopicEntry = {
        ...currentTopic,
        followUpQuestions: currentTopic.followUpQuestions.map(q =>
          q.id === questionId
            ? { ...q, answer: data.answer, isAnswered: true }
            : q
        )
      };

      // Update current topic
      setCurrentTopic(updatedTopic);

      // Update in session history
      setSession(prev => ({
        ...prev,
        topics: prev.topics.map(t =>
          t.id === currentTopic.id ? updatedTopic : t
        )
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error answering follow-up:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentTopic]);

  const clearSession = useCallback(() => {
    setSession({
      id: crypto.randomUUID(),
      level: null,
      topics: [],
      createdAt: new Date(),
      settings: session.settings // Preserve settings
    });
    setCurrentTopic(null);
    setError(null);
    clearStoredSession();
  }, [session.settings]);

  const value: SessionContextValue = {
    level: session.level,
    currentTopic,
    history: session.topics,
    setLevel,
    submitTopic,
    answerFollowUp,
    clearSession,
    isLoading,
    error
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
