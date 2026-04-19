/**
 * Test page for context providers
 * Navigate to /context-test to verify contexts work correctly
 */

import { ContextDemo } from '@/components/ContextDemo';

export default function ContextTestPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Context Providers Test
        </h1>
        <ContextDemo />
      </div>
    </main>
  );
}
