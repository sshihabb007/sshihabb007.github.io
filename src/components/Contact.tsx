import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { MapPinIcon, SendIcon, SocialIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

const CONFETTI_COLORS = ['#38bdf8', '#3b82f6', '#a78bfa', '#2dd4bf', '#fbbf24', '#f472b6'];

function pseudoRand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function CheckTickSvg() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="5 12 10 17 19 7" />
    </svg>
  );
}

interface ContactCardItem {
  key: string;
  label: string;
  value: string;
  href: string | null;
  clr: string;
  bg: string;
  ic: string;
  icon: React.ReactNode;
}

export function Contact() {
  const { contact } = PORTFOLIO_DATA;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [websiteHoney, setWebsiteHoney] = useState('');
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'validation_error' | 'email_error'>('idle');
  const [burstKey, setBurstKey] = useState(0);

  const leftRevealRef = useReveal<HTMLDivElement>();
  const rightRevealRef = useReveal<HTMLDivElement>();
  const refsRevealRef = useReveal<HTMLDivElement>();

  const validName = form.name.trim().length >= 2;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const validMsg = form.message.trim().length >= 10;
  const readyCount = [validName, validEmail, validMsg].filter(Boolean).length;

  const invalidName = triedSubmit && !validName;
  const invalidEmail = triedSubmit && !validEmail;
  const invalidMsg = triedSubmit && !validMsg;
  const isSending = status === 'sending';

  const cards: ContactCardItem[] = [
    {
      key: 'ct-email',
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      clr: 'var(--mail-color)',
      bg: 'color-mix(in srgb, var(--mail-color) 14%, var(--surface2))',
      ic: 'var(--mail-color)',
      icon: <SocialIcon platform="email" size={20} />,
    },
    {
      key: 'ct-phone',
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^+\d]/g, '')}`,
      clr: 'var(--phone-color)',
      bg: 'color-mix(in srgb, var(--phone-color) 14%, var(--surface2))',
      ic: 'var(--phone-color)',
      icon: <SocialIcon platform="phone" size={20} />,
    },
    {
      key: 'ct-wa',
      label: 'WhatsApp',
      value: contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}`,
      clr: 'var(--wa-color)',
      bg: 'color-mix(in srgb, var(--wa-color) 14%, var(--surface2))',
      ic: 'var(--wa-color)',
      icon: <SocialIcon platform="whatsapp" size={20} />,
    },
    {
      key: 'ct-loc',
      label: 'Location',
      value: contact.location,
      href: null,
      clr: 'var(--pin-color)',
      bg: 'color-mix(in srgb, var(--pin-color) 14%, var(--surface2))',
      ic: 'var(--pin-color)',
      icon: <MapPinIcon size={20} />,
    },
    {
      key: 'ct-li',
      label: 'LinkedIn',
      value: 'linkedin.com/in/mehedi-hasan-shihab',
      href: contact.linkedinUrl,
      clr: '#0A66C2',
      bg: 'color-mix(in srgb, #0A66C2 14%, var(--surface2))',
      ic: '#0A66C2',
      icon: <SocialIcon platform="linkedin" size={20} />,
    },
    {
      key: 'ct-gh',
      label: 'GitHub',
      value: 'github.com/sshihabb007',
      href: contact.githubUrl,
      clr: '#8b5cf6',
      bg: 'color-mix(in srgb, #8b5cf6 14%, var(--surface2))',
      ic: '#8b5cf6',
      icon: <SocialIcon platform="github" size={20} />,
    },
  ];

  const onCardPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const rxRatio = (e.clientX - rect.left) / rect.width;
    const ryRatio = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    el.style.setProperty('--rx', `${((0.5 - ryRatio) * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((rxRatio - 0.5) * 7).toFixed(2)}deg`);
  };

  const onCardPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  const onFormCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteHoney.trim().length > 0 || isSending) return;
    setTriedSubmit(true);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('validation_error');
      return;
    }
    if (!validEmail) {
      setStatus('email_error');
      return;
    }
    if (!validName || !validMsg) {
      setStatus('validation_error');
      return;
    }

    setStatus('sending');
    const subjectLine = encodeURIComponent(
      form.subject.trim() || `Portfolio Inquiry from ${form.name.trim()}`
    );
    const bodyText = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\nMessage:\n${form.message.trim()}`
    );

    window.setTimeout(() => {
      window.location.href = `mailto:${contact.email}?subject=${subjectLine}&body=${bodyText}`;
      setStatus('sent');
      setTriedSubmit(false);
      setBurstKey((n) => n + 1);
      setForm({ name: '', email: '', subject: '', message: '' });
      window.setTimeout(() => setStatus('idle'), 5500);
    }, 420);
  };

  return (
    <section
      id="contact"
      className="ct-section"
      style={{ padding: '72px 24px 80px' }}
    >
      <div className="svc-aurora" aria-hidden="true">
        <span className="svc-blob svc-blob--a" />
        <span className="svc-blob svc-blob--b" />
        <span className="svc-blob svc-blob--c" />
      </div>

      <div className="svc-wrap" style={{ maxWidth: 1180, margin: '0 auto' }}>
        <SectionHeader
          label="Get In Touch"
          title="Contact Me"
          sub="Have a full-stack platform, AI solution, or security project in mind? Let's collaborate."
        />

        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: 36,
            alignItems: 'start',
          }}
        >
          {/* Left column */}
          <div ref={leftRevealRef} className="reveal contact-left">
            <h3
              className="ct-title"
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Let&apos;s Connect
            </h3>
            <p
              style={{
                color: 'var(--text)',
                opacity: 0.85,
                fontSize: '.95rem',
                fontWeight: 500,
                lineHeight: 1.7,
                marginBottom: 22,
              }}
            >
              Open to Senior Software Engineering roles, remote Web &amp; AI development contracts,
              enterprise WordPress &amp; CRM consulting, and emergency cybersecurity recovery.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cards.map((item, idx) => {
                const inner = (
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div
                      className="cc-icon"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: item.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.ic,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: '.7rem',
                          fontFamily: `'DM Sans', sans-serif`,
                          fontWeight: 400,
                          textTransform: 'uppercase',
                          letterSpacing: '.12em',
                          color: 'var(--contact-label-color)',
                          marginBottom: 2,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontFamily: `'DM Sans', sans-serif`,
                          fontWeight: 500,
                          color: item.clr,
                          fontSize: '.95rem',
                          letterSpacing: '0.01em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                    {item.href && (
                      <svg
                        className="cc-go"
                        width="20"
                        height="20"
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
                    )}
                  </div>
                );

                return item.href ? (
                  <a
                    key={item.key}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="card edu-card contact-card"
                    onPointerMove={onCardPointerMove}
                    onPointerLeave={onCardPointerLeave}
                    style={
                      {
                        padding: '14px 20px',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        '--i': idx,
                        '--cc': item.clr,
                      } as React.CSSProperties
                    }
                  >
                    <span className="cc-ring" aria-hidden="true" />
                    {inner}
                  </a>
                ) : (
                  <div
                    key={item.key}
                    className="card edu-card contact-card"
                    onPointerMove={onCardPointerMove}
                    onPointerLeave={onCardPointerLeave}
                    style={
                      {
                        padding: '14px 20px',
                        '--i': idx,
                        '--cc': item.clr,
                      } as React.CSSProperties
                    }
                  >
                    <span className="cc-ring" aria-hidden="true" />
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: Send a Message */}
          <div ref={rightRevealRef} className="reveal contact-right">
            <div
              className="card edu-card contact-form-card"
              onPointerMove={onFormCardPointerMove}
              style={{ padding: '28px 32px 30px' }}
            >
              <div
                className="cf-progress"
                style={{ '--p': readyCount / 3 } as React.CSSProperties}
              >
                <span />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                  Send a Message
                </h3>
                <span className="cf-progress-note">
                  <b>{readyCount}</b> / 3 ready
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={websiteHoney}
                  onChange={(e) => setWebsiteHoney(e.target.value)}
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: 1,
                    height: 1,
                    opacity: 0,
                    pointerEvents: 'none',
                  }}
                />

                <div
                  className={`cf-field${invalidName ? ' cf-invalid' : ''}${validName ? ' cf-ok' : ''}`}
                  style={{ '--f': 0 } as React.CSSProperties}
                >
                  <div className="cf-label-row">
                    <label
                      style={{
                        display: 'block',
                        fontSize: '.85rem',
                        fontFamily: `'DM Sans', sans-serif`,
                        fontWeight: 400,
                        marginBottom: 6,
                        letterSpacing: '0.04em',
                        color: 'var(--text)',
                      }}
                    >
                      Full Name
                    </label>
                    <span className="cf-tick" aria-hidden="true">
                      <CheckTickSvg />
                    </span>
                  </div>
                  <input
                    className="input-field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    disabled={isSending}
                  />
                </div>

                <div
                  className={`cf-field${invalidEmail ? ' cf-invalid' : ''}${validEmail ? ' cf-ok' : ''}`}
                  style={{ '--f': 1 } as React.CSSProperties}
                >
                  <div className="cf-label-row">
                    <label
                      style={{
                        display: 'block',
                        fontSize: '.85rem',
                        fontFamily: `'DM Sans', sans-serif`,
                        fontWeight: 400,
                        marginBottom: 6,
                        letterSpacing: '0.04em',
                        color: 'var(--text)',
                      }}
                    >
                      Email Address
                    </label>
                    <span className="cf-tick" aria-hidden="true">
                      <CheckTickSvg />
                    </span>
                  </div>
                  <input
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    disabled={isSending}
                  />
                </div>

                <div
                  className={`cf-field${form.subject.trim().length > 0 ? ' cf-ok' : ''}`}
                  style={{ '--f': 1.5 } as React.CSSProperties}
                >
                  <div className="cf-label-row">
                    <label
                      style={{
                        display: 'block',
                        fontSize: '.85rem',
                        fontFamily: `'DM Sans', sans-serif`,
                        fontWeight: 400,
                        marginBottom: 6,
                        letterSpacing: '0.04em',
                        color: 'var(--text)',
                      }}
                    >
                      Subject <span style={{ opacity: 0.55, fontSize: '.76rem' }}>(optional)</span>
                    </label>
                    <span className="cf-tick" aria-hidden="true">
                      <CheckTickSvg />
                    </span>
                  </div>
                  <input
                    className="input-field"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Project inquiry / Hiring / Collaboration"
                    disabled={isSending}
                  />
                </div>

                <div
                  className={`cf-field${invalidMsg ? ' cf-invalid' : ''}${validMsg ? ' cf-ok' : ''}`}
                  style={{ '--f': 2 } as React.CSSProperties}
                >
                  <div className="cf-label-row">
                    <label
                      style={{
                        display: 'block',
                        fontSize: '.85rem',
                        fontFamily: `'DM Sans', sans-serif`,
                        fontWeight: 400,
                        marginBottom: 6,
                        letterSpacing: '0.04em',
                        color: 'var(--text)',
                      }}
                    >
                      Message
                    </label>
                    <span className="cf-tick" aria-hidden="true">
                      <CheckTickSvg />
                    </span>
                  </div>
                  <textarea
                    className="input-field"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project…"
                    style={{ resize: 'vertical' }}
                    disabled={isSending}
                  />
                  <span className={`cf-count${validMsg ? ' cf-count--ok' : ''}`}>
                    {form.message.trim().length} chars
                    {validMsg ? '' : ' · add a few more words'}
                  </span>
                </div>

                <div className="cf-send-wrap">
                  <button
                    type="submit"
                    className={`btn-primary contact-send${isSending ? ' is-sending' : ''}${status === 'sent' ? ' is-sent' : ''}`}
                    style={
                      {
                        justifyContent: 'center',
                        opacity: isSending ? 0.85 : 1,
                        '--f': 3,
                      } as React.CSSProperties
                    }
                    disabled={isSending}
                  >
                    {isSending ? (
                      <span className="cf-spinner" aria-hidden="true" />
                    ) : (
                      <SendIcon size={16} />
                    )}
                    {isSending
                      ? 'Sending…'
                      : status === 'sent'
                        ? 'Message Sent!'
                        : 'Send Message'}
                  </button>

                  {burstKey > 0 && (
                    <span key={burstKey} className="cf-burst" aria-hidden="true">
                      {Array.from({ length: 18 }, (_, i) => {
                        const angle = (i / 18) * Math.PI * 2 + pseudoRand(i) * 0.3;
                        const dist = 70 + pseudoRand(i + 40) * 90;
                        return (
                          <i
                            key={i}
                            style={
                              {
                                '--x': `${Math.cos(angle) * dist}px`,
                                '--y': `${Math.sin(angle) * dist - 30}px`,
                                '--r': `${Math.round(pseudoRand(i + 80) * 540 - 270)}deg`,
                                '--c': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                              } as React.CSSProperties
                            }
                          />
                        );
                      })}
                    </span>
                  )}
                </div>

                {status === 'validation_error' && (
                  <div className="alert-box alert-warning">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span style={{ color: 'var(--text)', opacity: 0.9 }}>
                      Please complete your name, valid email, and a short message (10+ characters) before sending.
                    </span>
                  </div>
                )}

                {status === 'email_error' && (
                  <div className="alert-box alert-warning">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span style={{ color: 'var(--text)', opacity: 0.9 }}>
                      Please enter a valid email address so I can reply to you.
                    </span>
                  </div>
                )}

                {status === 'sent' && (
                  <div className="alert-box alert-success">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span style={{ color: 'var(--text)', opacity: 0.95 }}>
                      Email draft opened for <strong>{contact.email}</strong>! Looking forward to speaking with you.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Academic References Row */}
        <div ref={refsRevealRef} className="reveal" style={{ marginTop: 48 }}>
          <div
            style={{
              fontSize: '.76rem',
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Academic References
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 18,
            }}
          >
            {contact.references.map((ref) => (
              <div
                key={ref.id}
                className="card edu-card"
                style={{
                  padding: '22px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div className="syne" style={{ fontWeight: 700, fontSize: '1.02rem', color: 'var(--text)' }}>
                  {ref.name}
                </div>
                <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--accent)' }}>
                  {ref.role}
                </div>
                <div style={{ fontSize: '.83rem', color: 'var(--muted)' }}>
                  {ref.dept} · {ref.institution}
                </div>
                <a
                  href={`mailto:${ref.email}`}
                  className="mono"
                  style={{
                    marginTop: 4,
                    fontSize: '.8rem',
                    fontWeight: 600,
                    color: 'var(--accent2)',
                    width: 'fit-content',
                    textDecoration: 'none',
                  }}
                >
                  ✉ {ref.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
