import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TopicInput from '../TopicInput';

describe('TopicInput', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('Component Rendering', () => {
    it('should render NotebookTextarea component', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox', { name: /enter your topic/i });
      expect(textarea).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const button = screen.getByRole('button', { name: /submit topic/i });
      expect(button).toBeInTheDocument();
    });

    it('should display placeholder text', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByPlaceholderText(/what would you like to learn about today/i);
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Character Count Validation (Requirements 2.2, 2.4)', () => {
    it('should disable submit button when input is empty', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const button = screen.getByRole('button', { name: /submit topic/i });
      expect(button).toBeDisabled();
    });

    it('should enable submit button when input is 1-500 characters', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /submit topic/i });

      // Test with 1 character
      fireEvent.change(textarea, { target: { value: 'a' } });
      expect(button).not.toBeDisabled();

      // Test with 500 characters
      fireEvent.change(textarea, { target: { value: 'a'.repeat(500) } });
      expect(button).not.toBeDisabled();
    });

    it('should disable submit button when input exceeds 500 characters', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /submit topic/i });

      // NotebookTextarea prevents input over maxLength, so button stays disabled
      fireEvent.change(textarea, { target: { value: 'a'.repeat(501) } });
      expect(button).toBeDisabled();
    });

    it('should display character counter', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const counter = screen.getByText(/0\/500/);
      expect(counter).toBeInTheDocument();
    });

    it('should update character counter as user types', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Hello' } });

      const counter = screen.getByText(/5\/500/);
      expect(counter).toBeInTheDocument();
    });
  });

  describe('Inline Validation Errors (Requirement 2.7)', () => {
    it('should display error when submitting empty topic', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const form = screen.getByRole('button', { name: /submit topic/i }).closest('form');
      fireEvent.submit(form!);

      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent(/please enter a topic to learn about/i);
    });

    it('should not call onSubmit when input is empty', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const form = screen.getByRole('button', { name: /submit topic/i }).closest('form');
      fireEvent.submit(form!);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should clear error when user starts typing', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      // Trigger error
      const form = screen.getByRole('button', { name: /submit topic/i }).closest('form');
      fireEvent.submit(form!);
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Start typing
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'W' } });

      // Error should be cleared
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Submit Button Styling (Requirement 2.4, 2.5)', () => {
    it('should have vintage school button styling', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const button = screen.getByRole('button', { name: /submit topic/i });
      expect(button).toHaveClass('submit-button');
    });

    it('should be enabled when input is valid', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Why is the sky blue?' } });

      const button = screen.getByRole('button', { name: /submit topic/i });
      expect(button).not.toBeDisabled();
    });

    it('should be disabled when input is invalid', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const button = screen.getByRole('button', { name: /submit topic/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Loading State (Requirement 2.5)', () => {
    it('should display loading state during API call', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={true} />);
      
      const button = screen.getByRole('button', { name: /submitting topic/i });
      expect(button).toHaveTextContent(/learning/i);
    });

    it('should show spinner during loading', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={true} />);
      
      const spinner = screen.getByRole('button').querySelector('.chalk-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should disable textarea during loading', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={true} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('should disable submit button during loading', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={true} />);
      
      const button = screen.getByRole('button', { name: /submitting topic/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with topic text when valid', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox');
      const topicText = 'Why is the sky blue?';
      fireEvent.change(textarea, { target: { value: topicText } });

      const button = screen.getByRole('button', { name: /submit topic/i });
      fireEvent.click(button);

      expect(mockOnSubmit).toHaveBeenCalledWith(topicText);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should submit on form submit event', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Test topic' } });

      const form = screen.getByRole('button').closest('form');
      fireEvent.submit(form!);

      expect(mockOnSubmit).toHaveBeenCalledWith('Test topic');
    });

    it('should prevent default form submission', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Test' } });

      const form = screen.getByRole('button').closest('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');
      
      form!.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox', { name: /enter your topic/i });
      expect(textarea).toBeInTheDocument();

      const button = screen.getByRole('button', { name: /submit topic/i });
      expect(button).toBeInTheDocument();
    });

    it('should announce errors with aria-live', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const form = screen.getByRole('button').closest('form');
      fireEvent.submit(form!);

      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('aria-live', 'polite');
    });

    it('should have minimum touch target size', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const button = screen.getByRole('button', { name: /submit topic/i });
      expect(button).toHaveClass('min-h-[44px]');
      expect(button).toHaveClass('min-w-[44px]');
    });
  });

  describe('Integration with NotebookTextarea', () => {
    it('should pass maxLength prop to NotebookTextarea', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} maxLength={300} />);
      
      const counter = screen.getByText(/0\/300/);
      expect(counter).toBeInTheDocument();
    });

    it('should pass disabled state to NotebookTextarea', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={true} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('should update state when NotebookTextarea value changes', () => {
      render(<TopicInput onSubmit={mockOnSubmit} isLoading={false} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'New topic' } });

      expect(textarea).toHaveValue('New topic');
    });
  });
});
