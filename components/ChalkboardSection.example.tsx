'use client';

import ChalkboardSection from './ChalkboardSection';
import TypewriterText from './TypewriterText';

/**
 * ChalkboardSection Examples
 * 
 * Demonstrates various use cases for the ChalkboardSection component
 */

export function BasicExample() {
  return (
    <ChalkboardSection>
      <div className="p-8">
        <h1 className="chalk-text text-2xl font-bold mb-4">
          Basic Chalkboard Section
        </h1>
        <p className="chalk-text text-base leading-relaxed">
          This is a simple example of the ChalkboardSection component with static text.
          Notice the authentic chalkboard texture and proper contrast for readability.
        </p>
      </div>
    </ChalkboardSection>
  );
}

export function WithTypewriterExample() {
  return (
    <ChalkboardSection>
      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="chalk-text text-xl font-semibold mb-6">
          Why is the sky blue?
        </h2>
        <TypewriterText
          text="The sky appears blue because of a phenomenon called Rayleigh scattering. When sunlight enters Earth's atmosphere, it collides with gas molecules. Blue light has a shorter wavelength and gets scattered more than other colors, making the sky appear blue to our eyes."
          speed={30}
          className="text-lg leading-relaxed"
        />
      </div>
    </ChalkboardSection>
  );
}

export function FullScreenExample() {
  return (
    <ChalkboardSection className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="chalk-text text-4xl font-bold mb-8">
          Welcome to ClassMate
        </h1>
        <p className="chalk-text text-xl leading-relaxed mb-6">
          Your AI-powered learning companion
        </p>
        <p className="chalk-text text-base opacity-90">
          Select your learning level to get started
        </p>
      </div>
    </ChalkboardSection>
  );
}

export function WithMultipleContentBlocks() {
  return (
    <ChalkboardSection>
      <div className="p-8 space-y-8">
        <div>
          <h2 className="chalk-text text-2xl font-bold mb-3">
            Main Concept
          </h2>
          <p className="chalk-text text-base leading-relaxed">
            This section demonstrates how multiple content blocks can be organized
            within a single ChalkboardSection component.
          </p>
        </div>
        
        <div className="border-t border-chalk-gray/30 pt-6">
          <h3 className="chalk-text text-xl font-semibold mb-3">
            Key Points
          </h3>
          <ul className="chalk-text text-base space-y-2 list-disc list-inside">
            <li>Authentic chalkboard texture</li>
            <li>Subtle noise overlay</li>
            <li>Radial gradient for depth</li>
            <li>WCAG 2.1 AA compliant</li>
          </ul>
        </div>
        
        <div className="border-t border-chalk-gray/30 pt-6">
          <h3 className="chalk-text text-xl font-semibold mb-3">
            Follow-Up Questions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-lg border-2 border-chalk-gray/50 hover:border-chalk-white transition-colors">
              <span className="chalk-text">✋ What creates the texture effect?</span>
            </button>
            <button className="w-full text-left p-4 rounded-lg border-2 border-chalk-gray/50 hover:border-chalk-white transition-colors">
              <span className="chalk-text">✋ How is accessibility ensured?</span>
            </button>
          </div>
        </div>
      </div>
    </ChalkboardSection>
  );
}

export function ResponsiveExample() {
  return (
    <ChalkboardSection>
      <div className="p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="chalk-text text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            Responsive Chalkboard
          </h1>
          <p className="chalk-text text-sm md:text-base lg:text-lg leading-relaxed">
            This example demonstrates responsive padding and text sizing.
            The content adapts gracefully across mobile, tablet, and desktop viewports
            while maintaining the nostalgic chalkboard aesthetic.
          </p>
        </div>
      </div>
    </ChalkboardSection>
  );
}

// Default export for easy testing
export default function ChalkboardSectionExamples() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4 px-4">Basic Example</h2>
        <BasicExample />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4 px-4">With Typewriter Effect</h2>
        <WithTypewriterExample />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4 px-4">Full Screen Example</h2>
        <FullScreenExample />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4 px-4">Multiple Content Blocks</h2>
        <WithMultipleContentBlocks />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4 px-4">Responsive Example</h2>
        <ResponsiveExample />
      </div>
    </div>
  );
}
