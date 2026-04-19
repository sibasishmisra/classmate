import { NextRequest, NextResponse } from 'next/server';
import { logSession, readLogs } from '@/lib/session-logger';

export async function GET(request: NextRequest) {
  try {
    console.log('[TEST] Creating test log entry...');

    await logSession({
      topic: 'Test: Why is the sky blue?',
      level: 3,
      explanation: 'Test explanation to verify logging is working in this environment.',
      followUpQuestions: [
        { question: 'Why does the sky turn red at sunset?' },
        { question: 'What would the sky look like on Mars?' },
      ],
      request,
    });

    const logs = await readLogs();

    return NextResponse.json({
      success: true,
      message: 'Test log created',
      totalLogs: logs.length,
      latestLog: logs[0],
      storageBackend: process.env.DATABASE_URL ? 'neon-postgres' : 'file',
    });
  } catch (error: any) {
    console.error('[TEST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
