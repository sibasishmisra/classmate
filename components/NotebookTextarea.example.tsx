'use client';

import { useState } from 'react';
import NotebookTextarea from './NotebookTextarea';

/**
 * Example usage of the NotebookTextarea component
 * This file demonstrates various configurations and use cases
 */

export default function NotebookTextareaExample() {
  const [basicValue, setBasicValue] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [shortValue, setShortValue] = useState('');
  const [prefilledValue, setPrefilledValue] = useState('Why is the sky blue?');

  return (
    <div className="min-h-screen bg-paper-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold font-ui text-ink-black mb-2">
            NotebookTextarea Component Examples
          </h1>
          <p className="text-chalk-gray font-ui">
            Demonstrating various configurations of the notebook-themed textarea
          </p>
        </header>

        {/* Example 1: Basic Usage */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold font-ui text-ink-black mb-2">
              1. Basic Usage (Default Settings)
            </h2>
            <p className="text-sm text-chalk-gray font-ui mb-4">
              Default placeholder, 500 character limit
            </p>
          </div>
          <NotebookTextarea
            value={basicValue}
            onChange={setBasicValue}
          />
          <div className="text-sm text-chalk-gray font-ui">
            Current value: {basicValue || '(empty)'}
          </div>
        </section>

        {/* Example 2: Custom Placeholder and Limit */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold font-ui text-ink-black mb-2">
              2. Custom Configuration
            </h2>
            <p className="text-sm text-chalk-gray font-ui mb-4">
              Custom placeholder text and 200 character limit
            </p>
          </div>
          <NotebookTextarea
            value={customValue}
            onChange={setCustomValue}
            placeholder="Ask me anything about science, history, or math..."
            maxLength={200}
          />
        </section>

        {/* Example 3: Short Limit (Testing Warning State) */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold font-ui text-ink-black mb-2">
              3. Warning State Demo
            </h2>
            <p className="text-sm text-chalk-gray font-ui mb-4">
              50 character limit - type more than 45 characters to see warning color
            </p>
          </div>
          <NotebookTextarea
            value={shortValue}
            onChange={setShortValue}
            placeholder="Type more than 45 characters..."
            maxLength={50}
          />
        </section>

        {/* Example 4: Prefilled Value */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold font-ui text-ink-black mb-2">
              4. Prefilled Value
            </h2>
            <p className="text-sm text-chalk-gray font-ui mb-4">
              Textarea with initial content
            </p>
          </div>
          <NotebookTextarea
            value={prefilledValue}
            onChange={setPrefilledValue}
          />
        </section>

        {/* Example 5: Disabled State */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold font-ui text-ink-black mb-2">
              5. Disabled State
            </h2>
            <p className="text-sm text-chalk-gray font-ui mb-4">
              Textarea in disabled state (e.g., while loading)
            </p>
          </div>
          <NotebookTextarea
            value="This textarea is disabled"
            onChange={() => {}}
            disabled={true}
          />
        </section>

        {/* Example 6: With Submit Button */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold font-ui text-ink-black mb-2">
              6. Complete Form Example
            </h2>
            <p className="text-sm text-chalk-gray font-ui mb-4">
              Textarea integrated with submit button
            </p>
          </div>
          <NotebookTextarea
            value={basicValue}
            onChange={setBasicValue}
          />
          <button
            className="submit-button"
            disabled={basicValue.length === 0 || basicValue.length > 500}
            onClick={() => alert(`Submitted: ${basicValue}`)}
          >
            Submit Topic
          </button>
          <p className="text-xs text-chalk-gray font-ui">
            Button is enabled only when input is between 1-500 characters
          </p>
        </section>

        {/* Design System Reference */}
        <section className="border-t border-ruled-line pt-8 mt-12">
          <h2 className="text-xl font-semibold font-ui text-ink-black mb-4">
            Design System Elements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold font-ui text-ink-black">Colors Used</h3>
              <ul className="text-sm text-chalk-gray font-ui space-y-1">
                <li>• Background: paper-cream (#faf8f3)</li>
                <li>• Text: ink-black (#2d3748)</li>
                <li>• Placeholder: chalk-gray (#9ca3af)</li>
                <li>• Warning: warning-yellow (#fbbf24)</li>
                <li>• Margin line: margin-red (#dc2626)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold font-ui text-ink-black">Typography</h3>
              <ul className="text-sm text-chalk-gray font-ui space-y-1">
                <li>• Body text: Lora (serif)</li>
                <li>• Counter: DM Sans (sans-serif)</li>
                <li>• Line height: 32px (matches ruled lines)</li>
                <li>• Placeholder: Italic style</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
