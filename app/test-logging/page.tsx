'use client';

import { useState } from 'react';

export default function TestLoggingPage() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testExplainAPI = async () => {
    setIsLoading(true);
    setResult('Testing...');
    
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Why is the sky blue?',
          level: 3
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Success! Explanation received. Check /logs page to see if it was logged.\n\nExplanation: ${data.explanation.substring(0, 200)}...`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLogs = async () => {
    setIsLoading(true);
    setResult('Checking logs...');
    
    try {
      const response = await fetch('/api/logs');
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Logs API working!\n\nTotal logs: ${data.count}\n\nLast log:\n${JSON.stringify(data.logs[0], null, 2)}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Logging Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testExplainAPI}
            disabled={isLoading}
            className="px-6 py-3 bg-accent-blue text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50"
          >
            1. Test Explain API (Creates a log)
          </button>
          
          <button
            onClick={checkLogs}
            disabled={isLoading}
            className="px-6 py-3 bg-accent-green text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 ml-4"
          >
            2. Check Logs API
          </button>
        </div>
        
        {result && (
          <div className="bg-white border-2 border-ruled-line rounded-lg p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {result}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <h2 className="font-bold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Test Explain API" to create a test session</li>
            <li>Click "Check Logs API" to verify the log was saved</li>
            <li>Go to <a href="/logs" className="text-accent-blue underline">/logs</a> (PIN: 042026) to see the dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
