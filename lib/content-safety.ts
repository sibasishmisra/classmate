/**
 * Content Safety Utilities
 * 
 * Provides client-side content validation and filtering for ClassMate.info.
 * Ensures age-appropriate content for students ages 9-14.
 * 
 * Validates: Requirements 15.1, 15.2, 15.3
 */

/**
 * List of inappropriate keywords and patterns to filter
 * This is a basic implementation - production would use more sophisticated filtering
 */
const INAPPROPRIATE_PATTERNS = [
  // Violence
  /\b(kill|murder|weapon|gun|bomb|terrorist|violence)\b/i,
  // Adult content
  /\b(sex|porn|nude|xxx)\b/i,
  // Drugs
  /\b(drug|cocaine|heroin|meth)\b/i,
  // Hate speech
  /\b(hate|racist|nazi)\b/i,
  // Self-harm
  /\b(suicide|self-harm|cutting)\b/i,
];

/**
 * Educational exceptions - topics that might match patterns but are educational
 */
const EDUCATIONAL_EXCEPTIONS = [
  /\b(world war|history|historical)\b/i,
  /\b(biology|anatomy|science)\b/i,
  /\b(medicine|medical|health)\b/i,
];

/**
 * Validates user input for inappropriate content
 * 
 * @param input - The user's topic input
 * @returns Object with isValid flag and optional error message
 */
export function validateContentSafety(input: string): {
  isValid: boolean;
  error?: string;
} {
  if (!input || input.trim().length === 0) {
    return { isValid: true };
  }

  const normalizedInput = input.toLowerCase().trim();

  // Check for educational exceptions first
  const hasEducationalContext = EDUCATIONAL_EXCEPTIONS.some(pattern =>
    pattern.test(normalizedInput)
  );

  // Check for inappropriate patterns
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(normalizedInput) && !hasEducationalContext) {
      return {
        isValid: false,
        error: "Let's learn about something else! That topic isn't quite right for our classroom. Try asking about something different!"
      };
    }
  }

  return { isValid: true };
}

/**
 * Filters potentially inappropriate content from API responses
 * 
 * @param content - The content to filter
 * @returns Object with filtered flag and cleaned content
 */
export function filterResponseContent(content: string): {
  isFiltered: boolean;
  content: string;
  reason?: string;
} {
  if (!content || content.trim().length === 0) {
    return { isFiltered: false, content };
  }

  // Check for inappropriate patterns in response
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isFiltered: true,
        content: '',
        reason: 'Response contained inappropriate content'
      };
    }
  }

  return { isFiltered: false, content };
}

/**
 * Validates that API response contains required fields and appropriate content
 * 
 * @param response - The API response object
 * @returns Object with isValid flag and optional error message
 */
export function validateAPIResponse(response: any): {
  isValid: boolean;
  error?: string;
} {
  // Check for required fields
  if (!response) {
    return {
      isValid: false,
      error: 'Empty response from API'
    };
  }

  if (typeof response.explanation !== 'string' || response.explanation.trim().length === 0) {
    return {
      isValid: false,
      error: 'Missing or invalid explanation in response'
    };
  }

  if (!Array.isArray(response.followUpQuestions)) {
    return {
      isValid: false,
      error: 'Missing or invalid follow-up questions in response'
    };
  }

  // Allow 0-2 follow-up questions (more lenient)
  if (response.followUpQuestions.length > 2) {
    // Trim to 2 questions
    response.followUpQuestions = response.followUpQuestions.slice(0, 2);
  }

  // Validate content safety
  const explanationCheck = filterResponseContent(response.explanation);
  if (explanationCheck.isFiltered) {
    return {
      isValid: false,
      error: 'Response contained inappropriate content'
    };
  }

  // Validate follow-up questions
  for (const question of response.followUpQuestions) {
    if (!question.id || !question.question) {
      return {
        isValid: false,
        error: 'Invalid follow-up question format'
      };
    }

    const questionCheck = filterResponseContent(question.question);
    if (questionCheck.isFiltered) {
      return {
        isValid: false,
        error: 'Follow-up question contained inappropriate content'
      };
    }
  }

  return { isValid: true };
}

/**
 * Creates a privacy-preserving log entry
 * Excludes student topics and personally identifiable information
 * 
 * @param metadata - Metadata to log (timestamp, level, response time, etc.)
 * @returns Sanitized log entry
 */
export function createPrivacyPreservingLog(metadata: {
  timestamp: Date;
  level?: number;
  responseTime?: number;
  statusCode?: number;
  errorType?: string;
}): Record<string, any> {
  return {
    timestamp: metadata.timestamp.toISOString(),
    level: metadata.level,
    responseTime: metadata.responseTime,
    statusCode: metadata.statusCode,
    errorType: metadata.errorType,
    // Explicitly exclude: topic, explanation, questions, user identifiers
  };
}
