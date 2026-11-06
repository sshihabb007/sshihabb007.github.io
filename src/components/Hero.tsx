import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import {
  ANIMATION_MODES,
  DEFAULT_ANIMATION_MODE,
  getAnimationMode,
  setAnimationMode,
  subscribeAnimationMode,
} from '../three/animationStore';
import { createHeroScene } from '../three/createHeroScene';
import { hasWebGL, onIdle, scrollToSection } from '../utils/scroll';
import { AnimationIcon, DownloadIcon, SocialIcon } from './Icons';

function HeroScene() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !hasWebGL()) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    const cancelIdle = onIdle(() => {
      try {
        if (!cancelled) {
          dispose = createHeroScene(el, '.hero-avatar-wrapper');
        }
      } catch (err) {
        console.warn('[HeroScene] disabled:', err);
      }
    });

    return () => {
      cancelled = true;
      cancelIdle();
      dispose?.();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}

function AnimPicker() {
  const mode = useSyncExternalStore(
    subscribeAnimationMode,
    getAnimationMode,
    () => DEFAULT_ANIMATION_MODE
  );
  const [supported] = useState(() => hasWebGL());
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const currentMeta = ANIMATION_MODES.find((m) => m.id === mode) ?? ANIMATION_MODES[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!supported) return null;

  return (
    <div ref={wrapRef} className="anim-picker" data-open={open}>
      <div className="anim-picker__panel">
        <button
          type="button"
          className="anim-picker__head"
          aria-expanded={open}
          aria-controls="anim-picker-list"
          aria-label={open ? 'Close animation themes' : `Animation theme: ${currentMeta.label}. Change`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="anim-picker__cur">
            <AnimationIcon mode={mode} size={19} />
          </span>
          <span className="anim-picker__caption">
            <span className="anim-picker__caption-title">Animation</span>
            <span className="anim-picker__caption-value">{currentMeta.label}</span>
          </span>
          <svg
            className="anim-picker__chev"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        <div
          id="anim-picker-list"
          className="anim-picker__list"
          role="radiogroup"
          aria-label="Animation theme"
          aria-hidden={!open}
          onKeyDown={(e) => {
            if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
            e.preventDefault();
            const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
            const nextIdx =
              (ANIMATION_MODES.findIndex((m) => m.id === mode) + dir + ANIMATION_MODES.length) %
              ANIMATION_MODES.length;
            const next = ANIMATION_MODES[nextIdx];
            setAnimationMode(next.id);
            e.currentTarget.querySelector<HTMLElement>(`[data-mode="${next.id}"]`)?.focus();
          }}
        >
          <div className="anim-picker__inner">
            {ANIMATION_MODES.map((m, k) => {
              const active = m.id === mode;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={open && active ? 0 : -1}
                  data-mode={m.id}
                  data-tip={m.label}
                  aria-label={`${m.label} — ${m.blurb}`}
                  className={`anim-opt${active ? ' is-active' : ''}`}
                  style={{ '--k': k } as React.CSSProperties}
                  onClick={() => {
                    setAnimationMode(m.id);
                    window.setTimeout(() => setOpen(false), 260);
                  }}
                >
                  <AnimationIcon mode={m.id} size={20} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .anim-picker {
          position: absolute;
          right: 24px;
          bottom: 100px;
          z-index: 3;
          animation: fadeUp .7s 1.2s cubic-bezier(.2,.8,.2,1) both;
        }
        .anim-picker__panel {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          padding: 5px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--surface) 76%, transparent);
          border: 1px solid color-mix(in srgb, var(--border) 85%, transparent);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
          backdrop-filter: blur(16px) saturate(140%);
          box-shadow: 0 12px 34px -12px rgba(2, 6, 23, .45), 0 1px 0 rgba(255,255,255,.04) inset;
          transition: box-shadow .4s ease;
        }
        .anim-picker[data-open="true"] .anim-picker__panel {
          box-shadow: 0 18px 44px -12px rgba(2, 6, 23, .55), 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent);
        }

        .anim-picker__head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 12px 4px 5px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--text);
          cursor: pointer;
          text-align: left;
          transition: background-color .25s ease;
        }
        .anim-picker__head:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
        .anim-picker__head:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .anim-picker__cur {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 50%;
          color: #fff; background: var(--accent);
          box-shadow: 0 6px 18px -4px color-mix(in srgb, var(--accent) 70%, transparent);
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
        }
        .anim-picker[data-open="true"] .anim-picker__cur { transform: rotate(360deg); }
        .anim-picker__caption { display: flex; flex-direction: column; line-height: 1.1; min-width: 76px; }
        .anim-picker__caption-title {
          font-family: 'Syne', sans-serif; font-size: .56rem; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--muted);
        }
        .anim-picker__caption-value {
          font-family: 'Syne', sans-serif; font-size: .84rem; font-weight: 700; color: var(--text); margin-top: 2px; white-space: nowrap;
        }
        .anim-picker__chev { color: var(--muted); transition: transform .45s cubic-bezier(.34,1.56,.64,1), color .25s ease; }
        .anim-picker__head:hover .anim-picker__chev { color: var(--accent); }
        .anim-picker[data-open="true"] .anim-picker__chev { transform: rotate(180deg); }

        .anim-picker__list {
          max-width: 0;
          opacity: 0;
          clip-path: inset(-48px 0 -12px 0);
          transition: max-width .55s cubic-bezier(.2,.8,.2,1), opacity .3s ease, margin .4s ease, clip-path .4s ease;
        }
        .anim-picker[data-open="true"] .anim-picker__list {
          max-width: 640px;
          opacity: 1;
          margin-right: 4px;
          clip-path: inset(-54px -100px -16px -100px);
        }
        .anim-picker__inner {
          display: flex; align-items: center; gap: 4px; padding: 0 6px 0 4px; border-right: 1px solid var(--border); margin-right: 2px;
        }
        .anim-opt {
          position: relative; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
          width: 38px; height: 38px; padding: 0; border: 0; border-radius: 50%;
          background: transparent; color: var(--muted); cursor: pointer;
          opacity: 0; transform: translateX(14px) scale(.7);
          transition: background-color .22s ease, color .22s ease, box-shadow .22s ease, opacity .3s ease, transform .45s cubic-bezier(.34,1.56,.64,1);
        }
        .anim-picker[data-open="true"] .anim-opt {
          opacity: 1; transform: none;
          transition-delay: 0s, 0s, 0s, calc(var(--k, 0) * 28ms + 120ms), calc(var(--k, 0) * 28ms + 120ms);
        }
        .anim-picker[data-open="true"] .anim-opt:hover {
          color: var(--text); background: color-mix(in srgb, var(--accent) 14%, transparent); transform: translateY(-3px) scale(1.08); transition-delay: 0s;
        }
        .anim-opt:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .anim-opt.is-active {
          color: #fff; background: var(--accent); box-shadow: 0 6px 18px -4px color-mix(in srgb, var(--accent) 70%, transparent);
        }
        .anim-opt::after {
          content: attr(data-tip);
          position: absolute; bottom: calc(100% + 10px); left: 50%;
          transform: translate(-50%, 4px);
          padding: 4px 9px; border-radius: 8px;
          background: var(--text); color: var(--bg);
          font-family: 'Syne', sans-serif; font-size: .68rem; font-weight: 700; letter-spacing: .04em; white-space: nowrap;
          opacity: 0; pointer-events: none; transition: opacity .18s ease, transform .18s ease;
          z-index: 10;
        }
        .anim-opt:hover::after, .anim-opt:focus-visible::after { opacity: 1; transform: translate(-50%, 0); }

        @media (max-width: 768px) { .anim-picker { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .anim-picker { animation: none; }
          .anim-picker__list, .anim-opt, .anim-picker__chev, .anim-picker__cur { transition: none; }
        }
      `}</style>
    </div>
  );
}

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function TypedText({ text, delay = 650, speed = 34 }: { text: string; delay?: number; speed?: number }) {
  const [len, setLen] = useState(() => (prefersReduced() ? text.length : 0));

  useEffect(() => {
    if (prefersReduced()) {
      setLen(text.length);
      return;
    }
    let cur = 0;
    let iv = 0;
    const t = window.setTimeout(() => {
      iv = window.setInterval(() => {
        cur += 1;
        setLen(cur);
        if (cur >= text.length) window.clearInterval(iv);
      }, speed);
    }, delay);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(iv);
    };
  }, [text, delay, speed]);

  return (
    <span className="hero-typed">
      <span className="hero-typed-ghost" aria-hidden="true">
        {text}
      </span>
      <span className="hero-typed-live" aria-label={text}>
        {text.slice(0, len)}
        <i className={`hero-caret${len >= text.length ? ' is-done' : ''}`} />
      </span>
    </span>
  );
}

function StatCounter({ value, delay = 900 }: { value: string; delay?: number }) {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(() =>
    match && !prefersReduced() ? `${match[1]}0${match[3]}` : value
  );

  useEffect(() => {
    if (!match || prefersReduced()) {
      setDisplay(value);
      return;
    }
    const target = parseFloat(match[2]);
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
    let raf = 0;
    const t = window.setTimeout(() => {
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min((now - t0) / 1400, 1);
        const eased = 1 - Math.pow(1 - k, 3);
        setDisplay(`${match[1]}${(target * eased).toFixed(decimals)}${match[3]}`);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [value, delay]);

  return <>{display}</>;
}

function formatSocialHref(platform: string, raw: string): string {
  const s = raw.trim();
  if (platform === 'phone') return s.startsWith('tel:') ? s : `tel:${s.replace(/[^+\d]/g, '')}`;
  if (platform === 'email') return s.startsWith('mailto:') ? s : `mailto:${s}`;
  if (platform === 'whatsapp') {
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    return `https://wa.me/${s.replace(/[^\d]/g, '')}`;
  }
  if (/^(https?:|mailto:|tel:)/i.test(s)) return s;
  return `https://${s}`;
}

