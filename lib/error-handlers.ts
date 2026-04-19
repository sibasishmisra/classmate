/**
 * Error handling utilities for ClassMate.info
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 */

import type {
  NetworkError,
  ClaudeAPIError,
  ValidationError,
  ContentSafetyError,
  StorageError,
  AppError
} from '@/types';

/**
 * Friendly error display configuration
 */
export interface FriendlyErrorConfig {
  title: string;
  message: string;
  icon: string;
  retryable?: boolean;
  retryAfter?: number;
}

/**
 * Handle network errors with friendly messages
 * Validates: Requirement 9.2
 */
export function handleNetworkError(error: NetworkError): FriendlyErrorConfig {
  return {
    title: "Can't reach the classroom right now",
    message: "Check your internet connection and try again.",
    icon: "📡",
    retryable: error.retryable
  };
}

/**
 * Handle Claude API errors with status code mapping
 * Validates: Requirement 9.1, 9.4
 */
export function handleClaudeError(error: ClaudeAPIError): FriendlyErrorConfig {
  const errorMessages: Record<number, FriendlyErrorConfig> = {
    401: {
      title: "The teacher needs to check in",
      message: "There's a configuration issue. Please try again later.",
      icon: "🔑",
      retryable: false
    },
    429: {
      title: "The classroom is full right now",
      message: `Too many students learning at once! Try again in ${error.retryAfter || 60} seconds.`,
      icon: "⏰",
      retryable: true,
      retryAfter: error.retryAfter
    },
    500: {
      title: "The teacher stepped out for a moment",
      message: "Something went wrong on our end. Please try again!",
      icon: "🚪",
      retryable: true
    },
    503: {
      title: "School's temporarily closed",
      message: "The service is under maintenance. Check back soon!",
      icon: "🔧",
      retryable: true
    }
  };

  return errorMessages[error.statusCode] || errorMessages[500];
}

/**
 * Handle validation errors with gentle feedback
 * Validates: Requirement 9.6
 */
export function handleValidationError(error: ValidationError): FriendlyErrorConfig {
  const fieldMessages: Record<string, Record<string, FriendlyErrorConfig>> = {
    topic: {
      required: {
        title: "Don't forget your topic!",
        message: "Please enter a topic to learn about.",
        icon: "✏️",
        retryable: false
      },
      maxLength: {
        title: "That's a bit too long",
        message: "Please keep your topic under 500 characters.",
        icon: "✏️",
        retryable: false
      },
      minLength: {
        title: "Tell us more",
        message: "Please enter at least one character.",
        icon: "✏️",
        retryable: false
      }
    },
    level: {
      invalid: {
        title: "Please select a level",
        message: "Choose your learning level to get started.",
        icon: "📚",
        retryable: false
      }
    }
  };

  const fieldConfig = fieldMessages[error.field];
  if (fieldConfig && fieldConfig[error.rule]) {
    return fieldConfig[error.rule];
  }

  // Default validation error
  return {
    title: "Let's try that again",
    message: error.message || "Please check your input and try again.",
    icon: "✏️",
    retryable: false
  };
}

/**
 * Handle content safety errors with non-judgmental redirection
 * Validates: Requirement 9.3
 */
export function handleContentSafetyError(error: ContentSafetyError): FriendlyErrorConfig {
  const safetyMessages: Record<string, FriendlyErrorConfig> = {
    inappropriate_input: {
      title: "Let's learn about something else",
      message: "That topic isn't quite right for our classroom. Try asking about something different!",
      icon: "📚",
      retryable: false
    },
    unsafe_response: {
      title: "Let's try a different approach",
      message: "We couldn't provide a good answer for that. Try rephrasing your question!",
      icon: "📚",
      retryable: false
    }
  };

  return safetyMessages[error.reason] || safetyMessages.inappropriate_input;
}

/**
 * Handle storage errors with graceful degradation
 * Validates: Requirement 9.7
 */
export function handleStorageError(error: StorageError): FriendlyErrorConfig {
  const storageMessages: Record<string, FriendlyErrorConfig> = {
    quota_exceeded: {
      title: "Storage space is full",
      message: "Your session won't be saved, but you can keep learning!",
      icon: "💾",
      retryable: false
    },
    unavailable: {
      title: "Can't save your session",
      message: "Your session won't be saved, but you can keep learning!",
      icon: "💾",
      retryable: false
    },
    corrupted: {
      title: "Session data issue",
      message: "We'll start fresh. Your learning can continue!",
      icon: "💾",
      retryable: false
    }
  };

  return storageMessages[error.reason] || storageMessages.unavailable;
}

/**
 * Generic error handler that routes to specific handlers
 * Validates: Requirement 9.5, 9.6
 */
export function handleError(error: AppError): FriendlyErrorConfig {
  switch (error.type) {
    case 'network':
      return handleNetworkError(error);
    case 'claude_api':
      return handleClaudeError(error);
    case 'validation':
      return handleValidationError(error);
    case 'content_safety':
      return handleContentSafetyError(error);
    case 'storage':
      return handleStorageError(error);
    default:
      // Fallback for unknown error types
      return {
        title: "Something unexpected happened",
        message: "Don't worry, let's try again!",
        icon: "🔄",
        retryable: true
      };
  }
}

/**
 * Log error for debugging without exposing sensitive data
 * Validates: Requirement 9.5
 */
export function logError(error: AppError, context?: Record<string, any>): void {
  const errorLog = {
    timestamp: new Date().toISOString(),
    type: error.type,
    message: 'message' in error ? error.message : ('reason' in error ? error.reason : 'Unknown error'),
    context: {
      hasActiveTopic: context?.hasActiveTopic || false,
      level: context?.level || null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    }
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorLog);
  }

  // In production, this would send to a monitoring service
  // without including any user topics or personal data
}

/**
 * Create a network error
 */
export function createNetworkError(message: string, retryable: boolean = true): NetworkError {
  return {
    type: 'network',
    message,
    retryable
  };
}

/**
 * Create a Claude API error
 */
export function createClaudeError(
  statusCode: number,
  message: string,
  retryAfter?: number
): ClaudeAPIError {
  return {
    type: 'claude_api',
    statusCode,
    message,
    retryAfter
  };
}

/**
 * Create a validation error
 */
export function createValidationError(
  field: string,
  rule: string,
  message: string
): ValidationError {
  return {
    type: 'validation',
    field,
    rule,
    message
  };
}

/**
 * Create a content safety error
 */
export function createContentSafetyError(
  reason: 'inappropriate_input' | 'unsafe_response',
  message: string
): ContentSafetyError {
  return {
    type: 'content_safety',
    reason,
    message
  };
}

/**
 * Create a storage error
 */
export function createStorageError(reason: string): StorageError {
  return {
    type: 'storage',
    reason
  };
}
