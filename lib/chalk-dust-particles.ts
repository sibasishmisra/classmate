/**
 * Canvas-based chalk dust particle system for ClassMate.info
 * Provides whimsical feedback on interactions with nostalgic chalk dust effect
 * Validates: Requirements 6.3, 10.7
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export interface ChalkDustOptions {
  particleCount?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  velocityRange?: number;
}

/**
 * Create chalk dust particles at a specific position
 */
export function createChalkDustParticles(
  x: number,
  y: number,
  options: ChalkDustOptions = {}
): Particle[] {
  const {
    particleCount = 8,
    minSize = 1,
    maxSize = 3,
    velocityRange = 2,
  } = options;

  return Array.from({ length: particleCount }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * velocityRange,
    vy: (Math.random() - 0.5) * velocityRange - 1, // Slight upward bias
    life: 1,
    maxLife: 1,
    size: Math.random() * (maxSize - minSize) + minSize,
  }));
}

/**
 * Update particle positions and life
 */
export function updateParticles(particles: Particle[], deltaTime: number = 16): Particle[] {
  return particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vy: particle.vy + 0.1, // Gravity
      life: particle.life - deltaTime / 1000,
    }))
    .filter((particle) => particle.life > 0);
}

/**
 * Render particles to canvas
 */
export function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  color: string = '#f5f5dc'
): void {
  particles.forEach((particle) => {
    const opacity = particle.life / particle.maxLife;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity * 0.6;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get particle count based on device type
 */
export function getParticleCount(): number {
  if (typeof window === 'undefined') return 8;
  const isMobile = window.innerWidth < 768;
  return isMobile ? 4 : 8;
}
