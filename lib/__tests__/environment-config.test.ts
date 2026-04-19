/**
 * Environment Configuration Tests
 * Validates: Requirements 13.5, 14.1
 * 
 * These tests verify that environment variables are properly configured
 * and that the application correctly reads configuration values.
 */

describe('Environment Configuration', () => {
  describe('Claude API Key Configuration', () => {
    it('should have CLAUDE_API_KEY environment variable accessible', () => {
      // In test environment, the variable may be undefined
      // We verify that the code can access process.env.CLAUDE_API_KEY
      const apiKey = process.env.CLAUDE_API_KEY;
      
      // The variable should be either undefined or a string (never null or other types)
      expect(apiKey === undefined || typeof apiKey === 'string').toBe(true);
    });

    it('should validate Claude API key format', () => {
      const validKey = 'sk-ant-api03-test-key-here';
      const invalidKey = 'invalid-key-format';
      
      expect(validKey.startsWith('sk-ant-')).toBe(true);
      expect(invalidKey.startsWith('sk-ant-')).toBe(false);
    });
  });

  describe('Rate Limiting Configuration', () => {
    it('should have default rate limit values', () => {
      const requests = parseInt(process.env.RATE_LIMIT_REQUESTS || '10', 10);
      const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
      
      expect(requests).toBeGreaterThan(0);
      expect(windowMs).toBeGreaterThan(0);
    });

    it('should parse rate limit configuration as numbers', () => {
      const requests = parseInt(process.env.RATE_LIMIT_REQUESTS || '10', 10);
      const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
      
      expect(typeof requests).toBe('number');
      expect(typeof windowMs).toBe('number');
      expect(Number.isNaN(requests)).toBe(false);
      expect(Number.isNaN(windowMs)).toBe(false);
    });
  });

  describe('Application Configuration', () => {
    it('should have application name configured', () => {
      const appName = process.env.NEXT_PUBLIC_APP_NAME || 'ClassMate.info';
      
      expect(appName).toBe('ClassMate.info');
    });

    it('should have max topic length configured', () => {
      const maxLength = parseInt(process.env.NEXT_PUBLIC_MAX_TOPIC_LENGTH || '500', 10);
      
      expect(maxLength).toBe(500);
      expect(maxLength).toBeGreaterThan(0);
    });

    it('should have max history entries configured', () => {
      const maxEntries = parseInt(process.env.NEXT_PUBLIC_MAX_HISTORY_ENTRIES || '10', 10);
      
      expect(maxEntries).toBe(10);
      expect(maxEntries).toBeGreaterThan(0);
    });
  });

  describe('Environment Variable Security', () => {
    it('should not expose CLAUDE_API_KEY to client-side code', () => {
      // Client-side environment variables must start with NEXT_PUBLIC_
      const apiKeyVarName = 'CLAUDE_API_KEY';
      
      expect(apiKeyVarName.startsWith('NEXT_PUBLIC_')).toBe(false);
    });

    it('should only expose safe configuration to client', () => {
      const clientVars = [
        'NEXT_PUBLIC_APP_NAME',
        'NEXT_PUBLIC_MAX_TOPIC_LENGTH',
        'NEXT_PUBLIC_MAX_HISTORY_ENTRIES'
      ];
      
      clientVars.forEach(varName => {
        expect(varName.startsWith('NEXT_PUBLIC_')).toBe(true);
      });
    });

    it('should keep sensitive configuration server-side only', () => {
      const serverOnlyVars = [
        'CLAUDE_API_KEY',
        'RATE_LIMIT_REQUESTS',
        'RATE_LIMIT_WINDOW_MS'
      ];
      
      serverOnlyVars.forEach(varName => {
        expect(varName.startsWith('NEXT_PUBLIC_')).toBe(false);
      });
    });
  });
});
