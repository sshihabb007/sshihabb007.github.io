import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

function EyePeekIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function InfoDocIcon() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const CLOSE_MS = 460;

export function Projects() {
  const [cat, setCat] = useState<'all' | ProjectCategory>('all');
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const [closing, setClosing] = useState(false);
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' });
  const [slideDir, setSlideDir] = useState<'none' | 'next' | 'prev'>('none');
  const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const closingRef = useRef(false);
  const closeTimerRef = useRef(0);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const filterRevealRef = useReveal<HTMLDivElement>();
  const gridRevealRef = useReveal<HTMLDivElement>();

  const projects = PORTFOLIO_DATA.projects;
  const filtered = cat === 'all' ? projects : projects.filter((p) => p.cat === cat);
  const modalPool =
    selected && filtered.some((p) => p.id === selected.id) ? filtered : projects;
  const selectedIndex = selected ? modalPool.findIndex((p) => p.id === selected.id) : -1;

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
  }, [cat, projects.length]);

  const openModal = (proj: ProjectItem, e?: React.MouseEvent<HTMLElement>) => {
    window.clearTimeout(closeTimerRef.current);
    closingRef.current = false;
    setClosing(false);
    setSlideDir('none');
    if (e && (e.clientX || e.clientY)) {
      setOrigin({ x: `${e.clientX}px`, y: `${e.clientY}px` });
    } else {
      setOrigin({ x: '50%', y: '50%' });
    }
    setSelected(proj);
  };

  const closeModal = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setSelected(null);
      setClosing(false);
      closingRef.current = false;
    }, CLOSE_MS);
  }, []);

  const stepProject = useCallback(
    (delta: number) => {
      if (!selected || modalPool.length < 2) return;
      const curIdx = modalPool.findIndex((x) => x.id === selected.id);
      if (curIdx === -1) return;
      const nextProj = modalPool[(curIdx + delta + modalPool.length) % modalPool.length];
      setSlideDir(delta === 1 ? 'next' : 'prev');
      setSelected(nextProj);
      panelRef.current?.scrollTo({ top: 0 });
    },
    [selected, modalPool]
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowRight') stepProject(1);
      else if (e.key === 'ArrowLeft') stepProject(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, closeModal, stepProject]);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  const onPanelScroll = () => {
    const panel = panelRef.current;
    const bar = progressRef.current;
    if (!panel || !bar) return;
    const max = panel.scrollHeight - panel.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, panel.scrollTop / max) : 0})`;
  };

  const onCardMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--rx', `${((0.5 - ny) * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((nx - 0.5) * 8).toFixed(2)}deg`);
  };

  const onCardLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  const triggerRipple = (e: React.PointerEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const rip = btn.querySelector<HTMLElement>(':scope > .rip');
    if (!rip) return;
    const r = btn.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 2.2;
    const wave = document.createElement('span');
    wave.className = 'rip-wave';
    wave.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    rip.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  };

  const countFor = (k: 'all' | ProjectCategory) =>
    k === 'all' ? projects.length : projects.filter((p) => p.cat === k).length;

  return (
    <section id="projects" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <SectionHeader label="Portfolio" title="Projects" />

        <div
          ref={filterRevealRef}
          className="reveal project-filter-wrap"
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}
        >
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
            {PROJECT_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`filter-tab${cat === t.key ? ' active' : ''}`}
                onClick={() => setCat(t.key)}
              >
                {t.label}
                <span className="pf-count">{countFor(t.key)}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={gridRevealRef}
          className="reveal project-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
            gap: 28,
            alignItems: 'stretch',
          }}
        >
          {filtered.map((proj, idx) => (
            <div
              key={`${cat}-${proj.id}`}
              className="project-card"
              onPointerMove={onCardMove}
              onPointerLeave={onCardLeave}
              style={{ display: 'flex', flexDirection: 'column', '--i': idx } as React.CSSProperties}
            >
              <div
                className="proj-media"
                onClick={(e) => openModal(proj, e)}
                style={{
                  height: 215,
                  background: `linear-gradient(135deg, ${proj.c}26 0%, ${proj.c}0d 55%, var(--surface2) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1e293b',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                {proj.img ? (
                  <img
                    className="proj-img"
                    src={proj.img}
                    alt={proj.title}
                    width={400}
                    height={215}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `radial-gradient(${proj.c}33 1px, transparent 1px)`,
                        backgroundSize: '18px 18px',
                        opacity: 0.55,
                      }}
                    />
                    <div
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: 24,
                        background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
                        border: `1.5px solid ${proj.c}4d`,
                        boxShadow: `0 16px 38px -10px ${proj.c}59`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <ProjectIllustration iconKey={proj.iconKey} accent={proj.c} size={46} />
                    </div>
                  </>
                )}

                <span className="proj-cat">{CATEGORY_LABELS[proj.cat]}</span>
                <span className="proj-overlay" aria-hidden="true">
                  <span className="proj-peek">
                    <EyePeekIcon /> View details
                  </span>
                </span>
              </div>

              <div
                style={{
                  padding: '24px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                <h3
                  className="proj-title"
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700,
                    fontSize: '1.16rem',
                    marginBottom: 10,
                    lineHeight: 1.35,
                    letterSpacing: '0.01em',
                  }}
                >
                  <span>{proj.title}</span>
                </h3>

                <p
                  style={{
                    color: 'var(--muted)',
                    fontSize: '.86rem',
                    lineHeight: 1.65,
                    marginBottom: 16,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {proj.desc}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginBottom: 18,
                  }}
                >
                  {proj.tech.slice(0, 6).map((t, bi) => (
                    <span
                      key={t}
                      className="tech-badge"
                      style={
                        {
                          '--b': bi,
                          padding: proj.tech.length > 4 ? '4px 9px' : undefined,
                          fontSize: proj.tech.length > 4 ? '.69rem' : undefined,
                        } as React.CSSProperties
                      }
                    >
                      {t}
                    </span>
                  ))}
                  {proj.tech.length > 6 && (
                    <span
                      className="tech-badge"
                      style={{ '--b': 6, padding: '4px 9px', fontSize: '.69rem' } as React.CSSProperties}
                    >
                      +{proj.tech.length - 6}
                    </span>
                  )}
                </div>

                <div
                  className="proj-actions"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 9,
                    marginTop: 'auto',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, width: '100%' }}>
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        onPointerDown={triggerRipple}
                        className="btn-outline proj-gh"
                        style={{
                          position: 'relative',
                          fontSize: '.84rem',
                          padding: '8px 14px',
                          flex: '1 1 0',
                          justifyContent: 'center',
                        }}
                      >
                        <SocialIcon platform="github" size={15} /> GitHub
                        <span className="rip" aria-hidden="true" />
                      </a>
                    )}

                    <button
                      type="button"
                      onPointerDown={triggerRipple}
                      onClick={(e) => openModal(proj, e)}
                      className="btn-primary proj-details"
                      style={{
                        position: 'relative',
                        fontSize: '.84rem',
                        padding: '8px 14px',
                        flex: '1 1 0',
                        justifyContent: 'center',
                      }}
                    >
                      <InfoDocIcon /> Details
                      <span className="rip" aria-hidden="true" />
                    </button>

                    {proj.live && (
                      <a
                        href={proj.live}
                        target="_blank"
                        rel="noreferrer"
                        onPointerDown={triggerRipple}
                        className="btn-primary proj-live"
                        style={{
                          position: 'relative',
                          fontSize: '.84rem',
                          padding: '8px 14px',
                          flex: '1 1 0',
                          justifyContent: 'center',
                          background: '#10b981',
                          borderColor: '#10b981',
                        }}
                      >
                        <ExternalLinkIcon size={15} /> Live
                        <span className="rip" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className={`modal-bg${closing ? ' closing' : ''}`}
          onClick={closeModal}
          onWheel={(e) => panelRef.current?.scrollBy({ top: e.deltaY, behavior: 'auto' })}
          style={{ '--ox': origin.x, '--oy': origin.y } as React.CSSProperties}
        >
          <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            onScroll={onPanelScroll}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            className={`card hide-scrollbar pm-panel${closing ? ' closing' : ''}`}
            style={{
              maxWidth: 920,
              width: '96%',
              maxHeight: '92vh',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="pm-progress" aria-hidden="true">
              <span ref={progressRef} />
            </div>

            <div className="pm-toolbar">
              <div className="pm-toolbar-in">
                <span className="pm-counter">
                  {pad2(selectedIndex + 1)} <i>/</i> {pad2(modalPool.length)}
                </span>

                <div className="pm-toolbar-btns">
                  {modalPool.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="pm-iconbtn"
                        onClick={() => stepProject(-1)}
                        aria-label="Previous project"
                        title="Previous project (←)"
                      >
                        <ChevronLeftIcon size={18} />
                      </button>
                      <button
                        type="button"
                        className="pm-iconbtn"
                        onClick={() => stepProject(1)}
                        aria-label="Next project"
                        title="Next project (→)"
                      >
                        <ChevronRightIcon size={18} />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="pm-iconbtn pm-close"
                    onClick={closeModal}
                    aria-label="Close project details"
                    title="Close (Esc)"
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div key={selected.id} className={`pm-content pm-dir-${slideDir}`}>
              <div
                className="pm-banner"
                style={
                  selected.img
                    ? undefined
                    : {
                        background: `linear-gradient(135deg, ${selected.c}33, ${selected.c}12, var(--surface2))`,
                      }
                }
              >
                {selected.img ? (
                  <img className="pm-banner-img" src={selected.img} alt={selected.title} />
                ) : (
                  <div className="pm-banner-icon">
                    <div
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: 26,
                        background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
                        border: `1.5px solid ${selected.c}55`,
                        boxShadow: `0 18px 40px -12px ${selected.c}66`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ProjectIllustration iconKey={selected.iconKey} accent={selected.c} size={52} />
                    </div>
                  </div>
                )}
                <div className="pm-banner-fade" />
                <span className="pm-banner-cat">{CATEGORY_LABELS[selected.cat]}</span>
              </div>

              <div
                className="pm-head"
                style={{
                  padding: '8px 28px 28px',
                  position: 'relative',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    marginBottom: 14,
                    lineHeight: 1.25,
                    letterSpacing: '0.02em',
                    color: 'var(--text)',
                  }}
                >
                  {selected.title}
                </h2>

                <div className="pm-meta">
                  <span>
                    Stack: <b>{selected.tech.length} technologies</b>
                  </span>
                  {selected.live && (
                    <span className="pm-meta-live">
                      <i aria-hidden="true" /> Live Production
                    </span>
                  )}
                </div>

                <p
                  style={{
                    color: 'var(--text)',
                    opacity: 0.9,
                    lineHeight: 1.8,
                    marginBottom: 22,
                    fontSize: '.96rem',
                  }}
                >
                  {selected.desc}
                </p>

                {selected.highlights.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div
                      style={{
                        fontSize: '.76rem',
                        fontWeight: 700,
                        letterSpacing: '.12em',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        marginBottom: 12,
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
                        gap: 10,
                      }}
                    >
                      {selected.highlights.map((hl, hi) => (
                        <li
                          key={hi}
                          style={{
                            position: 'relative',
                            paddingLeft: 18,
                            fontSize: '.9rem',
                            lineHeight: 1.65,
                            color: 'var(--text)',
                            opacity: 0.88,
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

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 26 }}>
                  {selected.tech.map((t) => (
                    <span key={t} className="tech-badge">
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {selected.live && (
                    <a
                      href={selected.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ background: '#10b981', borderColor: '#10b981' }}
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
                      className="btn-primary proj-download"
                    >
                      <ExternalLinkIcon size={14} /> {xl.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
