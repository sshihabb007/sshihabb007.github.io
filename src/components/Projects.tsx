import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA, type ProjectCategory, type ProjectItem } from '../data/portfolioData';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExternalLinkIcon,
  ProjectIllustration,
  SocialIcon,
} from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

const PROJECT_TABS: { key: 'all' | ProjectCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI & Agents' },
  { key: 'fullstack', label: 'Full-Stack & CRM' },
  { key: 'wordpress', label: 'WordPress' },
  { key: 'security', label: 'Cybersecurity' },
  { key: 'desktop', label: 'Desktop & Core' },
  { key: 'tools', label: 'Tools & SEO' },
];

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  ai: 'AI & Autonomous Agents',
  fullstack: 'Full-Stack & Enterprise Web',
  wordpress: 'WordPress Ecosystem',
  security: 'Cybersecurity & Forensics',
  desktop: 'Desktop & Core Systems',
  tools: 'Web Tools & Analytics',
};

export function Projects() {
  const [cat, setCat] = useState<'all' | ProjectCategory>('all');
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const [closing, setClosing] = useState(false);
  const [origin, setOrigin] = useState({ x: '50vw', y: '50vh' });
  const [slideDir, setSlideDir] = useState<'next' | 'prev' | null>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });

  const revealRef = useReveal();
  const barRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const filtered =
    cat === 'all' ? PORTFOLIO_DATA.projects : PORTFOLIO_DATA.projects.filter((p) => p.cat === cat);

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

  const openModal = (proj: ProjectItem, e?: React.MouseEvent<HTMLElement>) => {
    if (e?.currentTarget) {
      const r = e.currentTarget.getBoundingClientRect();
      setOrigin({ x: `${Math.round(r.left + r.width / 2)}px`, y: `${Math.round(r.top + r.height / 2)}px` });
    } else {
      setOrigin({ x: '50vw', y: '50vh' });
    }
    setSlideDir(null);
    setClosing(false);
    setSelected(proj);
  };

  const closeModal = useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setSelected(null);
      setClosing(false);
      setSlideDir(null);
    }, 280);
  }, [closing]);

  const stepProject = useCallback(
    (delta: number) => {
      if (!selected || filtered.length < 2) return;
      const curIdx = filtered.findIndex((x) => x.id === selected.id);
      if (curIdx === -1) return;
      const nextIdx = (curIdx + delta + filtered.length) % filtered.length;
      setSlideDir(delta > 0 ? 'next' : 'prev');
      setSelected(filtered[nextIdx]);
    },
    [selected, filtered]
  );

  useEffect(() => {
    if (!selected) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowRight') stepProject(1);
      else if (e.key === 'ArrowLeft') stepProject(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [selected, closeModal, stepProject]);

  const triggerRipple = (e: React.PointerEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'pm-ripple';
    const d = Math.max(r.width, r.height) * 2.1;
    span.style.width = span.style.height = `${d}px`;
    span.style.left = `${e.clientX - r.left - d / 2}px`;
    span.style.top = `${e.clientY - r.top - d / 2}px`;
    btn.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  };

  const selectedIndex = selected ? filtered.findIndex((p) => p.id === selected.id) : -1;

  return (
    <section id="projects" ref={revealRef} style={{ padding: 'var(--section-py) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader
          label="Portfolio"
          title="Featured Projects"
          sub="28 production platforms, autonomous AI systems, enterprise CRMs, cybersecurity recoveries, and open-source solutions"
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
            {PROJECT_TABS.map((t) => {
              const count =
                t.key === 'all'
                  ? PORTFOLIO_DATA.projects.length
                  : PORTFOLIO_DATA.projects.filter((p) => p.cat === t.key).length;
              return (
                <button
                  key={t.key}
                  ref={(el) => {
                    tabRefs.current[t.key] = el;
                  }}
                  onClick={() => setCat(t.key)}
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
          key={cat}
          className="pf-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {filtered.map((proj, idx) => (
            <div
              key={proj.id}
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                animationDelay: `${Math.min(idx, 9) * 45}ms`,
              }}
              className="card pf-card project-card"
            >
              {/* Banner Visual */}
              <div
                onClick={(e) => openModal(proj, e)}
                style={{
                  height: 192,
                  background: `linear-gradient(135deg, ${proj.c}1c 0%, ${proj.c}08 55%, var(--bg3) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {/* Decorative Grid Mesh */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `radial-gradient(${proj.c}2e 1px, transparent 1px)`,
                    backgroundSize: '18px 18px',
                    opacity: 0.55,
                  }}
                />
                {/* Category pill top-left */}
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 14,
                    fontSize: '.68rem',
                    fontWeight: 700,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'color-mix(in srgb, var(--bg2) 86%, transparent)',
                    border: `1px solid ${proj.c}44`,
                    color: proj.c,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {CATEGORY_LABELS[proj.cat]}
                </span>
                {/* Index watermark top-right */}
                <span
                  className="syne"
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 14,
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: proj.c,
                    opacity: 0.28,
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Glowing emblem */}
                <div
                  className="proj-banner-emblem"
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 24,
                    background: 'color-mix(in srgb, var(--bg2) 88%, transparent)',
                    border: `1.5px solid ${proj.c}48`,
                    boxShadow: `0 16px 38px -10px ${proj.c}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'transform .4s cubic-bezier(.2, 1.4, .3, 1)',
                  }}
                >
                  <ProjectIllustration iconKey={proj.iconKey} accent={proj.c} size={42} />
                </div>
              </div>

              <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  className="syne"
                  style={{
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    marginBottom: 8,
                    lineHeight: 1.35,
                  }}
                >
                  {proj.title}
                </h3>

                <p
                  style={{
                    color: 'var(--text2)',
                    fontSize: '.86rem',
                    lineHeight: 1.68,
                    flex: 1,
                    marginBottom: 16,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {proj.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                  {proj.tech.slice(0, 4).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                  {proj.tech.length > 4 && <span className="tag">+{proj.tech.length - 4}</span>}
                </div>

                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    onPointerDown={triggerRipple}
                    onClick={(e) => openModal(proj, e)}
                    className="pm-trigger"
                    style={{
                      '--pc': proj.c,
                      background: `${proj.c}14`,
                      color: proj.c,
                      border: `1px solid ${proj.c}33`,
                      borderRadius: 50,
                      padding: '7px 16px',
                      fontSize: '.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    } as React.CSSProperties}
                  >
                    <span className="pm-trigger-label">View Details</span>
                    <span className="pm-trigger-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </button>

                  {proj.live && (
                    <a
                      href={proj.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-ext-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '7px 14px',
                        borderRadius: 50,
                        fontSize: '.8rem',
                        fontWeight: 600,
                        background: 'var(--accent)',
                        color: '#fff',
                      }}
                    >
                      <ExternalLinkIcon size={13} /> Live Site
                    </a>
                  )}

                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-ext-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '7px 14px',
                        borderRadius: 50,
                        fontSize: '.8rem',
                        fontWeight: 600,
                        border: '1px solid var(--border)',
                        color: 'var(--text2)',
                        background: 'var(--bg3)',
                      }}
                    >
                      <SocialIcon platform="github" size={14} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Circular Clip-Path Reveal Project Modal */}
      {selected && (
        <div
          onClick={closeModal}
          className={`modal-bg${closing ? ' closing' : ''}`}
          style={
            {
              '--ox': origin.x,
              '--oy': origin.y,
              '--mc': selected.c,
            } as React.CSSProperties
          }
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            className={`pm-panel${closing ? ' closing' : ''}`}
          >
            <div className="pm-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="pm-dot" style={{ background: selected.c }} />
                {selectedIndex >= 0 && (
                  <span className="mono pm-counter">
                    {String(selectedIndex + 1).padStart(2, '0')} /{' '}
                    {String(filtered.length).padStart(2, '0')}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {filtered.length > 1 && (
                  <>
                    <button
                      onClick={() => stepProject(-1)}
                      aria-label="Previous project"
                      title="Previous (←)"
                      className="pm-icon-btn"
                    >
                      <ChevronLeftIcon size={16} />
                    </button>
                    <button
                      onClick={() => stepProject(1)}
                      aria-label="Next project"
                      title="Next (→)"
                      className="pm-icon-btn"
                    >
                      <ChevronRightIcon size={16} />
                    </button>
                  </>
                )}
                <button
                  onClick={closeModal}
                  aria-label="Close modal"
                  title="Close (Esc)"
                  className="pm-icon-btn pm-close"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            </div>

            <div
              key={selected.id}
              className={`pm-body${slideDir ? ` slide-${slideDir}` : ''}`}
            >
              <div
                className="pm-hero"
                style={{
                  background: `linear-gradient(135deg, ${selected.c}22, ${selected.c}08)`,
                  padding: '28px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 18,
                      background: 'var(--bg2)',
                      border: `1.5px solid ${selected.c}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ProjectIllustration iconKey={selected.iconKey} accent={selected.c} size={36} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '.72rem',
                        fontWeight: 700,
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: selected.c,
                      }}
                    >
                      {CATEGORY_LABELS[selected.cat]}
                    </span>
                    <h3
                      className="syne"
                      style={{
                        fontWeight: 800,
                        fontSize: '1.35rem',
                        marginTop: 4,
                        color: 'var(--text)',
                      }}
                    >
                      {selected.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p
                className="pm-stagger pm-s2"
                style={{
                  color: 'var(--text2)',
                  lineHeight: 1.8,
                  marginBottom: 20,
                  fontSize: '.94rem',
                }}
              >
                {selected.desc}
              </p>

              {selected.highlights.length > 0 && (
                <div className="pm-stagger pm-s3" style={{ marginBottom: 22 }}>
                  <div
                    style={{
                      fontSize: '.76rem',
                      fontWeight: 700,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text3)',
                      marginBottom: 10,
                    }}
                  >
                    Key Features & Engineering Highlights
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 9,
                    }}
                  >
                    {selected.highlights.map((hl, hi) => (
                      <li
                        key={hi}
                        style={{
                          position: 'relative',
                          paddingLeft: 18,
                          fontSize: '.88rem',
                          lineHeight: 1.65,
                          color: 'var(--text2)',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            left: 2,
                            top: '.58em',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: selected.c,
                          }}
                        />
                        {hl}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                className="pm-stagger pm-s3"
                style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 26 }}
              >
                {selected.tech.map((t, ti) => (
                  <span
                    key={t}
                    className="tag pm-chip"
                    style={{ animationDelay: `${160 + ti * 32}ms` }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="pm-stagger pm-s4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {selected.live && (
                  <a
                    href={selected.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <ExternalLinkIcon size={15} /> Visit Live Platform
                  </a>
                )}
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    <SocialIcon platform="github" size={16} /> Source Code
                  </a>
                )}
                {selected.extraLinks?.map((xl) => (
                  <a
                    key={xl.url}
                    href={xl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    <ExternalLinkIcon size={14} /> {xl.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .project-card:hover .proj-banner-emblem {
          transform: scale(1.08) translateY(-3px);
        }
        .proj-ext-btn {
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }
        .proj-ext-btn:hover {
          transform: translateY(-2px);
        }
        .pm-trigger {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 6px;
          transition: transform .25s cubic-bezier(.2, 1.3, .3, 1), box-shadow .25s ease, background .25s ease, border-color .25s ease;
        }
        .pm-trigger:hover {
          transform: translateY(-2px);
          background: color-mix(in srgb, var(--pc) 20%, transparent) !important;
          border-color: color-mix(in srgb, var(--pc) 55%, transparent) !important;
          box-shadow: 0 8px 20px -6px color-mix(in srgb, var(--pc) 45%, transparent);
        }
        .pm-trigger:active { transform: translateY(0) scale(.96); }
        .pm-trigger-arrow {
          font-size: .82em;
          transition: transform .28s cubic-bezier(.2, 1.4, .3, 1);
        }
        .pm-trigger:hover .pm-trigger-arrow { transform: translate(2px, -2px); }
        .pm-ripple {
          position: absolute; border-radius: 50%; pointer-events: none;
          background: color-mix(in srgb, var(--pc, var(--accent)) 32%, transparent);
          transform: scale(0);
          animation: pmRipple .55s cubic-bezier(.2, .7, .2, 1) forwards;
        }
        @keyframes pmRipple { to { transform: scale(1); opacity: 0; } }

        .modal-bg {
          background: rgba(8, 12, 24, .66);
          backdrop-filter: blur(10px) saturate(140%);
          -webkit-backdrop-filter: blur(10px) saturate(140%);
          animation: pmBgIn .32s ease forwards;
        }
        .modal-bg.closing { animation: pmBgOut .26s ease forwards; }
        @keyframes pmBgIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pmBgOut { from { opacity: 1; } to { opacity: 0; } }

        .pm-panel {
          position: relative;
          background: var(--bg2);
          border: 1px solid color-mix(in srgb, var(--mc, var(--accent)) 32%, var(--border));
          border-radius: 22px;
          padding: 20px 30px 30px;
          max-width: 680px; width: 100%; max-height: 88vh; overflow-y: auto;
          box-shadow:
            0 30px 80px -20px rgba(0, 0, 0, .55),
            0 0 0 1px rgba(255, 255, 255, .04) inset,
            0 20px 60px -30px color-mix(in srgb, var(--mc, var(--accent)) 45%, transparent);
          transform-origin: calc(var(--ox, 50vw) - 50vw + 50%) calc(var(--oy, 50vh) - 50vh + 50%);
          animation: pmPanelIn .44s cubic-bezier(.22, 1, .36, 1) forwards;
        }
        .pm-panel.closing { animation: pmPanelOut .26s cubic-bezier(.4, 0, .6, 1) forwards; }
        @keyframes pmPanelIn {
          0%   { opacity: 0; transform: scale(.72) translateY(18px); clip-path: circle(8% at 50% 50%); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: scale(1) translateY(0); clip-path: circle(150% at 50% 50%); }
        }
        @keyframes pmPanelOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(.88) translateY(12px); }
        }

        .pm-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding-bottom: 14px; margin-bottom: 18px;
          border-bottom: 1px solid var(--border);
        }
        .pm-dot {
          width: 10px; height: 10px; border-radius: 50%;
          box-shadow: 0 0 12px var(--mc, var(--accent));
        }
        .pm-counter { font-size: .76rem; color: var(--text3); letter-spacing: .08em; }
        .pm-icon-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid var(--border); background: var(--bg3); color: var(--text2);
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
          transition: transform .22s cubic-bezier(.2, 1.4, .3, 1), color .2s ease, border-color .2s ease, background .2s ease;
        }
        .pm-icon-btn:hover { color: var(--text); border-color: var(--accent); transform: scale(1.08); }
        .pm-close:hover { color: #ef4444; border-color: rgba(239, 68, 68, .5); transform: rotate(90deg) scale(1.08); }

        .pm-hero {
          position: relative; border-radius: 16px; overflow: hidden;
          margin-bottom: 20px; border: 1px solid var(--border);
          animation: pmItemIn .42s cubic-bezier(.22, 1, .36, 1) 40ms backwards;
        }
        .pm-stagger { animation: pmItemIn .42s cubic-bezier(.22, 1, .36, 1) backwards; }
        .pm-s2 { animation-delay: 130ms; }
        .pm-s3 { animation-delay: 170ms; }
        .pm-s4 { animation-delay: 230ms; }
        @keyframes pmItemIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pm-chip { animation: pmChipIn .36s cubic-bezier(.2, 1.4, .3, 1) backwards; }
        @keyframes pmChipIn {
          from { opacity: 0; transform: scale(.8) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .pm-body.slide-next { animation: pmSlideNext .32s cubic-bezier(.22, 1, .36, 1); }
        .pm-body.slide-prev { animation: pmSlidePrev .32s cubic-bezier(.22, 1, .36, 1); }
        @keyframes pmSlideNext { from { opacity: 0; transform: translateX(22px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pmSlidePrev { from { opacity: 0; transform: translateX(-22px); } to { opacity: 1; transform: translateX(0); } }

        @media (max-width: 600px) {
          .pm-panel { padding: 16px 18px 22px; border-radius: 18px; }
        }
      `}</style>
    </section>
  );
}

