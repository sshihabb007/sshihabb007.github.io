import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { AwardSealIcon, CertBrandIcon, ExternalLinkIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

export function Certifications() {
  const revealRef = useReveal();

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--rx', `${((y / r.height - 0.5) * -7).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 7).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <section
      id="certifications"
      ref={revealRef}
      style={{
        padding: 'var(--section-py) 24px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader
          label="Credentials"
          title="Google & Gemini Certifications"
          sub="5 officially verified Google for Education & Generative AI credentials authenticated via Accredible Wallet"
        />

        {/* Verified Accredible Wallet Banner */}
        <div
          className="reveal card"
          style={{
            marginBottom: 28,
            padding: '18px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            background: 'linear-gradient(135deg, rgba(66,133,244,.08), rgba(139,92,246,.08))',
            borderColor: 'color-mix(in srgb, var(--accent) 30%, var(--border))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              className="syne"
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #4285F4, #8b5cf6)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              MH
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="syne" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                  Mehedi Hasan Shihab — Google for Education Verified Profile
                </span>
                <span
                  style={{
                    fontSize: '.7rem',
                    fontWeight: 700,
                    padding: '2px 9px',
                    borderRadius: 999,
                    background: 'rgba(16,185,129,.14)',
                    color: '#10b981',
                    border: '1px solid rgba(16,185,129,.3)',
                  }}
                >
                  ✓ 5 VERIFIED CREDENTIALS
                </span>
              </div>
              <div style={{ fontSize: '.83rem', color: 'var(--text2)', marginTop: 2 }}>
                Inspect official digital badges and blockchain/issuer verification directly on Google Accredible.
              </div>
            </div>
          </div>

          <a
            href={PORTFOLIO_DATA.contact.walletUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '.84rem' }}
          >
            <ExternalLinkIcon size={14} /> View Accredible Wallet
          </a>
        </div>

        <div
          className="cert-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 22,
          }}
        >
          {PORTFOLIO_DATA.certifications.map((cert, idx) => (
            <a
              key={cert.id}
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              style={{ '--cc': cert.c, textDecoration: 'none', color: 'inherit' } as React.CSSProperties}
              className={`card cert-card reveal d${Math.min((idx % 5) + 1, 5)}`}
            >
              <span className="cert-glow" aria-hidden="true" />
              <span className="cert-seal" aria-hidden="true">
                <AwardSealIcon size={18} />
              </span>
              <span className="syne cert-year-bg" aria-hidden="true">
                0{idx + 1}
              </span>

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>
                <div className="cert-icon" style={{ color: cert.c }}>
                  <CertBrandIcon type={cert.iconType} />
                </div>

                <div style={{ minWidth: 0, flex: 1, position: 'relative', zIndex: 1 }}>
                  <h3 className="syne cert-title">{cert.title}</h3>
                  <div className="cert-org">{cert.org}</div>
                  <div className="cert-date">{cert.date}</div>
                </div>
              </div>

              <p
                style={{
                  fontSize: '.84rem',
                  lineHeight: 1.65,
                  color: 'var(--text2)',
                  marginTop: 14,
                  marginBottom: 14,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {cert.desc}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 'auto',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {cert.tags.map((tg) => (
                  <span
                    key={tg}
                    style={{
                      fontSize: '.68rem',
                      fontWeight: 700,
                      letterSpacing: '.04em',
                      padding: '3px 9px',
                      borderRadius: 999,
                      background: `color-mix(in srgb, ${cert.c} 12%, var(--bg3))`,
                      color: cert.c,
                      border: `1px solid color-mix(in srgb, ${cert.c} 28%, transparent)`,
                    }}
                  >
                    {tg}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .cert-card {
          position: relative;
          padding: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px));
          transition: transform .25s cubic-bezier(.2, .8, .2, 1), border-color .3s ease, box-shadow .32s ease;
          will-change: transform;
        }
        .cert-card::before {
          content: '';
          position: absolute; left: 0; right: 0; top: 0; height: 3px;
          background: linear-gradient(90deg, var(--cc), color-mix(in srgb, var(--cc) 45%, var(--accent2)));
          transform: scaleX(.28); transform-origin: left; opacity: .7;
          transition: transform .4s cubic-bezier(.22, 1, .36, 1), opacity .3s ease;
        }
        .cert-card:hover {
          --lift: -5px;
          border-color: color-mix(in srgb, var(--cc) 55%, var(--border));
          box-shadow: 0 22px 44px -18px color-mix(in srgb, var(--cc) 40%, transparent);
        }
        .cert-card:hover::before { transform: scaleX(1); opacity: 1; }

        .cert-glow {
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(300px circle at var(--mx, 50%) var(--my, 40%),
            color-mix(in srgb, var(--cc) 15%, transparent), transparent 70%);
          opacity: 0; pointer-events: none; transition: opacity .3s ease;
        }
        .cert-card:hover .cert-glow { opacity: 1; }

        .cert-seal {
          position: absolute; top: 14px; right: 14px;
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--cc);
          background: color-mix(in srgb, var(--cc) 12%, transparent);
          border: 1px dashed color-mix(in srgb, var(--cc) 40%, transparent);
          opacity: .75;
          transition: transform .6s cubic-bezier(.22, 1, .36, 1), opacity .3s ease, background .3s ease;
        }
        .cert-card:hover .cert-seal {
          opacity: 1;
          transform: rotate(360deg) scale(1.08);
          background: color-mix(in srgb, var(--cc) 20%, transparent);
        }

        .cert-year-bg {
          position: absolute; right: 16px; bottom: -12px;
          font-size: 3.8rem; font-weight: 800; line-height: 1; letter-spacing: -.04em;
          color: var(--cc); opacity: .055; pointer-events: none; user-select: none;
          transition: opacity .35s ease, transform .45s cubic-bezier(.2, .8, .2, 1);
        }
        .cert-card:hover .cert-year-bg { opacity: .12; transform: translateY(-3px) scale(1.04); }

        .cert-icon {
          position: relative; z-index: 1;
          width: 56px; height: 56px; border-radius: 15px;
          background: #ffffff;
          border: 1px solid var(--border);
          box-shadow: 0 3px 10px rgba(0, 0, 0, .05);
          padding: 9px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: transform .42s cubic-bezier(.2, 1.45, .3, 1), box-shadow .3s ease, border-color .3s ease;
        }
        .cert-card:hover .cert-icon {
          transform: translateY(-2px) scale(1.09) rotate(-4deg);
          border-color: color-mix(in srgb, var(--cc) 55%, var(--border));
          box-shadow: 0 12px 24px -10px color-mix(in srgb, var(--cc) 55%, transparent);
        }
        .cert-title {
          font-weight: 700; font-size: .98rem; line-height: 1.35;
          margin-bottom: 5px; padding-right: 26px; color: var(--text);
          transition: color .25s ease;
        }
        .cert-card:hover .cert-title { color: var(--cc); }
        .cert-org { color: var(--cc); font-weight: 700; font-size: .82rem; margin-bottom: 6px; }
        .cert-date {
          display: inline-block; font-size: .74rem; font-weight: 600; color: var(--text3);
          padding: 2px 9px; border-radius: 999px;
          background: var(--bg3); border: 1px solid var(--border);
        }
      `}</style>
    </section>
  );
}

