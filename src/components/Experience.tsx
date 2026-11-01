import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA, type ExperienceItem } from '../data/portfolioData';
import { techColor } from '../utils/techColor';
import { ExternalLinkIcon, GlobeIcon, MapPinIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

const EXP_ACCENTS = ['var(--accent)', 'var(--accent2)', '#10b981', '#f59e0b'];

function renderTextWithLinks(text: string) {
  const urlRe = /(https?:\/\/[^\s,)]+)/g;
  const parts = text.split(urlRe);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const cleanLabel = part.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--ec, var(--accent))',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          {cleanLabel}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function DomainTypingChip({ url }: { url: string }) {
  let domain = url;
  try {
    domain = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    domain = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || url;
  }

  const [typed, setTyped] = useState('');
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setTyped(hovered ? domain : '');
      return;
    }

    if (hovered) {
      let i = typed.length;
      const step = () => {
        if (i < domain.length) {
          i += 1;
          setTyped(domain.slice(0, i));
          timerRef.current = window.setTimeout(step, 34);
        }
      };
      timerRef.current = window.setTimeout(step, 55);
    } else if (typed.length > 0) {
      let i = typed.length;
      const erase = () => {
        if (i > 0) {
          i -= 1;
          setTyped(domain.slice(0, i));
          timerRef.current = window.setTimeout(erase, 16);
        }
      };
      erase();
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [hovered, domain]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${domain}`}
      className={`exp-link${hovered ? ' is-open' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <GlobeIcon size={14} className="exp-link-globe" />
      <span className="exp-link-label">Website</span>
      {typed.length > 0 && (
        <span className="exp-link-host mono" aria-hidden="true">
          <span className="exp-link-sep">·</span>
          {typed}
          {hovered && typed.length < domain.length && <span className="exp-link-caret" />}
        </span>
      )}
      <ExternalLinkIcon size={12} />
    </a>
  );
}

