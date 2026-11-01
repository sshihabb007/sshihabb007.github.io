import React, { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
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
import { AnimationIcon, DownloadIcon, SendIcon, SocialIcon } from './Icons';

function AnimPicker() {
  const mode = useSyncExternalStore(
    subscribeAnimationMode,
    getAnimationMode,
    () => DEFAULT_ANIMATION_MODE
  );
  const trackRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const ind = indicatorRef.current;
    if (!track || !ind) return;

    const sync = () => {
      const btn = track.querySelector<HTMLElement>(`[data-mode="${mode}"]`);
      if (!btn) return;
      ind.style.width = `${btn.offsetWidth}px`;
      ind.style.transform = `translate3d(${btn.offsetLeft}px, 0, 0)`;
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(track);
    return () => ro.disconnect();
  }, [mode]);

  return (
    <div className="anim-picker-wrap">
      <div
        ref={trackRef}
        className="anim-picker"
        role="radiogroup"
        aria-label="Background animation"
      >
        <span ref={indicatorRef} className="anim-picker__ind" aria-hidden="true" />
        {ANIMATION_MODES.map((m) => {
          const active = m.id === mode;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              data-mode={m.id}
              title={`${m.label} — ${m.blurb}`}
              className={`anim-picker__btn${active ? ' active' : ''}`}
              onClick={() => setAnimationMode(m.id)}
            >
              <span className="anim-picker__icon">
                <AnimationIcon mode={m.id} size={15} />
              </span>
              <span className="anim-picker__lbl">{m.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .anim-picker-wrap {
          display: flex;
          justify-content: center;
          margin-top: 26px;
          position: relative;
          z-index: 3;
          animation: heroFadeUp .7s ease 1.1s backwards;
        }
        @media (max-width: 960px) {
          .anim-picker-wrap { display: none; }
        }
        .anim-picker {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 5px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--bg2) 72%, transparent);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          border: 1px solid var(--border);
          box-shadow: 0 8px 28px -8px rgba(0, 0, 0, .28),
                      0 1px 0 rgba(255, 255, 255, .05) inset;
          max-width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .anim-picker::-webkit-scrollbar { display: none; }
        .anim-picker__ind {
          position: absolute;
          top: 5px;
          bottom: 5px;
          left: 0;
          width: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 65%, var(--accent2)));
          box-shadow: 0 4px 14px -2px color-mix(in srgb, var(--accent) 55%, transparent);
          transition: transform .38s cubic-bezier(.2, .85, .25, 1),
                      width .38s cubic-bezier(.2, .85, .25, 1);
          pointer-events: none;
          z-index: 0;
        }
        .anim-picker__btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          border: 0;
          background: transparent;
          color: var(--text2);
          font-family: inherit;
          font-size: .78rem;
          font-weight: 600;
          letter-spacing: .01em;
          border-radius: 999px;
          cursor: pointer;
          white-space: nowrap;
          transition: color .25s ease, transform .2s ease;
          user-select: none;
        }
        .anim-picker__btn:hover { color: var(--text); }
        .anim-picker__btn.active {
          color: #fff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, .25);
        }
        .anim-picker__btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        .anim-picker__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform .35s cubic-bezier(.2, .8, .2, 1);
        }
        .anim-picker__btn:hover .anim-picker__icon { transform: scale(1.12); }
        .anim-picker__btn.active .anim-picker__icon { transform: scale(1.08); }
        @media (prefers-reduced-motion: reduce) {
          .anim-picker-wrap { animation: none !important; }
          .anim-picker__ind, .anim-picker__icon { transition: none; }
        }
      `}</style>
    </div>
  );
}

function HeroScene() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [supported] = useState(() => hasWebGL());

  useEffect(() => {
    const el = hostRef.current;
    if (!supported || !el) return;
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
    }, 200);

    return () => {
      cancelled = true;
      cancelIdle();
      dispose?.();
    };
  }, [supported]);

  if (!supported) return null;

  return (
    <div
      ref={hostRef}
      className="hero-3d"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}

function formatSocialHref(platform: string, raw: string): string {
  const s = raw.trim();
  if (platform === 'phone') {
    return s.startsWith('tel:') ? s : `tel:${s.replace(/[^+\d]/g, '')}`;
  }
  if (platform === 'email') {
    return s.startsWith('mailto:') ? s : `mailto:${s}`;
  }
  if (platform === 'whatsapp') {
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    return `https://wa.me/${s.replace(/[^\d]/g, '')}`;
  }
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('mailto:') || s.startsWith('tel:')) {
    return s;
  }
  return `https://${s}`;
}

