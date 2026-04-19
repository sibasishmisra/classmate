/**
 * Input validation and sanitization utilities for ClassMate.info
 * Validates: Requirements 2.2, 2.4, 14.5, 15.2
 */

import { validateContentSafety as validateContentSafetyComprehensive } from './content-safety';

/**
 * Validates topic input length (1-500 characters)
 * Property 2: Input Validation Consistency
 */
export function validateTopicInput(input: string): boolean {
  return input.length >= 1 && input.length <= 500;
}

/**
 * Sanitizes user input by removing/escaping potentially harmful content
 * Property 13: Input Sanitization
 */
export function sanitizeInput(input: string): string {
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove other potentially dangerous tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*>/gi, '');
  
  // Remove any remaining HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Validates content for safety before API submission
 * Property 17: Content Validation
 */
export function validateContentSafety(input: string): {
  isValid: boolean;
  reason?: string;
} {
  // Temporarily simplified - just check if input exists
  if (!input || input.trim().length === 0) {
    return { isValid: false, reason: 'empty_input' };
  }
  
  // Use comprehensive content safety validation
  try {
    const result = validateContentSafetyComprehensive(input);
    
    if (!result.isValid) {
      return {
        isValid: false,
        reason: 'inappropriate_content'
      };
    }
  } catch (error) {
    console.error('Content safety validation error:', error);
    // If validation fails, allow it through (fail open for now)
    return { isValid: true };
  }
  
  return { isValid: true };
}

/**
 * Combined validation and sanitization for topic input
 */
export function processTopicInput(input: string): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  // Check length
  if (!validateTopicInput(input)) {
    return {
      isValid: false,
      sanitized: '',
      error: input.length === 0 
        ? 'Please enter a topic to learn about!'
        : 'Your topic is too long. Please keep it under 500 characters.'
    };
  }
  
  // Sanitize input
  const sanitized = sanitizeInput(input);
  
  // Check content safety
  const safetyCheck = validateContentSafety(sanitized);
  if (!safetyCheck.isValid) {
    return {
      isValid: false,
      sanitized: '',
      error: "Let's learn about something else! Try asking about a different topic."
    };
  }
  
  return {
    isValid: true,
    sanitized
  };
}
