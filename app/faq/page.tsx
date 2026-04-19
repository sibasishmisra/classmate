'use client';

import Link from 'next/link';
import FAQSection from '@/components/FAQSection';

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-paper-white" role="main">
      {/* Header */}
      <header className="bg-chalkboard-black text-chalk-white py-6 px-4 shadow-lg" role="banner">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-ui">
                ClassMate.info
              </h1>
              <p className="text-chalk-gray mt-2 font-body">
                Help & Frequently Asked Questions
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-accent-blue text-white rounded-lg font-ui font-medium hover:bg-opacity-90 transition-colors"
              aria-label="Go back to home page"
            >
              ← Back to Learning
            </Link>
          </div>
        </div>
      </header>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <FAQSection />
      </div>

      {/* Footer */}
      <footer className="bg-chalkboard-black text-chalk-white py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-sm">
            Still have questions? ClassMate is here to help you learn! 📚
          </p>
          <p className="font-body text-xs text-chalk-gray mt-2">
            © 2026 ClassMate.info - AI-powered learning companion
          </p>
        </div>
      </footer>
    </main>
  );
}
