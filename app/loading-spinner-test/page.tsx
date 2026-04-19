'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ChalkSpinner from '@/components/ChalkSpinner';
import PaperFlipLoader from '@/components/PaperFlipLoader';

/**
 * Loading Spinner Test Page
 * 
 * Demonstrates the loading spinner components in various contexts
 * to verify they work correctly during API calls.
 */
export default function LoadingSpinnerTestPage() {
  const [isLoadingChalk, setIsLoadingChalk] = useState(false);
  const [isLoadingPaper, setIsLoadingPaper] = useState(false);

  const simulateAPICall = (type: 'chalk' | 'paper') => {
    if (type === 'chalk') {
      setIsLoadingChalk(true);
      setTimeout(() => setIsLoadingChalk(false), 3000);
    } else {
      setIsLoadingPaper(true);
      setTimeout(() => setIsLoadingPaper(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-paper-cream p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold font-ui text-ink-black mb-4">
            Loading Spinner Test Page
          </h1>
          <p className="text-lg text-chalk-gray">
            Test the loading spinners in various contexts to ensure they display correctly during API calls.
          </p>
        </div>

        {/* Chalk Spinner Tests */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            Chalk Spinner (Chalkboard Context)
          </h2>
          
          <div className="bg-chalkboard-black rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
            {isLoadingChalk ? (
              <LoadingSpinner 
                variant="chalk" 
                size="lg" 
                text="Writing on the chalkboard..."
              />
            ) : (
              <div className="text-center">
                <p className="chalk-text text-xl mb-6">
                  Click the button to simulate an API call
                </p>
                <button
                  onClick={() => simulateAPICall('chalk')}
                  className="px-6 py-3 bg-chalk-white text-ink-black rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Simulate API Call
                </button>
              </div>
            )}
          </div>

          {/* Size Variants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-chalkboard-black rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
              <p className="chalk-text text-sm mb-4">Small</p>
              <ChalkSpinner size="sm" />
            </div>
            <div className="bg-chalkboard-black rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
              <p className="chalk-text text-sm mb-4">Medium</p>
              <ChalkSpinner size="md" />
            </div>
            <div className="bg-chalkboard-black rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
              <p className="chalk-text text-sm mb-4">Large</p>
              <ChalkSpinner size="lg" />
            </div>
          </div>
        </section>

        {/* Paper Flip Loader Tests */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            Paper Flip Loader (Notebook Context)
          </h2>
          
          <div className="bg-white rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center gap-6 border-2 border-ruled-line">
            {isLoadingPaper ? (
              <LoadingSpinner 
                variant="paper" 
                size="lg" 
                text="Flipping through pages..."
              />
            ) : (
              <div className="text-center">
                <p className="text-ink-black text-xl mb-6">
                  Click the button to simulate an API call
                </p>
                <button
                  onClick={() => simulateAPICall('paper')}
                  className="px-6 py-3 bg-ink-black text-paper-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Simulate API Call
                </button>
              </div>
            )}
          </div>

          {/* Size Variants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] border border-ruled-line">
              <p className="text-ink-black text-sm mb-4">Small</p>
              <PaperFlipLoader size="sm" />
            </div>
            <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] border border-ruled-line">
              <p className="text-ink-black text-sm mb-4">Medium</p>
              <PaperFlipLoader size="md" />
            </div>
            <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] border border-ruled-line">
              <p className="text-ink-black text-sm mb-4">Large</p>
              <PaperFlipLoader size="lg" />
            </div>
          </div>
        </section>

        {/* Combined Usage */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            Real-World Usage Examples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example 1: Explanation Loading */}
            <div className="bg-chalkboard-black rounded-lg p-6">
              <h3 className="chalk-text text-lg font-semibold mb-4">
                Explanation Loading
              </h3>
              <div className="min-h-[200px] flex items-center justify-center">
                <LoadingSpinner 
                  variant="chalk" 
                  size="md" 
                  text="Asking the teacher..."
                />
              </div>
            </div>

            {/* Example 2: Content Loading */}
            <div className="bg-white rounded-lg p-6 border border-ruled-line">
              <h3 className="text-ink-black text-lg font-semibold mb-4">
                Content Loading
              </h3>
              <div className="min-h-[200px] flex items-center justify-center">
                <LoadingSpinner 
                  variant="paper" 
                  size="md" 
                  text="Preparing your lesson..."
                />
              </div>
            </div>

            {/* Example 3: Follow-up Question */}
            <div className="bg-chalkboard-black rounded-lg p-6">
              <h3 className="chalk-text text-lg font-semibold mb-4">
                Follow-up Answer Loading
              </h3>
              <div className="min-h-[200px] flex items-center justify-center">
                <ChalkSpinner size="md" text="Thinking..." />
              </div>
            </div>

            {/* Example 4: Session History */}
            <div className="bg-white rounded-lg p-6 border border-ruled-line">
              <h3 className="text-ink-black text-lg font-semibold mb-4">
                History Loading
              </h3>
              <div className="min-h-[200px] flex items-center justify-center">
                <PaperFlipLoader size="sm" text="Loading history..." />
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Test */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            Accessibility Features
          </h2>
          
          <div className="bg-paper-cream rounded-lg p-6 border border-ruled-line">
            <ul className="space-y-3 text-ink-black">
              <li>✓ <strong>ARIA Labels:</strong> All spinners have role="status" and aria-live="polite"</li>
              <li>✓ <strong>Screen Reader Text:</strong> Hidden "Loading..." text for screen readers</li>
              <li>✓ <strong>Reduced Motion:</strong> Falls back to static emoji when prefers-reduced-motion is enabled</li>
              <li>✓ <strong>Semantic HTML:</strong> Proper use of status indicators</li>
              <li>✓ <strong>Color Contrast:</strong> Meets WCAG AA standards</li>
            </ul>
          </div>
        </section>

        {/* Performance Notes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold font-ui text-ink-black">
            Performance Notes
          </h2>
          
          <div className="bg-paper-cream rounded-lg p-6 border border-ruled-line">
            <ul className="space-y-3 text-ink-black">
              <li>• <strong>CSS Animations:</strong> GPU-accelerated for smooth 60fps performance</li>
              <li>• <strong>No JavaScript Loops:</strong> Pure CSS animations, no performance impact</li>
              <li>• <strong>Lightweight:</strong> Minimal DOM elements and styles</li>
              <li>• <strong>Responsive:</strong> Works on all screen sizes without layout shifts</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
