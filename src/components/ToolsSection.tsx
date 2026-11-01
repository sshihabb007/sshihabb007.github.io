import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA, type ToolCategory, type WebToolItem } from '../data/portfolioData';
import { CloseIcon, ExternalLinkIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

const TOOL_TABS: { key: 'all' | ToolCategory; label: string }[] = [
  { key: 'all', label: 'All Tools' },
  { key: 'calculators', label: 'Scientific & Math' },
  { key: 'ai_media', label: 'AI & Media Suite' },
  { key: 'finance_utility', label: 'Finance & Utility' },
];

function ToolCard({
  tool,
  index,
  onPreview,
}: {
  tool: WebToolItem;
  index: number;
  onPreview: (tool: WebToolItem) => void;
}) {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--rx', `${((y / r.height - 0.5) * -4.5).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 4.5).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={
        {
          '--pc': tool.accent,
          animationDelay: `${Math.min(index, 10) * 50}ms`,
        } as React.CSSProperties
      }
      className="card pf-card pub-card"
    >
      <span className="pub-glow" aria-hidden="true" />
      <span className="syne pub-year-bg" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="pub-top">
        <span className="pub-badge">
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: tool.accent,
              display: 'inline-block',
            }}
          />
          <span>{tool.categoryLabel}</span>
        </span>
        <span className="mono pub-year" style={{ color: '#10b981', fontWeight: 700 }}>
          ● LIVE APP
        </span>
      </div>

      <h3 className="syne pub-title">{tool.title}</h3>
      <div className="pub-venue">{tool.subtitle}</div>
      <p className="pub-abstract">{tool.desc}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, position: 'relative', zIndex: 1 }}>
        {tool.tags.map((tg) => (
          <span key={tg} className="tag" style={{ fontSize: '.7rem' }}>
            {tg}
          </span>
        ))}
      </div>

      <div className="pub-footer">
        <button
          type="button"
          onClick={() => onPreview(tool)}
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            color: 'var(--text2)',
            padding: '7px 14px',
            borderRadius: 999,
            fontSize: '.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all .22s ease',
          }}
          className="tool-preview-btn"
        >
          Quick Preview
        </button>

        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pub-cta"
        >
          <span>Launch Live Tool</span>
          <ExternalLinkIcon size={13} />
        </a>
      </div>
    </article>
  );
}