function ExpCard({ item, index }: { item: ExperienceItem; index: number }) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const accent = EXP_ACCENTS[index % EXP_ACCENTS.length];
  const isPresent = /present|current/i.test(item.date);
  const watermark = isPresent
    ? 'NOW'
    : String(item.date).match(/\d{4}/g)?.[0] ?? '';

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
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
    el.style.setProperty('--rx', `${((y / r.height - 0.5) * -4).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 4.5).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={rowRef}
      style={{ '--ec': accent } as React.CSSProperties}
      className={`exp-row reveal d${Math.min(index + 1, 5)}${visible ? ' is-in' : ''}`}
    >
      <span className="exp-node" aria-hidden="true">
        <span className="exp-node-core" />
        {isPresent && <span className="exp-node-ping" />}
      </span>

      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="card exp-card"
        style={{ padding: '32px 34px' }}
      >
        {watermark && (
          <span className="syne exp-watermark" aria-hidden="true">
            {watermark}
          </span>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: 18,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div>
            <h3
              className="syne exp-role"
              style={{ fontWeight: 700, fontSize: '1.22rem', marginBottom: 6 }}
            >
              {item.role}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ color: accent, fontWeight: 700, fontSize: '.98rem' }}>
                {item.company}
              </span>
              {item.url && <DomainTypingChip url={item.url} />}
            </div>
          </div>

          <div className="exp-meta" style={{ textAlign: 'right' }}>
            <div className="exp-date">
              {isPresent && <span className="exp-live-dot" aria-hidden="true" />}
              <span>{item.date}</span>
            </div>
            {item.location && (
              <div
                className="exp-loc"
                style={{
                  color: 'var(--text3)',
                  fontSize: '.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 4,
                  marginTop: 6,
                }}
              >
                <MapPinIcon size={13} /> {item.location}
              </div>
            )}
          </div>
        </div>

        <ul
          style={{
            padding: 0,
            margin: '0 0 22px 0',
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {item.desc.map((bullet, bi) => (
            <li
              key={bi}
              className="exp-bullet"
              style={{ '--bi': bi } as React.CSSProperties}
            >
              <span className="exp-chev" aria-hidden="true" />
              <span>{renderTextWithLinks(bullet)}</span>
            </li>
          ))}
        </ul>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 7,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {item.tech.map((t, ti) => (
            <span
              key={t}
              className="exp-chip"
              style={
                {
                  '--ti': ti,
                  '--tc': techColor(t),
                } as React.CSSProperties
              }
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  const revealRef = useReveal();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
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
      id="experience"
      ref={revealRef}
      style={{
        padding: 'var(--section-py) 24px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionHeader
          label="Career Path"
          title="Work Experience"
          sub="7+ years delivering enterprise web systems, AI platforms, and cybersecurity solutions across Bangladesh and Australia"
        />

        <div ref={trackRef} className="exp-track">
          <span className="exp-rail" aria-hidden="true">
            <span ref={fillRef} className="exp-rail-fill" />
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {PORTFOLIO_DATA.experience.map((item, idx) => (
              <ExpCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .exp-track { position: relative; padding-left: 42px; }
        .exp-rail {
          position: absolute; left: 12px; top: 34px; bottom: 34px;
          width: 2px; border-radius: 2px; background: var(--border); overflow: hidden;
        }
        .exp-rail-fill {
          display: block; width: 100%; height: 100%;
          background: linear-gradient(180deg, var(--accent), var(--accent2), #10b981);
          transform-origin: top; transform: scaleY(0);
          transition: transform .18s ease-out;
          box-shadow: 0 0 12px var(--accent);
        }
        .exp-row { position: relative; }
        .exp-node {
          position: absolute; left: -42px; top: 36px;
          width: 26px; height: 26px; border-radius: 50%;
          background: var(--bg); border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          z-index: 2;
          transition: border-color .4s ease, box-shadow .4s ease, transform .4s cubic-bezier(.2, 1.4, .3, 1);
        }
        .exp-node-core {
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--border2);
          transition: background .4s ease, transform .4s cubic-bezier(.2, 1.4, .3, 1);
        }
        .exp-row.is-in .exp-node {
          border-color: var(--ec);
          box-shadow: 0 0 0 5px color-mix(in srgb, var(--ec) 16%, transparent);
        }
        .exp-row.is-in .exp-node-core { background: var(--ec); transform: scale(1.1); }
        .exp-row:hover .exp-node { transform: scale(1.15); }
        .exp-node-ping {
          position: absolute; inset: -3px; border-radius: 50%;
          border: 2px solid var(--ec); opacity: 0;
          animation: expPing 2.2s cubic-bezier(.2, .8, .2, 1) infinite;
        }
        @keyframes expPing {
          0%   { transform: scale(.9);  opacity: .75; }
          100% { transform: scale(1.75); opacity: 0; }
        }

        .exp-card {
          position: relative; overflow: hidden;
          transform: perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform .25s cubic-bezier(.2, .8, .2, 1), border-color .3s ease, box-shadow .32s ease;
          will-change: transform;
        }
        .exp-card::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(460px circle at var(--mx, 50%) var(--my, 35%),
            color-mix(in srgb, var(--ec) 13%, transparent), transparent 68%);
          opacity: 0; pointer-events: none; transition: opacity .3s ease;
        }
        .exp-card::after {
          content: ''; position: absolute; left: 0; top: 16%; bottom: 16%;
          width: 3px; border-radius: 0 3px 3px 0; background: var(--ec);
          transform: scaleY(.35); opacity: .55;
          transition: transform .36s cubic-bezier(.2, .8, .2, 1), opacity .32s ease, top .36s ease, bottom .36s ease;
        }
        .exp-card:hover {
          border-color: color-mix(in srgb, var(--ec) 52%, var(--border));
          box-shadow: 0 22px 46px -18px color-mix(in srgb, var(--ec) 34%, transparent);
        }
        .exp-card:hover::before { opacity: 1; }
        .exp-card:hover::after { top: 8%; bottom: 8%; transform: scaleY(1); opacity: 1; }

        .exp-watermark {
          position: absolute; right: 22px; bottom: -16px;
          font-size: 5rem; font-weight: 800; line-height: 1; letter-spacing: -.04em;
          color: var(--ec); opacity: .05; pointer-events: none; user-select: none;
          transition: opacity .35s ease, transform .45s cubic-bezier(.2, .8, .2, 1);
        }
        .exp-card:hover .exp-watermark { opacity: .1; transform: translateY(-4px) scale(1.03); }

        .exp-role { transition: color .25s ease; }
        .exp-card:hover .exp-role { color: var(--ec); }

        .exp-link {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 6px;
          font-size: .78rem; font-weight: 600; color: var(--ec);
          padding: 4px 11px 4px 9px; border-radius: 999px;
          background: color-mix(in srgb, var(--ec) 9%, var(--bg3));
          border: 1px solid color-mix(in srgb, var(--ec) 28%, var(--border));
          box-shadow: 0 2px 10px -4px color-mix(in srgb, var(--ec) 35%, transparent);
          transition: color .25s ease, background .28s ease, border-color .28s ease,
                      transform .3s cubic-bezier(.2, 1.4, .3, 1), box-shadow .3s ease;
        }
        .exp-link:hover, .exp-link.is-open {
          color: #fff;
          background: var(--ec);
          border-color: var(--ec);
          transform: translateY(-2px);
          box-shadow: 0 10px 22px -6px color-mix(in srgb, var(--ec) 65%, transparent);
        }
        .exp-link-globe { flex-shrink: 0; transition: transform .65s cubic-bezier(.22, 1, .36, 1); }
        .exp-link:hover .exp-link-globe, .exp-link.is-open .exp-link-globe { transform: rotate(360deg); }
        .exp-link-host { font-size: .74rem; font-weight: 500; opacity: .94; display: inline-flex; align-items: center; white-space: nowrap; }
        .exp-link-sep { margin: 0 5px 0 1px; opacity: .6; }
        .exp-link-caret {
          display: inline-block; width: 1.5px; height: .85em; margin-left: 2px;
          background: currentColor; animation: expCaret .7s steps(2) infinite;
        }
        @keyframes expCaret { 50% { opacity: 0; } }

        .exp-date {
          display: inline-flex; align-items: center; gap: 7px;
          font-weight: 700; font-size: .82rem; color: var(--ec);
          background: color-mix(in srgb, var(--ec) 11%, transparent);
          border: 1px solid color-mix(in srgb, var(--ec) 26%, transparent);
          padding: 5px 13px; border-radius: 999px;
        }
        .exp-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, .22);
          animation: expLiveBlink 1.8s ease-in-out infinite;
        }
        @keyframes expLiveBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: .45; transform: scale(.85); }
        }

        .exp-bullet {
          position: relative; padding-left: 20px;
          color: var(--text2); font-size: .92rem; line-height: 1.72;
          opacity: 0; transform: translateX(-8px);
          transition: opacity .45s ease, transform .45s cubic-bezier(.2, .8, .2, 1), color .25s ease;
          transition-delay: calc(var(--bi, 0) * 70ms + 120ms);
        }
        .exp-row.is-in .exp-bullet { opacity: 1; transform: translateX(0); }
        .exp-bullet:hover { color: var(--text); }
        .exp-chev {
          position: absolute; left: 2px; top: .62em;
          width: 7px; height: 7px;
          border-right: 2px solid var(--ec); border-top: 2px solid var(--ec);
          transform: rotate(45deg);
          transition: transform .28s cubic-bezier(.2, 1.4, .3, 1);
        }
        .exp-bullet:hover .exp-chev { transform: translateX(3px) rotate(45deg); }

        .exp-chip {
          font-size: .74rem; font-weight: 600;
          padding: 4px 11px; border-radius: 999px;
          background: color-mix(in srgb, var(--tc) 13%, var(--bg3));
          color: var(--tc);
          border: 1px solid color-mix(in srgb, var(--tc) 34%, transparent);
          opacity: 0; transform: translateY(6px) scale(.94);
          transition:
            opacity .38s ease calc(var(--ti, 0) * 35ms + 240ms),
            transform .28s cubic-bezier(.2, 1.4, .3, 1),
            background .25s ease, border-color .25s ease, color .25s ease, box-shadow .25s ease;
        }
        .exp-row.is-in .exp-chip { opacity: 1; transform: translateY(0) scale(1); }
        .exp-chip:hover {
          transform: translateY(-2px) scale(1.04);
          background: color-mix(in srgb, var(--tc) 22%, var(--bg3));
          border-color: color-mix(in srgb, var(--tc) 62%, transparent);
          box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--tc) 55%, transparent);
        }

        @media (max-width: 640px) {
          .exp-track { padding-left: 28px; }
          .exp-rail { left: 8px; }
          .exp-node { left: -28px; top: 28px; width: 20px; height: 20px; }
          .exp-node-core { width: 7px; height: 7px; }
          .exp-card { padding: 24px 20px !important; }
          .exp-meta { text-align: left !important; }
          .exp-loc { justify-content: flex-start !important; }
          .exp-watermark { font-size: 3.6rem; right: 14px; bottom: -10px; }
        }
      `}</style>
    </section>
  );
}

