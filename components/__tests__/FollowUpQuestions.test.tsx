import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FollowUpQuestions from '../FollowUpQuestions';
import type { FollowUpQuestion } from '@/types';

// Mock fetch
global.fetch = jest.fn();

// Mock SuccessCelebration component
jest.mock('../SuccessCelebration', () => {
  return function MockSuccessCelebration({ trigger, onComplete }: any) {
    return trigger ? <div data-testid="mock-celebration">Celebration!</div> : null;
  };
});

describe('FollowUpQuestions', () => {
  const mockQuestions: FollowUpQuestion[] = [
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

  const mockContext = 'Original topic: Why is the sky blue?\n\nExplanation: The sky appears blue because...';
  const mockLevel = 3;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render exactly 2 QuestionCard components', () => {
    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    const questionCards = screen.getAllByRole('button');
    expect(questionCards).toHaveLength(2);
  });

  it('should render section header', () => {
    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    expect(screen.getByText('Want to learn more?')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    const region = screen.getByRole('region', { name: 'Follow-up questions' });
    expect(region).toBeInTheDocument();
  });

  it('should render both questions with correct text', () => {
    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    expect(screen.getByText(mockQuestions[0].question)).toBeInTheDocument();
    expect(screen.getByText(mockQuestions[1].question)).toBeInTheDocument();
  });

  it('should handle answer fetching for first question', async () => {
    const mockAnswer = 'If Earth had no atmosphere, the sky would appear black...';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: mockAnswer })
    });

    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    const questionCards = screen.getAllByRole('button');
    
    // Click first question
    fireEvent.click(questionCards[0]);

    // Wait for answer to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText(mockAnswer)).toBeInTheDocument();
    });
  });

  it('should keep both questions accessible when one is answered', async () => {
    const mockAnswer1 = 'Answer to first question';
    const mockAnswer2 = 'Answer to second question';
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: mockAnswer1 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: mockAnswer2 })
      });

    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    const questionCards = screen.getAllByRole('button');

    // Click first question
    fireEvent.click(questionCards[0]);

    // Wait for first answer
    await waitFor(() => {
      expect(screen.getByText(mockAnswer1)).toBeInTheDocument();
    });

    // Second question should still be clickable
    expect(questionCards[1]).toBeEnabled();
    
    // Click second question
    fireEvent.click(questionCards[1]);

    // Wait for second answer
    await waitFor(() => {
      expect(screen.getByText(mockAnswer2)).toBeInTheDocument();
    });

    // Both answers should be visible
    expect(screen.getByText(mockAnswer1)).toBeInTheDocument();
    expect(screen.getByText(mockAnswer2)).toBeInTheDocument();
  });

  it('should apply responsive grid layout classes', () => {
    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    const grid = screen.getByTestId('follow-up-questions').querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
  });

  it('should return null if questions array is not exactly 2', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const { container } = render(
      <FollowUpQuestions
        questions={[mockQuestions[0]]}
        level={mockLevel}
        context={mockContext}
      />
    );

    expect(container.firstChild).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith('FollowUpQuestions expects exactly 2 questions');

    consoleWarnSpy.mockRestore();
  });

  it('should return null if questions is undefined', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const { container } = render(
      <FollowUpQuestions
        questions={undefined as any}
        level={mockLevel}
        context={mockContext}
      />
    );

    expect(container.firstChild).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it('should update local state when answer is fetched', async () => {
    const mockAnswer = 'This is the answer';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: mockAnswer })
    });

    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    const questionCards = screen.getAllByRole('button');
    
    // Click first question
    fireEvent.click(questionCards[0]);

    // Wait for answer
    await waitFor(() => {
      expect(screen.getByText(mockAnswer)).toBeInTheDocument();
    });

    // Click again to collapse
    fireEvent.click(questionCards[0]);

    // Answer should be hidden
    expect(screen.queryByText(mockAnswer)).not.toBeInTheDocument();

    // Click again to expand
    fireEvent.click(questionCards[0]);

    // Answer should be visible again (from local state, no new API call)
    expect(screen.getByText(mockAnswer)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should pass correct props to QuestionCard components', () => {
    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    // Both questions should be rendered
    expect(screen.getByText(mockQuestions[0].question)).toBeInTheDocument();
    expect(screen.getByText(mockQuestions[1].question)).toBeInTheDocument();

    // Both should have raised hand icons
    const handIcons = screen.getAllByText('✋');
    expect(handIcons).toHaveLength(2);
  });

  it('should handle errors in one question without affecting the other', async () => {
    const errorMessage = 'Failed to fetch answer';
    const mockAnswer = 'This is a successful answer';

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: errorMessage })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: mockAnswer })
      });

    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    const questionCards = screen.getAllByRole('button');

    // Click first question (will error)
    fireEvent.click(questionCards[0]);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Second question should still be clickable
    fireEvent.click(questionCards[1]);

    await waitFor(() => {
      expect(screen.getByText(mockAnswer)).toBeInTheDocument();
    });

    // Error should still be visible
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should trigger celebration when both questions are answered', async () => {
    const mockAnswer1 = 'Answer to first question';
    const mockAnswer2 = 'Answer to second question';
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: mockAnswer1 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: mockAnswer2 })
      });

    render(
      <FollowUpQuestions
        questions={mockQuestions}
        level={mockLevel}
        context={mockContext}
      />
    );

    // Initially, celebration should not be visible
    expect(screen.queryByTestId('mock-celebration')).not.toBeInTheDocument();

    const questionCards = screen.getAllByRole('button');

    // Click first question
    fireEvent.click(questionCards[0]);

    // Wait for first answer
    await waitFor(() => {
      expect(screen.getByText(mockAnswer1)).toBeInTheDocument();
    });

    // Celebration should not trigger yet (only 1 question answered)
    expect(screen.queryByTestId('mock-celebration')).not.toBeInTheDocument();

    // Click second question
    fireEvent.click(questionCards[1]);

    // Wait for second answer
    await waitFor(() => {
      expect(screen.getByText(mockAnswer2)).toBeInTheDocument();
    });

    // Now celebration should be triggered (both questions answered)
    await waitFor(() => {
      expect(screen.getByTestId('mock-celebration')).toBeInTheDocument();
    });
  });
});
