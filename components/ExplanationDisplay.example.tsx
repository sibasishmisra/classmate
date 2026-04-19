'use client';

import React, { useState } from 'react';
import ExplanationDisplay from './ExplanationDisplay';
import type { FollowUpQuestion } from '@/types';

/**
 * ExplanationDisplay Component Examples
 * 
 * This file demonstrates various usage patterns for the ExplanationDisplay component.
 */

export default function ExplanationDisplayExamples() {
  const [selectedExample, setSelectedExample] = useState<string>('basic');

  // Example data
  const basicFollowUpQuestions: FollowUpQuestion[] = [
    {
      id: 'q1',
      question: 'What would happen if Earth had no atmosphere?',
      isAnswered: false
    },
    {
      id: 'q2',
      question: 'Why does the sky change colors at sunset?',
      isAnswered: false
    }
  ];

  const answeredFollowUpQuestions: FollowUpQuestion[] = [
    {
      id: 'q1',
      question: 'What would happen if Earth had no atmosphere?',
      answer: 'Without an atmosphere, the sky would appear black, just like in space. There would be no air to scatter sunlight, so you would see the darkness of space even during the day.',
      isAnswered: true
    },
    {
      id: 'q2',
      question: 'Why does the sky change colors at sunset?',
      isAnswered: false
    }
  ];

  const handleQuestionClick = (questionId: string) => {
    console.log('Question clicked:', questionId);
    alert(`Question ${questionId} clicked! In a real app, this would fetch the answer.`);
  };

  const examples = {
    basic: {
      title: 'Basic Usage',
      description: 'Standard explanation display with follow-up questions',
      component: (
        <ExplanationDisplay
          topic="Why is the sky blue?"
          level={3}
          explanation="The sky appears blue because of how sunlight interacts with the atmosphere. When sunlight enters Earth's atmosphere, it collides with tiny air molecules. Blue light has shorter waves that scatter more easily than other colors, so we see blue light coming from all directions in the sky."
          followUpQuestions={basicFollowUpQuestions}
          onQuestionClick={handleQuestionClick}
        />
      )
    },
    loading: {
      title: 'Loading State',
      description: 'Shows loading animation while fetching explanation',
      component: (
        <ExplanationDisplay
          topic="How do plants make food?"
          level={2}
          explanation=""
          isLoading={true}
        />
      )
    },
    error: {
      title: 'Error State',
      description: 'Displays friendly error message when something goes wrong',
      component: (
        <ExplanationDisplay
          topic="What causes earthquakes?"
          level={4}
          explanation=""
          error="The teacher stepped out for a moment. Please try again!"
        />
      )
    },
    answered: {
      title: 'With Answered Question',
      description: 'Shows follow-up question with its answer',
      component: (
        <ExplanationDisplay
          topic="Why is the sky blue?"
          level={3}
          explanation="The sky appears blue because of how sunlight interacts with the atmosphere. When sunlight enters Earth's atmosphere, it collides with tiny air molecules. Blue light has shorter waves that scatter more easily than other colors, so we see blue light coming from all directions in the sky."
          followUpQuestions={answeredFollowUpQuestions}
          onQuestionClick={handleQuestionClick}
        />
      )
    },
    noQuestions: {
      title: 'Without Follow-Up Questions',
      description: 'Explanation display without follow-up questions',
      component: (
        <ExplanationDisplay
          topic="What is gravity?"
          level={1}
          explanation="Gravity is a force that pulls things together. It's what keeps you on the ground and stops you from floating away! The Earth has gravity that pulls everything toward its center. That's why when you drop something, it falls down instead of floating up."
          followUpQuestions={[]}
        />
      )
    },
    level1: {
      title: 'Level 1 (Ages 9-10)',
      description: 'Explanation for youngest learners',
      component: (
        <ExplanationDisplay
          topic="Why do we have seasons?"
          level={1}
          explanation="We have seasons because Earth tilts as it goes around the Sun. When your part of Earth tilts toward the Sun, you get more sunlight and it's summer. When it tilts away, you get less sunlight and it's winter. Spring and fall happen in between!"
          followUpQuestions={[
            {
              id: 'q1',
              question: 'Does the Sun move around Earth?',
              isAnswered: false
            },
            {
              id: 'q2',
              question: 'Why is summer hot and winter cold?',
              isAnswered: false
            }
          ]}
          onQuestionClick={handleQuestionClick}
        />
      )
    },
    level6: {
      title: 'Level 6 (Ages 14+)',
      description: 'Explanation for advanced learners',
      component: (
        <ExplanationDisplay
          topic="How does photosynthesis work?"
          level={6}
          explanation="Photosynthesis is the process by which plants convert light energy into chemical energy. In the chloroplasts, chlorophyll molecules absorb photons from sunlight, exciting electrons that drive a series of reactions. These reactions split water molecules, releasing oxygen as a byproduct, and use the energy to convert carbon dioxide into glucose through the Calvin cycle. This process is fundamental to life on Earth, as it produces the oxygen we breathe and forms the base of most food chains."
          followUpQuestions={[
            {
              id: 'q1',
              question: 'What role do chloroplasts play in photosynthesis?',
              isAnswered: false
            },
            {
              id: 'q2',
              question: 'How does the Calvin cycle differ from light-dependent reactions?',
              isAnswered: false
            }
          ]}
          onQuestionClick={handleQuestionClick}
        />
      )
    },
    longExplanation: {
      title: 'Long Explanation',
      description: 'Handles longer explanation text with typewriter effect',
      component: (
        <ExplanationDisplay
          topic="How does the Internet work?"
          level={5}
          explanation="The Internet is a vast network of interconnected computers that communicate using standardized protocols. When you visit a website, your computer sends a request through your Internet Service Provider (ISP) to a Domain Name System (DNS) server, which translates the website's name into an IP address. Your request then travels through multiple routers and networks, potentially crossing continents through undersea cables, until it reaches the server hosting the website. The server processes your request and sends back the data in small packets, which are reassembled by your computer to display the webpage. This entire process happens in milliseconds, involving countless devices and technologies working together seamlessly. The Internet's design is decentralized, meaning there's no single point of control or failure, which makes it remarkably resilient and scalable."
          followUpQuestions={[
            {
              id: 'q1',
              question: 'What is the difference between the Internet and the World Wide Web?',
              isAnswered: false
            },
            {
              id: 'q2',
              question: 'How do routers know where to send data packets?',
              isAnswered: false
            }
          ]}
          onQuestionClick={handleQuestionClick}
        />
      )
    }
  };

  return (
    <div className="min-h-screen bg-paper-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-ink-black mb-4">
          ExplanationDisplay Component Examples
        </h1>
        <p className="text-lg text-chalk-gray mb-8">
          Explore different states and configurations of the ExplanationDisplay component.
        </p>

        {/* Example Selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {Object.entries(examples).map(([key, example]) => (
            <button
              key={key}
              onClick={() => setSelectedExample(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedExample === key
                  ? 'bg-ink-black text-paper-white'
                  : 'bg-paper-cream text-ink-black hover:bg-chalk-gray hover:text-paper-white'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        {/* Selected Example */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-ink-black mb-2">
            {examples[selectedExample as keyof typeof examples].title}
          </h2>
          <p className="text-base text-chalk-gray mb-6">
            {examples[selectedExample as keyof typeof examples].description}
          </p>
        </div>

        {/* Component Display */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {examples[selectedExample as keyof typeof examples].component}
        </div>

        {/* Usage Code */}
        <div className="mt-8 bg-ink-black text-chalk-white p-6 rounded-lg overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Code Example</h3>
          <pre className="text-sm">
            <code>{getCodeExample(selectedExample)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function getCodeExample(exampleKey: string): string {
  const examples: Record<string, string> = {
    basic: `<ExplanationDisplay
  topic="Why is the sky blue?"
  level={3}
  explanation="The sky appears blue because..."
  followUpQuestions={[
    {
      id: 'q1',
      question: 'What would happen if Earth had no atmosphere?',
      isAnswered: false
    },
    {
      id: 'q2',
      question: 'Why does the sky change colors at sunset?',
      isAnswered: false
    }
  ]}
  onQuestionClick={(id) => console.log('Question clicked:', id)}
/>`,
    loading: `<ExplanationDisplay
  topic="How do plants make food?"
  level={2}
  explanation=""
  isLoading={true}
/>`,
    error: `<ExplanationDisplay
  topic="What causes earthquakes?"
  level={4}
  explanation=""
  error="The teacher stepped out for a moment. Please try again!"
/>`,
    answered: `<ExplanationDisplay
  topic="Why is the sky blue?"
  level={3}
  explanation="The sky appears blue because..."
  followUpQuestions={[
    {
      id: 'q1',
      question: 'What would happen if Earth had no atmosphere?',
      answer: 'Without an atmosphere, the sky would appear black...',
      isAnswered: true
    }
  ]}
/>`,
    noQuestions: `<ExplanationDisplay
  topic="What is gravity?"
  level={1}
  explanation="Gravity is a force that pulls things together..."
  followUpQuestions={[]}
/>`,
    level1: `<ExplanationDisplay
  topic="Why do we have seasons?"
  level={1}
  explanation="We have seasons because Earth tilts..."
  followUpQuestions={[...]}
/>`,
    level6: `<ExplanationDisplay
  topic="How does photosynthesis work?"
  level={6}
  explanation="Photosynthesis is the process by which plants..."
  followUpQuestions={[...]}
/>`,
    longExplanation: `<ExplanationDisplay
  topic="How does the Internet work?"
  level={5}
  explanation="The Internet is a vast network of interconnected computers..."
  followUpQuestions={[...]}
/>`
  };

  return examples[exampleKey] || examples.basic;
}
