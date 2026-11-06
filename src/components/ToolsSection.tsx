import React, { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PORTFOLIO_DATA, type ToolCategory, type WebToolItem } from '../data/portfolioData';
import {
  DEFAULT_ANIMATION_MODE,
  getAnimationMode,
  subscribeAnimationMode,
} from '../three/animationStore';
import { createPublicationScene } from '../three/createPublicationScene';
import { hasWebGL, onIdle } from '../utils/scroll';
import { CloseIcon, ExternalLinkIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

const TOOL_TABS: { key: 'all' | ToolCategory; label: string }[] = [
  { key: 'all', label: 'All Tools' },
  { key: 'calculators', label: 'Scientific & Math' },
  { key: 'ai_media', label: 'AI & Media Suite' },
  { key: 'finance_utility', label: 'Finance & Utility' },
];

function ToolsHelixCanvas() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mode = useSyncExternalStore(
    subscribeAnimationMode,
    getAnimationMode,
    () => DEFAULT_ANIMATION_MODE
  );

  const isSketch = mode === 'sketch';

  useEffect(() => {
    if (isSketch) return;
    const el = ref.current;
    if (!el || !hasWebGL()) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    const cancelIdle = onIdle(() => {
      if (!cancelled && ref.current) {
        dispose = createPublicationScene(ref.current);
      }
    }, 600);

    return () => {
      cancelled = true;
      cancelIdle();
      dispose?.();
    };
  }, [isSketch]);

  if (isSketch) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.55,
      }}
    />
  );
}

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
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <article
      onPointerMove={onMove}
      style={
        {
          padding: '28px 30px 24px',
          display: 'flex',
          flexDirection: 'column',
          color: 'inherit',
          '--i': index,
        } as React.CSSProperties
      }
      className="card edu-card pub-card"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div
          className="pub-icon"
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: `color-mix(in srgb, ${tool.accent} 18%, var(--surface2))`,
            border: `1px solid color-mix(in srgb, ${tool.accent} 38%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tool.accent,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '.86rem',
            flexShrink: 0,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        <span className="pub-read-badge">{tool.categoryLabel}</span>
      </div>

      <h3
        style={{
          fontFamily: "'Syne',sans-serif",
          fontWeight: 700,
          fontSize: '1.1rem',
          marginBottom: 6,
          lineHeight: 1.4,
          color: 'var(--text)',
        }}
      >
        {tool.title}
      </h3>

      <div
        style={{
          fontSize: '.82rem',
          color: tool.accent,
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {tool.subtitle}
      </div>

      <p
        style={{
          fontSize: '.85rem',
          color: 'var(--muted)',
          lineHeight: 1.65,
          marginBottom: 14,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {tool.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {tool.tags.map((tg) => (
          <span
            key={tg}
            className="tech-badge"
            style={{ padding: '3px 9px', fontSize: '.68rem' }}
          >
            {tg}
          </span>
        ))}
      </div>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: 14,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => onPreview(tool)}
          className="btn-outline"
          style={{
            padding: '7px 14px',
            fontSize: '.78rem',
            cursor: 'pointer',
          }}
        >
          Quick Preview
        </button>

        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            padding: '7px 15px',
            fontSize: '.78rem',
          }}
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
  const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [previewTool, setPreviewTool] = useState<WebToolItem | null>(null);

  const filterRevealRef = useReveal<HTMLDivElement>();
  const gridRevealRef = useReveal<HTMLDivElement>();
  const barRef = useRef<HTMLDivElement | null>(null);

  const tools = PORTFOLIO_DATA.tools;
  const filtered = cat === 'all' ? tools : tools.filter((t) => t.category === cat);

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
  }, [cat, tools.length]);

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

  const countFor = (k: 'all' | ToolCategory) =>
    k === 'all' ? tools.length : tools.filter((t) => t.category === k).length;

  return (
    <section
      id="tools"
      className="pub-section"
      style={{
        padding: '96px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ToolsHelixCanvas />

      <div style={{ maxWidth: 1360, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="Interactive Suite"
          title="Live Web Tools"
          sub="11 standalone client-side utilities engineered by Mehedi Hasan Shihab — run them live right inside your browser"
        />

        <div
          ref={filterRevealRef}
          className="reveal"
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}
        >
          <div ref={barRef} className="pf-bar">
            {pill && (
              <span
                aria-hidden="true"
                className="pf-pill"
                style={{
                  width: pill.w,
                  height: pill.h,
                  transform: `translate(${pill.x}px, ${pill.y}px)`,
                }}
              />
            )}
            {TOOL_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setCat(t.key)}
                className={`filter-tab${cat === t.key ? ' active' : ''}`}
              >
                {t.label}
                <span className="pf-count">{countFor(t.key)}</span>
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRevealRef} className="pub-grid reveal">
          {filtered.map((tool, idx) => (
            <ToolCard
              key={`${cat}-${tool.id}`}
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
            className="card pm-panel"
            style={{
              width: '96%',
              maxWidth: 1020,
              height: '88vh',
              borderRadius: 22,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
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
                background: 'var(--surface)',
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
                  type="button"
                  onClick={() => setPreviewTool(null)}
                  aria-label="Close tool preview"
                  className="pm-iconbtn pm-close"
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
    </section>
  );
}
