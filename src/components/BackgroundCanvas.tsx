import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  DEFAULT_ANIMATION_MODE,
  getAnimationMode,
  subscribeAnimationMode,
} from '../three/animationStore';
import { createNetworkScene } from '../three/createNetworkScene';
import { hasWebGL, onIdle } from '../utils/scroll';

class FallbackNode {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  canvasWidth: number;
  canvasHeight: number;

  constructor(w: number, h: number) {
    this.canvasWidth = w;
    this.canvasHeight = h;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.35 + Math.random() * 0.4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update(dtMs: number) {
    let f = dtMs / 16.66;
    if (f > 3) f = 1;
    this.x += this.vx * f;
    this.y += this.vy * f;
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.x > this.canvasWidth) {
      this.x = this.canvasWidth;
      this.vx *= -1;
    }
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -1;
    }
    if (this.y > this.canvasHeight) {
      this.y = this.canvasHeight;
      this.vy *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string, alpha: number) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
  }
}

function CanvasConstellationFallback() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let nodes: FallbackNode[] = [];
    let isDark = document.documentElement.classList.contains('dark');
    const mo = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const rebuild = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodes = [];
      const count = Math.max(Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 80), 40);
      for (let i = 0; i < count; i++) {
        nodes.push(new FallbackNode(canvas.width, canvas.height));
      }
    };

    let raf = 0;
    let prev = performance.now();
    let hidden = false;

    const tick = (now: number) => {
      if (hidden) return;
      const dt = now - prev;
      prev = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fill = isDark ? '#94a3b8' : '#2563eb';
      const rgb = isDark ? '148, 163, 184' : '37, 99, 235';
      const baseAlpha = isDark ? 0.3 : 0.45;

      nodes.forEach((n) => n.update(dt));
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 19600) {
            const dist = Math.sqrt(d2);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const strength = 1 - dist / 140;
            ctx.strokeStyle = `rgba(${rgb}, ${strength * baseAlpha})`;
            ctx.lineWidth = isDark ? 0.8 : 1.2;
            ctx.stroke();
          }
        }
        nodes[i].draw(ctx, fill, baseAlpha);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        hidden = true;
        cancelAnimationFrame(raf);
      } else {
        hidden = false;
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', onVis);
    rebuild();
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', rebuild);

    return () => {
      window.removeEventListener('resize', rebuild);
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}

export function NetworkBackground() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(() => !hasWebGL());

  useEffect(() => {
    const el = hostRef.current;
    if (fallback || !el) return;

    let cancelled = false;
    let disposeScene: (() => void) | undefined;

    const cancelIdle = onIdle(() => {
      try {
        if (!cancelled) {
          disposeScene = createNetworkScene(el);
        }
      } catch (err) {
        console.warn('[NetworkBackground] falling back to 2D canvas:', err);
        if (!cancelled) setFallback(true);
      }
    }, 600);

    return () => {
      cancelled = true;
      cancelIdle();
      disposeScene?.();
    };
  }, [fallback]);

  if (fallback) return <CanvasConstellationFallback />;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}

export function CyberCursor() {
  const mode = useSyncExternalStore(
    subscribeAnimationMode,
    getAnimationMode,
    () => DEFAULT_ANIMATION_MODE
  );
  const [finePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const active = mode === 'code' && finePointer;

  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    const html = document.documentElement;
    html.classList.add('cyber-cursor');

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        el.style.opacity = '1';
      }
    };
    const onDown = () => el.classList.add('is-down');
    const onUp = () => el.classList.remove('is-down');
    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      html.classList.remove('cyber-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div ref={ref} className="cyber-xhair" aria-hidden="true">
      <svg viewBox="0 0 88 88" width="88" height="88">
        <circle cx="44" cy="44" r="17" />
        <g className="cyber-xhair__dash">
          <path d="M44 15.5a28.5 28.5 0 0 1 24.7 14.2" />
          <path d="M72.5 44a28.5 28.5 0 0 1-14.2 24.7" />
          <path d="M44 72.5a28.5 28.5 0 0 1-24.7-14.2" />
          <path d="M15.5 44a28.5 28.5 0 0 1 14.2-24.7" />
        </g>
        <path d="M44 2v18M44 68v18M2 44h18M68 44h18" />
        <circle cx="44" cy="44" r="1.8" className="cyber-xhair__dot" />
      </svg>
      <style>{`
        html.cyber-cursor, html.cyber-cursor * { cursor: none !important; }
        .cyber-xhair {
          --xh: #19f58b;
          position: fixed; left: 0; top: 0; width: 0; height: 0;
          z-index: 2147483000; pointer-events: none; opacity: 0;
          transition: opacity .2s ease; will-change: transform;
        }
        html:not(.dark) .cyber-xhair { --xh: #047857; }
        .cyber-xhair svg {
          position: absolute; left: -44px; top: -44px; overflow: visible;
          transition: transform .12s cubic-bezier(.2,.8,.2,1);
          filter: drop-shadow(0 0 1.5px rgba(0,0,0,.9)) drop-shadow(0 0 5px color-mix(in srgb, var(--xh) 55%, transparent));
        }
        .cyber-xhair.is-down svg { transform: scale(.8); }
        .cyber-xhair circle, .cyber-xhair path { fill: none; stroke: var(--xh); stroke-width: 2.2; stroke-linecap: round; }
        .cyber-xhair .cyber-xhair__dot { fill: var(--xh); stroke: none; }
        .cyber-xhair__dash { transform-origin: 44px 44px; animation: cyberXhairSpin 10s linear infinite; }
        @keyframes cyberXhairSpin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .cyber-xhair__dash { animation: none; } }
      `}</style>
    </div>
  );
}
