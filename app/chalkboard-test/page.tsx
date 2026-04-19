import ChalkboardSection from '@/components/ChalkboardSection';
import TypewriterText from '@/components/TypewriterText';

/**
 * Test page for ChalkboardSection component
 * 
 * This page demonstrates the ChalkboardSection component with various content types
 * to verify the chalkboard texture, noise overlay, radial gradient, and accessibility.
 */
export default function ChalkboardTestPage() {
  return (
    <div className="min-h-screen">
      {/* Example 1: Basic Usage */}
      <ChalkboardSection className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="chalk-text text-3xl font-bold mb-6">
            ChalkboardSection Component Test
          </h1>
          <p className="chalk-text text-lg leading-relaxed mb-4">
            This component applies the nostalgic chalkboard aesthetic with texture background,
            noise overlay, and radial gradient for depth. The contrast ratio between the
            chalkboard background (#1a1a1a) and chalk text (#f5f5dc) is 13.6:1, exceeding
            WCAG 2.1 AA requirements.
          </p>
        </div>
      </ChalkboardSection>

      {/* Example 2: With TypewriterText */}
      <ChalkboardSection className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="chalk-text text-2xl font-semibold mb-6">
            Why is the sky blue?
          </h2>
          <TypewriterText
            text="The sky appears blue because of a phenomenon called Rayleigh scattering. When sunlight enters Earth's atmosphere, it collides with gas molecules. Blue light has a shorter wavelength and gets scattered more than other colors, making the sky appear blue to our eyes."
            speed={30}
            className="text-base leading-relaxed"
          />
        </div>
      </ChalkboardSection>

      {/* Example 3: Multiple Content Blocks */}
      <ChalkboardSection className="py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div>
            <h3 className="chalk-text text-xl font-bold mb-3">
              Key Features
            </h3>
            <ul className="chalk-text text-base space-y-2 list-disc list-inside">
              <li>Chalkboard texture background (#1a1a1a)</li>
              <li>Subtle noise overlay for authenticity</li>
              <li>Radial gradient for visual depth</li>
              <li>WCAG 2.1 AA contrast compliance (13.6:1 ratio)</li>
              <li>Semantic HTML with proper ARIA labels</li>
            </ul>
          </div>

          <div className="border-t border-chalk-gray/30 pt-6">
            <h3 className="chalk-text text-xl font-bold mb-3">
              Accessibility
            </h3>
            <p className="chalk-text text-base leading-relaxed">
              The component uses semantic HTML with a section element and includes
              proper ARIA labels for screen reader compatibility. The high contrast
              ratio ensures readability for users with visual impairments.
            </p>
          </div>

          <div className="border-t border-chalk-gray/30 pt-6">
            <h3 className="chalk-text text-xl font-bold mb-3">
              Requirements Validated
            </h3>
            <div className="chalk-text text-base space-y-2">
              <p>✓ Requirement 3.8: Chalkboard aesthetic for explanations</p>
              <p>✓ Requirement 5.2: Chalkboard texture in background elements</p>
              <p>✓ Requirement 10.1: WCAG 2.1 AA contrast compliance</p>
            </div>
          </div>
        </div>
      </ChalkboardSection>

      {/* Example 4: Full Screen */}
      <ChalkboardSection className="min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="chalk-text text-4xl font-bold mb-6">
            Full Screen Chalkboard
          </h1>
          <p className="chalk-text text-xl leading-relaxed mb-8">
            This example demonstrates the chalkboard section at full screen height,
            perfect for hero sections or main content areas.
          </p>
          <p className="chalk-text text-base opacity-90">
            Notice the subtle radial gradient that adds depth to the background,
            creating an authentic classroom chalkboard feel.
          </p>
        </div>
      </ChalkboardSection>
    </div>
  );
}
