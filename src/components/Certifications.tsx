import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { CertBrandIcon, ExternalLinkIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

function CertArrowUpRight() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function CertSealSvg() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M12 2l2.4 1.7 2.9-.2 1.2 2.7 2.5 1.5-.6 2.9 1.1 2.7-1.9 2.2-.2 2.9-2.8.9-1.8 2.3-2.8-1.1-2.8 1.1-1.8-2.3-2.8-.9-.2-2.9L2.3 14.3l1.1-2.7-.6-2.9 2.5-1.5 1.2-2.7 2.9.2z"
        opacity=".35"
      />
      <polyline points="8.5 12.2 11 14.7 15.7 9.7" />
    </svg>
  );
}

export function Certifications() {
  const bannerRevealRef = useReveal<HTMLDivElement>();
  const gridRevealRef = useReveal<HTMLDivElement>();

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const rxRatio = (e.clientX - rect.left) / rect.width;
    const ryRatio = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    el.style.setProperty('--rx', `${((0.5 - ryRatio) * 8).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((rxRatio - 0.5) * 10).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <section
      id="certifications"
      className="cert-section"
      style={{ padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <SectionHeader
          label="Achievements"
          title="Certifications"
          sub="5 officially verified Google for Education & Generative AI credentials authenticated via Accredible Wallet"
        />

        {/* Verified Accredible Wallet Banner */}
        <div
          ref={bannerRevealRef}
          className="reveal card"
          style={{
            marginBottom: 28,
            padding: '18px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, var(--surface)), color-mix(in srgb, var(--accent2) 8%, var(--surface)))',
            borderColor: 'color-mix(in srgb, var(--accent) 32%, var(--border))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              className="syne"
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
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
              <div style={{ fontSize: '.84rem', color: 'var(--muted)', marginTop: 2 }}>
                Inspect official digital badges and issuer verification directly on Google Accredible.
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

        <div ref={gridRevealRef} className="cert-grid">
          {PORTFOLIO_DATA.certifications.map((cert, idx) => (
            <a
              key={cert.id}
              title="View Certificate"
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-card cert-card--link"
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              style={{ '--i': idx } as React.CSSProperties}
            >
              <span className="cert-ring" aria-hidden="true" />
              <span className="cert-seal" aria-hidden="true">
                <CertSealSvg />
              </span>

              <div className="cert-icon" style={{ color: cert.c }}>
                <span className="cert-icon-pulse" aria-hidden="true" />
                <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CertBrandIcon type={cert.iconType} />
                </div>
              </div>

              <h3 className="cert-title">{cert.title}</h3>

              <div className="cert-meta">
                <span className="cert-org">{cert.org}</span>
                <span className="cert-dot" aria-hidden="true" />
                <span className="cert-date">{cert.date}</span>
              </div>

              <p
                style={{
                  fontSize: '.84rem',
                  lineHeight: 1.62,
                  color: 'var(--muted)',
                  margin: '2px 0 6px',
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
                  marginBottom: 4,
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
                      background: `color-mix(in srgb, ${cert.c} 12%, var(--surface2))`,
                      color: cert.c,
                      border: `1px solid color-mix(in srgb, ${cert.c} 28%, transparent)`,
                    }}
                  >
                    {tg}
                  </span>
                ))}
              </div>

              <span className="cert-link">
                View certificate <CertArrowUpRight />
              </span>

              <span className="cert-bar" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
