'use client';

/**
 * FAQSection Component
 * 
 * Provides helpful information about using ClassMate.info
 * Includes how-to guides, dos and don'ts, and troubleshooting
 */

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'getting-started' | 'dos-donts' | 'features' | 'troubleshooting';
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    question: "How do I use ClassMate?",
    answer: "It's easy! First, select your learning level (Age 9-14). Then, type any question you're curious about in the notebook-style text box. Click 'Ask ClassMate' and watch as your explanation appears on the chalkboard with a cool typewriter effect!",
    category: 'getting-started'
  },
  {
    question: "What learning levels are available?",
    answer: "ClassMate offers 6 learning levels for ages 9-14. Each level provides explanations tailored to your age and understanding. Pick the level that matches your age for the best learning experience!",
    category: 'getting-started'
  },
  {
    question: "Can I ask any question?",
    answer: "Almost! You can ask about science, history, math, nature, technology, and many other educational topics. Questions should be between 1-500 characters. We filter out inappropriate content to keep learning safe and fun.",
    category: 'getting-started'
  },
  
  // Features
  {
    question: "What are the sound effects and animations?",
    answer: "ClassMate has nostalgic school-themed features! You'll see chalk dust particles when you hover over buttons, a typewriter animation when explanations appear, and page-flip transitions. Sound effects include a gentle school bell. You can turn these on or off in the Settings panel on the right side.",
    category: 'features'
  },
  {
    question: "How do I view my learning history?",
    answer: "Your last 10 topics are saved in the 'Your Learning Journey' section on the right side of the screen. Click on any past topic to see it again! Your history is saved in your browser and clears when you close the tab.",
    category: 'features'
  },
  {
    question: "What are follow-up questions?",
    answer: "After each explanation, ClassMate may suggest follow-up questions to help you learn more about the topic. Click on these questions to get deeper insights and expand your understanding!",
    category: 'features'
  },
  
  // Dos and Don'ts
  {
    question: "✅ DO: Ask clear, specific questions",
    answer: "Good examples: 'Why is the sky blue?', 'How do plants make food?', 'What causes earthquakes?' Clear questions help ClassMate give you the best explanations!",
    category: 'dos-donts'
  },
  {
    question: "✅ DO: Explore different topics",
    answer: "Don't be shy! Ask about anything you're curious about - science, history, nature, technology, arts, and more. Learning is an adventure!",
    category: 'dos-donts'
  },
  {
    question: "✅ DO: Use the settings to customize your experience",
    answer: "Turn sound effects and animations on or off based on your preference. Find the Settings panel on the right side of the screen. Your choices are saved automatically!",
    category: 'dos-donts'
  },
  {
    question: "❌ DON'T: Ask inappropriate questions",
    answer: "ClassMate is designed for educational learning. Questions about violence, adult content, or harmful topics will be filtered out. Keep it educational and fun!",
    category: 'dos-donts'
  },
  {
    question: "❌ DON'T: Submit very long questions",
    answer: "Keep your questions under 500 characters. Short, focused questions get better answers. If you have a complex topic, break it into smaller questions!",
    category: 'dos-donts'
  },
  {
    question: "❌ DON'T: Expect instant responses",
    answer: "ClassMate uses AI to create thoughtful explanations, which takes a few seconds. Be patient and watch the loading animation - good things take time!",
    category: 'dos-donts'
  },
  
  // Troubleshooting
  {
    question: "Why isn't my question working?",
    answer: "Check these things: 1) Is your question between 1-500 characters? 2) Is it educational and appropriate? 3) Do you have internet connection? 4) Try refreshing the page and asking again.",
    category: 'troubleshooting'
  },
  {
    question: "The animations aren't working. What should I do?",
    answer: "Check the Settings panel on the right - make sure 'Animations' is turned ON (green). Also, if your device has 'Reduce Motion' enabled in system settings, animations will be minimized automatically.",
    category: 'troubleshooting'
  },
  {
    question: "I can't hear any sounds. How do I fix this?",
    answer: "First, check the Settings panel and make sure 'Sound Effects' is turned ON (green). Then check your device volume. Some browsers also block sounds until you interact with the page - try clicking somewhere first!",
    category: 'troubleshooting'
  }
];

const categories = [
  { id: 'getting-started', label: '🚀 Getting Started', icon: '🚀' },
  { id: 'features', label: '✨ Features', icon: '✨' },
  { id: 'dos-donts', label: '📋 Dos & Don\'ts', icon: '📋' },
  { id: 'troubleshooting', label: '🔧 Troubleshooting', icon: '🔧' }
];

export default function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('getting-started');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredFAQs = faqData.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="faq-section bg-paper-cream rounded-lg p-6 md:p-8 shadow-paper">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-ink-black mb-2 font-ui">
          📚 Help & FAQ
        </h2>
        <p className="text-chalk-gray font-body">
          Everything you need to know about using ClassMate
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setExpandedIndex(0);
            }}
            className={`
              px-4 py-2 rounded-lg font-ui font-medium transition-all
              ${selectedCategory === category.id
                ? 'bg-accent-blue text-white shadow-md'
                : 'bg-white text-ink-black hover:bg-gray-100'
              }
            `}
            aria-label={`View ${category.label} questions`}
          >
            <span className="mr-2" aria-hidden="true">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFAQs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border-2 border-ruled-line overflow-hidden transition-all hover:border-accent-blue"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              aria-expanded={expandedIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-ink-black font-ui pr-4">
                {faq.question}
              </span>
              <span
                className={`text-2xl transition-transform ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>
            
            {expandedIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="px-6 py-4 bg-gray-50 border-t-2 border-ruled-line"
              >
                <p className="text-ink-black font-body leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 p-6 bg-accent-gold bg-opacity-10 border-2 border-accent-gold rounded-lg">
        <h3 className="text-lg font-semibold text-ink-black mb-3 font-ui flex items-center gap-2">
          <span aria-hidden="true">💡</span>
          Quick Tips
        </h3>
        <ul className="space-y-2 text-sm text-ink-black font-body">
          <li className="flex items-start gap-2">
            <span className="text-accent-gold" aria-hidden="true">★</span>
            <span>Your learning history is saved for this session only</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold" aria-hidden="true">★</span>
            <span>Settings are saved permanently in your browser</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold" aria-hidden="true">★</span>
            <span>You can change your learning level anytime</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-gold" aria-hidden="true">★</span>
            <span>ClassMate works best on modern browsers (Chrome, Firefox, Safari, Edge)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
