import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import {
  ANIMATION_MODES,
  DEFAULT_ANIMATION_MODE,
  getAnimationMode,
  setAnimationMode,
  subscribeAnimationMode,
} from '../three/animationStore';
import { scrollToSection, scrollToTop } from '../utils/scroll';
import { AnimationIcon, CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';

const NAV_LINKS = [
  ['home', 'Home'],
  ['education', 'Education'],
  ['skills', 'Skills'],
  ['services', 'Services'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['tools', 'Tools'],
  ['certifications', 'Certifications'],
  ['contact', 'Contact'],
] as const;

function AnimMobileDropdown() {
  const mode = useSyncExternalStore(
    subscribeAnimationMode,
    getAnimationMode,
    () => DEFAULT_ANIMATION_MODE
  );
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onScroll = () => setOpen(false);

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  const currentMeta = ANIMATION_MODES.find((m) => m.id === mode) ?? ANIMATION_MODES[0];

  return (
    <div ref={wrapRef} className="anim-dd">
      <button
        type="button"
        className={`anim-dd__btn${open ? ' open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Background animation: ${currentMeta.label}`}
        title={`Background: ${currentMeta.label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <AnimationIcon mode={mode} size={17} />
      </button>

      {open && (
        <div className="anim-dd__menu" role="listbox" aria-label="Background animation">
          <div className="anim-dd__hdr">Background FX</div>
          <div className="anim-dd__grid">
            {ANIMATION_MODES.map((m) => {
              const active = m.id === mode;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`anim-dd__item${active ? ' active' : ''}`}
                  onClick={() => {
                    setAnimationMode(m.id);
                    setOpen(false);
                  }}
                >
                  <span className="anim-dd__item-ic">
                    <AnimationIcon mode={m.id} size={15} />
                  </span>
                  <span className="anim-dd__item-txt">
                    <span className="anim-dd__item-lbl">{m.label}</span>
                    <span className="anim-dd__item-hnt">{m.blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .anim-dd { position: relative; display: none; }
        @media (max-width: 960px) { .anim-dd { display: inline-flex; } }

        .anim-dd__btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: var(--bg2);
          color: var(--text);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color .2s ease, border-color .2s ease, background .2s ease, transform .2s ease;
        }
        .anim-dd__btn:hover,
        .anim-dd__btn.open {
          color: var(--accent);
          border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
        }
        .anim-dd__btn:active { transform: scale(.94); }

        .anim-dd__menu {
          position: fixed;
          top: calc(var(--nav-h, 68px) + 6px);
          left: 12px;
          right: 12px;
          max-width: 340px;
          margin-left: auto;
          padding: 10px;
          border-radius: 16px;
          background: color-mix(in srgb, var(--bg2) 92%, transparent);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border: 1px solid var(--border);
          box-shadow: 0 18px 44px -12px rgba(0, 0, 0, .48),
                      0 1px 0 rgba(255, 255, 255, .05) inset;
          z-index: 120;
          animation: animDdIn .18s cubic-bezier(.2, .8, .2, 1);
          transform-origin: top right;
        }
        @keyframes animDdIn {
          from { opacity: 0; transform: translateY(-6px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .anim-dd__hdr {
          font-size: .66rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--text3);
          padding: 4px 8px 8px;
        }

        .anim-dd__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
        }

        .anim-dd__item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: 11px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text2);
          text-align: left;
          cursor: pointer;
          transition: background .18s ease, color .18s ease, border-color .18s ease;
        }
        .anim-dd__item:hover {
          background: color-mix(in srgb, var(--text) 6%, transparent);
          color: var(--text);
        }
        .anim-dd__item.active {
          background: color-mix(in srgb, var(--accent) 16%, transparent);
          border-color: color-mix(in srgb, var(--accent) 45%, transparent);
          color: var(--accent);
        }

        .anim-dd__item-ic {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: color-mix(in srgb, var(--text) 6%, transparent);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .anim-dd__item.active .anim-dd__item-ic {
          background: color-mix(in srgb, var(--accent) 22%, transparent);
        }

        .anim-dd__item-txt { display: flex; flex-direction: column; min-width: 0; }
        .anim-dd__item-lbl {
          font-size: .78rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: .01em;
        }
        .anim-dd__item-hnt {
          font-size: .66rem;
          color: var(--text3);
          line-height: 1.2;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .anim-dd__item.active .anim-dd__item-hnt {
          color: color-mix(in srgb, var(--accent) 80%, var(--text2));
        }
      `}</style>
    </div>
  );
}

interface NavbarProps {
  dark: boolean;
  onToggleTheme: () => void;
}

export function Navbar({ dark, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });

  const linksContainerRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map(([id]) => id);
    let raf = 0;

    const updateActive = () => {
      raf = 0;
      const probeY = window.scrollY + window.innerHeight * 0.32;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probeY) {
          current = id;
        }
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        current = ids[ids.length - 1];
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      const container = linksContainerRef.current;
      const el = linkRefs.current[activeId];
      if (!container || !el) return;
      const cr = container.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      if (er.width === 0) return;
      setPill({ x: er.left - cr.left, w: er.width, ready: true });
    };

    measure();
    document.fonts?.ready?.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeId]);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    setActiveId(id);
    if (id === 'home') {
      scrollToTop();
    } else {
      scrollToSection(id);
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 'var(--nav-h)',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'all .3s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="syne"
            style={{
              fontWeight: 800,
              fontSize: '1.65rem',
              letterSpacing: '0.02em',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
            }}
          >
            {PORTFOLIO_DATA.hero.wordmark}
          </a>

          <div
            ref={linksContainerRef}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            className="desktop-nav"
          >
            <span
              aria-hidden="true"
              className="nav-indicator"
              style={{
                transform: `translate3d(${pill.x}px, -50%, 0)`,
                width: pill.w,
                opacity: pill.ready ? 1 : 0,
              }}
            />
            {NAV_LINKS.map(([id, label]) => (
              <a
                key={id}
                ref={(el) => {
                  linkRefs.current[id] = el;
                }}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(id);
                }}
                className={`nav-link${activeId === id ? ' active' : ''}`}
              >
                {label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AnimMobileDropdown />

            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1.5px solid var(--border)',
                background: 'var(--bg2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text)',
                transition: 'all .25s ease',
              }}
            >
              {dark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="burger"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text)',
                padding: 4,
              }}
            >
              {menuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-h)',
            left: 0,
            right: 0,
            zIndex: 99,
            background: 'var(--bg2)',
            borderBottom: '1px solid var(--border)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            boxShadow: 'var(--shadow2)',
          }}
        >
          {NAV_LINKS.map(([id, label]) => {
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(id);
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                  color: isActive ? 'var(--accent)' : 'var(--text2)',
                  background: isActive ? 'rgba(37,99,235,.08)' : 'transparent',
                }}
              >
                {label}
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        .nav-link {
          position: relative;
          z-index: 1;
          padding: 7px 11px;
          border-radius: 999px;
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .05em;
          text-transform: uppercase;
          color: var(--text2);
          transition: color .25s ease;
          white-space: nowrap;
        }
        .nav-link:hover { color: var(--text); }
        .nav-link.active { color: var(--accent); }

        .nav-indicator {
          position: absolute;
          top: 50%;
          left: 0;
          height: 32px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
          box-shadow: 0 2px 10px -2px color-mix(in srgb, var(--accent) 25%, transparent);
          pointer-events: none;
          transition:
            transform .38s cubic-bezier(.22, 1, .36, 1),
            width .38s cubic-bezier(.22, 1, .36, 1),
            opacity .2s ease;
          will-change: transform, width;
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-indicator { transition: none; }
        }
        @media(max-width:1024px){
          .desktop-nav { display:none !important; }
          .burger { display:flex !important; }
        }
      `}</style>
    </>
  );
}
