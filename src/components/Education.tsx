import React, { useEffect, useId, useRef, useState } from 'react';
import { PORTFOLIO_DATA, type EducationItem } from '../data/portfolioData';
import { SectionHeader, useReveal } from './SectionHeader';

function EduScoreDial({
  badge,
  color,
  bgColor,
}: {
  badge: string;
  color: string;
  bgColor: string;
}) {
  const match = badge.match(/([\d.]+)\s*\/\s*([\d.]+)/);
  const hasMatch = Boolean(match);
  const rawValStr = match ? match[1] : '';
  const val = match ? parseFloat(rawValStr) : 0;
  const max = match ? parseFloat(match[2]) : 1;
  const decimals = rawValStr.includes('.') ? rawValStr.split('.')[1].length : 0;
  const label = (badge.split(':')[0] || 'GPA').trim();
  const pct = (val / max) * 100;
  const circ = 2 * Math.PI * 24;
  const targetOffset = circ - (pct / 100) * circ;

  const dialRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(circ);
  const [displayVal, setDisplayVal] = useState<string | number>(
    decimals > 0 ? (0).toFixed(decimals) : 0
  );
  const [hovered, setHovered] = useState(false);
  const gradId = `eg-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  useEffect(() => {
    if (!hasMatch) return;
    const el = dialRef.current;
    if (!el) return;

    const finalFormatted = decimals > 0 ? val.toFixed(decimals) : val;
    const zeroFormatted = decimals > 0 ? (0).toFixed(decimals) : 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startAnim = () => {
      if (reduced) {
        setOffset(targetOffset);
        setDisplayVal(finalFormatted);
        return () => {};
      }

      setOffset(circ);
      setDisplayVal(zeroFormatted);
      const timer = window.setTimeout(() => {
        setOffset(targetOffset);
      }, 150);

      const t0 = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const elapsed = Math.max(0, now - t0);
        const p = Math.min(elapsed / 1200, 1);
        const eased = (1 - (1 - p) ** 3) * val;
        if (p < 1) {
          setDisplayVal(decimals > 0 ? eased.toFixed(decimals) : Math.round(eased));
          raf = requestAnimationFrame(tick);
        } else {
          setDisplayVal(finalFormatted);
        }
      };
      raf = requestAnimationFrame(tick);

      return () => {
        window.clearTimeout(timer);
        cancelAnimationFrame(raf);
      };
    };

    if (typeof IntersectionObserver === 'undefined') {
      const cleanup = startAnim();
      return () => cleanup?.();
    }

    let cleanupAnim: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cleanupAnim?.();
          cleanupAnim = startAnim();
        } else {
          cleanupAnim?.();
          setOffset(circ);
          setDisplayVal(zeroFormatted);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    io.observe(el);

    const onHash = () => {
      if (window.location.hash === '#education') {
        cleanupAnim?.();
        cleanupAnim = startAnim();
      }
    };
    window.addEventListener('hashchange', onHash);

    return () => {
      io.disconnect();
      cleanupAnim?.();
      window.removeEventListener('hashchange', onHash);
    };
  }, [hasMatch, val, decimals, targetOffset, circ]);

  if (!hasMatch) {
    return (
      <span
        className="tech-badge"
        style={{
          background: 'transparent',
          border: `1.5px solid ${color}`,
          color,
          fontSize: '.84rem',
          padding: '6px 16px',
          fontWeight: 700,
          borderRadius: 9999,
        }}
      >
        {badge}
      </span>
    );
  }

  const progress = circ > 0 ? Math.min(Math.max(1 - offset / circ, 0), 1) : 0;
  const roundedPct = Math.round(pct);

  return (
    <div
      ref={dialRef}
      className={`edu-grade${hovered ? ' is-hover' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ '--gc': color, '--gb': bgColor } as React.CSSProperties}
    >
      <div className="edu-dial">
        <svg
          className="edu-dial-svg"
          width={52}
          height={52}
          viewBox="0 0 52 52"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: `color-mix(in srgb, ${color} 55%, white)` }} />
              <stop offset="100%" style={{ stopColor: color }} />
            </linearGradient>
          </defs>
          <circle
            cx={26}
            cy={26}
            r={24}
            stroke="var(--border)"
            strokeWidth={4}
            fill="none"
            opacity={0.55}
          />
          <circle
            cx={26}
            cy={26}
            r={24}
            stroke={`url(#${gradId})`}
            strokeWidth={4}
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
            }}
          />
          <g
            style={{
              transformOrigin: '26px 26px',
              transform: `rotate(${progress * 360}deg)`,
              transition: 'transform 1.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
              opacity: progress > 0.02 ? 1 : 0,
            }}
          >
            <circle className="edu-dial-cap" cx={50} cy={26} r={2.6} fill="#fff" />
          </g>
        </svg>
        <span className="edu-dial-val">{displayVal}</span>
      </div>

      <div className="edu-grade-text">
        <span className="edu-grade-label">{label}</span>
        <span className="edu-grade-sub">
          out of {max.toFixed(2)}
          <b>{roundedPct}%</b>
        </span>
      </div>
    </div>
  );
}

