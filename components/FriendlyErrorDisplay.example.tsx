'use client';

import React, { useState } from 'react';
import FriendlyErrorDisplay from './FriendlyErrorDisplay';

/**
 * FriendlyErrorDisplay Example
 * 
 * Demonstrates various error scenarios and styling options
 */
export default function FriendlyErrorDisplayExample() {
  const [selectedError, setSelectedError] = useState<string>('network');

  const handleRetry = () => {
    console.log('Retry clicked');
    alert('Retrying...');
  };

  const handleGoBack = () => {
    console.log('Go back clicked');
    alert('Going back...');
  };

  const handleClearAndFocus = () => {
    console.log('Clear and focus clicked');
    alert('Clearing input...');
  };

  const handleStartOver = () => {
    console.log('Start over clicked');
    alert('Starting over...');
  };

  const errorExamples = {
    network: (
      <FriendlyErrorDisplay
        title="Can't reach the classroom right now"
        message="Check your internet connection and try again."
        icon="📡"
        actions={[
          { label: 'Try Again', onClick: handleRetry },
          { label: 'Go Back', onClick: handleGoBack }
        ]}
      />
    ),
    rateLimit: (
      <FriendlyErrorDisplay
        title="The classroom is full right now"
        message="Too many students learning at once! Try again in 60 seconds."
        icon="⏰"
        actions={[
          { label: 'Try Again', onClick: handleRetry }
        ]}
      />
    ),
    serverError: (
      <FriendlyErrorDisplay
        title="The teacher stepped out for a moment"
        message="Something went wrong on our end. Please try again!"
        icon="🚪"
        actions={[
          { label: 'Try Again', onClick: handleRetry },
          { label: 'Go Back', onClick: handleGoBack }
        ]}
      />
    ),
    maintenance: (
      <FriendlyErrorDisplay
        title="School's temporarily closed"
        message="The service is under maintenance. Check back soon!"
        icon="🔧"
      />
    ),
    contentSafety: (
      <FriendlyErrorDisplay
        title="Let's learn about something else"
        message="That topic isn't quite right for our classroom. Try asking about something different!"
        icon="📚"
        style="gentle-redirect"
        actions={[
          { label: 'Try Another Topic', onClick: handleClearAndFocus }
        ]}
      />
    ),
    validation: (
      <FriendlyErrorDisplay
        title="Oops! That's a bit too long"
        message="Try to keep your topic under 500 characters so we can help you better!"
        icon="✏️"
        style="gentle-redirect"
        actions={[
          { label: 'Edit Topic', onClick: handleGoBack }
        ]}
      />
    ),
    generic: (
      <FriendlyErrorDisplay
        title="Oops! Something unexpected happened"
        message="Don't worry, let's start fresh!"
        icon="🔄"
        actions={[
          { label: 'Start Over', onClick: handleStartOver }
        ]}
      />
    ),
    auth: (
      <FriendlyErrorDisplay
        title="The teacher needs to check in"
        message="There's a configuration issue. Please try again later."
        icon="🔑"
      />
    ),
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'DM Sans, sans-serif', marginBottom: '2rem' }}>
        FriendlyErrorDisplay Examples
      </h1>

      {/* Error Type Selector */}
      <div style={{ marginBottom: '2rem' }}>
        <label
          htmlFor="error-select"
          style={{
            display: 'block',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            marginBottom: '0.5rem'
          }}
        >
          Select Error Type:
        </label>
        <select
          id="error-select"
          value={selectedError}
          onChange={(e) => setSelectedError(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '2px solid var(--ink-black)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '1rem',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          <option value="network">Network Error</option>
          <option value="rateLimit">Rate Limit Error</option>
          <option value="serverError">Server Error</option>
          <option value="maintenance">Maintenance</option>
          <option value="contentSafety">Content Safety (Gentle Redirect)</option>
          <option value="validation">Validation Error (Gentle Redirect)</option>
          <option value="generic">Generic Error</option>
          <option value="auth">Authentication Error</option>
        </select>
      </div>

      {/* Display Selected Error */}
      {errorExamples[selectedError as keyof typeof errorExamples]}

      {/* Documentation */}
      <div
        style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'var(--paper-cream)',
          borderRadius: '0.5rem',
          fontFamily: 'Lora, serif',
        }}
      >
        <h2 style={{ fontFamily: 'DM Sans, sans-serif', marginBottom: '1rem' }}>
          Usage Notes
        </h2>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.5rem' }}>
          <li>
            <strong>Default Style:</strong> Red dashed border for errors requiring attention
            (network, API, validation)
          </li>
          <li>
            <strong>Gentle Redirect Style:</strong> Blue dashed border for non-critical
            redirects (content safety, suggestions)
          </li>
          <li>
            <strong>Icons:</strong> Use themed emoji icons to match error type
            (📡 network, ⏰ rate limit, 🔧 maintenance, etc.)
          </li>
          <li>
            <strong>Actions:</strong> Provide clear next steps with action buttons
            (Try Again, Go Back, etc.)
          </li>
          <li>
            <strong>Language:</strong> Use age-appropriate, encouraging language with
            school metaphors
          </li>
          <li>
            <strong>Accessibility:</strong> Component includes proper ARIA labels and
            minimum touch targets
          </li>
        </ul>
      </div>
    </div>
  );
}
