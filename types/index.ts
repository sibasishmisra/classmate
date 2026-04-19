// Core domain models
export type LearningLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface LearningSession {
  id: string;
  level: LearningLevel | null;
  topics: TopicEntry[];
  createdAt: Date;
  settings: UserSettings;
}

export interface TopicEntry {
  id: string;
  topic: string;
  explanation: string;
  followUpQuestions: FollowUpQuestion[];
  timestamp: Date;
  level: LearningLevel;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  answer?: string;
  isAnswered: boolean;
}

export interface UserSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
}

// API request/response models
export interface ExplainRequest {
  topic: string;
  level: LearningLevel;
}

export interface ExplainResponse {
  explanation: string;
  followUpQuestions: FollowUpQuestion[];
  error?: string;
}

export interface AnswerRequest {
  question: string;
  context: string;
  level: LearningLevel;
}

export interface AnswerResponse {
  answer: string;
  error?: string;
}

// Claude API models
export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  system?: string;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  id: string;
  content: ClaudeContent[];
  model: string;
  stop_reason: string;
}

export interface ClaudeContent {
  type: 'text';
  text: string;
}

// Local Storage Schema
export interface StoredSession {
  version: '1.0';
  level?: LearningLevel;
  topics: TopicEntry[];
  settings: UserSettings;
  lastUpdated: string;
}

export interface StoredSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'default';
}

// Error types
export interface NetworkError {
  type: 'network';
  message: string;
  retryable: boolean;
}

export interface ClaudeAPIError {
  type: 'claude_api';
  statusCode: number;
  message: string;
  retryAfter?: number;
}

export interface ValidationError {
  type: 'validation';
  field: string;
  rule: string;
  message: string;
}

export interface ContentSafetyError {
  type: 'content_safety';
  reason: 'inappropriate_input' | 'unsafe_response';
  message: string;
}

export interface StorageError {
  type: 'storage';
  reason: string;
}

export type AppError =
  | NetworkError
  | ClaudeAPIError
  | ValidationError
  | ContentSafetyError
  | StorageError;
