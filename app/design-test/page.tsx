export default function DesignTestPage() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold font-ui text-ink-black mb-8">
        ClassMate Design System Test
      </h1>

      {/* Chalkboard Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">Chalkboard Theme</h2>
        <div className="chalkboard p-8 rounded-lg">
          <p className="chalk-text text-lg">
            This is chalk text on a chalkboard background. The sky appears blue
            because of the way light scatters in Earth's atmosphere.
          </p>
        </div>
      </section>

      {/* Notebook Paper Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">Notebook Paper Theme</h2>
        <div className="notebook-paper p-8 rounded-lg min-h-[200px]">
          <p className="ink-text text-base">
            This is text on notebook paper with ruled lines and a margin line.
            Notice the paper texture and the red margin line on the left.
          </p>
        </div>
      </section>

      {/* Level Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">Level Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="level-card">
            <div className="chalk-text text-center">
              <div className="text-2xl font-bold mb-2">Level 1</div>
              <div className="text-sm">Age 9-10</div>
            </div>
          </div>
          <div className="level-card selected">
            <div className="chalk-text text-center">
              <div className="text-2xl font-bold mb-2">Level 2</div>
              <div className="text-sm">Age 10-11</div>
            </div>
          </div>
          <div className="level-card">
            <div className="chalk-text text-center">
              <div className="text-2xl font-bold mb-2">Level 3</div>
              <div className="text-sm">Age 11-12</div>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">Buttons</h2>
        <div className="flex gap-4">
          <button className="submit-button">Submit Topic</button>
          <button className="submit-button" disabled>
            Disabled Button
          </button>
        </div>
      </section>

      {/* Question Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">Question Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="question-card">
            <div className="flex items-start gap-2">
              <span className="text-2xl">✋</span>
              <p className="ink-text">
                What would happen if Earth had no atmosphere?
              </p>
            </div>
          </div>
          <div className="question-card expanded">
            <div className="flex items-start gap-2">
              <span className="text-2xl">✋</span>
              <p className="ink-text">Why does the sky change colors at sunset?</p>
            </div>
            <div className="mt-4 pt-4 border-t border-ruled-line">
              <p className="ink-text text-sm">
                At sunset, sunlight travels through more atmosphere, scattering
                shorter wavelengths and leaving warm colors visible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">Loading States</h2>
        <div className="flex gap-8 items-center">
          <div className="chalkboard p-4 rounded-lg">
            <div className="chalk-spinner"></div>
          </div>
          <div className="paper-loader"></div>
        </div>
      </section>

      {/* Error Display */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">Error Display</h2>
        <div className="error-display">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🚪</span>
            <div>
              <h3 className="font-ui font-semibold text-lg text-error-red mb-2">
                The teacher stepped out for a moment
              </h3>
              <p className="ink-text text-sm mb-4">
                Something went wrong on our end. Please try again!
              </p>
              <button className="submit-button text-sm">Try Again</button>
            </div>
          </div>
        </div>
      </section>

      {/* History Tabs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">History Tabs</h2>
        <div className="flex">
          <div className="history-tab active">
            <span className="text-sm font-ui">Why is the sky blue?</span>
          </div>
          <div className="history-tab">
            <span className="text-sm font-ui">How do plants grow?</span>
          </div>
          <div className="history-tab">
            <span className="text-sm font-ui">What is gravity?</span>
          </div>
        </div>
      </section>

      {/* Typography Samples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">Typography</h2>
        <div className="space-y-2">
          <p className="font-body text-base ink-text">
            Body text (Lora): The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-ui text-base ink-text">
            UI text (DM Sans): The quick brown fox jumps over the lazy dog.
          </p>
          <p className="chalk-text text-base chalkboard p-4 rounded">
            Chalk text: The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </section>

      {/* Color Palette */}
      <section className="space-y-4">
        <h2 className="text-2xl font-ui text-ink-black">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="w-full h-20 bg-chalk-white rounded border border-gray-300"></div>
            <p className="text-sm font-ui">chalk-white</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-chalkboard-black rounded"></div>
            <p className="text-sm font-ui">chalkboard-black</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-paper-cream rounded border border-gray-300"></div>
            <p className="text-sm font-ui">paper-cream</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-ink-black rounded"></div>
            <p className="text-sm font-ui">ink-black</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-accent-gold rounded"></div>
            <p className="text-sm font-ui">accent-gold</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-accent-blue rounded"></div>
            <p className="text-sm font-ui">accent-blue</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-accent-green rounded"></div>
            <p className="text-sm font-ui">accent-green</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-margin-red rounded"></div>
            <p className="text-sm font-ui">margin-red</p>
          </div>
        </div>
      </section>
    </div>
  );
}
