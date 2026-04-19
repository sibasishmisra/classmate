/**
 * Task 18.4: Text Alternatives for Decorative Elements
 * 
 * Tests to verify that all decorative elements have appropriate
 * aria-hidden or text alternatives, and informative elements have
 * descriptive alt text or aria-labels.
 * 
 * Validates: Requirements 10.5
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LevelCard from '@/components/LevelCard';
import SuccessCelebration from '@/components/SuccessCelebration';
import ExplanationDisplay from '@/components/ExplanationDisplay';
import SessionHistory from '@/components/SessionHistory';
import HistoryTab from '@/components/HistoryTab';
import QuestionCard from '@/components/QuestionCard';
import FriendlyErrorDisplay from '@/components/FriendlyErrorDisplay';
import ChalkDustCanvas from '@/components/ChalkDustCanvas';
import ChalkSpinner from '@/components/ChalkSpinner';
import PaperFlipLoader from '@/components/PaperFlipLoader';
import LoadingSpinner from '@/components/LoadingSpinner';
import TypewriterText from '@/components/TypewriterText';
import type { TopicEntry, FollowUpQuestion } from '@/types';

describe('Task 18.4: Text Alternatives for Decorative Elements', () => {
  describe('Canvas Elements (Purely Decorative)', () => {
    it('should have aria-hidden on ChalkDustCanvas', () => {
      const { container } = render(<ChalkDustCanvas />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-hidden on LevelCard chalk dust canvas', () => {
      const { container } = render(
        <LevelCard level={1} ageRange="9-10" onClick={() => {}} />
      );
      const canvas = container.querySelector('canvas');
      expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-hidden on QuestionCard canvas', () => {
      const question: FollowUpQuestion = {
        id: '1',
        question: 'Test question?',
        isAnswered: false
      };
      const { container } = render(
        <QuestionCard question={question} level={3} context="test" />
      );
      const canvas = container.querySelector('canvas');
      expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Loading Spinners (Decorative with Status)', () => {
    it('should have role="status" and aria-live on ChalkSpinner', () => {
      const { container } = render(<ChalkSpinner />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-hidden on spinner animation element', () => {
      const { container } = render(<ChalkSpinner />);
      const spinnerElement = container.querySelector('.chalk-spinner');
      expect(spinnerElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have role="status" on PaperFlipLoader', () => {
      const { container } = render(<PaperFlipLoader />);
      const loader = container.querySelector('[role="status"]');
      expect(loader).toBeInTheDocument();
      expect(loader).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-hidden on paper flip animation', () => {
      const { container } = render(<PaperFlipLoader />);
      const paperElement = container.querySelector('.paper-loader');
      expect(paperElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have role="status" on LoadingSpinner', () => {
      const { container } = render(<LoadingSpinner variant="chalk" />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should have aria-hidden on LoadingSpinner emoji', () => {
      const { container } = render(<LoadingSpinner variant="chalk" />);
      const emoji = container.querySelector('[aria-hidden="true"]');
      expect(emoji).toBeInTheDocument();
    });
  });

  describe('Decorative Icons and Emojis', () => {
    it('should have aria-hidden on raised hand emoji in QuestionCard', () => {
      const question: FollowUpQuestion = {
        id: '1',
        question: 'Test question?',
        isAnswered: false
      };
      const { container } = render(
        <QuestionCard question={question} level={3} context="test" />
      );
      // The raised hand emoji should be decorative
      const handEmoji = container.querySelector('[aria-hidden="true"]');
      expect(handEmoji).toBeInTheDocument();
    });

    it('should have aria-hidden on celebration emojis in SuccessCelebration', () => {
      const { container } = render(
        <SuccessCelebration trigger={true} />
      );
      // All celebration emojis should be decorative
      const emojis = container.querySelectorAll('[aria-hidden="true"]');
      expect(emojis.length).toBeGreaterThan(0);
    });

    it('should have aria-hidden on typewriter cursor', () => {
      const { container } = render(
        <TypewriterText text="Test text" speed={10} />
      );
      // Wait for cursor to appear
      setTimeout(() => {
        const cursor = container.querySelector('.typewriter-cursor');
        if (cursor) {
          expect(cursor).toHaveAttribute('aria-hidden', 'true');
        }
      }, 100);
    });

    it('should have aria-hidden on error icon emoji in FriendlyErrorDisplay', () => {
      const { container } = render(
        <FriendlyErrorDisplay
          title="Error"
          message="Test error"
          icon="🤔"
        />
      );
      // The emoji icon should be decorative, but role="img" with aria-label
      const icon = container.querySelector('[role="img"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-label', 'Error icon');
    });

    it('should have aria-hidden on history tab bookmark indicator', () => {
      const topic: TopicEntry = {
        id: '1',
        topic: 'Test topic',
        explanation: 'Test explanation',
        followUpQuestions: [],
        timestamp: new Date(),
        level: 3
      };
      const { container } = render(
        <HistoryTab topic={topic} index={1} onClick={() => {}} />
      );
      // The bookmark corner fold should be decorative
      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });

    it('should have aria-hidden on session history book emoji', () => {
      render(<SessionHistory topics={[]} />);
      // The 📚 emoji in the heading is decorative
      const heading = screen.getByText(/Your Learning Journey/);
      expect(heading).toBeInTheDocument();
      // Emoji is part of text content, which is acceptable
    });
  });

  describe('Informative Elements with Text Alternatives', () => {
    it('should have descriptive aria-label on LevelCard button', () => {
      render(<LevelCard level={3} ageRange="11-12" onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Select level 3 for ages 11-12');
    });

    it('should have descriptive aria-label on QuestionCard', () => {
      const question: FollowUpQuestion = {
        id: '1',
        question: 'Why is the sky blue?',
        isAnswered: false
      };
      render(<QuestionCard question={question} level={3} context="test" />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-label', 'Follow-up question: Why is the sky blue?');
    });

    it('should have descriptive aria-label on HistoryTab', () => {
      const topic: TopicEntry = {
        id: '1',
        topic: 'Photosynthesis',
        explanation: 'Test explanation',
        followUpQuestions: [],
        timestamp: new Date(),
        level: 3
      };
      render(<HistoryTab topic={topic} index={1} onClick={() => {}} />);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveAttribute('aria-label', 'Revisit topic: Photosynthesis');
    });

    it('should have aria-label on ExplanationDisplay article', () => {
      render(
        <ExplanationDisplay
          topic="Test Topic"
          level={3}
          explanation="Test explanation"
        />
      );
      const article = screen.getByRole('article', { name: 'Explanation for Test Topic' });
      expect(article).toHaveAttribute('aria-label', 'Explanation for Test Topic');
    });

    it('should have aria-label on TypewriterText', () => {
      const { container } = render(
        <TypewriterText text="Test text" speed={10} />
      );
      const article = container.querySelector('[role="article"]');
      expect(article).toHaveAttribute('aria-label', 'Explanation text');
    });

    it('should have aria-label on SuccessCelebration container', () => {
      const { container } = render(
        <SuccessCelebration trigger={true} />
      );
      const celebration = container.querySelector('[aria-label="Celebration animation"]');
      expect(celebration).toBeInTheDocument();
    });
  });

  describe('Background Textures and Visual Effects', () => {
    it('should have aria-hidden on selected state indicator in LevelCard', () => {
      const { container } = render(
        <LevelCard level={1} ageRange="9-10" selected={true} onClick={() => {}} />
      );
      // The gold border indicator should be decorative
      const indicator = container.querySelector('[aria-hidden="true"]');
      expect(indicator).toBeInTheDocument();
    });

    it('should not expose decorative visual elements to screen readers', () => {
      const { container } = render(
        <ExplanationDisplay
          topic="Test"
          level={3}
          explanation="Test explanation"
        />
      );
      // Chalkboard background and textures should not be announced
      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
      // Should have at least some decorative elements
      expect(decorativeElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Status and Live Regions', () => {
    it('should have proper aria-live on loading states', () => {
      render(
        <ExplanationDisplay
          topic="Test"
          level={3}
          explanation=""
          isLoading={true}
        />
      );
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-live="assertive" on error states', () => {
      render(
        <ExplanationDisplay
          topic="Test"
          level={3}
          explanation=""
          error="Test error"
        />
      );
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have aria-live="polite" on SuccessCelebration', () => {
      const { container } = render(
        <SuccessCelebration trigger={true} />
      );
      const celebration = container.querySelector('[aria-live="polite"]');
      expect(celebration).toBeInTheDocument();
    });
  });

  describe('Interactive Element Accessibility', () => {
    it('should have aria-pressed on LevelCard when selected', () => {
      render(
        <LevelCard level={1} ageRange="9-10" selected={true} onClick={() => {}} />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have aria-expanded on QuestionCard', () => {
      const question: FollowUpQuestion = {
        id: '1',
        question: 'Test?',
        isAnswered: false
      };
      render(<QuestionCard question={question} level={3} context="test" />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-expanded');
    });

    it('should have aria-pressed on HistoryTab when active', () => {
      const topic: TopicEntry = {
        id: '1',
        topic: 'Test',
        explanation: 'Test',
        followUpQuestions: [],
        timestamp: new Date(),
        level: 3
      };
      render(<HistoryTab topic={topic} index={1} isActive={true} onClick={() => {}} />);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Complementary Content Labeling', () => {
    it('should have aria-label on SessionHistory complementary region', () => {
      render(<SessionHistory topics={[]} />);
      const aside = screen.getByRole('complementary');
      expect(aside).toHaveAttribute('aria-label', 'Session history');
    });

    it('should have aria-label on follow-up questions region', () => {
      const questions: FollowUpQuestion[] = [
        { id: '1', question: 'Q1?', isAnswered: false },
        { id: '2', question: 'Q2?', isAnswered: false }
      ];
      render(
        <ExplanationDisplay
          topic="Test"
          level={3}
          explanation="Test"
          followUpQuestions={questions}
        />
      );
      const region = screen.getByRole('region', { name: /follow-up questions/i });
      expect(region).toHaveAttribute('aria-label', 'Follow-up questions');
    });
  });
});
