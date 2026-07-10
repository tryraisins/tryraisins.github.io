'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

// Density chosen so the constellation reads as an actual sky, not confetti or
// a wireframe. Tuned for ~1440px viewport; auto-scales down on mobile.
const BASE_DENSITY = 0.00009; // particles per pixel²
const LINK_DIST = 130;         // px within which two particles get a line
const REPEL_DIST = 140;        // px within which the cursor repels particles
const REPEL_STRENGTH = 0.9;

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let particles: Particle[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let visible = true;

    const seed = () => {
      const count = Math.floor(width * height * BASE_DENSITY);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      // Cursor influence: soft radial ring around the pointer
      if (mouse.active) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, REPEL_DIST);
        grad.addColorStop(0, 'rgba(255, 107, 74, 0.12)');
        grad.addColorStop(1, 'rgba(255, 107, 74, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - REPEL_DIST, mouse.y - REPEL_DIST, REPEL_DIST * 2, REPEL_DIST * 2);
      }

      // Particle movement
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap softly instead of bouncing — feels more open
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_DIST && dist > 0) {
            const force = (1 - dist / REPEL_DIST) * REPEL_STRENGTH;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }
      }

      // Links between nearby particles — quadratic scan, kept cheap by small N
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.18;
            ctx.strokeStyle = `rgba(232, 230, 223, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Particles themselves — bone-colored, cursor-adjacent ones pick up coral
      for (const p of particles) {
        let color = 'rgba(232, 230, 223, 0.55)';
        if (mouse.active) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < REPEL_DIST) {
            const t = 1 - d / REPEL_DIST;
            color = `rgba(255, 107, 74, ${0.4 + t * 0.5})`;
          }
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (visible) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) raf = requestAnimationFrame(step);
      else cancelAnimationFrame(raf);
    };

    resize();

    if (prefersReducedMotion) {
      // Draw a single static frame — still adds atmosphere without any motion
      step();
    } else {
      raf = requestAnimationFrame(step);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
