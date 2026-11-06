import React, { useLayoutEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA, type SkillCategory } from '../data/portfolioData';
import { SectionHeader, useReveal } from './SectionHeader';

const SKILL_TABS: { key: 'all' | SkillCategory; label: string; color?: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'programming', label: 'Programming', color: '#3b82f6' },
  { key: 'web', label: 'Web & Full-Stack', color: '#14b8a6' },
  { key: 'ai', label: 'AI & Agents', color: '#a855f7' },
  { key: 'database', label: 'Databases & CRM', color: '#f59e0b' },
  { key: 'design', label: 'Design & Media', color: '#38bdf8' },
  { key: 'tools', label: 'Tools & Security', color: '#ec4899' },
];

const CAT_COLORS: Record<SkillCategory, string> = {
  programming: '#3b82f6',
  web: '#14b8a6',
  ai: '#a855f7',
  database: '#f59e0b',
  design: '#38bdf8',
  tools: '#ec4899',
};

export function Skills() {
  const [cat, setCat] = useState<'all' | SkillCategory>('all');
  const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [brokenIcons, setBrokenIcons] = useState<Record<string, boolean>>({});

  const liveRevealRef = useReveal<HTMLDivElement>();
  const insightsRevealRef = useReveal<HTMLDivElement>();
  const barRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLSpanElement | null>(null);
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());

  const skills = PORTFOLIO_DATA.skills;
  const filtered = cat === 'all' ? skills : skills.filter((s) => s.cat === cat);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const sync = () => {
      const activeBtn = bar.querySelector<HTMLElement>('.filter-tab.active');
      if (activeBtn) {
        setPill({
          x: activeBtn.offsetLeft,
          y: activeBtn.offsetTop,
          w: activeBtn.offsetWidth,
          h: activeBtn.offsetHeight,
        });
      }
    };
    sync();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(sync);
    ro.observe(bar);
    bar.querySelectorAll('.filter-tab').forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [cat, skills.length]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const nextRects = new Map<string, DOMRect>();
    for (const tile of Array.from(grid.querySelectorAll<HTMLElement>('.skill-tile'))) {
      const key = tile.dataset.k ?? '';
      const rect = tile.getBoundingClientRect();
      nextRects.set(key, rect);
      const prev = prevRectsRef.current.get(key);
      if (!prev) continue;
      const dx = prev.left - rect.left;
      const dy = prev.top - rect.top;
      if (dx || dy) {
        tile.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], {
          duration: 480,
          easing: 'cubic-bezier(.2,.8,.2,1)',
        });
      }
    }
    prevRectsRef.current = nextRects;
  }, [cat, skills]);

  const onStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const grid = gridRef.current;
    const spot = spotRef.current;
    if (!grid || !spot) return;
    const r = grid.getBoundingClientRect();
    spot.style.transform = `translate3d(${e.clientX - r.left - 170}px, ${e.clientY - r.top - 170}px, 0)`;
    spot.style.opacity = '1';
  };

  const onStageLeave = () => {
    if (spotRef.current) spotRef.current.style.opacity = '0';
  };

  const onTileMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--rx', `${((0.5 - ny) * 14).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((nx - 0.5) * 16).toFixed(2)}deg`);
  };

  const onTileLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  const countFor = (k: 'all' | SkillCategory) =>
    k === 'all' ? skills.length : skills.filter((s) => s.cat === k).length;

  return (
    <section id="skills" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <SectionHeader label="Technical Skills" title="My Tech Stack" />

        <div className="skills-filter">
          <div ref={barRef} className="pf-bar">
            {pill && (
              <span
                className="pf-pill"
                aria-hidden="true"
                style={{
                  width: pill.w,
                  height: pill.h,
                  transform: `translate(${pill.x}px, ${pill.y}px)`,
                }}
              />
            )}
            {SKILL_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`filter-tab${cat === t.key ? ' active' : ''}`}
                onClick={() => setCat(t.key)}
              >
                {t.key !== 'all' && (
                  <i
                    className="skills-dot"
                    style={{ background: t.color }}
                    aria-hidden="true"
                  />
                )}
                {t.label}
                <span className="pf-count">{countFor(t.key)}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={liveRevealRef}
          className="reveal skills-live"
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <div ref={gridRef} className="skills-grid">
            <span className="skills-sweep" aria-hidden="true" />
            <span ref={spotRef} className="skills-spot" aria-hidden="true" />

            {filtered.map((sk, idx) => {
              const catColor = CAT_COLORS[sk.cat] || sk.c || '#38bdf8';
              return (
                <div
                  key={sk.id}
                  data-k={sk.name}
                  className="skill-card skill-tile"
                  onPointerMove={onTileMove}
                  onPointerLeave={onTileLeave}
                  style={
                    {
                      '--i': idx,
                      '--d': Math.min(idx, 30) * 38,
                      '--cat': catColor,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className="skill-cat"
                    aria-hidden="true"
                    title={SKILL_TABS.find((t) => t.key === sk.cat)?.label || sk.cat}
                  />
                  {sk.icon && !brokenIcons[sk.id] ? (
                    <img
                      src={sk.icon}
                      alt={sk.name}
                      width={40}
                      height={40}
                      className="skill-icon"
                      loading="lazy"
                      decoding="async"
                      onError={() => setBrokenIcons((prev) => ({ ...prev, [sk.id]: true }))}
                    />
                  ) : (
                    <span
                      className="skill-icon syne"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '.82rem',
                        letterSpacing: '.03em',
                        color: sk.c || catColor,
                        background: `color-mix(in srgb, ${sk.c || catColor} 14%, var(--surface2))`,
                        border: `1px solid color-mix(in srgb, ${sk.c || catColor} 32%, transparent)`,
                      }}
                    >
                      {sk.badgeText || sk.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="skill-label">{sk.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Git Language Distribution + Personal Strengths & Spoken Languages */}
        <div
          ref={insightsRevealRef}
          className="reveal skills-insights-grid"
          style={{
            marginTop: 32,
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: 22,
          }}
        >
          <div className="card edu-card" style={{ padding: '24px 28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
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
              <span className="mono" style={{ fontSize: '.75rem', color: 'var(--muted)' }}>
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
                background: 'var(--surface2)',
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '.84rem',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: 600,
                      color: 'var(--text)',
                    }}
                  >
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
                  <span className="mono" style={{ fontSize: '.78rem', color: 'var(--muted)' }}>
                    {lang.percent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="card edu-card"
            style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}
          >
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
                {[...PORTFOLIO_DATA.personalTraits, ...PORTFOLIO_DATA.interests.slice(0, 4)].map(
                  (item) => (
                    <span
                      key={item}
                      style={{
                        fontSize: '.74rem',
                        fontWeight: 600,
                        padding: '4px 11px',
                        borderRadius: 999,
                        background: 'color-mix(in srgb, var(--accent) 9%, var(--surface2))',
                        border: '1px solid color-mix(in srgb, var(--accent) 22%, var(--border))',
                        color: 'var(--text)',
                      }}
                    >
                      {item}
                    </span>
                  )
                )}
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
                      background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
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
        @media (max-width: 820px) {
          .skills-insights-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
