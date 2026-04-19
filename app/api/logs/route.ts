import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LOGS_FILE = path.join(process.cwd(), 'data', 'logs.json');

interface LogEntry {
  id: string;
  timestamp: string;
  ip: string;
  location?: string;
  topic: string;
  level: number;
  explanation: string;
  followUpQuestions?: Array<{
    question: string;
    answer?: string;
  }>;
}

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read logs from file
async function readLogs(): Promise<LogEntry[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(LOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

// Write logs to file
async function writeLogs(logs: LogEntry[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

// Get approximate location from IP (using a free service)
async function getLocationFromIP(ip: string): Promise<string | undefined> {
  if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
    return 'Local';
  }
  
  try {
    // Using ipapi.co free tier (1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'ClassMate.info' }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.city && data.country_name) {
        return `${data.city}, ${data.country_name}`;
      }
      if (data.country_name) {
        return data.country_name;
      }
    }
  } catch (error) {
    console.error('Failed to get location:', error);
  }
  
  return undefined;
}

// GET - Retrieve all logs
export async function GET() {
  try {
    const logs = await readLogs();
    return NextResponse.json({ logs, count: logs.length });
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json(
      { error: 'Failed to read logs' },
      { status: 500 }
    );
  }
}

// POST - Add a new log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, level, explanation, followUpQuestions } = body;
    
    if (!topic || !level || !explanation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const ip = getClientIP(request);
    const location = await getLocationFromIP(ip);
    
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ip,
      location,
      topic,
      level,
      explanation,
      followUpQuestions: followUpQuestions || []
    };
    
    const logs = await readLogs();
    logs.unshift(newLog); // Add to beginning (newest first)
    
    // Keep only last 1000 logs to prevent file from growing too large
    const trimmedLogs = logs.slice(0, 1000);
    
    await writeLogs(trimmedLogs);
    
    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    console.error('Error adding log:', error);
    return NextResponse.json(
      { error: 'Failed to add log' },
      { status: 500 }
    );
  }
}

// DELETE - Clear all logs
export async function DELETE() {
  try {
    await writeLogs([]);
    return NextResponse.json({ success: true, message: 'All logs cleared' });
  } catch (error) {
    console.error('Error clearing logs:', error);
    return NextResponse.json(
      { error: 'Failed to clear logs' },
      { status: 500 }
    );
  }
}
