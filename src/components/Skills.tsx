import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA, type SkillCategory } from '../data/portfolioData';
import { SectionHeader, useReveal } from './SectionHeader';

const SKILL_TABS: { key: 'all' | SkillCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'programming', label: 'Programming' },
  { key: 'web', label: 'Web & Full-Stack' },
  { key: 'ai', label: 'AI & Agents' },
  { key: 'database', label: 'Databases & CRM' },
  { key: 'design', label: 'Design & Media' },
  { key: 'tools', label: 'Tools & Security' },
];

export function Skills() {
  const [cat, setCat] = useState<'all' | SkillCategory>('all');
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  const [sweepKey, setSweepKey] = useState(0);
  const [brokenIcons, setBrokenIcons] = useState<Record<string, boolean>>({});

  const revealRef = useReveal();
  const barRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const stageRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());
  const firstRenderRef = useRef(true);

  const filtered =
    cat === 'all' ? PORTFOLIO_DATA.skills : PORTFOLIO_DATA.skills.filter((s) => s.cat === cat);

  useEffect(() => {
    const syncPill = () => {
      const bar = barRef.current;
      const btn = tabRefs.current[cat];
      if (!bar || !btn) return;
      const br = bar.getBoundingClientRect();
      const tr = btn.getBoundingClientRect();
      if (tr.width === 0) return;
      setPill({ x: tr.left - br.left, w: tr.width, ready: true });
    };
    syncPill();
    document.fonts?.ready?.then(syncPill);
    window.addEventListener('resize', syncPill);
    return () => window.removeEventListener('resize', syncPill);
  }, [cat]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>('.skill-tile'));
    const nextRects = new Map<string, DOMRect>();
    tiles.forEach((el) => {
      if (el.dataset.skill) nextRects.set(el.dataset.skill, el.getBoundingClientRect());
    });

    if (firstRenderRef.current || reduced) {
      firstRenderRef.current = false;
      prevRectsRef.current = nextRects;
      return;
    }

    const prevRects = prevRectsRef.current;
    let enteredIdx = 0;

    tiles.forEach((el) => {
      const key = el.dataset.skill || '';
      const prev = prevRects.get(key);
      const next = nextRects.get(key);
      if (!next) return;
      el.getAnimations?.().forEach((a) => a.cancel());

      if (prev) {
        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          el.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: 'translate(0, 0)' },
            ],
            { duration: 460, easing: 'cubic-bezier(.22, 1, .36, 1)' }
          );
        }
      } else {
        const delay = Math.min(enteredIdx++, 16) * 24;
        el.animate(
          [
            { opacity: 0, transform: 'scale(.72) translateY(14px)' },
            { opacity: 1, transform: 'scale(1) translateY(0)' },
          ],
          { duration: 400, delay, easing: 'cubic-bezier(.2, 1.25, .3, 1)', fill: 'backwards' }
        );
      }
    });

    prevRectsRef.current = nextRects;
  }, [cat]);

  const onStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  const onTileMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--tx', `${x}px`);
    el.style.setProperty('--ty', `${y}px`);
    el.style.setProperty('--rx', `${((y / r.height - 0.5) * -13).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 13).toFixed(2)}deg`);
  };

  const onTileLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const selectTab = (key: 'all' | SkillCategory) => {
    if (key !== cat) {
      setCat(key);
      setSweepKey((n) => n + 1);
    }
  };

  return (
    <section id="skills" ref={revealRef} style={{ padding: 'var(--section-py) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader
          label="Technical Arsenal"
          title="Skills & Technologies"
          sub="Languages, frameworks, AI ecosystems, relational databases, and creative tools I engineer with daily"
        />

        <div className="reveal" style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div ref={barRef} className="pf-bar" onScroll={() => setCat((c) => c)}>
            <span
              aria-hidden="true"
              className="pf-pill"
              style={{
                transform: `translate3d(${pill.x}px, -50%, 0)`,
                width: pill.w,
                opacity: pill.ready ? 1 : 0,
              }}
            />
            {SKILL_TABS.map((t) => {
              const count =
                t.key === 'all'
                  ? PORTFOLIO_DATA.skills.length
                  : PORTFOLIO_DATA.skills.filter((s) => s.cat === t.key).length;
              return (
                <button
                  key={t.key}
                  ref={(el) => {
                    tabRefs.current[t.key] = el;
                  }}
                  onClick={() => selectTab(t.key)}
                  className={`pf-tab${cat === t.key ? ' active' : ''}`}
                >
                  <span>{t.label}</span>
                  <span className="pf-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={stageRef}
          onPointerMove={onStageMove}
          className="skills-stage reveal"
        >
          <div className="skills-spot" aria-hidden="true" />
          {sweepKey > 0 && <div key={sweepKey} className="skills-sweep" aria-hidden="true" />}

          <div
            ref={gridRef}
            className="skills-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))',
              gap: 14,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {filtered.map((sk) => (
              <div
                key={sk.id}
                data-skill={sk.name}
                onPointerMove={onTileMove}
                onPointerLeave={onTileLeave}
                style={{ '--sc': sk.c || 'var(--accent)' } as React.CSSProperties}
                className="skill-tile card"
              >
                <div className="skill-icon-ring">
                  {sk.icon && !brokenIcons[sk.id] ? (
                    <img
                      src={sk.icon}
                      alt={sk.name}
                      className="skill-img"
                      loading="lazy"
                      decoding="async"
                      width={32}
                      height={32}
                      onError={() =>
                        setBrokenIcons((prev) => ({ ...prev, [sk.id]: true }))
                      }
                      style={{ width: 32, height: 32, objectFit: 'contain' }}
                    />
                  ) : (
                    <span
                      className="syne"
                      style={{
                        fontWeight: 800,
                        fontSize: '.78rem',
                        letterSpacing: '.03em',
                        color: sk.c,
                      }}
                    >
                      {sk.badgeText || sk.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="skill-name">{sk.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Git Language Distribution + Personal Strengths & Languages */}
        <div
          className="reveal skills-insights-grid"
          style={{
            marginTop: 28,
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: 20,
          }}
        >
          <div className="card" style={{ padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span
                style={{
                  fontSize: '.76rem',
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}
              >
                Most Used Languages (Git)
              </span>
              <span className="mono" style={{ fontSize: '.75rem', color: 'var(--text3)' }}>
                6 Languages
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                height: 10,
                borderRadius: 999,
                overflow: 'hidden',
                gap: 2,
                marginBottom: 18,
                background: 'var(--bg3)',
              }}
            >
              {PORTFOLIO_DATA.gitLanguages.map((lang) => (
                <div
                  key={lang.name}
                  title={`${lang.name}: ${lang.percent}%`}
                  style={{
                    width: `${lang.percent}%`,
                    background: lang.color,
                    borderRadius: 999,
                  }}
                />
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px 16px',
              }}
            >
              {PORTFOLIO_DATA.gitLanguages.map((lang) => (
                <div
                  key={lang.name}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '.84rem' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--text)' }}>
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        background: lang.color,
                        display: 'inline-block',
                      }}
                    />
                    {lang.name}
                  </span>
                  <span className="mono" style={{ fontSize: '.78rem', color: 'var(--text3)' }}>
                    {lang.percent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div
                style={{
                  fontSize: '.76rem',
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: 10,
                }}
              >
                Personal Summary & Research Interests
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {[...PORTFOLIO_DATA.personalTraits, ...PORTFOLIO_DATA.interests.slice(0, 4)].map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: '.74rem',
                      fontWeight: 600,
                      padding: '4px 11px',
                      borderRadius: 999,
                      background: 'color-mix(in srgb, var(--accent) 9%, var(--bg3))',
                      border: '1px solid color-mix(in srgb, var(--accent) 22%, var(--border))',
                      color: 'var(--text2)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: 12,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text)' }}>
                Language Proficiency:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {PORTFOLIO_DATA.spokenLanguages.map((sp) => (
                  <span
                    key={sp.language}
                    style={{
                      fontSize: '.76rem',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      background: 'rgba(37,99,235,.08)',
                      padding: '4px 11px',
                      borderRadius: 999,
                    }}
                  >
                    {sp.language} — {sp.level}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .skills-stage {
          position: relative;
          border-radius: 22px;
          padding: 18px;
          margin: -18px;
          overflow: hidden;
        }
        .skills-spot {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity .35s ease;
          background: radial-gradient(
            420px circle at var(--gx, 50%) var(--gy, 50%),
            rgba(37, 99, 235, .10),
            rgba(6, 182, 212, .05) 42%,
            transparent 70%
          );
        }
        .skills-stage:hover .skills-spot { opacity: 1; }
        .skills-sweep {
          position: absolute;
          inset: -20% 0;
          pointer-events: none;
          z-index: 2;
          background: linear-gradient(105deg, transparent 38%, rgba(37, 99, 235, .10) 48%, rgba(6, 182, 212, .12) 52%, transparent 62%);
          animation: skillsSweep .65s cubic-bezier(.22, 1, .36, 1) forwards;
        }
        @keyframes skillsSweep {
          from { transform: translateX(-100%); opacity: 1; }
          to   { transform: translateX(100%);  opacity: 0; }
        }
        .skill-tile {
          position: relative;
          padding: 20px 12px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 11px;
          cursor: default;
          overflow: hidden;
          transform: perspective(700px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px));
          transition: transform .22s cubic-bezier(.2, .8, .2, 1), border-color .28s ease, box-shadow .28s ease;
          will-change: transform;
        }
        .skill-tile::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(150px circle at var(--tx, 50%) var(--ty, 30%),
            color-mix(in srgb, var(--sc) 22%, transparent), transparent 72%);
          opacity: 0;
          transition: opacity .28s ease;
          pointer-events: none;
        }
        .skill-tile::after {
          content: '';
          position: absolute;
          left: 24%; right: 24%; bottom: 0;
          height: 2.5px; border-radius: 3px 3px 0 0;
          background: var(--sc);
          transform: scaleX(0); opacity: 0;
          transition: transform .32s cubic-bezier(.2, .8, .2, 1), opacity .28s ease, left .32s ease, right .32s ease;
        }
        .skill-tile:hover {
          --lift: -5px;
          border-color: color-mix(in srgb, var(--sc) 58%, var(--border));
          box-shadow: 0 18px 34px -14px color-mix(in srgb, var(--sc) 38%, transparent);
        }
        .skill-tile:hover::before { opacity: 1; }
        .skill-tile:hover::after { left: 14%; right: 14%; transform: scaleX(1); opacity: 1; }

        .skill-icon-ring {
          position: relative; z-index: 1;
          width: 52px; height: 52px; border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          background: color-mix(in srgb, var(--sc) 11%, var(--bg3));
          border: 1px solid color-mix(in srgb, var(--sc) 22%, transparent);
          transition: transform .38s cubic-bezier(.2, 1.45, .3, 1), background .28s ease, border-color .28s ease, box-shadow .28s ease;
        }
        .skill-tile:hover .skill-icon-ring {
          transform: translateY(-3px) scale(1.1) rotate(-4deg);
          background: color-mix(in srgb, var(--sc) 18%, var(--bg3));
          border-color: color-mix(in srgb, var(--sc) 48%, transparent);
          box-shadow: 0 10px 20px -8px color-mix(in srgb, var(--sc) 55%, transparent);
        }
        .skill-img { transition: transform .38s cubic-bezier(.2, 1.4, .3, 1), filter .28s ease; }
        .skill-tile:hover .skill-img {
          transform: scale(1.08);
          filter: drop-shadow(0 4px 8px color-mix(in srgb, var(--sc) 45%, transparent));
        }
        .skill-name {
          position: relative; z-index: 1;
          font-size: .8rem; font-weight: 600; color: var(--text2); line-height: 1.3;
          transition: color .25s ease, transform .25s ease;
        }
        .skill-tile:hover .skill-name { color: var(--text); transform: translateY(-1px); }

        @media (max-width: 820px) {
          .skills-insights-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .skills-grid { grid-template-columns: repeat(auto-fill, minmax(98px, 1fr)) !important; gap: 10px !important; }
          .skill-tile { padding: 15px 8px 13px; gap: 8px; }
          .skill-icon-ring { width: 44px; height: 44px; border-radius: 12px; }
        }
      `}</style>
    </section>
  );
}
