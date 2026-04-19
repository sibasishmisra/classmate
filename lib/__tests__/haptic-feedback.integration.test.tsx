/**
 * Integration tests for Haptic Feedback in components
 * Validates: Requirements 6.6
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { hapticFeedback } from '../haptic-feedback';
import LevelCard from '../../components/LevelCard';
import ChalkDustButton from '../../components/ChalkDustButton';

// Mock the haptic feedback module
jest.mock('../haptic-feedback', () => ({
  hapticFeedback: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    trigger: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    isEnabled: jest.fn(() => true),
    isSupported: jest.fn(() => true),
    cancel: jest.fn(),
    toggle: jest.fn()
  },
  triggerLightHaptic: jest.fn(),
  triggerMediumHaptic: jest.fn(),
  triggerHeavyHaptic: jest.fn(),
  triggerHaptic: jest.fn()
}));

// Mock the useChalkDust hook
jest.mock('../hooks/useChalkDust', () => ({
  useChalkDust: () => ({
    canvasRef: { current: null },
    triggerChalkDust: jest.fn()
  })
}));

describe('Haptic Feedback Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LevelCard Component', () => {
    it('should trigger light haptic on level card click', () => {
      const { triggerLightHaptic } = require('../haptic-feedback');
      const mockOnClick = jest.fn();

      render(
        <LevelCard
          level={3}
          ageRange="11"
          selected={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(triggerLightHaptic).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(3);
    });

    it('should trigger haptic even when card is already selected', () => {
      const { triggerLightHaptic } = require('../haptic-feedback');
      const mockOnClick = jest.fn();

      render(
        <LevelCard
          level={3}
          ageRange="11"
          selected={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(triggerLightHaptic).toHaveBeenCalledTimes(1);
    });
  });

  describe('ChalkDustButton Component', () => {
    it('should trigger light haptic on button click', () => {
      const { triggerLightHaptic } = require('../haptic-feedback');
      const mockOnClick = jest.fn();

      render(
        <ChalkDustButton onClick={mockOnClick}>
          Click Me
        </ChalkDustButton>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(triggerLightHaptic).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should trigger haptic before onClick handler', () => {
      const { triggerLightHaptic } = require('../haptic-feedback');
      const callOrder: string[] = [];

      const mockOnClick = jest.fn(() => {
        callOrder.push('onClick');
      });

      (triggerLightHaptic as jest.Mock).mockImplementation(() => {
        callOrder.push('haptic');
      });

      render(
        <ChalkDustButton onClick={mockOnClick}>
          Click Me
        </ChalkDustButton>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(callOrder).toEqual(['haptic', 'onClick']);
    });

    it('should work with disabled button', () => {
      const { triggerLightHaptic } = require('../haptic-feedback');

      render(
        <ChalkDustButton disabled>
          Disabled Button
        </ChalkDustButton>
      );

      const button = screen.getByRole('button');
      
      // Disabled buttons don't fire click events in the DOM
      // So haptic shouldn't be triggered
      fireEvent.click(button);
      
      // The button is disabled, so click event won't fire
      expect(triggerLightHaptic).not.toHaveBeenCalled();
    });
  });

  describe('Multiple Component Interactions', () => {
    it('should handle multiple haptic triggers in sequence', () => {
      const { triggerLightHaptic } = require('../haptic-feedback');
      const mockOnClick = jest.fn();

      render(
        <>
          <ChalkDustButton onClick={mockOnClick}>Button 1</ChalkDustButton>
          <ChalkDustButton onClick={mockOnClick}>Button 2</ChalkDustButton>
          <ChalkDustButton onClick={mockOnClick}>Button 3</ChalkDustButton>
        </>
      );

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        fireEvent.click(button);
      });

      expect(triggerLightHaptic).toHaveBeenCalledTimes(3);
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });
});
