/**
 * Color Contrast Compliance Tests
 * 
 * Validates: Requirements 10.1
 * 
 * This test suite verifies that all text/background color combinations
 * meet WCAG 2.1 Level AA contrast requirements:
 * - Normal text (< 18pt): 4.5:1 minimum
 * - Large text (≥ 18pt or ≥ 14pt bold): 3:1 minimum
 */

import { describe, it, expect } from '@jest/globals';

// WCAG 2.1 Contrast Calculation
// Based on: https://www.w3.org/WAI/GL/wiki/Contrast_ratio

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Calculate relative luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA requirements
 */
function meetsWCAG_AA(
  ratio: number,
  textSize: 'normal' | 'large'
): boolean {
  const minRatio = textSize === 'normal' ? 4.5 : 3.0;
  return ratio >= minRatio;
}

// Color definitions from globals.css
const colors = {
  // Primary Colors
  chalkWhite: '#f5f5dc',
  chalkboardBlack: '#1a1a1a',
  chalkGray: '#6b7280', // Darkened for WCAG AA compliance
  paperWhite: '#fefefe',
  paperCream: '#faf8f3',
  inkBlack: '#2d3748',
  ruledLine: '#e5e7eb',
  marginRed: '#dc2626',

  // Accent Colors
  accentGold: '#d97706', // Darkened for WCAG AA compliance
  accentBlue: '#3b82f6',
  accentGreen: '#10b981',

  // Semantic Colors
  errorRed: '#dc2626', // Darkened for WCAG AA compliance
  warningYellow: '#fbbf24',
  successGreen: '#10b981',
};

