import { useEffect, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { scrollToTop } from '../utils/scroll';
import { ChevronUpIcon } from './Icons';

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg)',
        padding: '28px 24px',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          className="footer-copyright"
          style={{
            fontSize: '.9rem',
            color: 'var(--text)',
            textAlign: 'center',
          }}
        >
          © {new Date().getFullYear()} {PORTFOLIO_DATA.hero.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <button
        onClick={() => scrollToTop()}
        style={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          zIndex: 90,
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(37, 99, 235, .45)',
          transition: 'all .4s cubic-bezier(.175,.885,.32,1.275)',
          opacity: visible ? 1 : 0,
          visibility: visible ? 'visible' : 'hidden',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(20px)',
        }}
        className="scroll-btn"
        aria-label="Scroll to top"
      >
        <ChevronUpIcon size={24} />
      </button>

      <style>{`
        @media (max-width: 768px) {
          .scroll-btn {
            width: 36px !important;
            height: 36px !important;
            bottom: 20px !important;
            right: 20px !important;
          }
          .scroll-btn svg {
            width: 17px !important;
            height: 17px !important;
          }
        }
      `}</style>
    </>
  );
}

