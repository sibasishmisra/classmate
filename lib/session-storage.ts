/**
 * Session storage utilities for ClassMate.info
 * Validates: Requirements 11.4, 11.5
 */

import type { LearningSession, StoredSession } from '@/types';

const SESSION_KEY = 'classmate_session';
const SESSION_VERSION = '1.0';

/**
 * Persists session to localStorage
 * Property 11: Session Data Round-Trip
 */
export function persistSession(session: LearningSession): void {
  try {
    const stored: StoredSession = {
      version: SESSION_VERSION,
      level: session.level || undefined,
      topics: session.topics.slice(-10), // Keep last 10 only
      settings: session.settings,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
  } catch (error) {
    // Handle storage errors gracefully (quota exceeded, unavailable)
    console.warn('Failed to persist session:', error);
    // Graceful degradation - continue without persistence
  }
}

/**
 * Loads session from localStorage with validation
 * Property 11: Session Data Round-Trip
 */
export function loadSession(): LearningSession | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    
    const parsed: StoredSession = JSON.parse(stored);
    
    // Validate version
    if (parsed.version !== SESSION_VERSION) {
      console.warn('Session version mismatch, clearing old session');
      clearSession();
      return null;
    }
    
    // Validate structure
    if (!isValidStoredSession(parsed)) {
      console.warn('Invalid session structure, clearing corrupted session');
      clearSession();
      return null;
    }
    
    // Reconstruct session with proper types
    const session: LearningSession = {
      id: crypto.randomUUID(),
      level: parsed.level || null,
      topics: parsed.topics.map(topic => ({
        ...topic,
        timestamp: new Date(topic.timestamp)
      })),
      createdAt: new Date(),
      settings: parsed.settings
    };
    
    return session;
  } catch (error) {
    console.warn('Failed to load session:', error);
    return null;
  }
}

/**
 * Clears session from localStorage
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.warn('Failed to clear session:', error);
  }
}

/**
 * Validates stored session structure
 */
function isValidStoredSession(data: any): data is StoredSession {
  if (!data || typeof data !== 'object') return false;
  
  // Check required fields
  if (data.version !== SESSION_VERSION) return false;
  if (!Array.isArray(data.topics)) return false;
  if (!data.settings || typeof data.settings !== 'object') return false;
  if (typeof data.lastUpdated !== 'string') return false;
  
  // Validate level if present
  if (data.level !== undefined) {
    if (typeof data.level !== 'number' || data.level < 1 || data.level > 6) {
      return false;
    }
  }
  
  // Validate settings structure
  const settings = data.settings;
  if (
    typeof settings.soundEnabled !== 'boolean' ||
    typeof settings.animationsEnabled !== 'boolean' ||
    typeof settings.reducedMotion !== 'boolean'
  ) {
    return false;
  }
  
  // Validate topics array
  for (const topic of data.topics) {
    if (!isValidTopicEntry(topic)) return false;
  }
  
  return true;
}

/**
 * Validates topic entry structure
 */
function isValidTopicEntry(topic: any): boolean {
  if (!topic || typeof topic !== 'object') return false;
  
  // Check required fields
  if (typeof topic.id !== 'string') return false;
  if (typeof topic.topic !== 'string') return false;
  if (typeof topic.explanation !== 'string') return false;
  if (!Array.isArray(topic.followUpQuestions)) return false;
  if (typeof topic.level !== 'number' || topic.level < 1 || topic.level > 6) return false;
  
  // Validate follow-up questions
  if (topic.followUpQuestions.length !== 2) return false;
  
  for (const question of topic.followUpQuestions) {
    if (!question || typeof question !== 'object') return false;
    if (typeof question.id !== 'string') return false;
    if (typeof question.question !== 'string') return false;
    if (typeof question.isAnswered !== 'boolean') return false;
  }
  
  return true;
}

/**
 * Checks if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets storage usage information
 */
export function getStorageInfo(): {
  available: boolean;
  hasSession: boolean;
  sessionSize?: number;
} {
  const available = isStorageAvailable();
  
  if (!available) {
    return { available: false, hasSession: false };
  }
  
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return {
      available: true,
      hasSession: !!stored,
      sessionSize: stored ? new Blob([stored]).size : 0
    };
  } catch {
    return { available: false, hasSession: false };
  }
}
