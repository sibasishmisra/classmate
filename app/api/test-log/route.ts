import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('[TEST] Starting test log...');
    
    // Import the logging function
    const { logSession } = await import('@/lib/session-logger');
    
    // Create a test log
    await logSession({
      topic: 'Test Question - Why is the sky blue?',
      level: 3,
      explanation: 'This is a test explanation to verify logging is working correctly.',
      followUpQuestions: [
        {
          question: 'Test follow-up question 1?',
          answer: undefined
        },
        {
          question: 'Test follow-up question 2?',
          answer: undefined
        }
      ],
      request
    });
    
    console.log('[TEST] Test log created successfully');
    
    // Read the logs to verify
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const logsFile = path.join(process.cwd(), 'data', 'logs.json');
    
    const data = await fs.readFile(logsFile, 'utf-8');
    const logs = JSON.parse(data);
    
    return NextResponse.json({
      success: true,
      message: 'Test log created successfully',
      logsCount: logs.length,
      lastLog: logs[0]
    });
  } catch (error: any) {
    console.error('[TEST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
