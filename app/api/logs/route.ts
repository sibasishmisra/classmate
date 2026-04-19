import { NextRequest, NextResponse } from 'next/server';
import { readLogs, clearLogs, logSession } from '@/lib/session-logger';

// GET - Retrieve all logs
export async function GET() {
  try {
    const logs = await readLogs();
    return NextResponse.json({ logs, count: logs.length });
  } catch (error) {
    console.error('[API/logs] Error reading logs:', error);
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}

// POST - Add a new log entry (called directly from explain route)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, level, explanation, followUpQuestions } = body;

    if (!topic || !level || !explanation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await logSession({ topic, level, explanation, followUpQuestions, request });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API/logs] Error adding log:', error);
    return NextResponse.json({ error: 'Failed to add log' }, { status: 500 });
  }
}

// DELETE - Clear all logs
export async function DELETE() {
  try {
    await clearLogs();
    return NextResponse.json({ success: true, message: 'All logs cleared' });
  } catch (error) {
    console.error('[API/logs] Error clearing logs:', error);
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
}
