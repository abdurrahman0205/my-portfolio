"use client";

import { Globe } from "lucide-react";
import { useEffect, useRef } from "react";
import { sphereSkills } from "@/data/skills";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

// ── Tuning knobs ──────────────────────────────────────────────────────
// ADJUST: each constant below controls one aspect of the sphere feel.
const WIRE_POINT_COUNT = 60; // dots on the wireframe globe
const NEIGHBORS_PER_POINT = 3; // lines drawn from each dot
const EQUATOR_STEPS = 72; // smoothness of the equator ring
const AUTO_SPEED = 0.0022; // idle rotation speed (rad/frame)
const DRAG_FACTOR = 0.0055; // how fast dragging rotates
const INERTIA_DECAY = 0.95; // velocity kept per frame after release
const MAX_TILT = 1.15; // how far you can tilt up/down (radians)

/** Evenly distribute `count` points on a unit sphere. */
function fibonacciSphere(count: number): Vec3[] {
  const points: Vec3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    });
  }
  return points;
}

/** Connect every point to its 3 nearest neighbors (deduplicated edges). */
function buildEdges(points: Vec3[]): Array<[number, number]> {
  const seen = new Set<string>();
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < points.length; i++) {
    const distances: Array<{ j: number; d: number }> = [];
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dz = points[i].z - points[j].z;
      distances.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    distances.sort((a, b) => a.d - b.d);
    for (let k = 0; k < Math.min(NEIGHBORS_PER_POINT, distances.length); k++) {
      const j = distances[k].j;
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }
  return edges;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const num = Number.parseInt(full.slice(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * SkillsSphere — a rotating wireframe globe drawn on <canvas>, with skill
 * logos positioned on the sphere using a Fibonacci distribution. Rotation
 * lives in refs (no re-renders per frame); drag with pointer events, release
 * for decaying inertia, then slow auto-rotation resumes.
 */
export default function SkillsSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const wirePoints = fibonacciSphere(WIRE_POINT_COUNT);
    const edges = buildEdges(wirePoints);
    const iconPoints = fibonacciSphere(sphereSkills.length);
    const equator: Vec3[] = Array.from({ length: EQUATOR_STEPS }, (_, i) => {
      const angle = (i / EQUATOR_STEPS) * Math.PI * 2;
      return { x: Math.cos(angle), y: 0, z: Math.sin(angle) };
    });

    let size = 0;
    let raf = 0;
    let running = false;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let rotX = -0.28;
    let rotY = 0;
    let velX = 0;
    let velY = 0;
    // Fallbacks if the CSS vars are missing — keep in sync with the values
    // in SkillsSection.tsx (ADJUST: only used if the vars fail to resolve).
    let accent = "#cff45c";
    let disc = "#1e1e1e";

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let autoRotate = !motionQuery.matches;
    const onMotionChange = () => {
      autoRotate = !motionQuery.matches;
    };
    motionQuery.addEventListener("change", onMotionChange);

    // Accent/disc colors come from the section's theme-scoped CSS variables,
    // so they flip automatically with the light/dark class on <html>.
    const readColors = () => {
      const styles = getComputedStyle(container);
      accent = styles.getPropertyValue("--skills-accent").trim() || "#cff45c";
      disc = styles.getPropertyValue("--skills-disc").trim() || "#1e1e1e";
    };
    readColors();

    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      size = Math.max(1, Math.min(rect.width, rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Logo size scales with the sphere.
      // ADJUST: the min/max clamp controls icon size (px) across viewports.
      const iconPx = Math.max(28, Math.min(52, size * 0.115));
      for (const node of iconRefs.current) {
        if (node) node.style.fontSize = `${iconPx}px`;
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const draw = () => {
      if (size <= 0) return;
      const [ar, ag, ab] = hexToRgb(accent);
      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.34;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const rotate = (p: Vec3): Vec3 => {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        return {
          x: x1,
          y: p.y * cosX - z1 * sinX,
          z: p.y * sinX + z1 * cosX,
        };
      };
      const project = (p: Vec3) => {
        const perspective = 1 / (1 - p.z * 0.28);
        return {
          x: cx + p.x * radius * perspective,
          y: cy + p.y * radius * perspective,
        };
      };

      ctx.clearRect(0, 0, size, size);

      // Soft accent glow hugging the disc edge
      // ADJUST: middle stop = glow brightness (0.28 = strong, 0.12 = subtle),
      // outer multiplier = how far the glow bleeds past the disc edge
      ctx.globalAlpha = 1;
      const glow = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.9,
        cx,
        cy,
        radius * 1.18,
      );
      glow.addColorStop(0, `rgba(${ar},${ag},${ab},0)`);
      glow.addColorStop(0.5, `rgba(${ar},${ag},${ab},0.16)`);
      glow.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      // Dark filled disc with slight radial shading
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      const shading = ctx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.3,
        radius * 0.1,
        cx,
        cy,
        radius,
      );
      shading.addColorStop(0, "rgba(255,255,255,0.05)");
      shading.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = shading;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Wireframe: lines fade with depth
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const ra = rotate(wirePoints[a]);
        const rb = rotate(wirePoints[b]);
        const depth = ((ra.z + rb.z) / 2 + 1) / 2;
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},${(0.06 + 0.34 * depth).toFixed(3)})`;
        const pa = project(ra);
        const pb = project(rb);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // Thin equator ring
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.35)`;
      ctx.beginPath();
      for (let i = 0; i <= EQUATOR_STEPS; i++) {
        const p = project(rotate(equator[i % EQUATOR_STEPS]));
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Icons share the exact same rotation as the wireframe.
      // NOTE: the DOM nodes are already anchored at the container center via
      // left-1/2 top-1/2, so we translate by the OFFSET from center — adding
      // cx/cy here would push every icon half the container down-right.
      for (let i = 0; i < iconPoints.length; i++) {
        const node = iconRefs.current[i];
        if (!node) continue;
        const rp = rotate(iconPoints[i]);
        const depth = (rp.z + 1) / 2;
        const p = project(rp);
        // Smoothstep fade: icons dissolve to invisible as they rotate past
        // the globe's back edge, then fade back in as they come around.
        // ADJUST: steeper curve = faster fade; scale/opacity floors below
        // control how small/dim the front-vs-back icons get.
        const fade = depth * depth * (3 - 2 * depth);
        const scale = 0.55 + 0.45 * fade;
        const dx = p.x - cx;
        const dy = p.y - cy;
        node.style.transform = `translate(-50%, -50%) translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        node.style.opacity = fade.toFixed(3);
        node.style.zIndex = String(Math.round(depth * 100));
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!dragging) {
        velX *= INERTIA_DECAY;
        velY *= INERTIA_DECAY;
        // Ease back toward the slow auto-rotation speed after inertia fades
        const target = autoRotate ? AUTO_SPEED : 0;
        velY += (target - velY) * 0.02;
        rotY += velY;
        rotX = Math.max(-MAX_TILT, Math.min(MAX_TILT, rotX + velX));
      }
      draw();
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    // Pause the loop while the section is off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      velX = 0;
      velY = 0;
      container.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      rotY += dx * DRAG_FACTOR;
      rotX = Math.max(-MAX_TILT, Math.min(MAX_TILT, rotX - dy * DRAG_FACTOR));
      velY = dx * DRAG_FACTOR * 0.65 + velY * 0.35;
      velX = -dy * DRAG_FACTOR * 0.65 + velX * 0.35;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (container.hasPointerCapture(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    return () => {
      stop();
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[300px] touch-pan-y select-none lg:max-w-[520px]"
    >
      <canvas
        ref={canvasRef}
        tabIndex={-1}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      {/* Skill logos — decorative, the same skills are real text in the terminal */}
      <div aria-hidden="true" className="absolute inset-0">
        {sphereSkills.map((skill, index) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.name}
              ref={(node) => {
                iconRefs.current[index] = node;
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 flex flex-col items-center gap-1 will-change-transform"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <Icon />
              {/* ADJUST: label font size lives here (text-[11px]) */}
              <span className="font-mono text-[11px] font-medium whitespace-nowrap text-muted-foreground">
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Drag hint pill */}
      <div className="skills-pill pointer-events-none absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[10px] whitespace-nowrap sm:text-[11px]">
        <span className="opacity-70">&gt;</span>
        <Globe className="h-3 w-3" aria-hidden="true" />
        <span>Drag to explore skills universe</span>
      </div>
    </div>
  );
}
