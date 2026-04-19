/**
 * Unit tests for error handling utilities
 */

import {
  handleNetworkError,
  handleClaudeError,
  handleValidationError,
  handleContentSafetyError,
  handleStorageError,
  handleError,
  createNetworkError,
  createClaudeError,
  createValidationError,
  createContentSafetyError,
  createStorageError,
  logError
} from '../error-handlers';

describe('Error Handlers', () => {
  describe('handleNetworkError', () => {
    it('should return friendly network error message', () => {
      const error = createNetworkError('Connection failed', true);
      const result = handleNetworkError(error);

      expect(result.title).toBe("Can't reach the classroom right now");
      expect(result.message).toBe("Check your internet connection and try again.");
      expect(result.icon).toBe("📡");
      expect(result.retryable).toBe(true);
    });

    it('should handle non-retryable network errors', () => {
      const error = createNetworkError('DNS failure', false);
      const result = handleNetworkError(error);

      expect(result.retryable).toBe(false);
    });
  });

  describe('handleClaudeError', () => {
    it('should handle 401 unauthorized error', () => {
      const error = createClaudeError(401, 'Unauthorized');
      const result = handleClaudeError(error);

      expect(result.title).toBe("The teacher needs to check in");
      expect(result.icon).toBe("🔑");
      expect(result.retryable).toBe(false);
    });

    it('should handle 429 rate limit error with retry time', () => {
      const error = createClaudeError(429, 'Rate limited', 60);
      const result = handleClaudeError(error);

      expect(result.title).toBe("The classroom is full right now");
      expect(result.message).toContain('60 seconds');
      expect(result.icon).toBe("⏰");
      expect(result.retryable).toBe(true);
      expect(result.retryAfter).toBe(60);
    });

    it('should handle 500 internal server error', () => {
      const error = createClaudeError(500, 'Internal error');
      const result = handleClaudeError(error);

      expect(result.title).toBe("The teacher stepped out for a moment");
      expect(result.icon).toBe("🚪");
      expect(result.retryable).toBe(true);
    });

    it('should handle 503 service unavailable', () => {
      const error = createClaudeError(503, 'Service unavailable');
      const result = handleClaudeError(error);

      expect(result.title).toBe("School's temporarily closed");
      expect(result.icon).toBe("🔧");
      expect(result.retryable).toBe(true);
    });

    it('should default to 500 error for unknown status codes', () => {
      const error = createClaudeError(418, "I'm a teapot");
      const result = handleClaudeError(error);

      expect(result.title).toBe("The teacher stepped out for a moment");
      expect(result.retryable).toBe(true);
    });
  });

  describe('handleValidationError', () => {
    it('should handle required topic error', () => {
      const error = createValidationError('topic', 'required', 'Topic is required');
      const result = handleValidationError(error);

      expect(result.title).toBe("Don't forget your topic!");
      expect(result.message).toBe("Please enter a topic to learn about.");
      expect(result.icon).toBe("✏️");
      expect(result.retryable).toBe(false);
    });

    it('should handle topic max length error', () => {
      const error = createValidationError('topic', 'maxLength', 'Topic too long');
      const result = handleValidationError(error);

      expect(result.title).toBe("That's a bit too long");
      expect(result.message).toContain('500 characters');
      expect(result.icon).toBe("✏️");
    });

    it('should handle topic min length error', () => {
      const error = createValidationError('topic', 'minLength', 'Topic too short');
      const result = handleValidationError(error);

      expect(result.title).toBe("Tell us more");
      expect(result.message).toContain('at least one character');
    });

    it('should handle invalid level error', () => {
      const error = createValidationError('level', 'invalid', 'Invalid level');
      const result = handleValidationError(error);

      expect(result.title).toBe("Please select a level");
      expect(result.icon).toBe("📚");
    });

    it('should handle unknown validation errors with default message', () => {
      const error = createValidationError('unknown', 'unknown', 'Custom error message');
      const result = handleValidationError(error);

      expect(result.title).toBe("Let's try that again");
      expect(result.message).toBe('Custom error message');
      expect(result.icon).toBe("✏️");
    });
  });

  describe('handleContentSafetyError', () => {
    it('should handle inappropriate input error', () => {
      const error = createContentSafetyError('inappropriate_input', 'Content flagged');
      const result = handleContentSafetyError(error);

      expect(result.title).toBe("Let's learn about something else");
      expect(result.message).toContain("isn't quite right for our classroom");
      expect(result.icon).toBe("📚");
      expect(result.retryable).toBe(false);
    });

    it('should handle unsafe response error', () => {
      const error = createContentSafetyError('unsafe_response', 'Response filtered');
      const result = handleContentSafetyError(error);

      expect(result.title).toBe("Let's try a different approach");
      expect(result.message).toContain("couldn't provide a good answer");
      expect(result.icon).toBe("📚");
    });
  });

  describe('handleStorageError', () => {
    it('should handle quota exceeded error', () => {
      const error = createStorageError('quota_exceeded');
      const result = handleStorageError(error);

      expect(result.title).toBe("Storage space is full");
      expect(result.message).toContain("won't be saved");
      expect(result.icon).toBe("💾");
      expect(result.retryable).toBe(false);
    });

    it('should handle unavailable storage error', () => {
      const error = createStorageError('unavailable');
      const result = handleStorageError(error);

      expect(result.title).toBe("Can't save your session");
      expect(result.message).toContain("you can keep learning");
    });

    it('should handle corrupted data error', () => {
      const error = createStorageError('corrupted');
      const result = handleStorageError(error);

      expect(result.title).toBe("Session data issue");
      expect(result.message).toContain("start fresh");
    });

    it('should default to unavailable for unknown storage errors', () => {
      const error = createStorageError('unknown_reason');
      const result = handleStorageError(error);

      expect(result.title).toBe("Can't save your session");
    });
  });

  describe('handleError (generic handler)', () => {
    it('should route network errors correctly', () => {
      const error = createNetworkError('Connection failed', true);
      const result = handleError(error);

      expect(result.title).toBe("Can't reach the classroom right now");
    });

    it('should route Claude API errors correctly', () => {
      const error = createClaudeError(500, 'Server error');
      const result = handleError(error);

      expect(result.title).toBe("The teacher stepped out for a moment");
    });

    it('should route validation errors correctly', () => {
      const error = createValidationError('topic', 'required', 'Required');
      const result = handleError(error);

      expect(result.title).toBe("Don't forget your topic!");
    });

    it('should route content safety errors correctly', () => {
      const error = createContentSafetyError('inappropriate_input', 'Flagged');
      const result = handleError(error);

      expect(result.title).toBe("Let's learn about something else");
    });

    it('should route storage errors correctly', () => {
      const error = createStorageError('unavailable');
      const result = handleError(error);

      expect(result.title).toBe("Can't save your session");
    });

    it('should handle unknown error types with fallback', () => {
      const error = { type: 'unknown', message: 'Unknown error' } as any;
      const result = handleError(error);

      expect(result.title).toBe("Something unexpected happened");
      expect(result.message).toBe("Don't worry, let's try again!");
      expect(result.retryable).toBe(true);
    });
  });

  describe('logError', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should log error in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = createNetworkError('Test error', true);
      logError(error, { hasActiveTopic: true, level: 3 });

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.type).toBe('network');
      expect(loggedData.context.hasActiveTopic).toBe(true);
      expect(loggedData.context.level).toBe(3);

      process.env.NODE_ENV = originalEnv;
    });

    it('should not log to console in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = createNetworkError('Test error', true);
      logError(error);

      expect(consoleErrorSpy).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });

    it('should include timestamp in log', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = createClaudeError(500, 'Test');
      logError(error);

      const loggedData = consoleErrorSpy.mock.calls[0][1];
      expect(loggedData.timestamp).toBeDefined();
      expect(new Date(loggedData.timestamp).toString()).not.toBe('Invalid Date');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error factory functions', () => {
    it('should create network error with correct structure', () => {
      const error = createNetworkError('Connection failed', true);

      expect(error.type).toBe('network');
      expect(error.message).toBe('Connection failed');
      expect(error.retryable).toBe(true);
    });

    it('should create Claude error with correct structure', () => {
      const error = createClaudeError(429, 'Rate limited', 60);

      expect(error.type).toBe('claude_api');
      expect(error.statusCode).toBe(429);
      expect(error.message).toBe('Rate limited');
      expect(error.retryAfter).toBe(60);
    });

    it('should create validation error with correct structure', () => {
      const error = createValidationError('topic', 'required', 'Required field');

      expect(error.type).toBe('validation');
      expect(error.field).toBe('topic');
      expect(error.rule).toBe('required');
      expect(error.message).toBe('Required field');
    });

    it('should create content safety error with correct structure', () => {
      const error = createContentSafetyError('inappropriate_input', 'Flagged content');

      expect(error.type).toBe('content_safety');
      expect(error.reason).toBe('inappropriate_input');
      expect(error.message).toBe('Flagged content');
    });

    it('should create storage error with correct structure', () => {
      const error = createStorageError('quota_exceeded');

      expect(error.type).toBe('storage');
      expect(error.reason).toBe('quota_exceeded');
    });
  });
});
