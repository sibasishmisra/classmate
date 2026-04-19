import { render, screen, fireEvent } from '@testing-library/react';
import SessionHistory from '../SessionHistory';
import type { TopicEntry } from '@/types';

describe('SessionHistory', () => {
  const mockTopics: TopicEntry[] = [
    {
      id: '1',
      topic: 'Why is the sky blue?',
      explanation: 'The sky appears blue because...',
      followUpQuestions: [],
      timestamp: new Date('2024-01-15T10:00:00Z'),
      level: 3
    },
    {
      id: '2',
      topic: 'How do plants grow?',
      explanation: 'Plants grow by...',
      followUpQuestions: [],
      timestamp: new Date('2024-01-15T11:00:00Z'),
      level: 2
    }
  ];

  it('renders empty state when no topics', () => {
    render(<SessionHistory topics={[]} />);

    expect(screen.getByText('📚 Your Learning Journey')).toBeInTheDocument();
    expect(screen.getByText('Your recent topics will appear here')).toBeInTheDocument();
  });

  it('renders list of topics using HistoryTab components', () => {
    render(<SessionHistory topics={mockTopics} />);

    expect(screen.getByText('Why is the sky blue?')).toBeInTheDocument();
    expect(screen.getByText('How do plants grow?')).toBeInTheDocument();
  });

  it('displays topics in reverse order (most recent first)', () => {
    render(<SessionHistory topics={mockTopics} />);

    const tabs = screen.getAllByRole('tab');
    // First tab should be the most recent topic
    expect(tabs[0]).toHaveTextContent('How do plants grow?');
    expect(tabs[1]).toHaveTextContent('Why is the sky blue?');
  });

  it('shows level for each topic', () => {
    render(<SessionHistory topics={mockTopics} />);

    expect(screen.getByText(/Level 3/)).toBeInTheDocument();
    expect(screen.getByText(/Level 2/)).toBeInTheDocument();
  });

  it('calls onTopicSelect when a topic is clicked', () => {
    const handleSelect = jest.fn();
    render(<SessionHistory topics={mockTopics} onTopicSelect={handleSelect} />);

    const firstTopic = screen.getByText('How do plants grow?');
    fireEvent.click(firstTopic);

    expect(handleSelect).toHaveBeenCalledWith(mockTopics[1]);
  });

  it('has proper accessibility attributes', () => {
    render(<SessionHistory topics={mockTopics} />);

    expect(screen.getByRole('complementary', { name: 'Session history' })).toBeInTheDocument();
    expect(screen.getByLabelText('Revisit topic: Why is the sky blue?')).toBeInTheDocument();
  });

  it('limits display to 10 most recent topics', () => {
    const manyTopics: TopicEntry[] = Array.from({ length: 15 }, (_, i) => ({
      id: `topic-${i}`,
      topic: `Topic ${i}`,
      explanation: 'Explanation',
      followUpQuestions: [],
      timestamp: new Date(`2024-01-15T${10 + i}:00:00Z`),
      level: 1
    }));

    render(<SessionHistory topics={manyTopics} />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(10);
    
    // Should show topics 5-14 (the last 10)
    expect(screen.getByText('Topic 14')).toBeInTheDocument();
    expect(screen.getByText('Topic 5')).toBeInTheDocument();
    expect(screen.queryByText('Topic 4')).not.toBeInTheDocument();
  });

  it('highlights the current topic when currentTopicId is provided', () => {
    render(
      <SessionHistory 
        topics={mockTopics} 
        currentTopicId="2"
      />
    );

    const tabs = screen.getAllByRole('tab');
    // The first tab (most recent) should be active
    expect(tabs[0]).toHaveAttribute('aria-pressed', 'true');
    expect(tabs[1]).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders tablist role for accessibility', () => {
    render(<SessionHistory topics={mockTopics} />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});
