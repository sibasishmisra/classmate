/**
 * Tests for chalk dust particle system
 * Validates: Requirements 6.3, 10.7
 */

import {
  createChalkDustParticles,
  updateParticles,
  getParticleCount,
  prefersReducedMotion,
  type Particle,
} from '../chalk-dust-particles';

describe('Chalk Dust Particle System', () => {
  describe('createChalkDustParticles', () => {
    it('should create the specified number of particles', () => {
      const particles = createChalkDustParticles(100, 100, { particleCount: 8 });
      expect(particles).toHaveLength(8);
    });

    it('should create particles at the specified position', () => {
      const x = 150;
      const y = 200;
      const particles = createChalkDustParticles(x, y, { particleCount: 4 });
      
      particles.forEach(particle => {
        expect(particle.x).toBe(x);
        expect(particle.y).toBe(y);
      });
    });

    it('should create particles with random velocities', () => {
      const particles = createChalkDustParticles(100, 100, { particleCount: 10 });
      
      // Check that not all particles have the same velocity
      const velocities = particles.map(p => ({ vx: p.vx, vy: p.vy }));
      const uniqueVelocities = new Set(velocities.map(v => `${v.vx},${v.vy}`));
      
      expect(uniqueVelocities.size).toBeGreaterThan(1);
    });

    it('should create particles with sizes within the specified range', () => {
      const minSize = 1;
      const maxSize = 3;
      const particles = createChalkDustParticles(100, 100, {
        particleCount: 20,
        minSize,
        maxSize,
      });
      
      particles.forEach(particle => {
        expect(particle.size).toBeGreaterThanOrEqual(minSize);
        expect(particle.size).toBeLessThanOrEqual(maxSize);
      });
    });

    it('should initialize particles with full life', () => {
      const particles = createChalkDustParticles(100, 100, { particleCount: 5 });
      
      particles.forEach(particle => {
        expect(particle.life).toBe(1);
        expect(particle.maxLife).toBe(1);
      });
    });
  });

  describe('updateParticles', () => {
    it('should update particle positions based on velocity', () => {
      const particles: Particle[] = [
        { x: 100, y: 100, vx: 2, vy: -1, life: 1, maxLife: 1, size: 2 },
      ];
      
      const updated = updateParticles(particles, 16);
      
      expect(updated[0].x).toBe(102); // 100 + 2
      expect(updated[0].y).toBe(99);  // 100 + (-1)
    });

    it('should apply gravity to particles', () => {
      const particles: Particle[] = [
        { x: 100, y: 100, vx: 0, vy: 0, life: 1, maxLife: 1, size: 2 },
      ];
      
      const updated = updateParticles(particles, 16);
      
      expect(updated[0].vy).toBe(0.1); // Gravity applied
    });

    it('should decrease particle life over time', () => {
      const particles: Particle[] = [
        { x: 100, y: 100, vx: 0, vy: 0, life: 1, maxLife: 1, size: 2 },
      ];
      
      const updated = updateParticles(particles, 16);
      
      expect(updated[0].life).toBeLessThan(1);
    });

    it('should remove particles with life <= 0', () => {
      const particles: Particle[] = [
        { x: 100, y: 100, vx: 0, vy: 0, life: 0.01, maxLife: 1, size: 2 },
        { x: 200, y: 200, vx: 0, vy: 0, life: 0.5, maxLife: 1, size: 2 },
      ];
      
      const updated = updateParticles(particles, 16);
      
      expect(updated).toHaveLength(1);
      expect(updated[0].x).toBe(200);
    });

    it('should handle empty particle array', () => {
      const particles: Particle[] = [];
      const updated = updateParticles(particles, 16);
      
      expect(updated).toHaveLength(0);
    });
  });

  describe('getParticleCount', () => {
    it('should return 8 particles for desktop', () => {
      // Mock window.innerWidth for desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      expect(getParticleCount()).toBe(8);
    });

    it('should return 4 particles for mobile', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      expect(getParticleCount()).toBe(4);
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return false when reduced motion is not preferred', () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      expect(prefersReducedMotion()).toBe(false);
    });

    it('should return true when reduced motion is preferred', () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      expect(prefersReducedMotion()).toBe(true);
    });
  });
});
