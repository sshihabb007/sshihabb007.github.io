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

function SketchBackdrop() {
  return (
    <div className="sketch-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g className="sketch-doodle sketch-doodle--blue" transform="translate(88 160) rotate(-7)">
          <path d="M4 22 49 4l43 18v54L49 94 4 76z" />
          <path d="m4 22 45 19 43-19M49 41v53" />
          <path d="m22 35 8 4-8 4m15 4h14" />
        </g>
        <g className="sketch-doodle sketch-doodle--pink" transform="translate(1210 195) rotate(5)">
          <rect x="4" y="8" width="126" height="82" rx="7" />
          <path d="M4 28h126M18 18h2m11 0h2" />
          <path d="m53 47-12 9 12 9m25-18 12 9-12 9m-9-14-8 20" />
        </g>
        <g className="sketch-doodle sketch-doodle--green" transform="translate(135 610) rotate(4)">
          <ellipse cx="58" cy="20" rx="48" ry="15" />
          <path d="M10 20v52c0 9 22 16 48 16s48-7 48-16V20M10 46c0 9 22 16 48 16s48-7 48-16" />
          <path d="m43 37 12 11-12 11m28-22L59 59" />
        </g>
        <g className="sketch-doodle sketch-doodle--orange" transform="translate(1190 620) rotate(-6)">
          <path d="M8 82V34L66 5l58 29v48H8zM0 35 66 0l66 35M51 82V53h30v29M24 49h13m60 0h13" />
          <path d="M100 15h17v18" />
        </g>
        <g className="sketch-doodle sketch-doodle--purple" transform="translate(670 110) rotate(3)">
          <path d="M9 9h52v52H9zM22 23h25M22 34h25M22 45h16" />
          <path d="m80 42 28-28 15 15-28 28-19 5zM108 14l15 15" />
        </g>
        <g className="sketch-doodle sketch-doodle--pink" transform="translate(605 730) rotate(-3)">
          <path d="M10 28c0-12 10-20 22-20 9 0 16 5 20 13 5-8 12-13 21-13 12 0 22 8 22 20 0 19-43 49-43 49S10 47 10 28z" />
        </g>
        <g className="sketch-doodle sketch-doodle--purple" transform="translate(360 75) rotate(-8)">
          <path d="M10 10h24v24H10zM16 17h12M16 23h10M16 29h8" />
        </g>
        <g className="sketch-doodle sketch-doodle--orange" transform="translate(985 85) rotate(9)">
          <path d="m8 28 24-24 12 12-24 24-16 4zM27 9l12 12M4 44l8-2" />
        </g>
        <g className="sketch-doodle sketch-doodle--blue" transform="translate(520 425) rotate(5)">
          <path d="m8 18 14-14 14 14-14 14zM22 4v28M8 18h28" />
        </g>
        <g className="sketch-doodle sketch-doodle--pink" transform="translate(1040 470) rotate(-6)">
          <path d="M7 5h28v28H7zM13 12h16M13 19h12M13 26h9" />
        </g>
        <g className="sketch-doodle sketch-doodle--green" transform="translate(300 805) rotate(-5)">
          <path d="M8 20h34M25 4v32M12 8l26 25M38 8 12 33" />
        </g>
        <g className="sketch-doodle sketch-doodle--blue" transform="translate(890 790) rotate(8)">
          <path d="M8 28 27 5l19 23zM27 5v23M8 28h38" />
        </g>
        <g className="sketch-doodle sketch-doodle--orange" transform="translate(65 405) rotate(8)">
          <path d="M7 6h36v28H7zM14 14l7 6-7 6m14-2h8" />
        </g>
        <g className="sketch-doodle sketch-doodle--purple" transform="translate(1330 405) rotate(-8)">
          <circle cx="22" cy="22" r="18" />
          <path d="m15 21 5 5 10-11" />
        </g>
        <g className="sketch-doodle sketch-doodle--blue" transform="translate(280 280) rotate(-6)">
          <path d="m8 20 14-14 14 14-14 14zM8 20h28M22 6v28" />
          <circle cx="22" cy="20" r="5" />
        </g>
        <g className="sketch-doodle sketch-doodle--green" transform="translate(1120 300) rotate(7)">
          <rect x="6" y="7" width="72" height="54" rx="4" />
          <path d="M6 22h72M17 15h2m9 0h2m9 0h2M18 34h48M18 44h36M18 54h42" />
        </g>
        <g className="sketch-doodle sketch-doodle--pink" transform="translate(760 285) rotate(-5)">
          <path d="M10 14c0-6 7-10 15-7 7-6 18-2 17 6 8 0 12 8 7 14-3 4-10 6-18 5-10 5-22 0-22-8-7-2-7-8 1-10z" />
          <path d="M22 23c8-9 15 8 24-3" />
        </g>
        <g className="sketch-doodle sketch-doodle--orange" transform="translate(470 185) rotate(8)">
          <path d="M26 3 32 18 48 11 41 27 56 33 40 38 46 54 31 46 23 61 20 44 3 47 14 34 3 22 20 23z" />
        </g>
        <g className="sketch-doodle sketch-doodle--purple" transform="translate(1010 520) rotate(5)">
          <path d="M6 12h62v42H6zM18 12V5h38v7M18 26h38M18 36h38M18 46h25" />
        </g>
        <g className="sketch-doodle sketch-doodle--blue" transform="translate(185 455) rotate(8)">
          <path d="M8 10h46v34H8zM19 51h24M31 44v7M18 20h8m5 0h15M18 29h25" />
        </g>
        <g className="sketch-doodle sketch-doodle--green" transform="translate(725 585) rotate(-7)">
          <circle cx="13" cy="28" r="7" />
          <circle cx="54" cy="10" r="7" />
          <circle cx="61" cy="51" r="7" />
          <circle cx="100" cy="28" r="7" />
          <path d="m20 25 27-12m9 4 3 27m7 7 27-20m-66 0 27 0" />
        </g>
        <g className="sketch-doodle sketch-doodle--orange" transform="translate(1280 510) rotate(-8)">
          <path d="M7 12h48v36H7zM19 12V5h24v7M18 22h26M18 31h26M18 40h17" />
          <path d="m62 24 7 7 13-15" />
        </g>
        <g className="sketch-doodle sketch-doodle--pink" transform="translate(460 690) rotate(6)">
          <path d="m24 3 6 17 18-7-8 17 18 7-18 5 7 18-17-9-9 17-4-19-19 4 13-14L0 25l19 1z" />
        </g>
        <g className="sketch-doodle sketch-doodle--purple" transform="translate(850 180) rotate(-5)">
          <path d="M9 7h44v38H9zM20 19l-8 7 8 7m19-14 8 7-8 7m-5-17-7 20" />
        </g>
        <g className="sketch-doodle sketch-doodle--blue" transform="translate(75 745) rotate(5)">
          <path d="M10 22c0-8 8-13 17-9 5-8 18-7 21 2 9-2 15 5 12 12-2 7-11 9-18 6-7 7-21 5-24-2-6 0-8-4-8-9z" />
        </g>
      </svg>
    </div>
  );
}

export function NetworkBackground() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(() => !hasWebGL());
  const mode = useSyncExternalStore(
    subscribeAnimationMode,
    getAnimationMode,
    () => DEFAULT_ANIMATION_MODE
  );

  const isSketch = mode === 'sketch';

  useEffect(() => {
    const el = hostRef.current;
    if (fallback || isSketch || !el) return;

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
    }, 1000);

    return () => {
      cancelled = true;
      cancelIdle();
      disposeScene?.();
    };
  }, [fallback, isSketch]);

  if (isSketch) return <SketchBackdrop />;
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
