import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA, type ExperienceItem } from '../data/portfolioData';
import { hashTechHue } from '../utils/techColor';
import { MapPinIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

function ExpWebsiteChip({ url }: { url: string }) {
  let host = '';
  try {
    host = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    host = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || url;
  }

  const [typed, setTyped] = useState('');
  const timerRef = useRef<number>(0);

  const startTyping = () => {
    window.clearInterval(timerRef.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(host);
      return;
    }
    let idx = 0;
    setTyped('');
    timerRef.current = window.setInterval(() => {
      idx += 1;
      setTyped(host.slice(0, idx));
      if (idx >= host.length) {
        window.clearInterval(timerRef.current);
      }
    }, 36);
  };

  const stopTyping = () => {
    window.clearInterval(timerRef.current);
    setTyped('');
  };

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="exp-site"
      title={`Visit ${host}`}
      aria-label={`Visit website: ${host}`}
      onMouseEnter={startTyping}
      onMouseLeave={stopTyping}
      onFocus={startTyping}
      onBlur={stopTyping}
    >
      <span className="exp-site-ico" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" />
          <ellipse className="exp-globe-m exp-globe-m1" cx="12" cy="12" rx="4.2" ry="9" />
          <ellipse className="exp-globe-m exp-globe-m2" cx="12" cy="12" rx="4.2" ry="9" />
          <path d="M3.4 9h17.2M3.4 15h17.2" />
        </svg>
        <i className="exp-site-live" />
      </span>
      <span className="exp-site-label">Website</span>
      <span className="exp-site-host" aria-hidden="true">
        {typed}
        <i className="exp-site-caret" />
      </span>
    </a>
  );
}

function parseResponsibilityBullet(raw: string): { nodes: React.ReactNode; urls: string[] } {
  const urls: string[] = [];
  const urlRe = /(https?:\/\/[^\s,)]+)/g;
  const parts = raw.split(urlRe);
  const nodes = parts.map((part, idx) => {
    if (/^https?:\/\//i.test(part)) {
      const cleanUrl = part.replace(/\.$/, '');
      if (!urls.includes(cleanUrl)) urls.push(cleanUrl);
      const cleanHost = cleanUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      const trailingDot = part.endsWith('.') ? '.' : '';
      return (
        <React.Fragment key={idx}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent)',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            {cleanHost}
          </a>
          {trailingDot}
        </React.Fragment>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });

  return { nodes, urls };
}

