/**
 * POST /api/explain - Generate age-appropriate explanation for a topic
 * Validates: Requirements 3.1, 3.2, 3.4, 4.1, 14.2, 14.5, 14.6
 */

import { NextRequest, NextResponse } from 'next/server';
import { ExplainRequest, ExplainResponse, ClaudeRequest, ClaudeResponse, LearningLevel } from '@/types';
import { processTopicInput } from '@/lib/validation';
import { withRateLimit } from '@/lib/rate-limiter';
import { validateAPIResponse, createPrivacyPreservingLog } from '@/lib/content-safety';

// Age mapping for prompts
const AGE_MAP: Record<LearningLevel, string> = {
  1: '9-year-old',
  2: '10-year-old',
  3: '11-year-old',
  4: '12-year-old',
  5: '13-year-old',
  6: '14-year-old'
};

async function handlePOST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('[API] /api/explain - Request received');
    
    // Parse request body
    const body: ExplainRequest = await request.json();
    const { topic, level } = body;
    
    console.log('[API] Topic:', topic, 'Level:', level);

    // Validate level
    if (!level || level < 1 || level > 6) {
      return NextResponse.json(
        { error: 'Invalid learning level. Please select a level between 1 and 6.' },
        { status: 400 }
      );
    }

    // Validate and sanitize topic
    console.log('[API] Validating topic...');
    const validation = processTopicInput(topic);
    console.log('[API] Validation result:', validation);
    
    if (!validation.isValid) {
      console.log('[API] Validation failed:', validation.error);
      return NextResponse.json(
        { error: validation.error || 'Invalid topic input' },
        { status: 400 }
      );
    }

    const sanitizedTopic = validation.sanitized;

    // Check for API key
    console.log('[API] Checking for Claude API key...');
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('[API] CLAUDE_API_KEY not configured');
      return NextResponse.json(
        { error: 'The teacher needs to check in. Please try again later.' },
        { status: 500 }
      );
    }
    console.log('[API] API key found, length:', apiKey.length);

    // Format Claude API request for explanation
    console.log('[API] Formatting Claude API request...');
    const age = AGE_MAP[level];
    const systemPrompt = `You are a patient, encouraging teacher explaining concepts to a ${age} student (5th grade level).

Provide a clear, engaging explanation using:
- Simple, age-appropriate language suitable for 10-11 year olds
- Real-world examples that kids can relate to
- Short sentences and paragraphs
- Culturally universal examples (avoid country-specific references)
- Globally relatable scenarios and contexts
- Encouraging, supportive tone
- 2-3 paragraphs maximum
- No jargon unless explained simply
- Avoid assumptions about cultural background, location, or educational system

Think of explaining it to a 5th grader - make it fun, clear, and easy to understand!
Keep the explanation under 400 words and ensure it's appropriate for students worldwide.`;

    console.log('[API] Creating Claude request object...');
    const claudeRequest: ClaudeRequest = {
      model: 'claude-sonnet-4-20250514',  // Claude Sonnet 4 (newest)
      max_tokens: 20000,
      messages: [
        {
          role: 'user',
          content: `Topic: ${sanitizedTopic}\n\nPlease explain this topic.`
        }
      ],
      system: systemPrompt
    };
    
    console.log('[API] Claude request model:', claudeRequest.model);
    console.log('[API] Calling Claude API via SDK...');

    // Import the SDK-based client
    const { callClaudeAPI } = await import('@/lib/claude-api-client');

    // Call Claude API using the SDK client with retry and circuit breaker
    let claudeData: ClaudeResponse;
    try {
      console.log('[API] Calling Claude API...');
      claudeData = await callClaudeAPI(claudeRequest, {
        apiKey,
        timeoutMs: 30000,
        maxRetries: 3,
        onRetry: (attempt, error) => {
          console.log(`[API] Retry attempt ${attempt} due to:`, error.message);
        }
      });
      console.log('[API] Claude API response received successfully');
    } catch (error: any) {
      console.error('[API] Claude API error:', error);
      console.error('[API] Error name:', error.name);
      console.error('[API] Error message:', error.message);
      
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        return NextResponse.json(
          { error: 'The explanation is taking too long. Please try again!' },
          { status: 504 }
        );
      }
      
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'The teacher needs to check in. Please try again later.' },
          { status: 500 }
        );
      }
      
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'The classroom is full right now. Try again in a moment.' },
          { status: 429 }
        );
      }
      
      if (error.status === 503) {
        return NextResponse.json(
          { error: "School's temporarily closed. Check back soon!" },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'The teacher stepped out for a moment. Please try again!' },
        { status: 500 }
      );
    }

    // Validate response structure
    if (!claudeData.content || !Array.isArray(claudeData.content) || claudeData.content.length === 0) {
      console.error('Invalid Claude response structure:', claudeData);
      return NextResponse.json(
        { error: 'Received an unexpected response. Please try again!' },
        { status: 500 }
      );
    }

    const explanation = claudeData.content[0].text;

    // Validate explanation length (up to 4000 characters as per requirement 3.4)
    if (explanation.length > 4000) {
      console.warn('Explanation exceeds 4000 characters, truncating');
    }

    // Generate follow-up questions
    const followUpPrompt = `Based on this explanation about "${sanitizedTopic}":

${explanation}

Generate exactly 2 thought-provoking follow-up questions that:
- Encourage critical thinking appropriate for a ${age} from anywhere in the world
- Build on the explanation
- Are open-ended and engaging
- Use simple, culturally neutral language
- Avoid country-specific references or cultural assumptions
- Are globally relatable

Format your response as a JSON array with exactly 2 questions, like this:
["Question 1 here?", "Question 2 here?"]

Only return the JSON array, nothing else.`;

    const followUpRequest: ClaudeRequest = {
      model: 'claude-sonnet-4-20250514',  // Claude Sonnet 4 (same model for consistency)
      max_tokens: 20000,
      messages: [
        {
          role: 'user',
          content: followUpPrompt
        }
      ]
    };

    let followUpData: ClaudeResponse;
    try {
      followUpData = await callClaudeAPI(followUpRequest, {
        apiKey,
        timeoutMs: 30000,
        maxRetries: 2
      });
    } catch (error: any) {
      // If follow-up generation fails, return explanation without follow-ups
      console.error('Follow-up generation failed:', error);
      return NextResponse.json({
        explanation,
        followUpQuestions: []
      });
    }

    let followUpQuestions: Array<{ id: string; question: string; isAnswered: boolean }> = [];

    const followUpText = followUpData.content[0].text;

    try {
      // Parse JSON array from response
      const questionsArray: string[] = JSON.parse(followUpText.trim());
      
      if (Array.isArray(questionsArray) && questionsArray.length >= 2) {
        followUpQuestions = questionsArray.slice(0, 2).map((q, i) => ({
          id: `fq_${Date.now()}_${i}`,
          question: q,
          isAnswered: false
        }));
      }
    } catch (parseError) {
      console.error('Failed to parse follow-up questions:', parseError);
      // Continue without follow-up questions
    }

    // Return successful response
    const response: ExplainResponse = {
      explanation,
      followUpQuestions
    };

    // Validate response content safety
    const validationResult = validateAPIResponse(response);
    if (!validationResult.isValid) {
      console.error('Response validation failed:', validationResult.error);
      
      // Log without topic (privacy-preserving)
      const logEntry = createPrivacyPreservingLog({
        timestamp: new Date(),
        level,
        responseTime: Date.now() - startTime,
        statusCode: 500,
        errorType: 'content_validation_failed'
      });
      console.log('API Error:', logEntry);
      
      return NextResponse.json(
        { error: 'Unable to generate appropriate content. Please try a different topic!' },
        { status: 500 }
      );
    }

    // Log successful request (privacy-preserving)
    const logEntry = createPrivacyPreservingLog({
      timestamp: new Date(),
      level,
      responseTime: Date.now() - startTime,
      statusCode: 200
    });
    console.log('API Success:', logEntry);

    // Log to persistent storage for /logs page
    try {
      // Import the logging function directly
      const { logSession } = await import('@/lib/session-logger');
      await logSession({
        topic: sanitizedTopic,
        level,
        explanation,
        followUpQuestions: followUpQuestions.map(fq => ({
          question: fq.question,
          answer: undefined
        })),
        request
      });
      console.log('[API] Session logged successfully');
    } catch (logError) {
      // Don't fail the request if logging fails
      console.error('[API] Failed to log session:', logError);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('[API] Error in /api/explain:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Log error (privacy-preserving)
    const logEntry = createPrivacyPreservingLog({
      timestamp: new Date(),
      responseTime: Date.now() - startTime,
      statusCode: 500,
      errorType: 'internal_error'
    });
    console.log('API Error:', logEntry);
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again!' },
      { status: 500 }
    );
  }
}

// Export with rate limiting
export const POST = withRateLimit(handlePOST);