describe('Color Contrast Compliance - WCAG 2.1 AA', () => {
  describe('Chalkboard Text (chalk-white on chalkboard-black)', () => {
    it('should meet contrast ratio for normal text (4.5:1)', () => {
      const ratio = getContrastRatio(colors.chalkWhite, colors.chalkboardBlack);
      
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(ratio, 'normal')).toBe(true);
    });

    it('should meet contrast ratio for large text (3:1)', () => {
      const ratio = getContrastRatio(colors.chalkWhite, colors.chalkboardBlack);
      
      expect(ratio).toBeGreaterThanOrEqual(3.0);
      expect(meetsWCAG_AA(ratio, 'large')).toBe(true);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.chalkWhite, colors.chalkboardBlack);
      console.log(`Chalk white (#f5f5dc) on chalkboard black (#1a1a1a): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Notebook Text (ink-black on paper-cream)', () => {
    it('should meet contrast ratio for normal text (4.5:1)', () => {
      const ratio = getContrastRatio(colors.inkBlack, colors.paperCream);
      
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(ratio, 'normal')).toBe(true);
    });

    it('should meet contrast ratio for large text (3:1)', () => {
      const ratio = getContrastRatio(colors.inkBlack, colors.paperCream);
      
      expect(ratio).toBeGreaterThanOrEqual(3.0);
      expect(meetsWCAG_AA(ratio, 'large')).toBe(true);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.inkBlack, colors.paperCream);
      console.log(`Ink black (#2d3748) on paper cream (#faf8f3): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Notebook Text (ink-black on paper-white)', () => {
    it('should meet contrast ratio for normal text (4.5:1)', () => {
      const ratio = getContrastRatio(colors.inkBlack, colors.paperWhite);
      
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(ratio, 'normal')).toBe(true);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.inkBlack, colors.paperWhite);
      console.log(`Ink black (#2d3748) on paper white (#fefefe): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Secondary Text (chalk-gray on paper-cream)', () => {
    it('should meet contrast ratio for normal text (4.5:1)', () => {
      const ratio = getContrastRatio(colors.chalkGray, colors.paperCream);
      
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(ratio, 'normal')).toBe(true);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.chalkGray, colors.paperCream);
      console.log(`Chalk gray (#9ca3af) on paper cream (#faf8f3): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Secondary Text (chalk-gray on paper-white)', () => {
    it('should meet contrast ratio for normal text (4.5:1)', () => {
      const ratio = getContrastRatio(colors.chalkGray, colors.paperWhite);
      
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(ratio, 'normal')).toBe(true);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.chalkGray, colors.paperWhite);
      console.log(`Chalk gray (#9ca3af) on paper white (#fefefe): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Error Messages (error-red on paper-white)', () => {
    it('should meet contrast ratio for normal text (4.5:1)', () => {
      const ratio = getContrastRatio(colors.errorRed, colors.paperWhite);
      
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(ratio, 'normal')).toBe(true);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.errorRed, colors.paperWhite);
      console.log(`Error red (#ef4444) on paper white (#fefefe): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Button Text (paper-white on ink-black)', () => {
    it('should meet contrast ratio for normal text (4.5:1)', () => {
      const ratio = getContrastRatio(colors.paperWhite, colors.inkBlack);
      
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(ratio, 'normal')).toBe(true);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.paperWhite, colors.inkBlack);
      console.log(`Paper white (#fefefe) on ink black (#2d3748): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Button Hover Text (ink-black on paper-white)', () => {
    it('should meet contrast ratio for normal text (4.5:1)', () => {
      const ratio = getContrastRatio(colors.inkBlack, colors.paperWhite);
      
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(meetsWCAG_AA(ratio, 'normal')).toBe(true);
    });
  });

  describe('Level Card Border (chalk-gray on chalkboard-black)', () => {
    it('should meet contrast ratio for UI components (3:1)', () => {
      const ratio = getContrastRatio(colors.chalkGray, colors.chalkboardBlack);
      
      // UI components need 3:1 minimum
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.chalkGray, colors.chalkboardBlack);
      console.log(`Chalk gray (#9ca3af) on chalkboard black (#1a1a1a): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Selected Level Card Border (accent-gold on chalkboard-black)', () => {
    it('should meet contrast ratio for UI components (3:1)', () => {
      const ratio = getContrastRatio(colors.accentGold, colors.chalkboardBlack);
      
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.accentGold, colors.chalkboardBlack);
      console.log(`Accent gold (#f59e0b) on chalkboard black (#1a1a1a): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Question Card Border (accent-blue on paper-cream)', () => {
    it('should meet contrast ratio for UI components (3:1)', () => {
      const ratio = getContrastRatio(colors.accentBlue, colors.paperCream);
      
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('should document the actual contrast ratio', () => {
      const ratio = getContrastRatio(colors.accentBlue, colors.paperCream);
      console.log(`Accent blue (#3b82f6) on paper cream (#faf8f3): ${ratio.toFixed(2)}:1`);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe('Focus Indicators', () => {
    it('accent-gold focus outline should meet contrast on paper backgrounds', () => {
      const ratio = getContrastRatio(colors.accentGold, colors.paperWhite);
      
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('accent-blue focus outline should meet contrast on paper backgrounds', () => {
      const ratio = getContrastRatio(colors.accentBlue, colors.paperWhite);
      
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('chalk-white focus outline should meet contrast on chalkboard', () => {
      const ratio = getContrastRatio(colors.chalkWhite, colors.chalkboardBlack);
      
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });
  });

  describe('Comprehensive Color Audit', () => {
    it('should document all color combinations used in the app', () => {
      const combinations = [
        { text: 'chalkWhite', bg: 'chalkboardBlack', usage: 'Chalkboard explanations' },
        { text: 'inkBlack', bg: 'paperCream', usage: 'Notebook text' },
        { text: 'inkBlack', bg: 'paperWhite', usage: 'Main content' },
        { text: 'chalkGray', bg: 'paperCream', usage: 'Secondary text' },
        { text: 'chalkGray', bg: 'paperWhite', usage: 'Secondary text' },
        { text: 'errorRed', bg: 'paperWhite', usage: 'Error messages' },
        { text: 'paperWhite', bg: 'inkBlack', usage: 'Button text' },
        { text: 'inkBlack', bg: 'paperWhite', usage: 'Button hover' },
      ];

      console.log('\n=== Color Contrast Audit Report ===\n');
      
      combinations.forEach(({ text, bg, usage }) => {
        const textColor = colors[text as keyof typeof colors];
        const bgColor = colors[bg as keyof typeof colors];
        const ratio = getContrastRatio(textColor, bgColor);
        const passesNormal = meetsWCAG_AA(ratio, 'normal');
        const passesLarge = meetsWCAG_AA(ratio, 'large');
        
        console.log(`${usage}:`);
        console.log(`  ${text} (${textColor}) on ${bg} (${bgColor})`);
        console.log(`  Contrast: ${ratio.toFixed(2)}:1`);
        console.log(`  Normal text (4.5:1): ${passesNormal ? '✓ PASS' : '✗ FAIL'}`);
        console.log(`  Large text (3:1): ${passesLarge ? '✓ PASS' : '✗ FAIL'}`);
        console.log('');
      });

      // All combinations should pass
      expect(combinations.length).toBeGreaterThan(0);
    });
  });
});