function EduCard({ item, delay }: { item: EducationItem; delay: number }) {
  const revealRef = useReveal<HTMLDivElement>();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 3).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 4).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  const years = item.yr.match(/\b(?:19|20)\d{2}\b/g);
  const endYear = years ? years[years.length - 1] : '';

  return (
    <div
      ref={revealRef}
      className="reveal edu-item"
      style={{ transitionDelay: `${delay}ms`, '--d': delay } as React.CSSProperties}
    >
      <span className="edu-connector" aria-hidden="true" />
      <span className="edu-dot" aria-hidden="true" />

      <div
        className="card edu-card edu-card-x"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          padding: '34px 44px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span className="edu-orbit" aria-hidden="true" />
        {endYear && (
          <span className="edu-year" aria-hidden="true">
            {endYear}
          </span>
        )}

        <div
          style={{
            display: 'flex',
            gap: 32,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
          className="edu-card-content"
        >
          <div className="edu-logo-wrap">
            <span className="edu-ring" aria-hidden="true" />
            <span className="edu-pulse" aria-hidden="true" />
            <div
              className="edu-logo"
              style={{
                width: 104,
                height: 104,
                borderRadius: '50%',
                background: '#ffffff',
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                border: '2px solid var(--border)',
              }}
            >
              <img
                src={item.img}
                alt={item.inst}
                width={80}
                height={80}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="edu-text" style={{ flex: 1, minWidth: 260 }}>
            <div
              className="edu-title"
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: '1.42rem',
                color: 'var(--text)',
                marginBottom: 8,
                letterSpacing: '0.01em',
                lineHeight: 1.3,
              }}
            >
              {item.deg}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {item.instUrl ? (
                <a
                  className="edu-school"
                  href={item.instUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '1.02rem',
                    color: 'var(--text)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'color .2s',
                    letterSpacing: '0.01em',
                  }}
                  onMouseOver={(ev) => (ev.currentTarget.style.color = 'var(--accent)')}
                  onMouseOut={(ev) => (ev.currentTarget.style.color = 'var(--text)')}
                >
                  {item.inst}
                </a>
              ) : (
                <div
                  className="edu-school"
                  style={{
                    fontSize: '1.02rem',
                    color: 'var(--text)',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                  }}
                >
                  {item.inst}
                </div>
              )}
            </div>

            <div
              className="edu-meta"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 20,
                marginTop: 4,
              }}
            >
              <div
                className="edu-date"
                style={{ fontSize: '.9rem', color: 'var(--muted)', fontWeight: 500 }}
              >
                {item.yr}
              </div>
              <EduScoreDial badge={item.cgpa} color={item.tc} bgColor={item.bc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Education() {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = listEl.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.62;
      const firstDot = listEl.querySelector<HTMLElement>('.edu-dot');
      const railTop = firstDot
        ? firstDot.getBoundingClientRect().top + firstDot.offsetHeight / 2 - rect.top
        : 0;
      const fill = reduced
        ? rect.height
        : Math.min(Math.max(triggerY - rect.top - railTop, 0), Math.max(rect.height - railTop, 0));

      listEl.style.setProperty('--rail-top', `${railTop}px`);
      listEl.style.setProperty('--fill', `${fill}px`);

      listEl.querySelectorAll<HTMLElement>('.edu-item').forEach((itemEl) => {
        const dot = itemEl.querySelector<HTMLElement>('.edu-dot');
        if (!dot) return;
        const dr = dot.getBoundingClientRect();
        itemEl.classList.toggle('reached', reduced || dr.top + dr.height / 2 < triggerY);
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(listEl);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="education" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <SectionHeader label="Academic Journey" title="Education" />

        <div
          ref={listRef}
          className="edu-list"
          style={{
            maxWidth: 1060,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <span className="edu-rail" aria-hidden="true" />
          {PORTFOLIO_DATA.education.map((item, idx) => (
            <EduCard key={item.id} item={item} delay={idx * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}