function HeroStat({ value, label, index }: { value: string; label: string; index: number }) {
  const match = String(value).match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let timer = 0;
    let started = false;

    const startCount = () => {
      if (started) return;
      started = true;
      setDisplay(`${prefix}${(0).toFixed(decimals)}${suffix}`);
      timer = window.setTimeout(() => {
        const t0 = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / 1400);
          const eased = 1 - Math.pow(1 - k, 3);
          const cur = (target * eased).toFixed(decimals);
          setDisplay(`${prefix}${cur}${suffix}`);
          if (k < 1) {
            raf = requestAnimationFrame(step);
          } else {
            setDisplay(value);
          }
        };
        raf = requestAnimationFrame(step);
      }, 1500 + index * 130);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((x) => x.isIntersecting)) {
          startCount();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, index]);

  return (
    <div ref={ref} className="hero-stat" style={{ '--i': index } as React.CSSProperties}>
      <div className="syne hero-stats-value">{display}</div>
      <div className="hero-stats-label">{label}</div>
    </div>
  );
}

export function Hero() {
  const { hero } = PORTFOLIO_DATA;
  const sectionRef = useRef<HTMLElement | null>(null);
  const avatarInnerRef = useRef<HTMLDivElement | null>(null);

  const [typedSubtitle, setTypedSubtitle] = useState(hero.subtitle);
  const [typingDone, setTypingDone] = useState(true);

  useEffect(() => {
    const full = hero.subtitle;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedSubtitle(full);
      setTypingDone(true);
      return;
    }
    setTypedSubtitle('');
    setTypingDone(false);
    let idx = 0;
    let timer = 0;
    const startTimer = window.setTimeout(() => {
      const step = () => {
        idx += 1;
        setTypedSubtitle(full.slice(0, idx));
        if (idx < full.length) {
          timer = window.setTimeout(step, 30);
        } else {
          setTypingDone(true);
        }
      };
      step();
    }, 450);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [hero.subtitle]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    const sec = sectionRef.current;
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    sec.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    sec.style.setProperty('--my', `${e.clientY - rect.top}px`);

    const av = avatarInnerRef.current;
    if (av) {
      const ar = av.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (e.clientX - (ar.left + ar.width / 2)) / 260));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (ar.top + ar.height / 2)) / 260));
      av.style.transform = `perspective(900px) rotateY(${nx * 9}deg) rotateX(${-ny * 9}deg)`;
    }
  };

  const handlePointerLeave = () => {
    if (avatarInnerRef.current) {
      avatarInnerRef.current.style.transform = '';
    }
  };

  const magneticMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  };

  const magneticReset = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  };

  const bioLines = hero.bio.split('\n').filter((line) => line.length > 0);
  let wordCounter = 0;

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'calc(var(--nav-h, 70px) + 44px)',
        paddingBottom: 48,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <HeroScene />
      <div className="hero-spot" aria-hidden="true" />

      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          width: '100%',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 60,
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          <div>
            <h1 className="syne hero-title">
              <span className="hero-hi">Hi, I&apos;m </span>
              <span className="hero-name">{hero.name}</span>
            </h1>

            <p
              style={{
                fontSize: '1.35rem',
                fontWeight: 600,
                color: 'var(--text2)',
                marginBottom: 20,
                minHeight: '2rem',
              }}
            >
              <span>{typedSubtitle}</span>
              <span className={`hero-caret${typingDone ? ' idle' : ''}`} aria-hidden="true" />
            </p>

            <div
              className="hero-bio"
              style={{
                color: 'var(--text2)',
                maxWidth: 560,
                lineHeight: 1.85,
                marginBottom: 32,
                fontSize: '1rem',
              }}
            >
              {bioLines.map((line, li) => {
                const words = line.trim().split(/\s+/).filter(Boolean);
                return (
                  <p
                    key={li}
                    className="hero-bio-line"
                    style={{ margin: li < bioLines.length - 1 ? '0 0 12px 0' : 0 }}
                  >
                    {words.map((word, wi) => {
                      const idx = wordCounter++;
                      return (
                        <React.Fragment key={wi}>
                          <span
                            className="hero-word"
                            style={{ animationDelay: `${0.85 + idx * 0.024}s` }}
                          >
                            {word}
                          </span>
                          {wi < words.length - 1 ? ' ' : ''}
                        </React.Fragment>
                      );
                    })}
                  </p>
                );
              })}
            </div>

            <div
              className="hero-cta-group hero-enter"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 14,
                marginBottom: 36,
                animationDelay: '1.1s',
              }}
            >
              <a
                href={hero.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary hero-btn-cv hero-mag"
                onPointerMove={magneticMove}
                onPointerLeave={magneticReset}
              >
                <DownloadIcon size={16} /> {hero.resumeButtonText}
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
                className="btn-outline hero-btn-contact hero-mag"
                onPointerMove={magneticMove}
                onPointerLeave={magneticReset}
              >
                <SendIcon size={16} /> Contact Me
              </a>
            </div>

            <div
              className="hero-social-group"
              style={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
              {hero.socialLinks.map((item, idx) => {
                const href = formatSocialHref(item.platform, item.url);
                const external = href.startsWith('http');
                return (
                  <a
                    key={item.id}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={item.platform}
                    title={item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                    className="hero-social-icon hero-social-pop"
                    style={{
                      animationDelay: `${1.25 + idx * 0.06}s`,
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: '1.5px solid var(--border)',
                      background: 'var(--bg2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text2)',
                      boxShadow: 'var(--shadow)',
                    }}
                  >
                    <SocialIcon platform={item.platform} size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: -64,
            }}
            className="hero-avatar hero-avatar-enter"
          >
            <div
              className="hero-avatar-wrapper"
              style={{ position: 'relative', width: 320, height: 320 }}
            >
              <div
                className="ring1"
                style={{
                  position: 'absolute',
                  inset: -24,
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(37,99,235,.22)',
                  animation: 'spinSlow 22s linear infinite',
                  pointerEvents: 'none',
                }}
              />
              <div
                className="ring2"
                style={{
                  position: 'absolute',
                  inset: -48,
                  borderRadius: '50%',
                  border: '1px dashed rgba(6,182,212,.14)',
                  animation: 'spinSlow 36s linear infinite reverse',
                  pointerEvents: 'none',
                }}
              />
              <div className="hero-aura" aria-hidden="true" />
              <div className="hero-orbit" aria-hidden="true" />

              <div
                ref={avatarInnerRef}
                className="hero-avatar-inner"
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
                  padding: 4,
                  boxShadow: '0 24px 64px rgba(37,99,235,.28)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'var(--bg2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    fetchPriority="high"
                    decoding="async"
                    width={320}
                    height={320}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimPicker />

        <div
          className="hero-stats-container"
          style={{
            marginTop: 22,
            borderRadius: 16,
            padding: '12px 16px',
          }}
        >
          <span className="hero-stats-line" aria-hidden="true" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${hero.stats.length}, 1fr)`,
              gap: 40,
            }}
            className="hero-stats"
          >
            {hero.stats.map((st, idx) => (
              <HeroStat key={st.id} value={st.value} label={st.label} index={idx} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero-title {
          font-size: clamp(2.2rem, 3.85vw, 3.3rem);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.025em;
          margin-bottom: 14px;
          color: var(--text);
        }
        .hero-spot {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(
            560px circle at var(--mx, 72%) var(--my, 38%),
            rgba(37, 99, 235, .13),
            rgba(6, 182, 212, .05) 38%,
            transparent 68%
          );
          transition: opacity .3s ease;
        }
        html.dark .hero-spot {
          background: radial-gradient(
            600px circle at var(--mx, 72%) var(--my, 38%),
            rgba(59, 130, 246, .16),
            rgba(6, 182, 212, .06) 40%,
            transparent 70%
          );
        }
        .hero-hi {
          display: inline-block;
          animation: heroFadeUp .7s cubic-bezier(.2, .8, .2, 1) .05s backwards;
        }
        .hero-name {
          display: inline-block;
          background: linear-gradient(115deg, var(--accent) 0%, var(--accent2) 32%, #8b5cf6 65%, var(--accent) 100%);
          background-size: 240% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation:
            heroNameReveal .95s cubic-bezier(.22, 1, .36, 1) .18s backwards,
            heroGradFlow 7s ease-in-out 1.2s infinite;
        }
        @keyframes heroNameReveal {
          from { opacity: 0; transform: translateY(22px); filter: blur(8px); clip-path: inset(0 100% 0 0); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   clip-path: inset(0 0 0 0); }
        }
        @keyframes heroGradFlow {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-caret {
          display: inline-block;
          width: 2.5px;
          height: 1.05em;
          margin-left: 4px;
          vertical-align: -0.12em;
          border-radius: 2px;
          background: linear-gradient(180deg, var(--accent), var(--accent2));
        }
        .hero-caret.idle { animation: heroBlink 1.05s steps(2, start) infinite; }
        @keyframes heroBlink { 50% { opacity: 0; } }

        .hero-bio { text-align: justify; text-justify: inter-word; hyphens: auto; -webkit-hyphens: auto; }
        .hero-bio-line { text-align: justify; text-justify: inter-word; text-align-last: left; }
        .hero-word {
          display: inline;
          animation: heroWordFade .42s ease backwards;
        }
        @keyframes heroWordFade { from { opacity: 0; } to { opacity: 1; } }

        .hero-enter { animation: heroFadeUp .7s cubic-bezier(.2, .8, .2, 1) backwards; }
        .hero-mag {
          transition: transform .22s cubic-bezier(.2, .8, .2, 1), box-shadow .25s ease, background .25s ease, border-color .25s ease;
          will-change: transform;
        }
        .hero-social-pop {
          animation: heroPop .55s cubic-bezier(.2, 1.3, .3, 1) backwards;
          transition: transform .28s cubic-bezier(.2, 1.4, .3, 1), border-color .25s ease, box-shadow .25s ease !important;
        }
        .hero-social-pop:hover {
          transform: translateY(-5px) scale(1.08) !important;
          border-color: var(--accent) !important;
          box-shadow: 0 10px 24px -6px rgba(37, 99, 235, .38) !important;
        }
        @keyframes heroPop {
          from { opacity: 0; transform: scale(.5) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .hero-avatar-enter {
          animation: heroAvatarIn 1s cubic-bezier(.2, .8, .2, 1) .25s backwards;
        }
        @keyframes heroAvatarIn {
          from { opacity: 0; transform: scale(.86); filter: blur(6px); }
          to   { opacity: 1; transform: scale(1);   filter: blur(0); }
        }
        .hero-avatar-inner {
          position: relative;
          z-index: 2;
          transition: transform .35s cubic-bezier(.2, .8, .2, 1), box-shadow .4s ease;
          will-change: transform;
        }
        .hero-aura {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, var(--accent), var(--accent2), #8b5cf6, var(--accent));
          filter: blur(26px);
          opacity: .32;
          z-index: 0;
          pointer-events: none;
          animation: spinSlow 14s linear infinite, heroAuraPulse 4.5s ease-in-out infinite;
        }
        @keyframes heroAuraPulse {
          0%, 100% { opacity: .24; transform: scale(.97); }
          50%      { opacity: .42; transform: scale(1.04); }
        }
        .hero-orbit {
          position: absolute;
          inset: -36px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: spinSlow 16s linear infinite;
        }
        .hero-orbit::before,
        .hero-orbit::after {
          content: '';
          position: absolute;
          border-radius: 50%;
        }
        .hero-orbit::before {
          top: -5px; left: 50%; margin-left: -5px;
          width: 10px; height: 10px;
          background: var(--accent);
          box-shadow: 0 0 14px 3px var(--accent);
        }
        .hero-orbit::after {
          bottom: -4px; left: 50%; margin-left: -4px;
          width: 8px; height: 8px;
          background: var(--accent2);
          box-shadow: 0 0 12px 2px var(--accent2);
        }

        .hero-stats-container {
          position: relative;
          animation: heroFadeUp .7s ease 1.3s backwards;
        }
        .hero-stats-line {
          position: absolute;
          top: 0;
          left: 8%;
          right: 8%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
          overflow: hidden;
          pointer-events: none;
        }
        .hero-stats-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: -30%;
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent);
          animation: heroLineSweep 4.6s ease-in-out 2s infinite;
        }
        @keyframes heroLineSweep {
          0%   { left: -30%; opacity: 0; }
          15%  { opacity: 1; }
          65%  { left: 100%; opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .hero-stat {
          position: relative;
          text-align: center;
          padding: 10px 8px 14px;
          animation: heroStatIn .7s cubic-bezier(.2, .8, .2, 1) backwards;
          animation-delay: calc(var(--i, 0) * 130ms + 1.38s);
          transition: transform .35s cubic-bezier(.2, .8, .2, 1);
          cursor: default;
        }
        @keyframes heroStatIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroStatValPop {
          0%   { transform: scale(.86); opacity: 0; }
          65%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes heroStatBar {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        @keyframes heroStatDiv {
          from { transform: scaleY(0); opacity: 0; }
          to   { transform: scaleY(1); opacity: 1; }
        }
        .hero-stat:hover { transform: translateY(-4px); }
        .hero-stats-value {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -.02em;
          font-variant-numeric: tabular-nums;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 60%, #8b5cf6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          display: inline-block;
        }
        .hero-stat .hero-stats-value {
          animation: heroStatValPop .75s cubic-bezier(.2, 1.3, .3, 1) backwards;
          animation-delay: calc(var(--i, 0) * 130ms + 1.48s);
          transition: filter .35s ease, transform .35s cubic-bezier(.2, .8, .2, 1);
        }
        .hero-stat:hover .hero-stats-value {
          filter: drop-shadow(0 6px 18px rgba(37, 99, 235, .32));
          transform: scale(1.05);
        }
        .hero-stats-label {
          font-size: .82rem;
          color: var(--text3);
          font-weight: 600;
          margin-top: 5px;
          transition: color .3s ease, letter-spacing .3s ease, opacity .3s ease;
        }
        .hero-stat:hover .hero-stats-label { letter-spacing: .04em; opacity: 1 !important; color: var(--text2); }
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

        @media(max-width:1024px){
          .hero-title { font-size: 3.1rem; }
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
            text-align: justify !important;
            text-justify: inter-word;
            text-align-last: left !important;
            margin-bottom: 28px !important;
          }
          .hero-grid > div:last-child { display: flex !important; justify-content: center; }
          .hero-avatar { margin-top: 0px !important; margin-bottom: 16px !important; }
          .hero-avatar-wrapper { width: 230px !important; height: 230px !important; }
          .hero-avatar-inner { width: 230px !important; height: 230px !important; }
          .hero-avatar-wrapper .ring1 { inset: -18px !important; }
          .hero-avatar-wrapper .ring2 { inset: -36px !important; }
          .hero-orbit { inset: -30px; }
          .hero-title { font-size: 2.35rem; }
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
          .hero-social-group { justify-content: center !important; gap: 12px !important; width: 100% !important; flex-wrap: wrap; }
          .hero-social-icon { width: 42px !important; height: 42px !important; }
          .hero-stats-container { padding: 10px 12px !important; }
          .hero-stats { gap: 12px !important; }
          .hero-stat + .hero-stat::before { left: -6px; }
          .hero-stats-value { font-size: 1.35rem !important; }
          .hero-stats-label { font-size: 0.72rem !important; }
        }
      `}</style>
    </section>
  );
}
