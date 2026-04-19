'use client';

import LoadingSpinner from './LoadingSpinner';
import ChalkSpinner from './ChalkSpinner';
import PaperFlipLoader from './PaperFlipLoader';

/**
 * LoadingSpinner Component Examples
 * 
 * Demonstrates the various loading spinner animations available in ClassMate.
 * Shows different variants, sizes, and use cases.
 */
export default function LoadingSpinnerExample() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold font-ui text-ink-black mb-4">
          Loading Spinner Components
        </h1>
        <p className="text-lg text-chalk-gray">
          Nostalgic loading animations for API calls and async operations.
        </p>
      </div>

      {/* Example 1: Chalk Spinner Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold font-ui text-ink-black mb-2">
            1. Chalk Spinner (Default)
          </h2>
          <p className="text-chalk-gray font-ui">
            Simulates chalk writing on a chalkboard. Best for chalkboard-themed sections.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-chalkboard-black rounded-lg">
            <div className="text-chalk-white text-sm mb-4 text-center">Small</div>
            <LoadingSpinner variant="chalk" size="sm" />
          </div>
          <div className="p-8 bg-chalkboard-black rounded-lg">
            <div className="text-chalk-white text-sm mb-4 text-center">Medium (Default)</div>
            <LoadingSpinner variant="chalk" size="md" />
          </div>
          <div className="p-8 bg-chalkboard-black rounded-lg">
            <div className="text-chalk-white text-sm mb-4 text-center">Large</div>
            <LoadingSpinner variant="chalk" size="lg" />
          </div>
        </div>
      </section>

      {/* Example 2: Paper Flip Loader Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold font-ui text-ink-black mb-2">
            2. Paper Flip Loader
          </h2>
          <p className="text-chalk-gray font-ui">
            Simulates a notebook page flipping. Best for paper-themed sections.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-paper-cream rounded-lg border border-ruled-line">
            <div className="text-ink-black text-sm mb-4 text-center">Small</div>
            <LoadingSpinner variant="paper" size="sm" />
          </div>
          <div className="p-8 bg-paper-cream rounded-lg border border-ruled-line">
            <div className="text-ink-black text-sm mb-4 text-center">Medium (Default)</div>
            <LoadingSpinner variant="paper" size="md" />
          </div>
          <div className="p-8 bg-paper-cream rounded-lg border border-ruled-line">
            <div className="text-ink-black text-sm mb-4 text-center">Large</div>
            <LoadingSpinner variant="paper" size="lg" />
          </div>
        </div>
      </section>

      {/* Example 3: With Loading Text */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold font-ui text-ink-black mb-2">
            3. With Loading Text
          </h2>
          <p className="text-chalk-gray font-ui">
            Add descriptive text to provide context about what's loading.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-chalkboard-black rounded-lg">
            <LoadingSpinner 
              variant="chalk" 
              size="md" 
              text="Writing on the chalkboard..."
            />
          </div>
          <div className="p-8 bg-paper-cream rounded-lg border border-ruled-line">
            <LoadingSpinner 
              variant="paper" 
              size="md" 
              text="Flipping through pages..."
            />
          </div>
        </div>
      </section>

      {/* Example 4: Direct Component Usage */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold font-ui text-ink-black mb-2">
            4. Direct Component Usage
          </h2>
          <p className="text-chalk-gray font-ui">
            Use ChalkSpinner or PaperFlipLoader directly for more control.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-chalkboard-black rounded-lg">
            <ChalkSpinner size="lg" text="Generating explanation..." />
          </div>
          <div className="p-8 bg-paper-cream rounded-lg border border-ruled-line">
            <PaperFlipLoader size="lg" text="Loading content..." />
          </div>
        </div>
      </section>

      {/* Example 5: Real-World Use Cases */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold font-ui text-ink-black mb-2">
            5. Real-World Use Cases
          </h2>
          <p className="text-chalk-gray font-ui">
            Common scenarios where loading spinners are used in ClassMate.
          </p>
        </div>
        <div className="space-y-6">
          {/* API Call Loading */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">During API Calls</h3>
            <div className="bg-chalkboard-black rounded-lg p-8 min-h-[200px] flex items-center justify-center">
              <LoadingSpinner 
                variant="chalk" 
                size="lg" 
                text="Asking the teacher..."
              />
            </div>
          </div>

          {/* Content Loading */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Loading Content</h3>
            <div className="bg-paper-cream rounded-lg p-8 min-h-[200px] flex items-center justify-center border border-ruled-line">
              <LoadingSpinner 
                variant="paper" 
                size="md" 
                text="Preparing your lesson..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Usage Code */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold font-ui text-ink-black mb-2">
            Usage Code
          </h2>
        </div>
        <div className="p-6 bg-chalkboard-black rounded-lg">
          <pre className="text-chalk-white font-mono text-sm overflow-x-auto">
{`// Basic usage
<LoadingSpinner variant="chalk" size="md" />

// With text
<LoadingSpinner 
  variant="chalk" 
  size="lg" 
  text="Writing on the chalkboard..."
/>

// Paper variant
<LoadingSpinner 
  variant="paper" 
  size="md" 
  text="Flipping through pages..."
/>

// Direct component usage
<ChalkSpinner size="lg" text="Loading..." />
<PaperFlipLoader size="md" text="Please wait..." />

// In a loading state
{isLoading && (
  <LoadingSpinner 
    variant="chalk" 
    size="md" 
    text="Loading explanation..."
  />
)}`}
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold font-ui text-ink-black mb-2">
            Features
          </h2>
        </div>
        <div className="p-6 bg-paper-cream rounded-lg border border-ruled-line">
          <ul className="space-y-2 text-ink-black">
            <li>• Two nostalgic animation variants (chalk and paper)</li>
            <li>• Three size options (sm, md, lg)</li>
            <li>• Optional loading text for context</li>
            <li>• Fully accessible with ARIA labels and screen reader support</li>
            <li>• Respects prefers-reduced-motion user preference</li>
            <li>• Consistent with ClassMate's nostalgic design system</li>
            <li>• Optimized for performance (CSS animations)</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
