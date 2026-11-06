import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { ServiceIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function Services() {
  const gridRevealRef = useReveal<HTMLDivElement>();

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--rx', `${((0.5 - ny) * 7).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((nx - 0.5) * 9).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <section id="services" className="svc-section">
      <div className="svc-aurora" aria-hidden="true">
        <span className="svc-blob svc-blob--a" />
        <span className="svc-blob svc-blob--b" />
        <span className="svc-blob svc-blob--c" />
      </div>

      <div className="svc-wrap">
        <SectionHeader label="What I Offer" title="Services" />

        <p className="svc-lead">
          From the first idea to a live, secure, and scalable product — here is how I help
          organizations engineer full-stack platforms, AI systems, and enterprise infrastructure.
        </p>

        <div ref={gridRevealRef} className="svc-grid">
          {PORTFOLIO_DATA.services.map((svc, idx) => (
            <article
              key={svc.id}
              className="svc-card"
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              style={{ '--c': svc.c || 'var(--accent)', '--i': idx } as React.CSSProperties}
            >
              <span className="svc-num" aria-hidden="true">
                {svc.n || String(idx + 1).padStart(2, '0')}
              </span>

              <div className="svc-icon">
                <span className="svc-icon-pulse" aria-hidden="true" />
                <ServiceIcon
                  icon={svc.icon}
                  size={28}
                  color={svc.c}
                  className="svc-icon-svg"
                />
              </div>

              <h3 className="svc-title">{svc.title}</h3>
              <p className="svc-desc">{svc.desc}</p>

              <a href="#contact" className="svc-link">
                <span>Discuss this service</span>
                <ArrowRightIcon />
              </a>

              <span className="svc-bar" aria-hidden="true" />
            </article>
          ))}
        </div>

        <div className="svc-cta">
          <div className="svc-cta-text">
            <strong>Have a project in mind?</strong>
            <span>
              Tell me what you need — I&apos;ll reply with an architecture plan, timeline, and clear
              next step.
            </span>
          </div>
          <a href="#contact" className="svc-cta-btn">
            <span>Let&apos;s work together</span>
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
