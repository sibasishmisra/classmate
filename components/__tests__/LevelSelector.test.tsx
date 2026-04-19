import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LevelSelector from '../LevelSelector';
import { soundManager } from '@/lib/sound-manager';
import type { LearningLevel } from '@/types';

// Mock the sound manager
jest.mock('@/lib/sound-manager', () => ({
  soundManager: {
    play: jest.fn(),
  },
  SOUND_IDS: {
    BELL_SOFT: 'bell-soft',
  },
}));

// Mock LevelCard component
jest.mock('../LevelCard', () => {
  return function MockLevelCard({ level, ageRange, selected, onClick }: any) {
    return (
      <button
        data-testid={`level-card-${level}`}
        onClick={() => onClick(level)}
        aria-pressed={selected}
      >
        Level {level} - Age {ageRange}
      </button>
    );
  };
});

describe('LevelSelector', () => {
  const mockOnLevelSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders 6 LevelCard components for ages 9-14', () => {
    render(<LevelSelector onLevelSelect={mockOnLevelSelect} />);

    // Check all 6 levels are rendered
    for (let level = 1; level <= 6; level++) {
      expect(screen.getByTestId(`level-card-${level}`)).toBeInTheDocument();
    }

    // Verify age ranges
    expect(screen.getByText('Level 1 - Age 9')).toBeInTheDocument();
    expect(screen.getByText('Level 2 - Age 10')).toBeInTheDocument();
    expect(screen.getByText('Level 3 - Age 11')).toBeInTheDocument();
    expect(screen.getByText('Level 4 - Age 12')).toBeInTheDocument();
    expect(screen.getByText('Level 5 - Age 13')).toBeInTheDocument();
    expect(screen.getByText('Level 6 - Age 14')).toBeInTheDocument();
  });

  it('calls onLevelSelect callback when a level is clicked', () => {
    render(<LevelSelector onLevelSelect={mockOnLevelSelect} />);

    const level3Card = screen.getByTestId('level-card-3');
    fireEvent.click(level3Card);

    expect(mockOnLevelSelect).toHaveBeenCalledWith(3);
    expect(mockOnLevelSelect).toHaveBeenCalledTimes(1);
  });

  it('plays school bell sound on level selection', () => {
    render(<LevelSelector onLevelSelect={mockOnLevelSelect} />);

    const level2Card = screen.getByTestId('level-card-2');
    fireEvent.click(level2Card);

    expect(soundManager.play).toHaveBeenCalledWith('bell-soft');
  });

  it('passes selected state to the correct LevelCard', () => {
    render(<LevelSelector onLevelSelect={mockOnLevelSelect} selectedLevel={4} />);

    const level4Card = screen.getByTestId('level-card-4');
    expect(level4Card).toHaveAttribute('aria-pressed', 'true');

    // Other cards should not be selected
    const level1Card = screen.getByTestId('level-card-1');
    expect(level1Card).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders in responsive grid layout', () => {
    const { container } = render(<LevelSelector onLevelSelect={mockOnLevelSelect} />);

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-2'); // Mobile: 2 columns
    expect(gridContainer).toHaveClass('md:grid-cols-3'); // Desktop: 3 columns
  });

  it('handles multiple level selections', () => {
    render(<LevelSelector onLevelSelect={mockOnLevelSelect} />);

    fireEvent.click(screen.getByTestId('level-card-1'));
    fireEvent.click(screen.getByTestId('level-card-5'));
    fireEvent.click(screen.getByTestId('level-card-3'));

    expect(mockOnLevelSelect).toHaveBeenCalledTimes(3);
    expect(mockOnLevelSelect).toHaveBeenNthCalledWith(1, 1);
    expect(mockOnLevelSelect).toHaveBeenNthCalledWith(2, 5);
    expect(mockOnLevelSelect).toHaveBeenNthCalledWith(3, 3);
  });

  it('renders with no selected level initially', () => {
    render(<LevelSelector onLevelSelect={mockOnLevelSelect} />);

    // All cards should be unselected
    for (let level = 1; level <= 6; level++) {
      const card = screen.getByTestId(`level-card-${level}`);
      expect(card).toHaveAttribute('aria-pressed', 'false');
    }
  });
});