function formatSocialLabel(platform: string): string {
  switch (platform) {
    case 'phone':
      return 'Call Phone';
    case 'email':
      return 'Email Me';
    case 'whatsapp':
      return 'WhatsApp';
    case 'linkedin':
      return 'LinkedIn';
    case 'github':
      return 'GitHub';
    case 'facebook':
      return 'Facebook';
    case 'accredible':
      return 'Google Credentials';
    default:
      return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
}

export function Hero() {
  const { hero } = PORTFOLIO_DATA;
  const sectionRef = useRef<HTMLElement | null>(null);
  const avatarWrapRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const sec = sectionRef.current;
    if (sec) {
      const rect = sec.getBoundingClientRect();
      sec.style.setProperty('--hx', `${e.clientX - rect.left}px`);
      sec.style.setProperty('--hy', `${e.clientY - rect.top}px`);
    }
    const wrap = avatarWrapRef.current;
    if (wrap) {
      const r = wrap.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      wrap.style.setProperty('--ry', `${(nx * 9).toFixed(2)}deg`);
      wrap.style.setProperty('--rx', `${(-ny * 7).toFixed(2)}deg`);
    }
  };

  const handlePointerLeave = () => {
    avatarWrapRef.current?.style.setProperty('--rx', '0deg');
    avatarWrapRef.current?.style.setProperty('--ry', '0deg');
  };

  let wordIdx = 0;

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-live"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '104px 24px 120px',
        background: 'var(--hero-grad)',
      }}
    >
      <div className="hero-spot" aria-hidden="true" />
      <div
        className="blob"
        style={{ width: 520, height: 520, background: '#2563eb', top: -120, right: -120 }}
      />
      <div
        className="blob"
        style={{ width: 380, height: 380, background: '#0ea5e9', bottom: -60, left: '3%' }}
      />
      <div
        className="blob"
        style={{ width: 280, height: 280, background: '#14b8a6', top: '30%', left: '42%' }}
      />

      <HeroScene />

      <div className="neural-hero-brain" aria-hidden="true">
        <svg viewBox="0 0 240 170" role="presentation">
          <defs>
            <linearGradient id="neuralBrainStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#55e5ff" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path
            className="neural-brain-outline"
            d="M119 25C105 10 82 15 76 32 57 24 39 39 43 58 22 65 25 91 43 101 32 119 48 138 70 132 80 151 103 148 119 133 135 150 159 147 168 132 190 139 208 120 197 102 216 87 210 63 194 57 199 38 180 24 162 31 152 13 131 14 119 25Z"
          />
          <path
            className="neural-brain-fold"
            d="M119 27C112 46 126 54 118 72 111 90 126 104 119 132M77 34C86 43 84 54 75 62 66 71 72 82 83 86M158 34C148 43 151 54 161 62 171 70 164 82 154 87M54 99C68 94 77 102 78 115M184 99C169 94 160 103 159 116M91 37C101 42 103 52 98 61M146 39C136 45 136 55 141 64M90 106C101 97 109 101 115 112M146 104C137 96 129 100 124 112"
          />
          <g className="neural-brain-links">
            <path d="M52 72 77 55 99 63 119 47 143 58 166 47 190 68M47 99 76 87 96 99 119 83 144 97 167 83 196 98M68 121 91 111 119 123 145 111 171 123M77 55 76 87 91 111M99 63 96 99 91 111M119 47 119 83 119 123M143 58 144 97 145 111M166 47 167 83 171 123" />
          </g>
          <g className="neural-brain-nodes">
            <circle cx="52" cy="72" r="3" />
            <circle cx="77" cy="55" r="3.5" />
            <circle cx="99" cy="63" r="3" />
            <circle cx="119" cy="47" r="4" />
            <circle cx="143" cy="58" r="3" />
            <circle cx="166" cy="47" r="3.5" />
            <circle cx="190" cy="68" r="3" />
            <circle cx="47" cy="99" r="3" />
            <circle cx="76" cy="87" r="3.5" />
            <circle cx="96" cy="99" r="3" />
            <circle cx="119" cy="83" r="4" />
            <circle cx="144" cy="97" r="3.5" />
            <circle cx="167" cy="83" r="3" />
            <circle cx="196" cy="98" r="3" />
            <circle cx="68" cy="121" r="3" />
            <circle cx="91" cy="111" r="3.5" />
            <circle cx="119" cy="123" r="4" />
            <circle cx="145" cy="111" r="3" />
            <circle cx="171" cy="123" r="3.5" />
          </g>
          <circle className="neural-brain-signal" cx="119" cy="83" r="7" />
        </svg>
      </div>

      <div className="sketch-hero-doodles" aria-hidden="true">
        <svg className="sketch-hero-doodles-desktop" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <g className="sketch-doodle sketch-doodle--blue" transform="translate(770 82) rotate(-8)">
            <ellipse cx="50" cy="40" rx="45" ry="17" />
            <ellipse cx="50" cy="40" rx="45" ry="17" transform="rotate(60 50 40)" />
            <ellipse cx="50" cy="40" rx="45" ry="17" transform="rotate(120 50 40)" />
            <circle cx="50" cy="40" r="5" />
            <text x="23" y="91" className="sketch-label">React</text>
          </g>
          <g className="sketch-doodle sketch-doodle--green" transform="translate(1230 142) rotate(7)">
            <path d="m45 2 39 22v45L45 91 6 69V24zM45 2v44m39-22L45 46 6 24m39 22v45" />
            <text x="19" y="56" className="sketch-label">node</text>
            <text x="12" y="112" className="sketch-label">Node.js</text>
          </g>
          <g className="sketch-doodle sketch-doodle--purple" transform="translate(670 112) rotate(-3)">
            <rect x="2" y="5" width="132" height="82" rx="5" />
            <path d="M2 25h132M15 15h2m10 0h2" />
            <path d="m25 44-12 9 12 9m24-18 12 9-12 9m-8-15-8 21" />
            <text x="74" y="57" className="sketch-label">build</text>
          </g>
          <g className="sketch-doodle sketch-doodle--orange" transform="translate(100 660) rotate(5)">
            <rect x="4" y="4" width="118" height="74" rx="5" />
            <path d="M4 23h118M18 14h2m10 0h2" />
            <path d="m28 39-10 8 10 8m19-16 10 8-10 8m-7-13-7 19" />
            <text x="20" y="101" className="sketch-label">Software Eng.</text>
          </g>
          <g className="sketch-doodle sketch-doodle--pink" transform="translate(1230 655) rotate(-6)">
            <path d="M8 80V34L63 5l57 29v46H8zM0 35 63 0l65 35M48 80V53h31v27M96 15h17v18" />
            <path d="M35 33c-13 4-18 18-9 25l10-5 5 12 9-9-6-13 13-8-4-8-15 5z" />
            <text x="22" y="105" className="sketch-label">Gemini AI</text>
          </g>
          <g className="sketch-doodle sketch-doodle--pink" transform="translate(1050 455) rotate(7)">
            <path d="M32 3C17 3 6 15 6 29c0 13 9 21 21 24l-4 15 15-13c13-4 21-14 21-27C59 14 48 3 32 3z" />
            <path d="m20 22 8 7-8 7m17-14 8 7-8 7m-4-12-4 12" />
          </g>
          <g className="sketch-doodle sketch-doodle--blue" transform="translate(965 680) rotate(5)">
            <path d="M8 8h42v32H8zM17 18h24M17 26h16M17 34h20" />
          </g>
          <g className="sketch-doodle sketch-doodle--green" transform="translate(755 760) rotate(-4)">
            <path d="m4 22 13 13L43 8M2 42h48" />
          </g>
          <g className="sketch-doodle sketch-doodle--orange" transform="translate(520 115) rotate(8)">
            <circle cx="18" cy="18" r="14" />
            <path d="m12 18 5 5 9-11" />
          </g>
          <g className="sketch-doodle sketch-doodle--blue" transform="translate(305 392) rotate(-5)">
            <path d="M8 10h54v40H8zM22 22l-8 8 8 8m24-16 8 8-8 8m-7-19-7 22" />
          </g>
          <g className="sketch-doodle sketch-doodle--green" transform="translate(1110 318) rotate(6)">
            <circle cx="10" cy="12" r="5" />
            <circle cx="55" cy="5" r="5" />
            <circle cx="38" cy="43" r="5" />
            <circle cx="83" cy="32" r="5" />
            <path d="m15 11 35-5m3 4-13 28m-1 1 40-5" />
          </g>
          <g className="sketch-doodle sketch-doodle--pink" transform="translate(840 660) rotate(-7)">
            <path d="m28 2 7 17 18-7-8 17 18 7-19 4 6 18-16-10-10 17-3-19-19 4 13-14L2 25l19 1z" />
          </g>
          <g className="sketch-doodle sketch-doodle--purple" transform="translate(1050 120) rotate(4)">
            <rect x="5" y="6" width="60" height="43" rx="4" />
            <path d="M5 18h60M16 12h2m8 0h2m-9 17h36M17 37h24" />
          </g>
          <g className="sketch-doodle sketch-doodle--orange" transform="translate(275 750) rotate(8)">
            <path d="M7 11h45v34H7zM17 11V5h25v6M17 23h25M17 32h25M17 40h15" />
          </g>
          <g className="sketch-doodle sketch-doodle--blue" transform="translate(1330 430) rotate(-5)">
            <path d="M6 16c0-7 8-11 15-7 5-7 16-5 18 3 8-1 13 5 10 12-2 6-10 8-17 5-6 6-18 4-21-2-5 0-7-5-5-11z" />
          </g>
          <g className="sketch-doodle sketch-doodle--green" transform="translate(625 795) rotate(-4)">
            <path d="m5 21 11 11 23-26M2 43h44" />
          </g>
          <g className="sketch-doodle sketch-doodle--pink" transform="translate(715 245) rotate(5)">
            <circle cx="8" cy="8" r="4" />
            <circle cx="39" cy="8" r="4" />
            <circle cx="24" cy="34" r="4" />
            <path d="M12 8h23M10 12l11 18m16-18L27 30" />
          </g>
        </svg>

        <svg className="sketch-hero-doodles-mobile" viewBox="0 0 420 900" preserveAspectRatio="xMidYMid meet">
          <g className="sketch-doodle sketch-doodle--blue" transform="translate(16 92) rotate(-8)">
            <ellipse cx="40" cy="32" rx="35" ry="13" />
            <ellipse cx="40" cy="32" rx="35" ry="13" transform="rotate(60 40 32)" />
            <ellipse cx="40" cy="32" rx="35" ry="13" transform="rotate(120 40 32)" />
            <circle cx="40" cy="32" r="4" />
            <text x="16" y="76" className="sketch-label">React</text>
          </g>
          <g className="sketch-doodle sketch-doodle--purple" transform="translate(294 55) rotate(4)">
            <rect x="3" y="4" width="86" height="56" rx="5" />
            <path d="M3 18h86M13 11h2m8 0h2m-8 23-9 7 9 7m20-14 9 7-9 7m-5-12-6 18" />
          </g>
          <g className="sketch-doodle sketch-doodle--green" transform="translate(314 275) rotate(7)">
            <path d="m35 2 30 17v35L35 71 5 54V19zM35 2v34m30-17L35 36 5 19m30 17v35" />
            <text x="13" y="46" className="sketch-label">node</text>
          </g>
          <g className="sketch-doodle sketch-doodle--orange" transform="translate(18 430) rotate(5)">
            <rect x="3" y="4" width="74" height="52" rx="5" />
            <path d="M3 17h74M13 11h2m8 0h2m-7 21-8 6 8 6m18-12 8 6-8 6m-5-11-6 16" />
          </g>
          <g className="sketch-doodle sketch-doodle--pink" transform="translate(333 515) rotate(-7)">
            <path d="m22 2 6 14 15-4-8 13 14 7-16 3 4 15-13-9-9 14-2-16-16 3 11-12L0 18l16 1z" />
          </g>
          <g className="sketch-doodle sketch-doodle--blue" transform="translate(307 715) rotate(-5)">
            <path d="M3 13c0-6 7-9 13-5 4-6 13-4 15 3 6-1 10 4 8 10-2 5-8 7-14 4-5 5-15 3-18-2-4 0-6-5-4-10z" />
          </g>
          <g className="sketch-doodle sketch-doodle--green" transform="translate(25 760) rotate(-5)">
            <circle cx="8" cy="8" r="4" />
            <circle cx="43" cy="5" r="4" />
            <circle cx="27" cy="35" r="4" />
            <path d="m12 8 27-3m1 6L29 32" />
          </g>
        </svg>
      </div>

      <div
        className="hero-grid"
        style={{
          maxWidth: 1360,
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <h1
            className="hero-title"
            style={{
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 18,
              letterSpacing: '0.01em',
              animation: 'fadeUp .6s .25s ease both',
              opacity: 0,
            }}
          >
            <span className="hero-hi">Hi, I&apos;m</span>
            <br />
            <span className="grad-text hero-name">{hero.name}</span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              fontFamily: "'Syne',sans-serif",
              fontWeight: 600,
              color: 'var(--accent)',
              marginBottom: 16,
              letterSpacing: '0.02em',
              animation: 'fadeUp .6s .4s ease both',
              opacity: 0,
            }}
          >
            <TypedText key={hero.subtitle} text={hero.subtitle} />
          </p>

          <div
            className="hero-bio"
            style={{
              lineHeight: 1.75,
              fontFamily: "'Syne',sans-serif",
              color: 'var(--text)',
              fontSize: '1.06rem',
              fontWeight: 500,
              maxWidth: 540,
              marginBottom: 28,
              letterSpacing: '0.01em',
              textAlign: 'justify',
              textJustify: 'inter-word',
              textAlignLast: 'left',
            }}
          >
            {hero.bio.split(/\r?\n/).map((line, li, arr) => (
              <p
                key={li}
                className="hero-bio-line"
                style={{
                  margin: 0,
                  marginBottom: li < arr.length - 1 ? (line.trim() === '' ? 12 : 8) : 0,
                }}
              >
                {line
                  ? line.split(' ').map((word, wi, words) => (
                      <React.Fragment key={wi}>
                        <span
                          className="hero-word"
                          style={{ '--w': wordIdx++ } as React.CSSProperties}
                        >
                          {word}
                        </span>
                        {wi < words.length - 1 ? ' ' : ''}
                      </React.Fragment>
                    ))
                  : '\u00A0'}
              </p>
            ))}
          </div>

          <div
            className="hero-cta-group"
            style={{ animation: 'fadeUp .6s .7s ease both', opacity: 0 }}
          >
            <a
              href={hero.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary hero-btn-cv"
            >
              <DownloadIcon size={16} />
              <span>{hero.resumeButtonText}</span>
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className="btn-outline hero-btn-contact"
            >
              <span>Contact Me</span>
            </a>
          </div>

          <div
            className="hero-social-group"
            style={{ animation: 'fadeUp .6s .85s ease both', opacity: 0 }}
          >
            {hero.socialLinks.map((item, idx) => {
              const href = formatSocialHref(item.platform, item.url);
              const label = formatSocialLabel(item.platform);
              const external = href.startsWith('http');
              return (
                <a
                  key={item.id}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  data-label={label}
                  data-cat={item.platform}
                  className="social-icon hero-social-icon"
                  style={{ '--i': idx } as React.CSSProperties}
                >
                  <SocialIcon platform={item.platform} size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div
          className="hero-avatar"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '-40px',
            animation: 'fadeUp .6s .3s ease both',
            opacity: 0,
          }}
        >
          <div
            ref={avatarWrapRef}
            className="animate-float hero-avatar-wrapper"
            style={{ position: 'relative' }}
          >
            <span className="hero-aura" aria-hidden="true" />
            <span className="hero-orbit" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <div className="ring1" />
            <div className="ring2" />
            <div
              className="hero-avatar-inner"
              style={{
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--card-glow-hover)',
                border: '4px solid var(--accent)',
                background: 'var(--surface)',
              }}
            >
              <img
                src={hero.avatarUrl}
                alt={hero.name}
                width={310}
                height={310}
                fetchPriority="high"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimPicker />

      <div
        className="hero-stats-container"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--surface2)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '10px 24px',
          zIndex: 2,
          borderTop: '1px solid var(--border)',
        }}
      >
        <span className="hero-stats-line" aria-hidden="true" />
        <div
          className="hero-stats"
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: `repeat(${hero.stats.length}, 1fr)`,
            gap: 40,
          }}
        >
          {hero.stats.map((st, idx) => (
            <div
              key={st.id}
              className="hero-stat"
              style={
                {
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  '--i': idx,
                } as React.CSSProperties
              }
            >
              <div
                className="grad-text hero-stats-value"
                style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800 }}
              >
                <StatCounter key={st.value} value={st.value} />
              </div>
              <div
                className="hero-stats-label"
                style={{ color: 'var(--text)', opacity: 0.75, fontWeight: 500 }}
              >
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-title { font-size: clamp(2.4rem, 3.6vw, 3.55rem); }
        .hero-stats-value { font-size: 1.45rem; }
        .hero-stats-label { font-size: 0.8rem; }

        .hero-avatar-wrapper { width: 310px; height: 310px; }
        .hero-avatar-inner { width: 310px; height: 310px; }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 26px;
        }
        .hero-btn-cv, .hero-btn-contact {
          font-size: .94rem;
          padding: 12px 28px;
          border-radius: 50px;
          transition: transform .25s ease, box-shadow .3s ease, background-color .25s ease, color .25s ease;
        }
        .hero-social-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .hero-bio, .hero-bio-line {
          text-align: justify !important;
          text-justify: inter-word;
          text-align-last: left !important;
          hyphens: auto;
          -webkit-hyphens: auto;
          word-break: normal;
          overflow-wrap: break-word;
        }

        .hero-live { --hx: 70%; --hy: 40%; }
        .hero-spot {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(520px circle at var(--hx) var(--hy), color-mix(in srgb, var(--accent2) 14%, transparent), transparent 65%);
          opacity: .9;
        }

        @keyframes heroHi { from { opacity: 0; transform: translateX(-26px); filter: blur(6px); } to { opacity: 1; transform: none; filter: blur(0); } }
        @keyframes heroName { from { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(-18px); } to { clip-path: inset(0 -6% 0 0); opacity: 1; transform: none; } }
        @keyframes heroFlow { to { background-position: 200% 50%; } }
        .hero-hi { display: inline-block; animation: heroHi .8s cubic-bezier(.2, .8, .2, 1) .35s backwards; }
        .hero-name {
          display: inline-block;
          background: linear-gradient(110deg, var(--accent), var(--accent2), var(--accent3), var(--accent2), var(--accent));
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: heroName 1s cubic-bezier(.2, .8, .2, 1) .55s backwards, heroFlow 6s linear 1.6s infinite;
        }

        .hero-typed { position: relative; display: inline-block; }
        .hero-typed-ghost { visibility: hidden; }
        .hero-typed-live { position: absolute; left: 0; top: 0; width: 100%; }
        @keyframes heroCaret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .hero-caret { display: inline-block; width: 2px; height: 1.05em; margin-left: 3px; vertical-align: -0.15em; background: var(--accent2); animation: heroCaret .9s steps(1) infinite; }
        .hero-caret.is-done { animation: heroCaret 1.1s steps(1) 3; opacity: 0; animation-fill-mode: forwards; }

        @keyframes heroWord { from { opacity: 0; filter: blur(6px); } to { opacity: 1; filter: blur(0); } }
        .hero-word { animation: heroWord .55s ease backwards; animation-delay: calc(var(--w, 0) * 22ms + 900ms); }

        .hero-avatar-inner { transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform .25s ease-out; position: relative; z-index: 1; }
        @keyframes heroAuraSpin { to { transform: rotate(360deg); } }
        .hero-aura {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--accent2) 70%, transparent) 70deg, transparent 140deg, color-mix(in srgb, var(--accent3) 55%, transparent) 220deg, transparent 300deg);
          filter: blur(14px);
          opacity: .75;
          animation: heroAuraSpin 9s linear infinite;
          pointer-events: none;
        }
        @keyframes heroOrbit { to { transform: rotate(360deg); } }
        .hero-orbit { position: absolute; inset: -42px; border-radius: 50%; pointer-events: none; animation: heroOrbit 16s linear infinite; z-index: 2; }
        .hero-orbit i {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--accent2);
          box-shadow: 0 0 12px var(--accent2), 0 0 24px color-mix(in srgb, var(--accent2) 60%, transparent);
        }
        .hero-orbit i:nth-child(1) { top: 0; left: 50%; margin-left: -4px; }
        .hero-orbit i:nth-child(2) { bottom: 14%; left: 7%; width: 6px; height: 6px; background: var(--accent3); box-shadow: 0 0 10px var(--accent3); }
        .hero-orbit i:nth-child(3) { bottom: 10%; right: 8%; width: 7px; height: 7px; background: var(--accent); box-shadow: 0 0 10px var(--accent); }

        @keyframes heroStatsRise { from { transform: translateY(100%); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes heroStatIn { from { opacity: 0; transform: translateY(18px) scale(.9); filter: blur(6px); } to { opacity: 1; transform: none; filter: blur(0); } }
        @keyframes heroStatsTravel { from { transform: translateX(-120%); } to { transform: translateX(420%); } }
        @keyframes heroStatGlow { 0%, 100% { filter: drop-shadow(0 0 0 transparent); } 50% { filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent2) 65%, transparent)); } }
        @keyframes heroStatBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes heroStatDiv { from { transform: scaleY(0); } to { transform: scaleY(1); } }

        .hero-stats-container { animation: heroStatsRise .9s cubic-bezier(.2, .8, .2, 1) .8s backwards; overflow: hidden; }
        .hero-stats-line { position: absolute; top: 0; left: 0; right: 0; height: 2px; overflow: hidden; pointer-events: none; }
        .hero-stats-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 24%;
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--accent2), var(--accent), transparent);
          animation: heroStatsTravel 5.5s ease-in-out 1.8s infinite;
        }
        .hero-stat {
          position: relative; padding-bottom: 6px; cursor: default;
          animation: heroStatIn .8s cubic-bezier(.2, .8, .2, 1) backwards;
          animation-delay: calc(var(--i, 0) * 130ms + 1.15s);
          transition: transform .35s cubic-bezier(.34, 1.56, .64, 1);
        }
        .hero-stat:hover { transform: translateY(-3px) scale(1.05); }
        .hero-stat .hero-stats-value {
          display: inline-block; align-self: center;
          animation: heroStatGlow 4.4s ease-in-out infinite;
          animation-delay: calc(var(--i, 0) * -1.2s + 2.4s);
          transition: transform .35s cubic-bezier(.34, 1.56, .64, 1);
        }
        .hero-stat:hover .hero-stats-value { transform: scale(1.12); }
        .hero-stat .hero-stats-label { transition: letter-spacing .35s ease, opacity .3s ease; }
        .hero-stat:hover .hero-stats-label { letter-spacing: .04em; opacity: 1 !important; }
        .hero-stat::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 34px;
          height: 2px;
          margin-left: -17px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transform-origin: center;
          animation: heroStatBar .7s cubic-bezier(.2, .8, .2, 1) backwards;
          animation-delay: calc(var(--i, 0) * 130ms + 1.7s);
          transition: width .4s cubic-bezier(.2, .8, .2, 1), margin-left .4s cubic-bezier(.2, .8, .2, 1);
        }
        .hero-stat:hover::after { width: 76px; margin-left: -38px; }
        .hero-stat + .hero-stat::before {
          content: '';
          position: absolute;
          left: -20px;
          top: 12%;
          bottom: 18%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--border), transparent);
          transform-origin: center;
          animation: heroStatDiv .8s ease backwards;
          animation-delay: calc(var(--i, 0) * 130ms + 1.5s);
        }
        @media (max-width: 768px) { .hero-stat + .hero-stat::before { left: -6px; } }
        @media (prefers-reduced-motion: reduce) {
          .hero-stats-container, .hero-stat, .hero-stat::after, .hero-stat::before, .hero-stats-line::after, .hero-stat .hero-stats-value { animation: none !important; }
          .hero-hi, .hero-name, .hero-word { animation: none !important; }
          .hero-name { clip-path: none; }
          .hero-aura, .hero-orbit, .hero-caret { animation: none; }
          .hero-avatar-inner { transition: none; transform: none; }
        }
        @media (hover: none) {
          .hero-stat:hover { transform: none; }
          .hero-spot { display: none; }
          .hero-avatar-inner { transform: none; }
        }

        @media(max-width:1024px){
          .hero-title { font-size: 2.85rem; }
        }

        @media(max-width:768px){
          #home { padding-bottom: 80px !important; }
          .hero-grid { display: flex !important; flex-direction: column-reverse; gap: 32px; text-align: center; }
          .hero-grid > div:first-child { display: flex; flex-direction: column; align-items: center; width: 100%; }
          .hero-grid p:not(.hero-bio):not(.hero-bio-line) { text-align: center; }
          .hero-bio {
            font-size: 1.02rem !important;
            line-height: 1.75 !important;
            max-width: 100% !important;
            margin-bottom: 28px !important;
          }
          .hero-grid > div:last-child { display: flex !important; justify-content: center; }
          .hero-avatar { margin-top: 0px !important; margin-bottom: 16px !important; }
          .hero-avatar-wrapper { width: 230px !important; height: 230px !important; }
          .hero-avatar-inner { width: 230px !important; height: 230px !important; }
          .hero-avatar-wrapper .ring1 { inset: -18px !important; }
          .hero-avatar-wrapper .ring2 { inset: -36px !important; }
          .hero-orbit { inset: -30px; }
          .hero-title { font-size: 2.25rem; }

          .hero-cta-group {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
            width: 100% !important;
            max-width: 380px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-bottom: 28px !important;
          }
          .hero-btn-cv, .hero-btn-contact {
            width: 100% !important;
            padding: 13px 12px !important;
            font-size: 0.92rem !important;
            font-weight: 700 !important;
            border-radius: 50px !important;
            justify-content: center !important;
            white-space: nowrap !important;
            box-sizing: border-box !important;
          }
          .hero-btn-contact {
            border: 1.5px solid var(--accent) !important;
            color: var(--accent) !important;
            background: transparent !important;
          }
          .hero-social-group {
            justify-content: center !important;
            gap: 14px !important;
            width: 100% !important;
          }
          .hero-social-icon {
            width: 42px !important;
            height: 42px !important;
          }
          .hero-stats-container { padding: 10px 12px !important; }
          .hero-stats { gap: 12px !important; }
          .hero-stats-value { font-size: 1.25rem !important; }
          .hero-stats-label { font-size: 0.7rem !important; }
        }
      `}</style>
    </section>
  );
}
