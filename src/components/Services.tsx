import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { scrollToSection } from '../utils/scroll';
import { ServiceIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

export function Services() {
  const revealRef = useReveal();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--rx', `${((y / r.height - 0.5) * -9).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 9).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <section
      id="services"
      ref={revealRef}
      style={{
        padding: 'var(--section-py) 24px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="svc-aurora svc-aurora-1" aria-hidden="true" />
      <div className="svc-aurora svc-aurora-2" aria-hidden="true" />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="What I Offer"
          title="My Services"
          sub="End-to-end engineering, AI automation, cybersecurity hardening, and enterprise software solutions"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(295px, 1fr))',
            gap: 24,
          }}
        >
          {PORTFOLIO_DATA.services.map((svc, idx) => (
            <div
              key={svc.id}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              style={{ '--sc': svc.c || 'var(--accent)' } as React.CSSProperties}
              className={`svc-card card reveal d${Math.min((idx % 5) + 1, 5)}`}
            >
              <span className="svc-border" aria-hidden="true" />
              <span className="svc-glow" aria-hidden="true" />

              <div className="syne svc-num" aria-hidden="true">
                {svc.n}
              </div>

              <div className="svc-icon-ring">
                <span className="svc-icon-pulse" aria-hidden="true" />
                <div className="svc-icon-glyph">
                  <ServiceIcon icon={svc.icon} size={24} />
                </div>
              </div>

              <h3
                className="syne svc-title"
                style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}
              >
                {svc.title}
              </h3>

              <p
                style={{
                  color: 'var(--text2)',
                  fontSize: '.9rem',
                  lineHeight: 1.75,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {svc.desc}
              </p>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
                className="svc-cta"
              >
                <span>Let&apos;s talk</span>
                <span className="svc-cta-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @property --sa {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes svcOrbit { to { --sa: 360deg; } }

        .svc-aurora {
          position: absolute; width: 480px; height: 480px; border-radius: 50%;
          filter: blur(115px); opacity: .11; pointer-events: none; z-index: 0;
        }
        .svc-aurora-1 {
          top: -120px; left: -140px;
          background: radial-gradient(circle, var(--accent), transparent 68%);
          animation: svcDrift1 16s ease-in-out infinite alternate;
        }
        .svc-aurora-2 {
          bottom: -160px; right: -140px;
          background: radial-gradient(circle, var(--accent2), transparent 68%);
          animation: svcDrift2 19s ease-in-out infinite alternate;
        }
        @keyframes svcDrift1 { to { transform: translate(90px, 60px) scale(1.14); } }
        @keyframes svcDrift2 { to { transform: translate(-80px, -70px) scale(1.18); } }

        .svc-card {
          position: relative;
          padding: 32px 28px 26px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px));
          transition: transform .24s cubic-bezier(.2, .8, .2, 1), border-color .3s ease, box-shadow .32s ease;
          will-change: transform;
        }
        .svc-card:hover {
          --lift: -6px;
          border-color: color-mix(in srgb, var(--sc) 40%, var(--border));
          box-shadow: 0 24px 48px -18px color-mix(in srgb, var(--sc) 36%, transparent);
        }
        .svc-border {
          position: absolute; inset: 0; border-radius: inherit; padding: 1.5px;
          background: conic-gradient(from var(--sa), transparent 0deg, var(--sc) 70deg, transparent 150deg, transparent 210deg, color-mix(in srgb, var(--sc) 70%, var(--accent2)) 280deg, transparent 360deg);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0; pointer-events: none; transition: opacity .35s ease;
          animation: svcOrbit 5.5s linear infinite paused;
        }
        .svc-card:hover .svc-border { opacity: 1; animation-play-state: running; }

        .svc-glow {
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(300px circle at var(--mx, 50%) var(--my, 30%),
            color-mix(in srgb, var(--sc) 16%, transparent), transparent 70%);
          opacity: 0; pointer-events: none; transition: opacity .3s ease;
        }
        .svc-card:hover .svc-glow { opacity: 1; }

        .svc-num {
          position: absolute; top: 18px; right: 22px;
          font-size: 3rem; font-weight: 800; line-height: 1; letter-spacing: -.04em;
          color: var(--sc); opacity: .09; user-select: none; pointer-events: none;
          transition: opacity .35s ease, transform .4s cubic-bezier(.2, .8, .2, 1);
        }
        .svc-card:hover .svc-num { opacity: .22; transform: translateY(-3px) scale(1.06); }

        .svc-icon-ring {
          position: relative; width: 54px; height: 54px; border-radius: 15px;
          background: color-mix(in srgb, var(--sc) 12%, var(--bg3));
          border: 1px solid color-mix(in srgb, var(--sc) 24%, transparent);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 22px; color: var(--sc); z-index: 1;
          transition: transform .42s cubic-bezier(.2, 1.45, .3, 1), background .3s ease, border-color .3s ease, box-shadow .3s ease;
        }
        .svc-icon-glyph { display: flex; transition: transform .42s cubic-bezier(.2, 1.4, .3, 1); }
        .svc-icon-pulse {
          position: absolute; inset: -1px; border-radius: inherit;
          border: 1.5px solid var(--sc); opacity: 0; pointer-events: none;
        }
        .svc-card:hover .svc-icon-ring {
          transform: translateY(-3px) scale(1.08) rotate(-5deg);
          background: color-mix(in srgb, var(--sc) 20%, var(--bg3));
          border-color: color-mix(in srgb, var(--sc) 52%, transparent);
          box-shadow: 0 12px 26px -10px color-mix(in srgb, var(--sc) 60%, transparent);
        }
        .svc-card:hover .svc-icon-glyph { transform: scale(1.1); }
        .svc-card:hover .svc-icon-pulse { animation: svcPulse 1.5s cubic-bezier(.2, .8, .2, 1) infinite; }
        @keyframes svcPulse {
          0%   { transform: scale(1);    opacity: .55; }
          100% { transform: scale(1.48); opacity: 0; }
        }
        .svc-title { position: relative; z-index: 1; transition: color .25s ease; }
        .svc-card:hover .svc-title { color: var(--sc); }

        .svc-cta {
          position: relative; z-index: 1; margin-top: auto; padding-top: 18px;
          display: inline-flex; align-items: center; gap: 6px; width: fit-content;
          font-size: .82rem; font-weight: 700; letter-spacing: .02em; color: var(--sc);
          opacity: .72; transform: translateY(2px);
          transition: opacity .28s ease, transform .28s cubic-bezier(.2, .8, .2, 1), gap .28s ease;
        }
        .svc-cta-arrow { display: inline-block; transition: transform .3s cubic-bezier(.2, 1.4, .3, 1); }
        .svc-card:hover .svc-cta { opacity: 1; transform: translateY(0); }
        .svc-cta:hover .svc-cta-arrow,
        .svc-card:hover .svc-cta-arrow { transform: translateX(4px); }
      `}</style>
    </section>
  );
}