function ExpCardItem({ exp, idx }: { exp: ExperienceItem; idx: number }) {
  const revealRef = useReveal<HTMLDivElement>();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty(
      '--rx',
      `${((0.5 - (e.clientY - r.top) / r.height) * 2.4).toFixed(2)}deg`
    );
    el.style.setProperty(
      '--ry',
      `${(((e.clientX - r.left) / r.width - 0.5) * 3).toFixed(2)}deg`
    );
  };

  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={revealRef}
      style={{ position: 'relative', '--i': idx } as React.CSSProperties}
      className="exp-card-container"
    >
      <span className="exp-connector" aria-hidden="true" />
      <div
        style={{ position: 'absolute', left: 0, top: 8 }}
        className={`timeline-dot ${idx === 0 ? 'active' : ''} exp-timeline-dot`}
      />

      <div
        className="card edu-card exp-card"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <span className="exp-ring" aria-hidden="true" />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 18,
          }}
        >
          <div>
            <h3 className="exp-title" style={{ fontWeight: 700 }}>
              {exp.role}
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                marginTop: 6,
              }}
            >
              {exp.url ? (
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="exp-company"
                  style={{
                    color: 'var(--accent)',
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    display: 'inline-block',
                    textDecoration: 'none',
                  }}
                >
                  {exp.company}
                </a>
              ) : (
                <span
                  className="exp-company"
                  style={{
                    color: 'var(--accent)',
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    display: 'inline-block',
                  }}
                >
                  {exp.company}
                </span>
              )}
              {exp.url && <ExpWebsiteChip url={exp.url} />}
            </div>
          </div>

          <span
            className="exp-date"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text)',
              borderRadius: 50,
              fontWeight: 700,
              letterSpacing: '0.02em',
              background: 'var(--surface2)',
            }}
          >
            {exp.date}
          </span>
        </div>

        {exp.location && (
          <div
            className="exp-location"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text)',
              opacity: 0.75,
              marginBottom: 24,
            }}
          >
            <MapPinIcon size={16} /> {exp.location}
          </div>
        )}

        <ul
          className="exp-list"
          style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {exp.desc.map((bullet, bi) => {
            const parsed = parseResponsibilityBullet(bullet);
            return (
              <li
                key={bi}
                className="exp-li"
                style={
                  {
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    color: 'var(--text)',
                    opacity: 0.9,
                    lineHeight: 1.65,
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    '--k': bi,
                  } as React.CSSProperties
                }
              >
                <span className="exp-bullet" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </span>
                <span style={{ flex: 1 }}>
                  {parsed.nodes}
                  {parsed.urls.length > 0 && (
                    <span className="exp-resp-links">
                      {parsed.urls.map((u) => (
                        <ExpWebsiteChip key={u} url={u} />
                      ))}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {exp.tech && exp.tech.length > 0 && (
          <div className="exp-stack">
            <div className="exp-stack-title">
              <span>Tech stack</span>
            </div>
            <div className="exp-stack-list">
              {exp.tech.map((tech, ti) => (
                <span
                  key={tech}
                  className="exp-chip"
                  style={
                    {
                      '--t': ti,
                      '--h': hashTechHue(tech),
                    } as React.CSSProperties
                  }
                >
                  <i aria-hidden="true" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Experience() {
  const wrapRevealRef = useReveal<HTMLDivElement>();
  const listWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listWrapRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.62;
      const fill = reduced
        ? r.height
        : Math.min(Math.max(triggerY - r.top - 19, 0), Math.max(r.height - 19, 0));

      el.style.setProperty('--fill', `${fill}px`);
      el.querySelectorAll<HTMLElement>('.exp-card-container').forEach((cardEl) => {
        const dot = cardEl.querySelector<HTMLElement>('.exp-timeline-dot');
        if (!dot) return;
        const dr = dot.getBoundingClientRect();
        cardEl.classList.toggle('reached', reduced || dr.top + dr.height / 2 < triggerY);
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(el);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="experience" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <SectionHeader label="Career" title="Experience" />

        <div ref={wrapRevealRef} className="reveal">
          <div
            ref={listWrapRef}
            className="exp-list-wrap"
            style={{
              maxWidth: 1120,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 36,
              position: 'relative',
            }}
          >
            <span className="exp-rail" aria-hidden="true" />
            {PORTFOLIO_DATA.experience.map((exp, idx) => (
              <ExpCardItem key={exp.id} exp={exp} idx={idx} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .exp-card-container { padding-left: 64px; }
        .exp-card { padding: 40px 48px; }
        .exp-title { font-size: 1.45rem; }
        .exp-company { font-size: 1.15rem; }
        .exp-date { font-size: 0.85rem; padding: 8px 18px; font-family: 'Syne', sans-serif; letter-spacing: 0.05em; }
        .exp-location { font-size: 1rem; }
        .exp-list { gap: 24px; --lg: 24px; }
        .exp-list li { font-size: 1.05rem; }

        .exp-resp-links {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-left: 8px;
          vertical-align: middle;
        }

        @keyframes expGlobeSpin { 0% { transform: scaleX(1); } 50% { transform: scaleX(.04); } 100% { transform: scaleX(1); } }
        @keyframes expLiveDot { 0% { transform: scale(1); opacity: .6; } 70%, 100% { transform: scale(2.6); opacity: 0; } }
        @keyframes expSiteBob { 0%, 100% { translate: 0 0; } 50% { translate: 0 -1.5px; } }
        @keyframes expSiteCaret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

        .exp-site {
          position: relative;
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          gap: 6px;
          height: 24px;
          padding: 2px 10px 2px 3px;
          border-radius: 999px;
          text-decoration: none;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 9%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          top: -1px;
          transition: background-color .25s ease, border-color .25s ease, box-shadow .3s ease, transform .3s cubic-bezier(.34, 1.56, .64, 1);
        }
        .exp-site-ico {
          position: relative;
          width: 19px;
          height: 19px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #fff;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--accent) 80%, transparent);
          animation: expSiteBob 3.2s ease-in-out infinite;
        }
        .exp-site-ico svg { width: 13px; height: 13px; overflow: visible; }
        .exp-globe-m { transform-box: fill-box; transform-origin: center; animation: expGlobeSpin 3.4s ease-in-out infinite; }
        .exp-globe-m2 { animation-delay: -1.7s; }
        .exp-site:hover .exp-globe-m { animation-duration: 1.2s; }
        .exp-site-live {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 1.5px var(--surface), 0 0 6px #22c55e;
        }
        .exp-site-live::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #22c55e;
          animation: expLiveDot 2s ease-out infinite;
        }
        .exp-site-label {
          font-family: 'Syne', sans-serif;
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .04em;
          line-height: 1;
        }
        .exp-site-host {
          position: absolute;
          left: 0;
          bottom: calc(100% + 9px);
          min-width: 12px;
          padding: 5px 10px;
          border-radius: 8px;
          background: var(--text);
          color: var(--bg);
          font-family: 'Syne', sans-serif;
          font-size: .72rem;
          font-weight: 700;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transform: translateY(5px) scale(.94);
          transform-origin: left bottom;
          transition: opacity .2s ease, transform .3s cubic-bezier(.34, 1.56, .64, 1);
          z-index: 5;
        }
        .exp-site-caret { display: inline-block; width: 1.5px; height: .95em; margin-left: 2px; vertical-align: -.12em; background: currentColor; animation: expSiteCaret .8s steps(1) infinite; }
        .exp-site:hover, .exp-site:focus-visible {
          background: color-mix(in srgb, var(--accent) 17%, transparent);
          border-color: var(--accent);
          box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--accent) 75%, transparent);
          transform: translateY(-2px);
        }
        .exp-site:hover .exp-site-host, .exp-site:focus-visible .exp-site-host { opacity: 1; transform: none; }
        .exp-card-container:not(.visible) .exp-site-ico, .exp-card-container:not(.visible) .exp-globe-m, .exp-card-container:not(.visible) .exp-site-live::after { animation-play-state: paused; }
        @media (hover: none) { .exp-site-host { display: none; } }

        @keyframes expIn { from { opacity: 0; transform: perspective(900px) translateY(54px) rotateX(9deg); filter: blur(8px); } to { opacity: 1; transform: none; filter: blur(0); } }
        @keyframes expLi { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
        @keyframes expTag { from { opacity: 0; transform: translateY(10px) scale(.8); } to { opacity: 1; transform: none; } }
        @keyframes expRing { 0% { transform: scale(1); opacity: .55; } 70%, 100% { transform: scale(2.6); opacity: 0; } }
        @keyframes expDate { from { opacity: 0; transform: translateX(30px) scale(.9); } to { opacity: 1; transform: none; } }
        @keyframes expTitle { from { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(-12px); } to { clip-path: inset(0 -10% 0 0); opacity: 1; transform: none; } }
        @keyframes expFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes expSpark { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.5); } }

        .exp-rail {
          position: absolute;
          left: 6px;
          top: 19px;
          bottom: 0;
          width: 2px;
          border-radius: 2px;
          background: color-mix(in srgb, var(--border) 85%, transparent);
          pointer-events: none;
        }
        .exp-rail::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: var(--fill, 0px);
          border-radius: 2px;
          background: linear-gradient(to bottom, var(--accent), var(--accent2));
          box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 65%, transparent);
          transition: height .25s ease-out;
        }
        .exp-rail::before {
          content: '';
          position: absolute;
          left: 50%;
          top: var(--fill, 0px);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent2);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent2) 25%, transparent), 0 0 18px var(--accent2);
          transform: translate(-50%, -50%);
          transition: top .25s ease-out;
          animation: expSpark 1.8s ease-in-out infinite;
          z-index: 2;
        }

        .exp-card-container:not(.visible) .exp-card { opacity: 0; transform: translateY(54px); }
        .exp-card-container.visible .exp-card {
          opacity: 1;
          animation: expIn 1s cubic-bezier(.2, .8, .2, 1) backwards;
          animation-delay: .1s;
        }
        .exp-card {
          --rx: 0deg;
          --ry: 0deg;
          position: relative;
          overflow: hidden;
          transition: transform .3s ease-out, box-shadow .4s ease, border-color .4s ease;
        }
        .exp-card > * { position: relative; z-index: 1; }
        .exp-card-container.visible .exp-card:hover {
          transform: perspective(1200px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-5px);
          border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
        }

        .exp-card-container:not(.visible) .exp-title,
        .exp-card-container:not(.visible) .exp-date,
        .exp-card-container:not(.visible) .exp-location { opacity: 0; }
        .exp-card-container.visible .exp-title { animation: expTitle .8s cubic-bezier(.2, .8, .2, 1) .3s backwards; }
        .exp-card-container.visible .exp-company { animation: expFade .6s cubic-bezier(.2, .8, .2, 1) .42s backwards; }
        .exp-card-container.visible .exp-date { animation: expDate .7s cubic-bezier(.34, 1.4, .64, 1) .38s backwards; }
        .exp-card-container.visible .exp-location { animation: expFade .6s cubic-bezier(.2, .8, .2, 1) .5s backwards; }

        .exp-card-container .exp-timeline-dot {
          position: relative;
          scale: 1;
          background: var(--surface2);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--border) 85%, transparent);
          transition: scale .6s cubic-bezier(.34, 1.56, .64, 1) .1s, background-color .5s ease, box-shadow .5s ease;
        }
        .exp-card-container.reached .exp-timeline-dot {
          background: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 28%, transparent), 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent);
        }
        .exp-card-container:not(.visible) .exp-timeline-dot { scale: 0; }
        .exp-timeline-dot::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          opacity: 0;
          pointer-events: none;
          animation: expRing 3.2s ease-out infinite;
          animation-delay: calc(var(--i, 0) * -0.9s);
        }
        .exp-card-container:not(.reached) .exp-timeline-dot::after { animation-play-state: paused; }

        .exp-connector {
          position: absolute;
          left: 14px;
          top: 18px;
          width: 50px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent2) 30%, transparent));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .7s cubic-bezier(.2, .8, .2, 1) .3s;
        }
        .exp-card-container.visible .exp-connector { transform: scaleX(1); }

        .exp-card > .exp-ring {
          position: absolute;
          inset: 0;
          z-index: 3;
          border-radius: inherit;
          padding: 1.5px;
          pointer-events: none;
          background: conic-gradient(from var(--sa), transparent 0deg, transparent 280deg, var(--accent2) 330deg, var(--accent) 350deg, transparent 360deg);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
          opacity: 0;
          transition: opacity .4s ease;
          animation: serviceOrbit 5s linear infinite;
        }
        .exp-card:hover > .exp-ring { opacity: 1; }

        .exp-card::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity .4s ease;
          background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--accent) 13%, transparent), transparent 65%);
        }
        .exp-card:hover::before { opacity: 1; }
        .exp-card::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 28%;
          pointer-events: none;
          opacity: 0;
          transform: translateX(-160%) skewX(-20deg);
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 12%, transparent), transparent);
        }
        .exp-card:hover::after { animation: contactSheen 1.1s ease; }

        .exp-card-container:not(.visible) .exp-list li { opacity: 0; transform: translateX(-24px); }
        .exp-card-container.visible .exp-list li {
          animation: expLi .65s cubic-bezier(.2, .8, .2, 1) backwards;
          animation-delay: calc(var(--k, 0) * 110ms + 600ms);
        }
        .exp-list li { position: relative; transition: transform .3s cubic-bezier(.2, .8, .2, 1); }
        .exp-list li > * { position: relative; z-index: 1; }
        .exp-list li::before {
          content: '';
          position: absolute;
          inset: -6px -12px;
          border-radius: 12px;
          pointer-events: none;
          opacity: 0;
          transition: opacity .3s ease;
          background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 11%, transparent), transparent 85%);
        }
        .exp-card-container.visible .exp-list li:hover { transform: translateX(6px); }
        .exp-list li:hover::before { opacity: 1; }

        @keyframes expPing { 0% { transform: scale(1); opacity: .55; } 70%, 100% { transform: scale(2.1); opacity: 0; } }
        @keyframes expNudge { 0%, 100% { transform: translateX(-.5px); } 50% { transform: translateX(1.5px); } }
        .exp-bullet {
          position: relative;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          margin-top: 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          color: #fff;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          box-shadow: 0 4px 12px -3px color-mix(in srgb, var(--accent) 70%, transparent);
          transition: transform .4s cubic-bezier(.34, 1.56, .64, 1), border-radius .4s ease, box-shadow .3s ease;
        }
        .exp-bullet svg { animation: expNudge 2.2s ease-in-out infinite; animation-delay: calc(var(--k, 0) * -.45s); }
        .exp-bullet::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 1.5px solid var(--accent2);
          opacity: 0;
          animation: expPing 3s ease-out infinite;
          animation-delay: calc(var(--k, 0) * -.7s);
        }
        .exp-list li:hover .exp-bullet { transform: scale(1.18) rotate(90deg); border-radius: 50%; box-shadow: 0 6px 16px -3px color-mix(in srgb, var(--accent2) 80%, transparent); }
        .exp-list li:hover .exp-bullet svg { animation-duration: .8s; }
        .exp-card-container:not(.visible) .exp-bullet, .exp-card-container:not(.visible) .exp-bullet::before, .exp-card-container:not(.visible) .exp-bullet svg { animation-play-state: paused; }
        .exp-card-container:not(.visible) .exp-bullet { scale: 0; }
        .exp-bullet { scale: 1; transition-property: transform, border-radius, box-shadow, scale; }
        .exp-card-container.visible .exp-bullet { transition-delay: 0s, 0s, 0s, calc(var(--k, 0) * 110ms + 650ms); }
        .exp-list li:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 9px;
          top: 26px;
          bottom: calc(var(--lg, 24px) * -1 + 5px);
          width: 2px;
          border-radius: 2px;
          background: linear-gradient(to bottom, color-mix(in srgb, var(--accent) 55%, transparent), transparent);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform .8s cubic-bezier(.2, .8, .2, 1);
          transition-delay: calc(var(--k, 0) * 110ms + 900ms);
          pointer-events: none;
        }
        .exp-card-container.visible .exp-list li:not(:last-child)::after { transform: scaleY(1); }

        @keyframes expChipShine { 0%, 62% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }
        .exp-stack { margin-top: 30px; padding-top: 20px; position: relative; }
        .exp-stack::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 55%, transparent), var(--border) 40%, transparent);
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 1s cubic-bezier(.2, .8, .2, 1) .9s;
        }
        .exp-card-container.visible .exp-stack::before { transform: scaleX(1); }
        .exp-stack-title { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .exp-stack-title span {
          font-family: 'Syne', sans-serif;
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .exp-stack-title::before { content: ''; width: 18px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, var(--accent), var(--accent2)); }
        .exp-stack-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .exp-chip {
          --c: hsl(var(--h) 82% 36%);
          position: relative;
          overflow: hidden;
          isolation: isolate;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 15px 7px 12px;
          border-radius: 999px;
          font-family: 'Syne', sans-serif;
          font-size: .82rem;
          font-weight: 600;
          letter-spacing: .01em;
          color: var(--c);
          background: color-mix(in srgb, var(--c) 9%, var(--surface));
          border: 1px solid color-mix(in srgb, var(--c) 32%, transparent);
          transition: transform .3s cubic-bezier(.34, 1.56, .64, 1), box-shadow .3s ease, background-color .3s ease, color .3s ease, border-color .3s ease;
        }
        :root.dark .exp-chip { --c: hsl(var(--h) 90% 72%); }
        .exp-chip i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--c);
          box-shadow: 0 0 8px var(--c);
          transition: transform .3s cubic-bezier(.34, 1.56, .64, 1);
        }
        .exp-chip::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(105deg, transparent 38%, color-mix(in srgb, var(--c) 28%, transparent) 50%, transparent 62%);
          transform: translateX(-130%);
          animation: expChipShine 6s ease-in-out infinite;
          animation-delay: calc(var(--t, 0) * .5s + 2s);
        }
        .exp-card-container:not(.visible) .exp-chip { opacity: 0; }
        .exp-card-container:not(.visible) .exp-chip::after { animation-play-state: paused; }
        .exp-card-container.visible .exp-chip {
          animation: expTag .55s cubic-bezier(.34, 1.56, .64, 1) backwards;
          animation-delay: calc(var(--t, 0) * 65ms + 1100ms);
        }
        .exp-card-container.visible .exp-chip:hover {
          transform: translateY(-3px) scale(1.04);
          color: #fff;
          background: var(--c);
          border-color: var(--c);
          box-shadow: 0 10px 22px -8px var(--c);
        }
        :root.dark .exp-card-container.visible .exp-chip:hover { color: #0b1220; }
        .exp-chip:hover i { transform: scale(1.5); background: currentColor; box-shadow: none; }

        .exp-date { transition: transform .3s cubic-bezier(.34, 1.56, .64, 1), border-color .3s ease; }
        .exp-card:hover .exp-date { transform: scale(1.05); border-color: var(--accent) !important; }
        .exp-company { position: relative; }
        .exp-company::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .4s cubic-bezier(.2, .8, .2, 1);
        }
        .exp-company:hover::after { transform: scaleX(1); }

        @media (prefers-reduced-motion: reduce) {
          .exp-card-container .exp-card, .exp-card-container .exp-list li, .exp-card-container .exp-chip,
          .exp-card-container .exp-title, .exp-card-container .exp-date, .exp-card-container .exp-location { opacity: 1 !important; transform: none !important; animation: none !important; filter: none !important; clip-path: none !important; }
          .exp-connector { transform: none; transition: none; }
          .exp-card-container .exp-timeline-dot { scale: 1 !important; transition: none; }
          .exp-timeline-dot::after, .exp-rail::before, .exp-card > .exp-ring, .exp-bullet::before, .exp-bullet svg, .exp-chip::after, .exp-site-ico, .exp-globe-m, .exp-site-live::after, .exp-site-caret { animation: none; }
          .exp-card-container .exp-bullet { scale: 1 !important; }
          .exp-list li::after, .exp-stack::before { transform: none !important; transition: none; }
        }

        @media(max-width: 768px) {
          .exp-list-wrap { gap: 14px !important; }
          .exp-card-container { padding-left: 26px; }
          .exp-rail { left: 3px; }
          .exp-connector { width: 14px; left: 11px; top: 17px; }
          .exp-timeline-dot { left: -2px !important; width: 11px; height: 11px; }

          .exp-card.card { padding: 16px 16px 14px !important; border-radius: 16px; }
          .exp-card > div:first-of-type { gap: 8px 12px !important; margin-bottom: 10px !important; }
          .exp-title { font-size: 1.05rem; line-height: 1.25; }
          .exp-company { font-size: .88rem; margin-top: 3px !important; line-height: 1.3; }
          .exp-date { font-size: .68rem; padding: 4px 11px; }
          .exp-location { font-size: .76rem; margin-bottom: 12px !important; gap: 5px !important; }
          .exp-location svg { width: 13px; height: 13px; }
          .exp-list { gap: 16px; --lg: 16px; }
          .exp-list li { font-size: .84rem; line-height: 1.55 !important; gap: 8px !important; }
          .exp-bullet { width: 17px; height: 17px; border-radius: 6px; margin-top: 2px; }
          .exp-bullet svg { width: 8px; height: 8px; }
          .exp-list li:not(:last-child)::after { left: 7.5px; top: 22px; }
          .exp-resp-links { margin-left: 5px; }
          .exp-site { height: 22px; padding-right: 8px; gap: 5px; }
          .exp-site-ico { width: 17px; height: 17px; }
          .exp-site-ico svg { width: 12px; height: 12px; }
          .exp-site-label { font-size: .64rem; }
          .exp-stack { margin-top: 18px; padding-top: 14px; }
          .exp-stack-title { margin-bottom: 10px; }
          .exp-stack-title span { font-size: .62rem; }
          .exp-stack-list { gap: 7px; }
          .exp-chip { font-size: .7rem; padding: 5px 11px 5px 9px; gap: 6px; }
          .exp-chip i { width: 6px; height: 6px; }
        }
      `}</style>
    </section>
  );
}
