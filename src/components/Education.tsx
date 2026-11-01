import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA, type EducationItem } from '../data/portfolioData';
import { SectionHeader, useReveal } from './SectionHeader';

const CIRC = 2 * Math.PI * 16;

function parseScoreRatio(cgpaText: string): number | null {
  const slashMatch = cgpaText.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (slashMatch) {
    const val = parseFloat(slashMatch[1]);
    const max = parseFloat(slashMatch[2]);
    if (max > 0) return Math.max(0, Math.min(1, val / max));
  }
  const singleMatch = cgpaText.match(/(\d+\.\d+)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    const scale = val > 4 ? 5 : 4;
    return Math.max(0, Math.min(1, val / scale));
  }
  return null;
}

function EduCard({ item, index }: { item: EducationItem; index: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const ratio = parseScoreRatio(item.cgpa);
  const yearWatermark = String(item.yr).match(/\d{4}/g)?.slice(-1)[0] ?? '';

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--rx', `${((y / r.height - 0.5) * -4.5).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 5.5).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={cardRef}
      className={`edu-row reveal d${Math.min(index + 1, 5)}${visible ? ' is-in' : ''}`}
      style={{ '--ec': item.tc } as React.CSSProperties}
    >
      <span className="edu-node" aria-hidden="true">
        <span className="edu-node-core" />
      </span>

      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="card edu-card edu-card-x"
        style={{
          padding: '28px 32px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: 24,
          alignItems: 'center',
        }}
      >
        {yearWatermark && (
          <span className="syne edu-year-bg" aria-hidden="true">
            {yearWatermark}
          </span>
        )}

        <div
          className="edu-badge"
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <img
            src={item.img}
            alt={item.inst}
            loading="lazy"
            decoding="async"
            width={44}
            height={44}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <div className="edu-info" style={{ position: 'relative', zIndex: 1 }}>
          <h3
            className="syne edu-deg"
            style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 4 }}
          >
            {item.deg}
          </h3>
          <div
            style={{
              color: item.tc,
              fontWeight: 600,
              fontSize: '.9rem',
              marginBottom: 4,
            }}
          >
            {item.instUrl ? (
              <a
                href={item.instUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {item.inst} ↗
              </a>
            ) : (
              item.inst
            )}
          </div>
          <div style={{ color: 'var(--text3)', fontSize: '.82rem' }}>{item.yr}</div>
        </div>

        <div
          className="edu-cgpa-wrap"
          style={{
            background: item.bc,
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '8px 16px 8px 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {ratio !== null && (
            <svg className="edu-ring" width="38" height="38" viewBox="0 0 40 40" aria-hidden="true">
              <circle className="edu-ring-track" cx="20" cy="20" r="16" />
              <circle
                className="edu-ring-bar"
                cx="20"
                cy="20"
                r="16"
                style={{
                  stroke: item.tc,
                  strokeDasharray: CIRC,
                  strokeDashoffset: visible ? CIRC * (1 - ratio) : CIRC,
                }}
              />
            </svg>
          )}
          <div
            className="syne"
            style={{
              fontWeight: 800,
              fontSize: '.95rem',
              color: item.tc,
              whiteSpace: 'nowrap',
            }}
          >
            {item.cgpa}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Education() {
  const revealRef = useReveal();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const railFillRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const fill = railFillRef.current;
    if (!track || !fill) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh * 0.72 - r.top) / Math.max(1, r.height)));
      fill.style.transform = `scaleY(${progress.toFixed(4)})`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="education"
      ref={revealRef}
      style={{
        padding: 'var(--section-py) 24px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 940, margin: '0 auto' }}>
        <SectionHeader
          label="Academic Background"
          title="Education"
          sub="Postgraduate and undergraduate computer science foundations backed by distinguished academic performance"
        />

        <div ref={trackRef} className="edu-track">
          <span className="edu-rail" aria-hidden="true">
            <span ref={railFillRef} className="edu-rail-fill" />
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {PORTFOLIO_DATA.education.map((item, idx) => (
              <EduCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .edu-track { position: relative; padding-left: 38px; }
        .edu-rail {
          position: absolute;
          left: 11px; top: 28px; bottom: 28px;
          width: 2px; border-radius: 2px;
          background: var(--border); overflow: hidden;
        }
        .edu-rail-fill {
          display: block; width: 100%; height: 100%;
          background: linear-gradient(180deg, var(--accent), var(--accent2), #16a34a, #f59e0b);
          transform-origin: top; transform: scaleY(0);
          transition: transform .18s ease-out;
          box-shadow: 0 0 12px var(--accent);
        }
        .edu-row { position: relative; }
        .edu-node {
          position: absolute; left: -38px; top: 50%;
          transform: translateY(-50%);
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--bg);
          border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          z-index: 2;
          transition: border-color .4s ease, box-shadow .4s ease, transform .4s cubic-bezier(.2, 1.4, .3, 1);
        }
        .edu-node-core {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--border2);
          transition: background .4s ease, transform .4s cubic-bezier(.2, 1.4, .3, 1);
        }
        .edu-row.is-in .edu-node {
          border-color: var(--ec, var(--accent));
          box-shadow: 0 0 0 5px color-mix(in srgb, var(--ec, var(--accent)) 16%, transparent);
        }
        .edu-row.is-in .edu-node-core { background: var(--ec, var(--accent)); transform: scale(1.15); }
        .edu-row:hover .edu-node { transform: translateY(-50%) scale(1.16); }

        .edu-card-x {
          position: relative; overflow: hidden;
          transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform .25s cubic-bezier(.2, .8, .2, 1), border-color .3s ease, box-shadow .3s ease;
          will-change: transform;
        }
        .edu-card-x::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%),
            color-mix(in srgb, var(--ec, var(--accent)) 13%, transparent), transparent 65%);
          opacity: 0; transition: opacity .3s ease; pointer-events: none;
        }
        .edu-card-x::after {
          content: ''; position: absolute; left: 0; top: 18%; bottom: 18%;
          width: 3px; border-radius: 0 3px 3px 0;
          background: var(--ec, var(--accent));
          transform: scaleY(.35); opacity: .55;
          transition: transform .35s cubic-bezier(.2, .8, .2, 1), opacity .35s ease, top .35s ease, bottom .35s ease;
        }
        .edu-card-x:hover {
          border-color: color-mix(in srgb, var(--ec, var(--accent)) 55%, var(--border));
          box-shadow: 0 20px 44px -16px color-mix(in srgb, var(--ec, var(--accent)) 32%, transparent);
        }
        .edu-card-x:hover::before { opacity: 1; }
        .edu-card-x:hover::after { top: 10%; bottom: 10%; transform: scaleY(1); opacity: 1; }

        .edu-year-bg {
          position: absolute; right: 20px; bottom: -14px;
          font-size: 4.8rem; font-weight: 800; line-height: 1; letter-spacing: -.04em;
          color: var(--ec, var(--accent)); opacity: .05;
          pointer-events: none; user-select: none;
          transition: opacity .35s ease, transform .45s cubic-bezier(.2, .8, .2, 1);
        }
        .edu-card-x:hover .edu-year-bg { opacity: .1; transform: translateY(-4px) scale(1.03); }

        .edu-badge { position: relative; z-index: 1; transition: transform .4s cubic-bezier(.2, 1.4, .3, 1), box-shadow .35s ease; }
        .edu-card-x:hover .edu-badge {
          transform: scale(1.08) rotate(-4deg);
          box-shadow: 0 10px 22px -8px color-mix(in srgb, var(--ec, var(--accent)) 45%, transparent) !important;
        }
        .edu-deg { transition: color .25s ease; }
        .edu-card-x:hover .edu-deg { color: var(--ec, var(--accent)); }

        .edu-ring { transform: rotate(-90deg); flex-shrink: 0; }
        .edu-ring-track { fill: none; stroke: var(--border); stroke-width: 3.2; opacity: .55; }
        .edu-ring-bar {
          fill: none; stroke-width: 3.4; stroke-linecap: round;
          transition: stroke-dashoffset 1.35s cubic-bezier(.22, 1, .36, 1) .18s;
        }
        .edu-cgpa-wrap { transition: transform .3s cubic-bezier(.2, 1.3, .3, 1); }
        .edu-card-x:hover .edu-cgpa-wrap { transform: translateY(-2px); }

        @media (max-width: 680px) {
          .edu-track { padding-left: 28px; }
          .edu-rail { left: 7px; }
          .edu-node { left: -28px; width: 20px; height: 20px; }
          .edu-node-core { width: 6px; height: 6px; }
          .edu-year-bg { font-size: 3.6rem; right: 12px; bottom: -10px; }
          .edu-card {
            display: flex !important; flex-direction: column !important;
            text-align: center; padding: 24px 20px !important; gap: 16px !important;
          }
          .edu-info { display: flex; flex-direction: column; align-items: center; }
        }
      `}</style>
    </section>
  );
}

