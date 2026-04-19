/**
 * Session Logger - Logs user sessions to persistent storage
 */

import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

interface LogSessionParams {
  topic: string;
  level: number;
  explanation: string;
  followUpQuestions?: Array<{
    question: string;
    answer?: string;
  }>;
  request: NextRequest;
}

const LOGS_FILE = path.join(process.cwd(), 'data', 'logs.json');

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
  if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
    return 'Local';
  }
  
  try {
    // Using ipapi.co free tier (1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'ClassMate.info' },
      signal: AbortSignal.timeout(5000) // 5 second timeout
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

/**
 * Log a user session to persistent storage
 */
export async function logSession(params: LogSessionParams): Promise<void> {
  const { topic, level, explanation, followUpQuestions, request } = params;
  
  try {
    const ip = getClientIP(request);
    console.log('[Logger] Detected IP:', ip);
    
    const location = await getLocationFromIP(ip);
    console.log('[Logger] Detected location:', location);
    
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
    
    console.log('[Logger] Creating log entry:', {
      id: newLog.id,
      topic: newLog.topic,
      ip: newLog.ip,
      location: newLog.location
    });
    
    const logs = await readLogs();
    console.log('[Logger] Current logs count:', logs.length);
    
    logs.unshift(newLog); // Add to beginning (newest first)
    
    // Keep only last 1000 logs to prevent file from growing too large
    const trimmedLogs = logs.slice(0, 1000);
    
    await writeLogs(trimmedLogs);
    console.log('[Logger] Log saved successfully. New count:', trimmedLogs.length);
  } catch (error) {
    console.error('[Logger] Error logging session:', error);
    throw error;
  }
}

/**
 * Update a log entry with follow-up answer
 */
export async function updateLogWithAnswer(
  logId: string,
  questionIndex: number,
  answer: string
): Promise<void> {
  try {
    const logs = await readLogs();
    const logIndex = logs.findIndex(log => log.id === logId);
    
    if (logIndex === -1) {
      console.warn('[Logger] Log not found:', logId);
      return;
    }
    
    const log = logs[logIndex];
    if (log.followUpQuestions && log.followUpQuestions[questionIndex]) {
      log.followUpQuestions[questionIndex].answer = answer;
      await writeLogs(logs);
      console.log('[Logger] Follow-up answer updated');
    }
  } catch (error) {
    console.error('[Logger] Error updating log with answer:', error);
    throw error;
  }
}