export function ToolsSection() {
  const [cat, setCat] = useState<'all' | ToolCategory>('all');
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  const [previewTool, setPreviewTool] = useState<WebToolItem | null>(null);

  const revealRef = useReveal();
  const barRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const filtered =
    cat === 'all' ? PORTFOLIO_DATA.tools : PORTFOLIO_DATA.tools.filter((t) => t.category === cat);

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

  useEffect(() => {
    if (!previewTool) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewTool(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [previewTool]);

  return (
    <section
      id="tools"
      ref={revealRef}
      style={{
        padding: 'var(--section-py) 24px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="Interactive Suite"
          title="Live Web Tools"
          sub="11 standalone client-side utilities engineered by Mehedi Hasan Shihab — run them live right inside your browser"
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
            {TOOL_TABS.map((t) => {
              const count =
                t.key === 'all'
                  ? PORTFOLIO_DATA.tools.length
                  : PORTFOLIO_DATA.tools.filter((x) => x.category === t.key).length;
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

        <div key={cat} className="pub-grid">
          {filtered.map((tool, idx) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={idx}
              onPreview={(selectedTool) => setPreviewTool(selectedTool)}
            />
          ))}
        </div>
      </div>

      {/* Interactive Live Tool Sandbox Modal */}
      {previewTool && (
        <div className="modal-bg" onClick={() => setPreviewTool(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 980,
              height: '86vh',
              background: 'var(--bg2)',
              borderRadius: 20,
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,.55)',
            }}
          >
            <div
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: previewTool.accent,
                  }}
                />
                <span className="syne" style={{ fontWeight: 700, fontSize: '.98rem' }}>
                  {previewTool.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <a
                  href={previewTool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: '7px 14px', fontSize: '.78rem' }}
                >
                  <ExternalLinkIcon size={13} /> Open Full Tab
                </a>
                <button
                  onClick={() => setPreviewTool(null)}
                  aria-label="Close tool preview"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    background: 'var(--bg3)',
                    color: 'var(--text)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            </div>

            <iframe
              src={previewTool.url}
              title={previewTool.title}
              style={{
                flex: 1,
                width: '100%',
                border: 'none',
                background: '#fff',
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        .pub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
          gap: 24px;
        }
        .pub-card {
          position: relative;
          padding: 28px 28px 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 11px;
          transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px));
          transition: transform .25s cubic-bezier(.2, .8, .2, 1), border-color .3s ease, box-shadow .32s ease;
          will-change: transform;
        }
        .pub-card::after {
          content: '';
          position: absolute; left: 0; top: 18%; bottom: 18%;
          width: 3px; border-radius: 0 3px 3px 0;
          background: var(--pc);
          transform: scaleY(.4); opacity: .55;
          transition: transform .36s cubic-bezier(.2, .8, .2, 1), opacity .3s ease, top .36s ease, bottom .36s ease;
        }
        .pub-card:hover {
          --lift: -5px;
          border-color: color-mix(in srgb, var(--pc) 52%, var(--border));
          box-shadow: 0 22px 46px -18px color-mix(in srgb, var(--pc) 36%, transparent);
        }
        .pub-card:hover::after { top: 10%; bottom: 10%; transform: scaleY(1); opacity: 1; }

        .pub-glow {
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 30%),
            color-mix(in srgb, var(--pc) 15%, transparent), transparent 70%);
          opacity: 0; pointer-events: none; transition: opacity .3s ease;
        }
        .pub-card:hover .pub-glow { opacity: 1; }

        .pub-year-bg {
          position: absolute; right: 18px; bottom: -14px;
          font-size: 4.4rem; font-weight: 800; line-height: 1; letter-spacing: -.04em;
          color: var(--pc); opacity: .055; pointer-events: none; user-select: none;
          transition: opacity .35s ease, transform .45s cubic-bezier(.2, .8, .2, 1);
        }
        .pub-card:hover .pub-year-bg { opacity: .12; transform: translateY(-4px) scale(1.03); }

        .pub-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; position: relative; z-index: 1;
        }
        .pub-badge {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: .72rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
          color: var(--pc);
          background: color-mix(in srgb, var(--pc) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--pc) 28%, transparent);
          padding: 5px 11px; border-radius: 999px;
        }
        .pub-year { font-size: .74rem; letter-spacing: .04em; }
        .pub-title {
          position: relative; z-index: 1;
          font-weight: 700; font-size: 1.08rem; line-height: 1.35; color: var(--text);
          transition: color .25s ease;
        }
        .pub-card:hover .pub-title { color: var(--pc); }
        .pub-venue { position: relative; z-index: 1; font-size: .82rem; font-weight: 600; color: var(--pc); }
        .pub-abstract {
          position: relative; z-index: 1;
          font-size: .87rem; line-height: 1.68; color: var(--text2);
          margin: 2px 0 4px;
        }
        .pub-footer {
          position: relative; z-index: 1;
          margin-top: auto; padding-top: 14px;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .tool-preview-btn:hover {
          border-color: var(--pc) !important;
          color: var(--pc) !important;
        }
        .pub-cta {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: .8rem; font-weight: 700;
          color: #fff; background: var(--pc);
          padding: 7px 15px; border-radius: 999px;
          box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--pc) 65%, transparent);
          transition: transform .25s cubic-bezier(.2, 1.4, .3, 1), box-shadow .25s ease;
        }
        .pub-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px -6px color-mix(in srgb, var(--pc) 80%, transparent);
        }
        @media (max-width: 560px) {
          .pub-grid { grid-template-columns: 1fr; }
          .pub-card { padding: 22px 20px 20px; }
        }
      `}</style>
    </section>
  );
}

