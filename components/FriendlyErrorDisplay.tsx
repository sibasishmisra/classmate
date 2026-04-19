'use client';

import { useEffect } from 'react';
import { triggerHeavyHaptic } from '@/lib/haptic-feedback';

interface ErrorAction {
  label: string;
  onClick: () => void;
}

interface FriendlyErrorDisplayProps {
  title: string;
  message: string;
  icon?: string;
  actions?: ErrorAction[];
  style?: 'default' | 'gentle-redirect';
}

/**
 * FriendlyErrorDisplay Component
 * 
 * Displays age-appropriate error messages with nostalgic torn paper note aesthetic.
 * Features themed icons based on error type and provides retry/go back actions.
 * 
 * Features:
 * - Torn paper note aesthetic with dashed border
 * - Age-appropriate error messages
 * - Themed icons (📡, 🔑, ⏰, 🚪, 🔧, ✏️, 📚)
 * - Retry and go back action buttons
 * - Gentle, encouraging tone
 * - Accessible with ARIA labels
 * - Heavy haptic feedback pattern on mount
 * 
 * Validates: Requirements 6.6, 9.1, 9.2, 9.3, 9.4, 9.6
 * 
 * @param title - The error title (age-appropriate)
 * @param message - The error message (encouraging and clear)
 * @param icon - Optional emoji icon for the error type
 * @param actions - Array of action buttons (retry, go back, etc.)
 * @param style - Visual style variant ('default' or 'gentle-redirect')
 */
export default function FriendlyErrorDisplay({
  title,
  message,
  icon = '📝',
  actions = [],
  style = 'default'
}: FriendlyErrorDisplayProps) {
  const borderColor = style === 'gentle-redirect' ? 'var(--accent-blue)' : 'var(--error-red)';

  // Trigger heavy haptic feedback when error is displayed
  useEffect(() => {
    triggerHeavyHaptic();
  }, []);

  return (
    <div
      className="friendly-error-display"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-testid="friendly-error-display"
      style={{
        background: 'var(--paper-white)',
        border: `2px dashed ${borderColor}`,
        borderRadius: '0.5rem',
        padding: '1.5rem',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        maxWidth: '600px',
        margin: '2rem auto',
      }}
    >
      {/* Torn paper tab effect */}
      <div
        style={{
          position: 'absolute',
          top: '-2px',
          left: '10%',
          width: '30px',
          height: '20px',
          background: 'var(--paper-white)',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          transform: 'translateY(-100%)',
        }}
        aria-hidden="true"
      />

      {/* Icon and Title */}
      <div className="flex items-start gap-3 mb-3">
        <span
          className="text-3xl flex-shrink-0"
          role="img"
          aria-label="Error icon"
        >
          {icon}
        </span>
        <h2
          className="text-xl font-semibold text-ink-black font-ui"
          style={{ marginTop: '0.25rem' }}
        >
          {title}
        </h2>
      </div>

      {/* Message */}
      <p
        className="text-base text-ink-black font-body leading-relaxed mb-4"
        style={{ paddingLeft: '3rem' }}
      >
        {message}
      </p>

      {/* Action Buttons */}
      {actions.length > 0 && (
        <div
          className="flex flex-wrap gap-3"
          style={{ paddingLeft: '3rem' }}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="error-action-button focus:outline-none focus:ring-3 focus:ring-accent-blue focus:ring-offset-2"
              type="button"
              style={{
                background: index === 0 ? 'var(--ink-black)' : 'transparent',
                color: index === 0 ? 'var(--paper-white)' : 'var(--ink-black)',
                border: `2px solid var(--ink-black)`,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontSize: '0.875rem',
                minHeight: '44px',
                minWidth: '44px',
              }}
              onMouseEnter={(e) => {
                if (index === 0) {
                  e.currentTarget.style.background = 'var(--paper-white)';
                  e.currentTarget.style.color = 'var(--ink-black)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                } else {
                  e.currentTarget.style.background = 'var(--ink-black)';
                  e.currentTarget.style.color = 'var(--paper-white)';
                }
              }}
              onMouseLeave={(e) => {
                if (index === 0) {
                  e.currentTarget.style.background = 'var(--ink-black)';
                  e.currentTarget.style.color = 'var(--paper-white)';
                  e.currentTarget.style.transform = 'translateY(0)';
                } else {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--ink-black)';
                }
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
