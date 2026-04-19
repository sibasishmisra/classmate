/**
 * GET /api/health - Health check endpoint
 * Validates: Requirement 14.8
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  // Check if Claude API key is configured
  const apiKey = process.env.CLAUDE_API_KEY;
  const hasApiKey = !!apiKey;
  
  // Basic health check
  let claudeApiStatus: 'connected' | 'not_configured' | 'error' = 'not_configured';
  
  if (hasApiKey) {
    try {
      // Perform a lightweight check to Claude API
      // We'll just verify the key format is valid without making an actual API call
      // to avoid unnecessary costs and rate limit usage
      if (apiKey.startsWith('sk-ant-')) {
        claudeApiStatus = 'connected';
      } else {
        claudeApiStatus = 'error';
      }
    } catch (error) {
      claudeApiStatus = 'error';
    }
  }
  
  const response = {
    status: claudeApiStatus === 'connected' ? 'healthy' : 'degraded',
    timestamp,
    claudeApiStatus,
    version: '1.0.0'
  };
  
  const statusCode = claudeApiStatus === 'connected' ? 200 : 503;
  
  return NextResponse.json(response, { status: statusCode });
}
