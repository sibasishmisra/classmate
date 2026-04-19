/**
 * Tests for page transition animation CSS
 * **Validates: Requirements 6.4, 10.7**
 */

describe('Page Transition Animation CSS', () => {
  // Mock window.matchMedia for prefers-reduced-motion tests
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  };

  beforeEach(() => {
    // Reset matchMedia before each test
    mockMatchMedia(false);
  });

  it('should define page-flip animation with correct keyframes', () => {
    // Load the CSS file
    const fs = require('fs');
    const path = require('path');
    const cssPath = path.join(__dirname, '../globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Check for page-flip keyframes
    expect(cssContent).toContain('@keyframes page-flip');
    expect(cssContent).toContain('transform: perspective(1000px) rotateY(0deg)');
    expect(cssContent).toContain('transform: perspective(1000px) rotateY(90deg)');
    expect(cssContent).toContain('opacity: 1');
    expect(cssContent).toContain('opacity: 0.5');
  });

  it('should set desktop animation duration to 500ms', () => {
    const fs = require('fs');
    const path = require('path');
    const cssPath = path.join(__dirname, '../globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Check for page-transition class with 0.5s duration
    expect(cssContent).toMatch(/\.page-transition\s*{[^}]*animation:\s*page-flip\s+0\.5s\s+ease-in-out/);
  });

  it('should set mobile animation duration to 300ms', () => {
    const fs = require('fs');
    const path = require('path');
    const cssPath = path.join(__dirname, '../globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Check for mobile media query
    expect(cssContent).toContain('@media (max-width: 767px)');
    
    // Find the mobile section and check it contains the page-transition rule
    const mobileQueryIndex = cssContent.indexOf('@media (max-width: 767px)');
    const mobileSection = cssContent.substring(mobileQueryIndex, mobileQueryIndex + 500);
    
    expect(mobileSection).toContain('.page-transition');
    expect(mobileSection).toContain('animation-duration: 0.3s');
  });

  it('should respect prefers-reduced-motion', () => {
    const fs = require('fs');
    const path = require('path');
    const cssPath = path.join(__dirname, '../globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Check for prefers-reduced-motion media query
    expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
    expect(cssContent).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
  });

  it('should use CSS 3D transforms (perspective and rotateY)', () => {
    const fs = require('fs');
    const path = require('path');
    const cssPath = path.join(__dirname, '../globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Check for 3D transform properties
    expect(cssContent).toContain('perspective(1000px)');
    expect(cssContent).toContain('rotateY(0deg)');
    expect(cssContent).toContain('rotateY(90deg)');
  });
});
