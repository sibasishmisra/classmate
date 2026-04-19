import { render, screen, fireEvent } from '@testing-library/react';
import HistoryTab from '../HistoryTab';
import type { TopicEntry } from '@/types';

describe('HistoryTab', () => {
  const mockTopic: TopicEntry = {
    id: 'topic-1',
    topic: 'Why is the sky blue?',
    explanation: 'The sky appears blue because of light scattering...',
    followUpQuestions: [
      {
        id: 'fq-1',
        question: 'What causes sunsets to be red?',
        isAnswered: false
      },
      {
        id: 'fq-2',
        question: 'Why is space black?',
        isAnswered: false
      }
    ],
    timestamp: new Date('2024-01-15T10:30:00Z'),
    level: 3
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders topic title correctly', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByText('Why is the sky blue?')).toBeInTheDocument();
    });

    it('displays index number', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByText('1.')).toBeInTheDocument();
    });

    it('displays learning level', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByText('Level 3')).toBeInTheDocument();
    });

    it('displays timestamp in relative format', () => {
      // Mock current time to be 1 hour after the topic timestamp
      const now = new Date('2024-01-15T11:30:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(now);

      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByText('1h ago')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('displays "Just now" for very recent topics', () => {
      const recentTopic = {
        ...mockTopic,
        timestamp: new Date()
      };

      render(<HistoryTab topic={recentTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByText('Just now')).toBeInTheDocument();
    });

    it('displays bookmark corner fold decoration', () => {
      const { container } = render(
        <HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />
      );
      
      // Check for the decorative corner fold element
      const cornerFold = container.querySelector('.border-t-\\[8px\\]');
      expect(cornerFold).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies notebook tab styling', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      expect(button).toHaveClass('history-tab');
      expect(button).toHaveClass('bg-paper-cream');
      expect(button).toHaveClass('rounded-t-lg');
    });

    it('applies active state styling when isActive is true', () => {
      render(
        <HistoryTab topic={mockTopic} index={1} isActive={true} onClick={mockOnClick} />
      );
      
      const button = screen.getByRole('tab');
      expect(button).toHaveClass('active');
      expect(button).toHaveClass('bg-paper-white');
      expect(button).toHaveClass('border-accent-blue');
    });

    it('does not apply active styling when isActive is false', () => {
      render(
        <HistoryTab topic={mockTopic} index={1} isActive={false} onClick={mockOnClick} />
      );
      
      const button = screen.getByRole('tab');
      expect(button).not.toHaveClass('active');
    });

    it('changes bookmark color when active', () => {
      const { container, rerender } = render(
        <HistoryTab topic={mockTopic} index={1} isActive={false} onClick={mockOnClick} />
      );
      
      let cornerFold = container.querySelector('.border-t-chalk-gray');
      expect(cornerFold).toBeInTheDocument();

      rerender(
        <HistoryTab topic={mockTopic} index={1} isActive={true} onClick={mockOnClick} />
      );
      
      cornerFold = container.querySelector('.border-t-accent-gold');
      expect(cornerFold).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onClick with topic when clicked', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockTopic);
    });

    it('calls onClick when Enter key is pressed', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      fireEvent.keyDown(button, { key: 'Enter' });
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockTopic);
    });

    it('calls onClick when Space key is pressed', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      fireEvent.keyDown(button, { key: ' ' });
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockTopic);
    });

    it('does not call onClick for other keys', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      fireEvent.keyDown(button, { key: 'a' });
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('has hover effects applied via CSS classes', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      expect(button).toHaveClass('hover:bg-paper-white');
      expect(button).toHaveClass('hover:shadow-md');
      expect(button).toHaveClass('hover:-translate-y-0.5');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByRole('tab')).toBeInTheDocument();
    });

    it('has descriptive aria-label', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(
        screen.getByLabelText('Revisit topic: Why is the sky blue?')
      ).toBeInTheDocument();
    });

    it('has aria-pressed attribute reflecting active state', () => {
      const { rerender } = render(
        <HistoryTab topic={mockTopic} index={1} isActive={false} onClick={mockOnClick} />
      );
      
      let button = screen.getByRole('tab');
      expect(button).toHaveAttribute('aria-pressed', 'false');

      rerender(
        <HistoryTab topic={mockTopic} index={1} isActive={true} onClick={mockOnClick} />
      );
      
      button = screen.getByRole('tab');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('is keyboard focusable with tabIndex', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('has visible focus indicator', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus:ring-2');
      expect(button).toHaveClass('focus:ring-accent-blue');
    });

    it('has data-testid for testing', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByTestId('history-tab-topic-1')).toBeInTheDocument();
    });

    it('marks decorative elements with aria-hidden', () => {
      const { container } = render(
        <HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />
      );
      
      // Index number is decorative
      const indexSpan = screen.getByText('1.');
      expect(indexSpan).toHaveAttribute('aria-hidden', 'true');

      // Bullet separator is decorative
      const bullet = screen.getByText('•');
      expect(bullet).toHaveAttribute('aria-hidden', 'true');

      // Corner fold is decorative
      const cornerFold = container.querySelector('.border-t-\\[8px\\]');
      expect(cornerFold).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Timestamp Formatting', () => {
    it('formats minutes correctly', () => {
      const now = new Date('2024-01-15T10:45:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(now);

      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByText('15m ago')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('formats hours correctly', () => {
      const now = new Date('2024-01-15T13:30:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(now);

      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByText('3h ago')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('displays "Yesterday" for topics from previous day', () => {
      const now = new Date('2024-01-16T10:30:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(now);

      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      expect(screen.getByText('Yesterday')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('displays full date for older topics', () => {
      const now = new Date('2024-01-20T10:30:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(now);

      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      // Should display formatted date (format depends on locale)
      const timestampElement = screen.getByText(/1\/15\/2024|15\/1\/2024|2024-01-15/);
      expect(timestampElement).toBeInTheDocument();

      jest.useRealTimers();
    });
  });

  describe('Topic Title Truncation', () => {
    it('truncates long topic titles', () => {
      const longTopic = {
        ...mockTopic,
        topic: 'This is a very long topic title that should be truncated when displayed in the history tab to prevent layout issues'
      };

      render(<HistoryTab topic={longTopic} index={1} onClick={mockOnClick} />);
      
      const titleElement = screen.getByText(longTopic.topic);
      expect(titleElement).toHaveClass('truncate');
    });
  });

  describe('Requirements Validation', () => {
    it('validates Requirement 11.7: Display topic title and timestamp', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      // Topic title is displayed
      expect(screen.getByText('Why is the sky blue?')).toBeInTheDocument();
      
      // Timestamp is displayed (in some format)
      const button = screen.getByRole('tab');
      expect(button.textContent).toMatch(/ago|Yesterday|Just now|\d+\/\d+\/\d+/);
    });

    it('validates Requirement 11.7: Style as notebook tab or bookmark', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      
      // Notebook styling
      expect(button).toHaveClass('bg-paper-cream');
      expect(button).toHaveClass('rounded-t-lg');
      expect(button).toHaveClass('border');
      
      // Bookmark corner fold present
      const { container } = render(
        <HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />
      );
      const cornerFold = container.querySelector('.border-t-\\[8px\\]');
      expect(cornerFold).toBeInTheDocument();
    });

    it('validates Requirement 11.7: Implement click handler to load cached entry', () => {
      render(<HistoryTab topic={mockTopic} index={1} onClick={mockOnClick} />);
      
      const button = screen.getByRole('tab');
      fireEvent.click(button);
      
      // Click handler is called with the complete topic entry (cached data)
      expect(mockOnClick).toHaveBeenCalledWith(mockTopic);
      expect(mockOnClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'topic-1',
          topic: 'Why is the sky blue?',
          explanation: expect.any(String),
          followUpQuestions: expect.any(Array),
          timestamp: expect.any(Date),
          level: 3
        })
      );
    });
  });
});
