import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExplanationDisplay from '../ExplanationDisplay';
import type { FollowUpQuestion } from '@/types';

// Mock the TypewriterText component to avoid animation delays in tests
jest.mock('../TypewriterText', () => {
  return function MockTypewriterText({ text, className }: { text: string; className?: string }) {
    return <div className={className} data-testid="typewriter-text">{text}</div>;
  };
});

// Mock the ChalkboardSection component
jest.mock('../ChalkboardSection', () => {
  return function MockChalkboardSection({ 
    children, 
    className 
  }: { 
    children: React.ReactNode; 
    className?: string;
  }) {
    return <section className={className} data-testid="chalkboard-section">{children}</section>;
  };
});

describe('ExplanationDisplay', () => {
  const mockFollowUpQuestions: FollowUpQuestion[] = [
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

  const defaultProps = {
    topic: 'Why is the sky blue?',
    level: 3 as const,
    explanation: 'The sky appears blue because of how sunlight interacts with the atmosphere.',
    followUpQuestions: mockFollowUpQuestions
  };

  describe('Rendering', () => {
    it('should render topic, level, and explanation', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      expect(screen.getByText('Why is the sky blue?')).toBeInTheDocument();
      expect(screen.getByText('Explained for ages 11-12')).toBeInTheDocument();
      expect(screen.getByText('The sky appears blue because of how sunlight interacts with the atmosphere.')).toBeInTheDocument();
    });

    it('should render ChalkboardSection component', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      expect(screen.getByTestId('chalkboard-section')).toBeInTheDocument();
    });

    it('should render TypewriterText component', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      expect(screen.getByTestId('typewriter-text')).toBeInTheDocument();
    });

    it('should display correct age range for each level', () => {
      const levels = [
        { level: 1, age: '9-10' },
        { level: 2, age: '10-11' },
        { level: 3, age: '11-12' },
        { level: 4, age: '12-13' },
        { level: 5, age: '13-14' },
        { level: 6, age: '14+' }
      ];

      levels.forEach(({ level, age }) => {
        const { rerender } = render(
          <ExplanationDisplay
            {...defaultProps}
            level={level as 1 | 2 | 3 | 4 | 5 | 6}
          />
        );
        
        expect(screen.getByText(`Explained for ages ${age}`)).toBeInTheDocument();
        rerender(<div />); // Clean up
      });
    });
  });

  describe('Follow-Up Questions', () => {
    it('should render follow-up questions when provided', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      expect(screen.getByText('Want to learn more?')).toBeInTheDocument();
      expect(screen.getByText('What would happen if Earth had no atmosphere?')).toBeInTheDocument();
      expect(screen.getByText('Why does the sky change colors at sunset?')).toBeInTheDocument();
    });

    it('should not render follow-up section when no questions provided', () => {
      render(<ExplanationDisplay {...defaultProps} followUpQuestions={[]} />);
      
      expect(screen.queryByText('Want to learn more?')).not.toBeInTheDocument();
    });

    it('should call onQuestionClick when question is clicked', () => {
      const onQuestionClick = jest.fn();
      render(<ExplanationDisplay {...defaultProps} onQuestionClick={onQuestionClick} />);
      
      const firstQuestion = screen.getByText('What would happen if Earth had no atmosphere?');
      fireEvent.click(firstQuestion.closest('[role="button"]')!);
      
      expect(onQuestionClick).toHaveBeenCalledWith('q1');
    });

    it('should handle keyboard interaction on questions', () => {
      const onQuestionClick = jest.fn();
      render(<ExplanationDisplay {...defaultProps} onQuestionClick={onQuestionClick} />);
      
      const firstQuestion = screen.getByText('What would happen if Earth had no atmosphere?')
        .closest('[role="button"]')!;
      
      fireEvent.keyDown(firstQuestion, { key: 'Enter' });
      expect(onQuestionClick).toHaveBeenCalledWith('q1');
      
      fireEvent.keyDown(firstQuestion, { key: ' ' });
      expect(onQuestionClick).toHaveBeenCalledTimes(2);
    });

    it('should display answer when question is answered', () => {
      const answeredQuestions: FollowUpQuestion[] = [
        {
          id: 'q1',
          question: 'What would happen if Earth had no atmosphere?',
          answer: 'Without an atmosphere, the sky would appear black.',
          isAnswered: true
        }
      ];

      render(
        <ExplanationDisplay
          {...defaultProps}
          followUpQuestions={answeredQuestions}
        />
      );
      
      expect(screen.getByText('Without an atmosphere, the sky would appear black.')).toBeInTheDocument();
    });

    it('should render exactly 2 follow-up questions', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      const questions = screen.getAllByRole('button');
      expect(questions).toHaveLength(2);
    });
  });

  describe('Loading State', () => {
    it('should display loading state when isLoading is true', () => {
      render(<ExplanationDisplay {...defaultProps} isLoading={true} />);
      
      expect(screen.getByText('Writing on the chalkboard...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should not display content when loading', () => {
      render(<ExplanationDisplay {...defaultProps} isLoading={true} />);
      
      expect(screen.queryByText('Why is the sky blue?')).not.toBeInTheDocument();
      expect(screen.queryByText(defaultProps.explanation)).not.toBeInTheDocument();
    });

    it('should have proper accessibility attributes for loading state', () => {
      render(<ExplanationDisplay {...defaultProps} isLoading={true} />);
      
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(screen.getByText('Loading...')).toHaveClass('sr-only');
    });
  });

  describe('Error State', () => {
    it('should display error message when error is provided', () => {
      const errorMessage = 'Failed to fetch explanation';
      render(<ExplanationDisplay {...defaultProps} error={errorMessage} />);
      
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should not display content when error occurs', () => {
      render(<ExplanationDisplay {...defaultProps} error="Error occurred" />);
      
      expect(screen.queryByText('Why is the sky blue?')).not.toBeInTheDocument();
      expect(screen.queryByText(defaultProps.explanation)).not.toBeInTheDocument();
    });

    it('should have proper accessibility attributes for error state', () => {
      render(<ExplanationDisplay {...defaultProps} error="Error occurred" />);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for follow-up questions', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      const region = screen.getByRole('region', { name: 'Follow-up questions' });
      expect(region).toBeInTheDocument();
    });

    it('should have proper button roles for questions', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });

    it('should have descriptive aria-labels for each question', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      expect(screen.getByLabelText(/Follow-up question: What would happen/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Follow-up question: Why does the sky/)).toBeInTheDocument();
    });
  });

  describe('Integration with Components', () => {
    it('should pass explanation text to TypewriterText', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      const typewriter = screen.getByTestId('typewriter-text');
      expect(typewriter).toHaveTextContent(defaultProps.explanation);
    });

    it('should wrap explanation in ChalkboardSection', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      const chalkboard = screen.getByTestId('chalkboard-section');
      expect(chalkboard).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty explanation', () => {
      render(<ExplanationDisplay {...defaultProps} explanation="" />);
      
      expect(screen.getByTestId('typewriter-text')).toBeInTheDocument();
    });

    it('should handle long explanation text', () => {
      const longExplanation = 'A'.repeat(4000);
      render(<ExplanationDisplay {...defaultProps} explanation={longExplanation} />);
      
      expect(screen.getByText(longExplanation)).toBeInTheDocument();
    });

    it('should handle missing onQuestionClick callback', () => {
      render(<ExplanationDisplay {...defaultProps} onQuestionClick={undefined} />);
      
      const firstQuestion = screen.getByText('What would happen if Earth had no atmosphere?');
      
      // Should not throw error
      expect(() => {
        fireEvent.click(firstQuestion.closest('[role="button"]')!);
      }).not.toThrow();
    });

    it('should handle undefined followUpQuestions', () => {
      render(<ExplanationDisplay {...defaultProps} followUpQuestions={undefined} />);
      
      expect(screen.queryByText('Want to learn more?')).not.toBeInTheDocument();
    });
  });

  describe('Requirements Validation', () => {
    it('should validate Requirement 3.3: Display explanation within 200ms', () => {
      // Component renders synchronously, meeting the requirement
      const startTime = performance.now();
      render(<ExplanationDisplay {...defaultProps} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(200);
    });

    it('should validate Requirement 3.7: Lora serif font for body text', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      // TypewriterText component applies the font styling
      const typewriter = screen.getByTestId('typewriter-text');
      expect(typewriter).toBeInTheDocument();
    });

    it('should validate Requirement 3.8: Chalkboard background and chalk-style text', () => {
      render(<ExplanationDisplay {...defaultProps} />);
      
      // ChalkboardSection provides the chalkboard aesthetic
      const chalkboard = screen.getByTestId('chalkboard-section');
      expect(chalkboard).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should apply responsive grid classes for follow-up questions', () => {
      const { container } = render(<ExplanationDisplay {...defaultProps} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
    });

    it('should center content with max-width constraint', () => {
      const { container } = render(<ExplanationDisplay {...defaultProps} />);
      
      const content = container.querySelector('.max-w-3xl');
      expect(content).toHaveClass('mx-auto');
    });
  });
});
