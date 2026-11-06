import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import {
  ANIMATION_MODES,
  DEFAULT_ANIMATION_MODE,
  getAnimationMode,
  setAnimationMode,
  subscribeAnimationMode,
} from '../three/animationStore';
import { hasWebGL, scrollToSection, scrollToTop } from '../utils/scroll';
import { AnimationIcon, CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';

const NAV_ITEMS = [
  { id: 'home', label: 'ABOUT' },
  { id: 'education', label: 'EDUCATION' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'services', label: 'SERVICES' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'tools', label: 'TOOLS' },
  { id: 'certifications', label: 'CERTIFICATIONS' },
  { id: 'contact', label: 'CONTACT' },
] as const;

function AnimMobileDropdown() {
  const mode = useSyncExternalStore(
    subscribeAnimationMode,
    getAnimationMode,
    () => DEFAULT_ANIMATION_MODE
  );
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(76);
  const [supported] = useState(() => hasWebGL());
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onMenuOpen = (e: Event) => {
      if ((e as CustomEvent).detail !== 'anim') setOpen(false);
    };
    window.addEventListener('ui:menu-open', onMenuOpen);
    return () => window.removeEventListener('ui:menu-open', onMenuOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
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

  if (!supported) return null;

  return (
    <div ref={wrapRef} className="anim-dd" data-open={open}>
      <button
        ref={btnRef}
        type="button"
        className="anim-dd__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change animation theme"
        title="Animation theme"
        onClick={() => {
          if (!open) {
            const bottom = btnRef.current?.getBoundingClientRect().bottom ?? 56;
            setMenuTop(Math.round(bottom) + 14);
            window.dispatchEvent(new CustomEvent('ui:menu-open', { detail: 'anim' }));
          }
          setOpen((v) => !v);
        }}
      >
        <AnimationIcon mode={mode} size={19} />
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="anim-dd__chev"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className="anim-dd__menu"
        role="listbox"
        aria-label="Animation theme"
        style={{ top: menuTop }}
      >
        {ANIMATION_MODES.map((m, k) => {
          const active = m.id === mode;
          return (
            <button
              key={m.id}
              type="button"
              role="option"
              aria-selected={active}
              className={`anim-dd__item${active ? ' is-active' : ''}`}
              style={{ '--k': k } as React.CSSProperties}
              onClick={() => {
                setAnimationMode(m.id);
                setOpen(false);
              }}
            >
              <span className="anim-dd__item-icon">
                <AnimationIcon mode={m.id} size={17} />
              </span>
              <span className="anim-dd__item-label">{m.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .anim-dd { display: none; position: relative; margin-right: 4px; }
        @media (max-width: 768px) { .anim-dd { display: block; } }

        .anim-dd__btn {
          display: inline-flex; align-items: center; gap: 4px;
          height: 34px; padding: 0 8px; border-radius: 10px;
          border: 1px solid transparent; background: none; color: var(--text); cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: background-color .2s ease, border-color .2s ease;
        }
        .anim-dd[data-open="true"] .anim-dd__btn { background: var(--surface2); border-color: var(--border); }
        .anim-dd__btn svg:first-child { color: var(--accent); }
        .anim-dd__chev { opacity: .65; transition: transform .25s ease; }
        .anim-dd[data-open="true"] .anim-dd__chev { transform: rotate(180deg); }

        .anim-dd__menu {
          position: fixed;
          left: 16px;
          right: 16px;
          z-index: 600;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 12px;
          border-radius: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          box-shadow: 0 16px 40px rgba(0, 0, 0, .25);
          transform-origin: top right;
          opacity: 0; visibility: hidden; transform: translateY(-8px) scale(.97);
          transition: opacity .2s ease, transform .28s cubic-bezier(.2,.8,.2,1), visibility 0s linear .28s;
        }
        .anim-dd[data-open="true"] .anim-dd__menu {
          opacity: 1; visibility: visible; transform: none;
          transition: opacity .2s ease, transform .28s cubic-bezier(.2,.8,.2,1), visibility 0s;
        }
        .anim-dd__item {
          display: flex; align-items: center; justify-content: flex-start; gap: 7px;
          min-width: 0; padding: 9px 9px;
          border-radius: 10px; border: 1px solid transparent;
          background: var(--surface2); color: var(--text);
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: .66rem; letter-spacing: .02em;
          text-transform: uppercase; text-align: left; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          opacity: 0; transform: translateY(8px);
          transition: background-color .2s ease, border-color .2s ease, color .2s ease, opacity .3s ease, transform .35s cubic-bezier(.2,.8,.2,1);
        }
        .anim-dd[data-open="true"] .anim-dd__item {
          opacity: 1; transform: none;
          transition-delay: 0s, 0s, 0s, calc(var(--k, 0) * 24ms + 60ms), calc(var(--k, 0) * 24ms + 60ms);
        }
        .anim-dd__item:active { transform: scale(.97); }
        .anim-dd__item.is-active {
          color: #ff3333;
          background: rgba(255, 51, 51, 0.06);
          border-color: rgba(255, 51, 51, 0.3);
        }
        .anim-dd__item-icon {
          display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
          width: 24px; height: 24px; border-radius: 7px; color: var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, transparent);
        }
        .anim-dd__item.is-active .anim-dd__item-icon { color: #ff3333; background: rgba(255, 51, 51, 0.14); }
        .anim-dd__item-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        @media (prefers-reduced-motion: reduce) {
          .anim-dd__menu, .anim-dd__chev, .anim-dd__btn, .anim-dd__item { transition: none; }
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
  const mode = useSyncExternalStore(
    subscribeAnimationMode,
    getAnimationMode,
    () => DEFAULT_ANIMATION_MODE
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');

  const navRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const onMenuOpen = (e: Event) => {
      if ((e as CustomEvent).detail !== 'nav') setMenuOpen(false);
    };
    window.addEventListener('ui:menu-open', onMenuOpen);
    return () => window.removeEventListener('ui:menu-open', onMenuOpen);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 3) {
          setActiveId(item.id);
        }
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        setActiveId(NAV_ITEMS[NAV_ITEMS.length - 1].id);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncIndicator = () => {
      const ind = indicatorRef.current;
      const target = navRef.current?.querySelector<HTMLElement>(`[data-nav-id="${activeId}"]`);
      if (ind && target) {
        ind.style.transform = `translateX(${target.offsetLeft}px)`;
        ind.style.width = `${target.offsetWidth}px`;
        ind.style.opacity = '1';
      }
    };
    syncIndicator();
    const container = navRef.current;
    const ro = container ? new ResizeObserver(syncIndicator) : null;
    if (container && ro) ro.observe(container);
    document.fonts?.ready?.then(syncIndicator).catch(() => {});
    return () => ro?.disconnect();
  }, [activeId, mode]);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    setActiveId(id);
    if (id === 'home') {
      scrollToTop();
    } else {
      scrollToSection(id);
    }
  };

  const accentActive = mode === 'sketch' || mode === 'wildfire' || mode === 'code';

  return (
    <nav
      className="site-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '14px 20px',
        transition: 'all .3s',
        background: scrolled ? 'var(--nav-bg)' : 'var(--nav-bg-unscrolled)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.05)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1360,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <span
            onClick={() => handleNavClick('home')}
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: '1.15rem',
              cursor: 'pointer',
              letterSpacing: '0.12em',
              background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {PORTFOLIO_DATA.hero.wordmark}
          </span>
          {mode === 'sketch' && (
            <svg className="sketch-header-doodle" viewBox="0 0 48 32" aria-hidden="true">
              <path d="m4 23 15-15 8 8-15 15-9 2zM16 11l8 8M28 9l5-5 11 11-5 5M31 6l-3-3" />
              <path d="M33 27h11M36 23h8" />
            </svg>
          )}
        </div>

        <div
          ref={navRef}
          className="desktop-nav"
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(4px, 1.2vw, 22px)',
            position: 'relative',
          }}
        >
          <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
          {NAV_ITEMS.map((item) => (
            <span
              key={item.id}
              data-text={item.label}
              data-nav-id={item.id}
              className={`nav-link ${activeId === item.id ? 'active-link' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </span>
          ))}
        </div>

        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginLeft: 'auto',
          }}
        >
          <AnimMobileDropdown />

          {mode !== 'sketch' && (
            <button
              onClick={onToggleTheme}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
              }}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>
          )}

          <button
            onClick={() => {
              if (!menuOpen) {
                window.dispatchEvent(new CustomEvent('ui:menu-open', { detail: 'nav' }));
              }
              setMenuOpen(!menuOpen);
            }}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text)',
              padding: 4,
            }}
            className="mobile-burger"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            margin: '8px 16px 0',
            borderRadius: 16,
            padding: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = activeId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 4px',
                  borderRadius: 10,
                  color: active ? (accentActive ? 'var(--accent)' : '#ff3333') : 'var(--text)',
                  background: active
                    ? accentActive
                      ? 'color-mix(in srgb, var(--accent) 8%, transparent)'
                      : 'rgba(255, 51, 51, .05)'
                    : 'var(--surface2)',
                  border: active
                    ? accentActive
                      ? '1px solid color-mix(in srgb, var(--accent) 34%, transparent)'
                      : '1px solid rgba(255, 51, 51, .2)'
                    : '1px solid transparent',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .nav-link {
          cursor: pointer;
          padding: 0 !important;
          white-space: nowrap;
          font-size: clamp(0.62rem, 0.72vw, 0.78rem) !important;
          letter-spacing: clamp(-0.02em, -0.05em + 0.07vw, 0.05em) !important;
          transition: color .35s ease, transform .45s cubic-bezier(.34, 1.56, .64, 1), opacity .3s ease !important;
        }
        .active-link {
          color: var(--accent) !important;
          font-weight: 700 !important;
          transform: translateY(-2px);
          text-shadow: 0 0 16px color-mix(in srgb, var(--accent) 42%, transparent);
        }

        .nav-indicator {
          position: absolute;
          left: 0;
          bottom: -9px;
          height: 3px;
          width: 0;
          opacity: 0;
          border-radius: 3px;
          pointer-events: none;
          background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent));
          background-size: 200% 100%;
          box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 70%, transparent), 0 0 2px color-mix(in srgb, var(--accent2) 90%, transparent);
          transition: transform .6s cubic-bezier(.34, 1.25, .64, 1), width .6s cubic-bezier(.34, 1.25, .64, 1), opacity .4s ease;
          animation: navGlow 2.6s linear infinite;
        }
        @keyframes navGlow { to { background-position: -200% 0; } }
        @media (prefers-reduced-motion: reduce) { .nav-indicator { transition: none; animation: none; } }
        @media(max-width:850px){
          .desktop-nav { display: none !important; }
          .mobile-burger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
