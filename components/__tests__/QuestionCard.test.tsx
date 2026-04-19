import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionCard from '../QuestionCard';
import type { FollowUpQuestion } from '@/types';

// Mock fetch
global.fetch = jest.fn();

describe('QuestionCard', () => {
  const mockQuestion: FollowUpQuestion = {
    id: 'q1',
    question: 'What would happen if Earth had no atmosphere?',
    isAnswered: false
  };

  const mockContext = 'Original topic: Why is the sky blue?\n\nExplanation: The sky appears blue because...';
  const mockLevel = 3;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render question text with raised hand icon', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        level={mockLevel}
        context={mockContext}
      />
    );

    expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
    expect(screen.getByText('✋')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        level={mockLevel}
        context={mockContext}
      />
    );

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-expanded', 'false');
    expect(card).toHaveAttribute('aria-label', `Follow-up question: ${mockQuestion.question}`);
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('should fetch answer when clicked', async () => {
    const mockAnswer = 'If Earth had no atmosphere, the sky would appear black...';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: mockAnswer })
    });

    const onAnswerFetched = jest.fn();

    render(
      <QuestionCard
        question={mockQuestion}
        level={mockLevel}
        context={mockContext}
        onAnswerFetched={onAnswerFetched}
      />
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);

    // Should show loading state
    expect(screen.getByText('Thinking...')).toBeInTheDocument();

    // Wait for API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: mockQuestion.question,
          context: mockContext,
          level: mockLevel
        })
      });
    });

    // Should call onAnswerFetched callback
    await waitFor(() => {
      expect(onAnswerFetched).toHaveBeenCalledWith(mockQuestion.id, mockAnswer);
    });
  });

  it('should display answer in accordion when expanded', async () => {
    const answeredQuestion: FollowUpQuestion = {
      ...mockQuestion,
      isAnswered: true,
      answer: 'This is the answer to the question.'
    };

    render(
      <QuestionCard
        question={answeredQuestion}
        level={mockLevel}
        context={mockContext}
      />
    );

    const card = screen.getByRole('button');
    
    // Initially collapsed
    expect(screen.queryByText(answeredQuestion.answer!)).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(card);

    // Should show answer
    expect(screen.getByText(answeredQuestion.answer!)).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-expanded', 'true');
  });

  it('should toggle expansion when clicking already answered question', () => {
    const answeredQuestion: FollowUpQuestion = {
      ...mockQuestion,
      isAnswered: true,
      answer: 'This is the answer.'
    };

    render(
      <QuestionCard
        question={answeredQuestion}
        level={mockLevel}
        context={mockContext}
      />
    );

    const card = screen.getByRole('button');

    // Expand
    fireEvent.click(card);
    expect(screen.getByText(answeredQuestion.answer!)).toBeInTheDocument();

    // Collapse
    fireEvent.click(card);
    expect(screen.queryByText(answeredQuestion.answer!)).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'The teacher stepped out for a moment. Please try again!';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage })
    });

    render(
      <QuestionCard
        question={mockQuestion}
        level={mockLevel}
        context={mockContext}
      />
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should support keyboard navigation', async () => {
    const answeredQuestion: FollowUpQuestion = {
      ...mockQuestion,
      isAnswered: true,
      answer: 'This is the answer.'
    };

    render(
      <QuestionCard
        question={answeredQuestion}
        level={mockLevel}
        context={mockContext}
      />
    );

    const card = screen.getByRole('button');

    // Press Enter to expand
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(screen.getByText(answeredQuestion.answer!)).toBeInTheDocument();

    // Press Space to collapse
    fireEvent.keyDown(card, { key: ' ' });
    expect(screen.queryByText(answeredQuestion.answer!)).not.toBeInTheDocument();
  });

  it('should apply hover effects with rotation and scale', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        level={mockLevel}
        context={mockContext}
      />
    );

    const card = screen.getByTestId('question-card');
    expect(card).toHaveClass('question-card');
  });

  it('should rotate hand icon when expanded', async () => {
    const answeredQuestion: FollowUpQuestion = {
      ...mockQuestion,
      isAnswered: true,
      answer: 'This is the answer.'
    };

    render(
      <QuestionCard
        question={answeredQuestion}
        level={mockLevel}
        context={mockContext}
      />
    );

    const handIcon = screen.getByText('✋');
    const card = screen.getByRole('button');

    // Initially not rotated
    expect(handIcon).toHaveStyle({ transform: 'rotate(0deg)' });

    // Click to expand
    fireEvent.click(card);

    // Should be rotated
    expect(handIcon).toHaveStyle({ transform: 'rotate(15deg)' });
  });

  it('should not fetch answer multiple times while loading', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ answer: 'Test answer' })
      }), 100))
    );

    render(
      <QuestionCard
        question={mockQuestion}
        level={mockLevel}
        context={mockContext}
      />
    );

    const card = screen.getByRole('button');
    
    // Click multiple times rapidly
    fireEvent.click(card);
    fireEvent.click(card);
    fireEvent.click(card);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
