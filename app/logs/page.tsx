'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

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

const CORRECT_PIN = '042026';

export default function LogsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('logs_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadLogs();
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('logs_authenticated', 'true');
      loadLogs();
    } else {
      setError('Invalid PIN. Access denied.');
      setPin('');
    }
  };

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs? This cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch('/api/logs', { method: 'DELETE' });
      if (response.ok) {
        setLogs([]);
        alert('All logs cleared successfully.');
      }
    } catch (err) {
      console.error('Failed to clear logs:', err);
      alert('Failed to clear logs.');
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `classmate-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs
    .filter(log => 
      filter === '' || 
      log.topic.toLowerCase().includes(filter.toLowerCase()) ||
      log.ip.includes(filter) ||
      log.explanation.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-chalkboard-black flex items-center justify-center p-4">
        <div className="bg-paper-cream rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-ink-black font-ui mb-2">
              🔒 Protected Area
            </h1>
            <p className="text-chalk-gray font-body">
              Enter PIN to access logs
            </p>
          </div>
          
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit PIN"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-ruled-line rounded-lg font-ui text-lg text-center tracking-widest focus:border-accent-blue focus:outline-none"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-error-red p-3 rounded">
                <p className="text-error-red text-sm font-ui">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-ink-black text-paper-white py-3 rounded-lg font-ui font-semibold hover:bg-opacity-90 transition-all"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-white">
      {/* Header */}
      <header className="bg-chalkboard-black text-chalk-white py-6 px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-ui">
                📊 ClassMate Logs
              </h1>
              <p className="text-chalk-gray text-sm mt-1 font-body">
                Session activity and analytics
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportLogs}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg font-ui text-sm hover:bg-opacity-90 transition-all"
              >
                📥 Export
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-error-red text-white rounded-lg font-ui text-sm hover:bg-opacity-90 transition-all"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-ruled-line rounded-lg p-4">
            <div className="text-3xl font-bold text-accent-blue font-ui">{logs.length}</div>
            <div className="text-sm text-chalk-gray font-body">Total Sessions</div>
          </div>
          <div className="bg-white border-2 border-ruled-line rounded-lg p-4">
            <div className="text-3xl font-bold text-accent-green font-ui">
              {new Set(logs.map(l => l.ip)).size}
            </div>
            <div className="text-sm text-chalk-gray font-body">Unique IPs</div>
          </div>
          <div className="bg-white border-2 border-ruled-line rounded-lg p-4">
            <div className="text-3xl font-bold text-accent-gold font-ui">
              {logs.reduce((acc, log) => acc + (log.followUpQuestions?.length || 0), 0)}
            </div>
            <div className="text-sm text-chalk-gray font-body">Follow-up Questions</div>
          </div>
          <div className="bg-white border-2 border-ruled-line rounded-lg p-4">
            <div className="text-3xl font-bold text-ink-black font-ui">
              {logs.length > 0 ? formatDistanceToNow(new Date(logs[0]?.timestamp), { addSuffix: true }) : 'N/A'}
            </div>
            <div className="text-sm text-chalk-gray font-body">Last Activity</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-ruled-line rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by topic, IP, or content..."
                className="w-full px-4 py-2 border border-ruled-line rounded-lg font-body focus:border-accent-blue focus:outline-none"
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="px-4 py-2 border border-ruled-line rounded-lg font-ui focus:border-accent-blue focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logs List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-chalk-gray font-body">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-white border-2 border-ruled-line rounded-lg">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-chalk-gray font-body">
              {filter ? 'No logs match your search.' : 'No logs recorded yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white border-2 border-ruled-line rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-ink-black font-ui mb-2">
                      {log.topic}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-chalk-gray font-body">
                      <span className="flex items-center gap-1">
                        🕐 {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        🌐 {log.ip}
                      </span>
                      {log.location && (
                        <span className="flex items-center gap-1">
                          📍 {log.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        🎓 Level {log.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-paper-cream border-l-4 border-accent-blue rounded p-4 mb-4">
                  <p className="text-sm font-semibold text-ink-black font-ui mb-2">
                    Explanation:
                  </p>
                  <p className="text-sm text-chalk-gray font-body whitespace-pre-wrap">
                    {log.explanation}
                  </p>
                </div>

                {/* Follow-up Questions */}
                {log.followUpQuestions && log.followUpQuestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-ink-black font-ui mb-2">
                      Follow-up Questions:
                    </p>
                    {log.followUpQuestions.map((fq, idx) => (
                      <div key={idx} className="bg-paper-cream rounded p-3 text-sm">
                        <p className="font-semibold text-ink-black font-ui mb-1">
                          Q: {fq.question}
                        </p>
                        {fq.answer && (
                          <p className="text-chalk-gray font-body ml-4">
                            A: {fq.answer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
