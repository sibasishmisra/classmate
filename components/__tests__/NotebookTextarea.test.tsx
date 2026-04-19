import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotebookTextarea from '../NotebookTextarea';

describe('NotebookTextarea', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render with default placeholder text', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByPlaceholderText(/What would you like to learn about today?/);
    expect(textarea).toBeInTheDocument();
  });

  it('should render with custom placeholder text', () => {
    render(
      <NotebookTextarea 
        value="" 
        onChange={mockOnChange} 
        placeholder="Custom placeholder"
      />
    );
    
    const textarea = screen.getByPlaceholderText('Custom placeholder');
    expect(textarea).toBeInTheDocument();
  });

  it('should display character counter with 0/500 initially', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} />);
    
    expect(screen.getByText('0/500')).toBeInTheDocument();
  });

  it('should update character counter as user types', () => {
    const { rerender } = render(<NotebookTextarea value="" onChange={mockOnChange} />);
    
    rerender(<NotebookTextarea value="Hello" onChange={mockOnChange} />);
    expect(screen.getByText('5/500')).toBeInTheDocument();
    
    rerender(<NotebookTextarea value="Hello World" onChange={mockOnChange} />);
    expect(screen.getByText('11/500')).toBeInTheDocument();
  });

  it('should call onChange when user types', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test input' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('Test input');
  });

  it('should not allow input beyond maxLength', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} maxLength={10} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'This is a very long text' } });
    
    // onChange should not be called because input exceeds maxLength
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should accept input up to maxLength', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} maxLength={10} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '1234567890' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('1234567890');
  });

  it('should display custom maxLength in counter', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} maxLength={100} />);
    
    expect(screen.getByText('0/100')).toBeInTheDocument();
  });

  it('should highlight counter when near limit (>90%)', () => {
    const longText = 'a'.repeat(460);
    render(<NotebookTextarea value={longText} onChange={mockOnChange} maxLength={500} />);
    
    const counter = screen.getByText('460/500');
    expect(counter).toHaveClass('text-warning-yellow');
    expect(counter).toHaveClass('font-semibold');
  });

  it('should not highlight counter when below 90% of limit', () => {
    const mediumText = 'a'.repeat(400);
    render(<NotebookTextarea value={mediumText} onChange={mockOnChange} maxLength={500} />);
    
    const counter = screen.getByText('400/500');
    expect(counter).toHaveClass('text-chalk-gray');
    expect(counter).not.toHaveClass('text-warning-yellow');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} disabled={true} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('should have proper ARIA labels', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-label', 'Enter your topic');
    expect(textarea).toHaveAttribute('aria-describedby', 'character-counter');
  });

  it('should have notebook paper styling classes', () => {
    const { container } = render(<NotebookTextarea value="" onChange={mockOnChange} />);
    
    const notebookPaper = container.querySelector('.notebook-paper');
    expect(notebookPaper).toBeInTheDocument();
  });

  it('should apply focus styles when focused', () => {
    const { container } = render(<NotebookTextarea value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    const wrapper = container.querySelector('.notebook-paper');
    
    // Initially no shadow
    expect(wrapper).not.toHaveClass('shadow-paper');
    
    // Focus textarea
    fireEvent.focus(textarea);
    expect(wrapper).toHaveClass('shadow-paper');
    
    // Blur textarea
    fireEvent.blur(textarea);
    expect(wrapper).not.toHaveClass('shadow-paper');
  });

  it('should use handwriting-style font for placeholder', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('placeholder:italic');
    expect(textarea).toHaveClass('placeholder:font-body');
  });

  it('should have proper padding for margin area', () => {
    render(<NotebookTextarea value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    // The notebook-paper class applies padding-left: 70px via CSS
    const wrapper = textarea.closest('.notebook-paper');
    expect(wrapper).toBeInTheDocument();
  });
});
