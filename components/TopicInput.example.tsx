'use client';

import React, { useState } from 'react';
import TopicInput from './TopicInput';

/**
 * Example usage of the TopicInput component
 * Demonstrates different states and integration patterns
 */
export default function TopicInputExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedTopic, setSubmittedTopic] = useState<string | null>(null);

  const handleSubmit = async (topic: string) => {
    console.log('Topic submitted:', topic);
    setIsLoading(true);
    setSubmittedTopic(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    setSubmittedTopic(topic);
  };

  const handleReset = () => {
    setSubmittedTopic(null);
  };

  return (
    <div className="min-h-screen bg-paper-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-ui text-ink-black">
            TopicInput Component Examples
          </h1>
          <p className="text-chalk-gray font-ui">
            Interactive examples of the TopicInput component in different states
          </p>
        </div>

        {/* Example 1: Default State */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            1. Default State
          </h2>
          <p className="text-chalk-gray font-ui">
            Empty input with submit button disabled
          </p>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <TopicInput 
              onSubmit={(topic) => console.log('Default example:', topic)} 
              isLoading={false} 
            />
          </div>
        </section>

        {/* Example 2: Interactive Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            2. Interactive Example
          </h2>
          <p className="text-chalk-gray font-ui">
            Try submitting a topic to see the loading state and result
          </p>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <TopicInput 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
            
            {submittedTopic && (
              <div className="mt-6 p-4 bg-success-green/10 border-l-4 border-success-green rounded">
                <p className="font-ui text-ink-black">
                  <strong>Topic submitted:</strong> {submittedTopic}
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 text-sm text-accent-blue hover:underline font-ui"
                >
                  Submit another topic
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Example 3: Custom Max Length */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            3. Custom Max Length (200 characters)
          </h2>
          <p className="text-chalk-gray font-ui">
            Demonstrates custom character limit
          </p>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <TopicInput 
              onSubmit={(topic) => console.log('Custom length:', topic)} 
              isLoading={false}
              maxLength={200}
            />
          </div>
        </section>

        {/* Example 4: Loading State */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            4. Loading State
          </h2>
          <p className="text-chalk-gray font-ui">
            Shows the component during API call (permanently loading for demo)
          </p>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <TopicInput 
              onSubmit={(topic) => console.log('Loading example:', topic)} 
              isLoading={true} 
            />
          </div>
        </section>

        {/* Example 5: Integration Pattern */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            5. Integration Pattern
          </h2>
          <p className="text-chalk-gray font-ui mb-4">
            Example code showing typical integration with API calls
          </p>
          <div className="p-6 bg-chalkboard-black rounded-lg">
            <pre className="text-chalk-white font-mono text-sm overflow-x-auto">
{`const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (topic: string) => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, level: 3 })
    });
    const data = await response.json();
    // Handle response...
  } catch (error) {
    // Handle error...
  } finally {
    setIsLoading(false);
  }
};

return (
  <TopicInput 
    onSubmit={handleSubmit} 
    isLoading={isLoading} 
  />
);`}
            </pre>
          </div>
        </section>

        {/* Validation Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            6. Validation Behavior
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-accent-blue rounded">
              <p className="font-ui text-ink-black">
                <strong>✓ Valid:</strong> Input with 1-500 characters enables submit button
              </p>
            </div>
            <div className="p-4 bg-red-50 border-l-4 border-error-red rounded">
              <p className="font-ui text-ink-black">
                <strong>✗ Invalid:</strong> Empty input or &gt;500 characters disables submit button
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border-l-4 border-warning-yellow rounded">
              <p className="font-ui text-ink-black">
                <strong>⚠ Error Display:</strong> Friendly error message shown for invalid submissions
              </p>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            7. Accessibility Features
          </h2>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <ul className="space-y-2 font-ui text-ink-black">
              <li className="flex items-start gap-2">
                <span className="text-accent-green">✓</span>
                <span>Keyboard navigation: Tab to navigate, Enter to submit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">✓</span>
                <span>ARIA labels: Proper labels for screen readers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">✓</span>
                <span>Live regions: Error messages announced automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">✓</span>
                <span>Touch targets: Minimum 44x44px for mobile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green">✓</span>
                <span>Focus indicators: Visible focus states</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
