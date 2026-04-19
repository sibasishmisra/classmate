/**
 * React hook for canvas-based chalk dust particle animations
 * Validates: Requirements 6.3, 10.7
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import {
  createChalkDustParticles,
  updateParticles,
  renderParticles,
  prefersReducedMotion,
  getParticleCount,
  type Particle,
  type ChalkDustOptions,
} from '../chalk-dust-particles';

export interface UseChalkDustReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  triggerChalkDust: (x: number, y: number, options?: ChalkDustOptions) => void;
}

/**
 * Hook to manage canvas-based chalk dust particle system
 */
export function useChalkDust(): UseChalkDustReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and render particles
    particlesRef.current = updateParticles(particlesRef.current, deltaTime);
    renderParticles(ctx, particlesRef.current);

    // Continue animation if particles exist
    if (particlesRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
    }
  }, []);

  // Start animation loop
  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isAnimating, animate]);

  // Trigger chalk dust effect
  const triggerChalkDust = useCallback(
    (x: number, y: number, options: ChalkDustOptions = {}) => {
      // Respect reduced motion preference
      if (prefersReducedMotion()) return;

      const particleCount = options.particleCount ?? getParticleCount();
      const newParticles = createChalkDustParticles(x, y, {
        ...options,
        particleCount,
      });

      particlesRef.current = [...particlesRef.current, ...newParticles];
      startAnimation();
    },
    [startAnimation]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return {
    canvasRef,
    triggerChalkDust,
  };
}
