"use client";

import { useEffect, useRef } from "react";

// ── Perlin noise (2D, seeded) ──────────────────────────────────────────
const PERM = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function grad(hash: number, x: number, y: number) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}
function noise2(x: number, y: number) {
  const xf = Math.floor(x);
  const yf = Math.floor(y);
  const X = xf & 255;
  const Y = yf & 255;
  const dx = x - xf;
  const dy = y - yf;
  const u = fade(dx);
  const v = fade(dy);
  const aa = PERM[PERM[X] + Y];
  const ab = PERM[PERM[X] + Y + 1];
  const ba = PERM[PERM[X + 1] + Y];
  const bb = PERM[PERM[X + 1] + Y + 1];
  return lerp(
    lerp(grad(aa, dx, dy), grad(ba, dx - 1, dy), u),
    lerp(grad(ab, dx, dy - 1), grad(bb, dx - 1, dy - 1), u),
    v,
  );
}

// ── Tuning knobs ───────────────────────────────────────────────────────
// ADJUST: NOISE_SCALE = swirl size (bigger = broader currents),
// STEP = filament speed in px/frame, LINE_WIDTH = stroke thinness,
// FADE = how fast trails dissolve (higher = shorter filaments),
// COLOR = filament color (use "#cff45c" to match the site lime accent).
const NOISE_SCALE = 0.0022;
const TIME_SPEED = 0.0016;
const STEP = 1.4;
const LINE_WIDTH = 0.7;
const FADE = 0.045;
const COLOR: [number, number, number] = [52, 211, 153]; // emerald #34d399

/**
 * AboutCanvas — a Perlin noise particle flow field: hundreds of particles
 * drift through an invisible noise field, drawing thin, glowing emerald
 * filaments that stream organically and slowly dissolve. Pure canvas +
 * rAF; no animation libraries, no React state per frame.
 */
export default function AboutCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let time = 0;
    // ADJUST: particles per 900px² of canvas (clamped below)
    let particles: Array<{ x: number; y: number }> = [];

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const spawn = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(
        250,
        Math.min(700, Math.round((width * height) / 900)),
      );
      particles = Array.from({ length: count }, spawn);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    // Advance every particle one small step along the noise field
    const advance = () => {
      const [r, g, b] = COLOR;
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = "round";
      for (const particle of particles) {
        const angle =
          noise2(particle.x * NOISE_SCALE, particle.y * NOISE_SCALE + time) *
          Math.PI *
          3;
        const px = particle.x;
        const py = particle.y;
        particle.x += Math.cos(angle) * STEP;
        particle.y += Math.sin(angle) * STEP;
        // Wrap around the edges so filaments stream across the whole card
        if (
          particle.x < 0 ||
          particle.x > width ||
          particle.y < 0 ||
          particle.y > height
        ) {
          Object.assign(particle, spawn());
          continue;
        }
        const depth = 0.35 + 0.65 * Math.random(); // slight brightness variance
        ctx.strokeStyle = `rgba(${r},${g},${b},${(0.5 * depth).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(particle.x, particle.y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      // Trails dissolve slowly so the field keeps streaming, never clogging
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${FADE})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      time += TIME_SPEED;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      advance();
    };
    const start = () => {
      if (running || motionQuery.matches) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    // Reduced motion: draw a static field (many steps, no loop)
    if (motionQuery.matches) {
      for (let i = 0; i < 400; i++) advance();
    }

    // Pause the loop while the card is off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    // ADJUST: the dark backdrop is fixed in both themes so the glowing
    // filaments always read — swap the hex to retint the card.
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border"
      style={{ backgroundColor: "#0e1210" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
