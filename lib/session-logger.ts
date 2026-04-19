/**
 * Session Logger
 * Production : Neon PostgreSQL (via @neondatabase/serverless)
 * Development: Local file /data/logs.json
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
  followUpQuestions: Array<{ question: string; answer?: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isNeonConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

async function getLocationFromIP(ip: string): Promise<string> {
  const isLocal =
    !ip ||
    ip === 'unknown' ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.');

  if (isLocal) return 'Local';

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'ClassMate.info' },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const d = await res.json();
      if (d.city && d.country_name) return `${d.city}, ${d.country_name}`;
      if (d.country_name) return d.country_name;
    }
  } catch {
    // silently ignore
  }
  return 'Unknown';
}

// ─── Neon PostgreSQL ──────────────────────────────────────────────────────────

async function getNeonClient() {
  const { neon } = await import('@neondatabase/serverless');
  return neon(process.env.DATABASE_URL!);
}

async function neonEnsureTable() {
  const sql = await getNeonClient();
  await sql`
    CREATE TABLE IF NOT EXISTS session_logs (
      id          TEXT PRIMARY KEY,
      timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ip          TEXT,
      location    TEXT,
      topic       TEXT NOT NULL,
      level       INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      follow_ups  JSONB DEFAULT '[]'
    )
  `;
}

async function neonInsertLog(entry: LogEntry): Promise<void> {
  await neonEnsureTable();
  const sql = await getNeonClient();
  await sql`
    INSERT INTO session_logs (id, timestamp, ip, location, topic, level, explanation, follow_ups)
    VALUES (
      ${entry.id},
      ${entry.timestamp},
      ${entry.ip},
      ${entry.location ?? null},
      ${entry.topic},
      ${entry.level},
      ${entry.explanation},
      ${JSON.stringify(entry.followUpQuestions)}
    )
  `;
}

async function neonReadLogs(): Promise<LogEntry[]> {
  await neonEnsureTable();
  const sql = await getNeonClient();
  const rows = await sql`
    SELECT id, timestamp, ip, location, topic, level, explanation, follow_ups
    FROM session_logs
    ORDER BY timestamp DESC
    LIMIT 1000
  `;
  return rows.map((r: any) => ({
    id: r.id,
    timestamp: new Date(r.timestamp).toISOString(),
    ip: r.ip,
    location: r.location,
    topic: r.topic,
    level: r.level,
    explanation: r.explanation,
    followUpQuestions: r.follow_ups ?? [],
  }));
}

async function neonClearLogs(): Promise<void> {
  await neonEnsureTable();
  const sql = await getNeonClient();
  await sql`DELETE FROM session_logs`;
}

// ─── File Storage (dev fallback) ──────────────────────────────────────────────

const LOGS_FILE = path.join(process.cwd(), 'data', 'logs.json');

async function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  try { await fs.access(dir); } catch { await fs.mkdir(dir, { recursive: true }); }
}

async function fileReadLogs(): Promise<LogEntry[]> {
  try {
    await ensureDataDir();
    return JSON.parse(await fs.readFile(LOGS_FILE, 'utf-8'));
  } catch { return []; }
}

async function fileInsertLog(entry: LogEntry): Promise<void> {
  await ensureDataDir();
  const logs = await fileReadLogs();
  logs.unshift(entry);
  await fs.writeFile(LOGS_FILE, JSON.stringify(logs.slice(0, 1000), null, 2), 'utf-8');
}

async function fileClearLogs(): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(LOGS_FILE, '[]', 'utf-8');
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function readLogs(): Promise<LogEntry[]> {
  if (isNeonConfigured()) {
    console.log('[Logger] backend=neon');
    return neonReadLogs();
  }
  console.log('[Logger] backend=file');
  return fileReadLogs();
}

export async function clearLogs(): Promise<void> {
  if (isNeonConfigured()) return neonClearLogs();
  return fileClearLogs();
}

interface LogSessionParams {
  topic: string;
  level: number;
  explanation: string;
  followUpQuestions?: Array<{ question: string; answer?: string }>;
  request: NextRequest;
}

export async function logSession(params: LogSessionParams): Promise<void> {
  const { topic, level, explanation, followUpQuestions = [], request } = params;

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
    followUpQuestions,
  };

  console.log('[Logger] saving:', {
    topic: entry.topic,
    ip: entry.ip,
    location: entry.location,
    backend: isNeonConfigured() ? 'neon' : 'file',
  });

  if (isNeonConfigured()) {
    await neonInsertLog(entry);
  } else {
    await fileInsertLog(entry);
  }

  console.log('[Logger] saved ✓');
}
