/**
 * POST /api/answer - Answer a follow-up question with context
 * Validates: Requirements 4.3, 14.2, 14.5, 14.6
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnswerRequest, AnswerResponse, ClaudeRequest, ClaudeResponse, LearningLevel } from '@/types';
import { sanitizeInput } from '@/lib/validation';
import { withRateLimit } from '@/lib/rate-limiter';
import { filterResponseContent, createPrivacyPreservingLog } from '@/lib/content-safety';

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
    // Parse request body
    const body: AnswerRequest = await request.json();
    const { question, context, level } = body;

    // Validate level
    if (!level || level < 1 || level > 6) {
      return NextResponse.json(
        { error: 'Invalid learning level. Please select a level between 1 and 6.' },
        { status: 400 }
      );
    }

    // Validate question
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a question.' },
        { status: 400 }
      );
    }

    // Validate context
    if (!context || typeof context !== 'string' || context.trim().length === 0) {
      return NextResponse.json(
        { error: 'Context is required to answer the question.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedQuestion = sanitizeInput(question);
    const sanitizedContext = sanitizeInput(context);

    // Check for API key
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('CLAUDE_API_KEY not configured');
      return NextResponse.json(
        { error: 'The teacher needs to check in. Please try again later.' },
        { status: 500 }
      );
    }

    // Format Claude API request
    const age = AGE_MAP[level];
    const systemPrompt = `You are a patient teacher answering a follow-up question for a ${age} student from anywhere in the world.

Provide a clear, concise answer that:
- Builds on the previous explanation
- Uses simple, culturally neutral language
- Avoids country-specific references or cultural assumptions
- Is globally relatable
- Encourages further curiosity
- Stays under 200 words`;

    const claudeRequest: ClaudeRequest = {
      model: 'claude-sonnet-4-20250514',  // Claude Sonnet 4 (newest)
      max_tokens: 20000,
      messages: [
        {
          role: 'user',
          content: `Original Context:
${sanitizedContext}

Follow-up Question: ${sanitizedQuestion}

Please answer this question.`
        }
      ],
      system: systemPrompt
    };

    // Import the SDK-based client
    const { callClaudeAPI } = await import('@/lib/claude-api-client');

    // Call Claude API using the SDK client with retry and circuit breaker
    let claudeData: ClaudeResponse;
    try {
      claudeData = await callClaudeAPI(claudeRequest, {
        apiKey,
        timeoutMs: 30000,
        maxRetries: 3,
        onRetry: (attempt, error) => {
          console.log(`[API] Retry attempt ${attempt} due to:`, error.message);
        }
      });
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        return NextResponse.json(
          { error: 'The answer is taking too long. Please try again!' },
          { status: 504 }
        );
      }
      
      if (error.status === 401) {
        console.error('Invalid Claude API key');
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

    const answer = claudeData.content[0].text;

    // Validate content safety
    const contentCheck = filterResponseContent(answer);
    if (contentCheck.isFiltered) {
      console.error('Answer content filtered:', contentCheck.reason);
      
      // Log without question/answer (privacy-preserving)
      const logEntry = createPrivacyPreservingLog({
        timestamp: new Date(),
        level,
        responseTime: Date.now() - startTime,
        statusCode: 500,
        errorType: 'content_filtered'
      });
      console.log('API Error:', logEntry);
      
      return NextResponse.json(
        { error: 'Unable to generate appropriate content. Please try a different question!' },
        { status: 500 }
      );
    }

    // Return successful response
    const response: AnswerResponse = {
      answer
    };

    // Log successful request (privacy-preserving)
    const logEntry = createPrivacyPreservingLog({
      timestamp: new Date(),
      level,
      responseTime: Date.now() - startTime,
      statusCode: 200
    });
    console.log('API Success:', logEntry);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in /api/answer:', error);
    
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
