/**
 * Session Logger - Logs user sessions to persistent storage
 * Uses Upstash Redis in production, local file in development
 */

import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export interface LogEntry {
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

// ─── Storage Backend ──────────────────────────────────────────────────────────

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const LOGS_KEY = 'classmate:logs';
const MAX_LOGS = 1000;

// Check if Redis is configured
function isRedisConfigured(): boolean {
  return !!(REDIS_URL && REDIS_TOKEN);
}

// ─── Redis Storage ────────────────────────────────────────────────────────────

async function redisCommand(command: string[]): Promise<any> {
  const response = await fetch(`${REDIS_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`Redis error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

async function redisReadLogs(): Promise<LogEntry[]> {
  try {
    // LRANGE key 0 -1 returns all items
    const items: string[] = await redisCommand(['LRANGE', LOGS_KEY, '0', '-1']);
    if (!items || items.length === 0) return [];
    return items.map((item) => JSON.parse(item));
  } catch (error) {
    console.error('[Logger] Redis read error:', error);
    return [];
  }
}

async function redisWriteLog(entry: LogEntry): Promise<void> {
  // LPUSH prepends (newest first), then trim to MAX_LOGS
  await redisCommand(['LPUSH', LOGS_KEY, JSON.stringify(entry)]);
  await redisCommand(['LTRIM', LOGS_KEY, '0', String(MAX_LOGS - 1)]);
}

async function redisClearLogs(): Promise<void> {
  await redisCommand(['DEL', LOGS_KEY]);
}

// ─── File Storage (Development fallback) ─────────────────────────────────────

const LOGS_FILE = path.join(process.cwd(), 'data', 'logs.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function fileReadLogs(): Promise<LogEntry[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(LOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function fileWriteLog(entry: LogEntry): Promise<void> {
  await ensureDataDir();
  const logs = await fileReadLogs();
  logs.unshift(entry);
  const trimmed = logs.slice(0, MAX_LOGS);
  await fs.writeFile(LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
}

async function fileClearLogs(): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(LOGS_FILE, '[]', 'utf-8');
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function readLogs(): Promise<LogEntry[]> {
  if (isRedisConfigured()) {
    console.log('[Logger] Using Redis storage');
    return redisReadLogs();
  }
  console.log('[Logger] Using file storage (dev)');
  return fileReadLogs();
}

export async function clearLogs(): Promise<void> {
  if (isRedisConfigured()) {
    return redisClearLogs();
  }
  return fileClearLogs();
}

// ─── IP & Location ────────────────────────────────────────────────────────────

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;

  return 'unknown';
}

async function getLocationFromIP(ip: string): Promise<string | undefined> {
  const isLocal =
    ip === 'unknown' ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.');

  if (isLocal) return 'Local';

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'ClassMate.info' },
      signal: AbortSignal.timeout(4000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.city && data.country_name) return `${data.city}, ${data.country_name}`;
      if (data.country_name) return data.country_name;
    }
  } catch {
    // silently fail
  }

  return undefined;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface LogSessionParams {
  topic: string;
  level: number;
  explanation: string;
  followUpQuestions?: Array<{ question: string; answer?: string }>;
  request: NextRequest;
}

export async function logSession(params: LogSessionParams): Promise<void> {
  const { topic, level, explanation, followUpQuestions, request } = params;

  const ip = getClientIP(request);
  const location = await getLocationFromIP(ip);

  const entry: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ip,
    location,
    topic,
    level,
    explanation,
    followUpQuestions: followUpQuestions || [],
  };

  console.log('[Logger] Saving log:', {
    id: entry.id,
    topic: entry.topic,
    ip: entry.ip,
    location: entry.location,
    backend: isRedisConfigured() ? 'redis' : 'file',
  });

  if (isRedisConfigured()) {
    await redisWriteLog(entry);
  } else {
    await fileWriteLog(entry);
  }

  console.log('[Logger] Log saved successfully');
}
