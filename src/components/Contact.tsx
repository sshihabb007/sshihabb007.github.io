import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { MapPinIcon, SendIcon, SocialIcon } from './Icons';
import { SectionHeader, useReveal } from './SectionHeader';

const CONFETTI_COLORS = ['#2563eb', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b'];

interface ContactCardItem {
  id: string;
  label: string;
  val: string;
  href: string | null;
  color: string;
  icon: React.ReactNode;
}

export function Contact() {
  const { contact } = PORTFOLIO_DATA;
  const [form, setForm] = useState({ name: '', email: '', subject: '', msg: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [burstKey, setBurstKey] = useState(0);
  const revealRef = useReveal();

  const validName = form.name.trim().length >= 2;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const validMsg = form.msg.trim().length >= 6;
  const readyCount = [validName, validEmail, validMsg].filter(Boolean).length;

  const cards: ContactCardItem[] = [
    {
      id: 'ct-email',
      label: 'Email',
      val: contact.email,
      href: `mailto:${contact.email}`,
      color: 'var(--accent)',
      icon: <SocialIcon platform="email" size={20} />,
    },
    {
      id: 'ct-phone',
      label: 'Phone',
      val: contact.phone,
      href: `tel:${contact.phone.replace(/[^+\d]/g, '')}`,
      color: '#16a34a',
      icon: <SocialIcon platform="phone" size={20} />,
    },
    {
      id: 'ct-wa',
      label: 'WhatsApp',
      val: contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}`,
      color: '#25D366',
      icon: <SocialIcon platform="whatsapp" size={20} />,
    },
    {
      id: 'ct-loc',
      label: 'Location',
      val: contact.location,
      href: null,
      color: 'var(--accent3)',
      icon: <MapPinIcon size={20} />,
    },
    {
      id: 'ct-li',
      label: 'LinkedIn',
      val: 'linkedin.com/in/mehedi-hasan-shihab',
      href: contact.linkedinUrl,
      color: '#0A66C2',
      icon: <SocialIcon platform="linkedin" size={20} />,
    },
    {
      id: 'ct-gh',
      label: 'GitHub',
      val: 'github.com/sshihabb007',
      href: contact.githubUrl,
      color: '#8b5cf6',
      icon: <SocialIcon platform="github" size={20} />,
    },
  ];

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--rx', `${((y / r.height - 0.5) * -6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 6).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validName || !validEmail || !validMsg || status === 'sending') return;

    setStatus('sending');
    const subjectLine = encodeURIComponent(
      form.subject.trim() || `Portfolio Inquiry from ${form.name.trim()}`
    );
    const bodyText = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\nMessage:\n${form.msg.trim()}`
    );

    window.setTimeout(() => {
      window.location.href = `mailto:${contact.email}?subject=${subjectLine}&body=${bodyText}`;
      setStatus('sent');
      setBurstKey((n) => n + 1);
      setForm({ name: '', email: '', subject: '', msg: '' });
      window.setTimeout(() => setStatus('idle'), 5000);
    }, 380);
  };

  return (
    <section
      id="contact"
      ref={revealRef}
      style={{
        padding: 'var(--section-py) 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="svc-aurora ct-aurora-1" aria-hidden="true" />
      <div className="svc-aurora ct-aurora-2" aria-hidden="true" />

      <div style={{ maxWidth: 1020, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="Get In Touch"
          title="Contact Me"
          sub="Have a full-stack platform, AI solution, or security project in mind? Let's collaborate."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.35fr',
            gap: 40,
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Left column */}
          <div className="reveal">
            <h3 className="syne ct-title">Let&apos;s Connect</h3>
            <p
              style={{
                color: 'var(--text2)',
                lineHeight: 1.78,
                fontSize: '.92rem',
                marginBottom: 24,
              }}
            >
              Open to Senior Software Engineering roles, remote Web &amp; AI development contracts,
              enterprise WordPress &amp; CRM consulting, and emergency cybersecurity recovery.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {cards.map((item, idx) => {
                const inner = (
                  <>
                    <span className="ct-glow" aria-hidden="true" />
                    <div className="ct-icon">{item.icon}</div>
                    <div style={{ minWidth: 0, flex: 1, position: 'relative', zIndex: 1 }}>
                      <div
                        style={{
                          fontSize: '.7rem',
                          color: 'var(--text3)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '.08em',
                        }}
                      >
                        {item.label}
                      </div>
                      <div className="ct-val">{item.val}</div>
                    </div>
                    {item.href && (
                      <span className="ct-arrow" aria-hidden="true">
                        ↗
                      </span>
                    )}
                  </>
                );

                const styleProps = {
                  '--cc': item.color,
                  animationDelay: `${idx * 55}ms`,
                } as React.CSSProperties;

                return item.href ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onPointerMove={onMove}
                    onPointerLeave={onLeave}
                    style={styleProps}
                    className="card ct-card ct-link"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={item.id}
                    onPointerMove={onMove}
                    onPointerLeave={onLeave}
                    style={styleProps}
                    className="card ct-card"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: Send a Message */}
          <div
            onPointerMove={(e) => {
              if (e.pointerType === 'touch') return;
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
            }}
            className="card cf-card reveal d2"
          >
            <span className="cf-glow" aria-hidden="true" />

            <div className="cf-head">
              <h3 className="syne" style={{ fontWeight: 700, fontSize: '1.12rem' }}>
                Send a Message
              </h3>
              <span className="mono cf-prog-label">{readyCount} / 3 ready</span>
            </div>

            <div className="cf-prog" aria-hidden="true">
              <span
                className="cf-prog-fill"
                style={{ transform: `scaleX(${(readyCount / 3).toFixed(3)})` }}
              />
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
                className="form-row"
              >
                <div className={`cf-field${validName ? ' is-valid' : ''}`}>
                  <label className="cf-label">
                    <span>Name *</span>
                    <span className="cf-tick" aria-hidden="true">
                      ✓
                    </span>
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="cf-input"
                  />
                </div>

                <div className={`cf-field${validEmail ? ' is-valid' : ''}`}>
                  <label className="cf-label">
                    <span>Email *</span>
                    <span className="cf-tick" aria-hidden="true">
                      ✓
                    </span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="cf-input"
                  />
                </div>
              </div>

              <div className={`cf-field${form.subject.trim().length > 0 ? ' is-valid' : ''}`}>
                <label className="cf-label">
                  <span>Subject</span>
                  <span className="cf-opt">optional</span>
                </label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Project inquiry / Hiring / Collaboration"
                  className="cf-input"
                />
              </div>

              <div className={`cf-field${validMsg ? ' is-valid' : ''}`}>
                <label className="cf-label">
                  <span>Message *</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span className="mono cf-count">{form.msg.length} chars</span>
                    <span className="cf-tick" aria-hidden="true">
                      ✓
                    </span>
                  </span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.msg}
                  onChange={(e) => setForm({ ...form, msg: e.target.value })}
                  placeholder="Tell me about your project, timeline, or question..."
                  style={{ resize: 'vertical' }}
                  className="cf-input"
                />
              </div>

              {status === 'sent' && (
                <div className="cf-alert cf-alert-ok">
                  <span className="cf-alert-icon">✓</span>
                  <span>
                    Email draft opened for <strong>{contact.email}</strong>! Looking forward to
                    speaking with you.
                  </span>
                </div>
              )}

              <div style={{ position: 'relative' }}>
                {burstKey > 0 && (
                  <div key={burstKey} className="cf-burst" aria-hidden="true">
                    {Array.from({ length: 18 }).map((_, i) => {
                      const angle = (i / 18) * Math.PI * 2;
                      const dist = 58 + (i % 3) * 22;
                      return (
                        <span
                          key={i}
                          style={
                            {
                              '--dx': `${Math.cos(angle) * dist}px`,
                              '--dy': `${Math.sin(angle) * dist - 14}px`,
                              '--rot': `${i * 47}deg`,
                              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                            } as React.CSSProperties
                          }
                        />
                      );
                    })}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`btn-primary cf-submit ${status}`}
                >
                  {status === 'sending' ? (
                    <>
                      <span className="cf-spinner" aria-hidden="true" />
                      <span>Preparing Message…</span>
                    </>
                  ) : status === 'sent' ? (
                    <>
                      <span>✓</span>
                      <span>Message Ready</span>
                    </>
                  ) : (
                    <>
                      <span className="cf-plane">
                        <SendIcon size={16} />
                      </span>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Academic References Row */}
        <div className="reveal" style={{ marginTop: 42 }}>
          <div
            style={{
              fontSize: '.76rem',
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 14,
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
                className="card"
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
                <div style={{ fontSize: '.82rem', color: 'var(--text2)' }}>
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
                  }}
                >
                  ✉ {ref.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .svc-aurora {
          position: absolute; width: 460px; height: 460px; border-radius: 50%;
          filter: blur(120px); opacity: .10; pointer-events: none; z-index: 0;
        }
        .ct-aurora-1 {
          top: -120px; right: -140px;
          background: radial-gradient(circle, var(--accent), transparent 68%);
          animation: ctDrift 17s ease-in-out infinite alternate;
        }
        .ct-aurora-2 {
          bottom: -160px; left: -140px;
          background: radial-gradient(circle, var(--accent2), transparent 68%);
          animation: ctDrift 21s ease-in-out infinite alternate-reverse;
        }
        @keyframes ctDrift { to { transform: translate(-70px, 60px) scale(1.15); } }

        .ct-title {
          font-weight: 800; font-size: 1.35rem; margin-bottom: 12px;
          background: linear-gradient(120deg, var(--text) 20%, var(--accent) 55%, var(--accent2) 85%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ctShine 7s ease-in-out infinite alternate;
        }
        @keyframes ctShine { to { background-position: 100% 50%; } }

        .ct-card {
          position: relative; padding: 13px 16px;
          display: flex; align-items: center; gap: 14px; overflow: hidden;
          transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateX(var(--shift, 0px));
          transition: transform .25s cubic-bezier(.2, .8, .2, 1), border-color .28s ease, box-shadow .3s ease;
          will-change: transform;
        }
        .ct-card::after {
          content: ''; position: absolute; left: 0; top: 22%; bottom: 22%;
          width: 3px; border-radius: 0 3px 3px 0; background: var(--cc);
          transform: scaleY(.35); opacity: .55;
          transition: transform .32s cubic-bezier(.2, .8, .2, 1), opacity .28s ease, top .32s ease, bottom .32s ease;
        }
        .ct-card:hover {
          --shift: 4px;
          border-color: color-mix(in srgb, var(--cc) 55%, var(--border));
          box-shadow: 0 16px 34px -16px color-mix(in srgb, var(--cc) 42%, transparent);
        }
        .ct-card:hover::after { top: 12%; bottom: 12%; transform: scaleY(1); opacity: 1; }

        .ct-glow {
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(240px circle at var(--mx, 30%) var(--my, 50%),
            color-mix(in srgb, var(--cc) 16%, transparent), transparent 70%);
          opacity: 0; pointer-events: none; transition: opacity .28s ease;
        }
        .ct-card:hover .ct-glow { opacity: 1; }

        .ct-icon {
          position: relative; z-index: 1;
          width: 40px; height: 40px; border-radius: 12px;
          background: color-mix(in srgb, var(--cc) 12%, var(--bg3));
          border: 1px solid color-mix(in srgb, var(--cc) 26%, transparent);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--cc);
          transition: transform .38s cubic-bezier(.2, 1.45, .3, 1), background .28s ease, box-shadow .28s ease;
        }
        .ct-card:hover .ct-icon {
          transform: scale(1.1) rotate(-5deg);
          background: color-mix(in srgb, var(--cc) 20%, var(--bg3));
          box-shadow: 0 10px 20px -8px color-mix(in srgb, var(--cc) 55%, transparent);
        }
        .ct-val {
          font-weight: 600; font-size: .86rem; color: var(--text);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          transition: color .25s ease;
        }
        .ct-link:hover .ct-val { color: var(--cc); }
        .ct-arrow {
          position: relative; z-index: 1; font-size: .92rem; font-weight: 700; color: var(--text3);
          opacity: .55; transition: transform .3s cubic-bezier(.2, 1.4, .3, 1), color .25s ease, opacity .25s ease;
        }
        .ct-link:hover .ct-arrow { opacity: 1; color: var(--cc); transform: translate(3px, -3px); }

        .cf-card { position: relative; padding: 32px 30px 30px; overflow: hidden; }
        .cf-glow {
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 20%),
            color-mix(in srgb, var(--accent) 11%, transparent), transparent 70%);
          opacity: 0; pointer-events: none; transition: opacity .35s ease;
        }
        .cf-card:hover .cf-glow { opacity: 1; }
        .cf-head {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 12px;
        }
        .cf-prog-label { font-size: .74rem; color: var(--text3); letter-spacing: .04em; }
        .cf-prog {
          position: relative; z-index: 1; height: 3px; border-radius: 3px;
          background: var(--bg3); overflow: hidden; margin-bottom: 22px;
        }
        .cf-prog-fill {
          display: block; width: 100%; height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent2), #10b981);
          transform-origin: left;
          transition: transform .45s cubic-bezier(.22, 1, .36, 1);
        }

        .cf-field { position: relative; }
        .cf-label {
          display: flex; align-items: center; justify-content: space-between;
          font-size: .78rem; font-weight: 600; color: var(--text2);
          margin-bottom: 6px; transition: color .25s ease;
        }
        .cf-field:focus-within .cf-label { color: var(--accent); }
        .cf-opt, .cf-count { font-size: .7rem; font-weight: 500; color: var(--text3); }
        .cf-tick {
          display: inline-flex; align-items: center; justify-content: center;
          width: 16px; height: 16px; border-radius: 50%;
          font-size: .66rem; font-weight: 800;
          color: #fff; background: #10b981;
          opacity: 0; transform: scale(.4);
          transition: opacity .25s ease, transform .32s cubic-bezier(.2, 1.5, .3, 1);
        }
        .cf-field.is-valid .cf-tick { opacity: 1; transform: scale(1); }

        .cf-input {
          width: 100%; padding: 11px 14px; border-radius: 11px;
          border: 1.5px solid var(--border); background: var(--bg3);
          color: var(--text); font-family: inherit; font-size: .9rem; outline: none;
          transition: border-color .25s ease, background .25s ease, box-shadow .28s ease, transform .2s ease;
        }
        .cf-input:hover { border-color: color-mix(in srgb, var(--accent) 35%, var(--border)); }
        .cf-input:focus {
          border-color: var(--accent);
          background: var(--bg2);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 14%, transparent);
        }
        .cf-field.is-valid .cf-input:not(:focus) {
          border-color: color-mix(in srgb, #10b981 45%, var(--border));
        }

        .cf-alert {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 15px; border-radius: 11px;
          font-size: .86rem; font-weight: 600;
          animation: cfAlertIn .36s cubic-bezier(.2, 1.3, .3, 1);
        }
        @keyframes cfAlertIn {
          from { opacity: 0; transform: translateY(-6px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cf-alert-ok {
          background: rgba(16, 185, 129, .11);
          border: 1px solid rgba(16, 185, 129, .32);
          color: #10b981;
        }
        .cf-alert-icon {
          width: 20px; height: 20px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: .72rem; font-weight: 800; flex-shrink: 0;
          background: currentColor; color: #fff;
        }

        .cf-submit {
          width: 100%; justify-content: center; position: relative; overflow: hidden;
          transition: transform .25s cubic-bezier(.2, 1.3, .3, 1), box-shadow .3s ease, background .3s ease, opacity .25s ease;
        }
        .cf-submit.sending { opacity: .82; cursor: wait; }
        .cf-submit.sent {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          box-shadow: 0 10px 26px -8px rgba(16, 185, 129, .6) !important;
        }
        .cf-plane { display: inline-flex; transition: transform .35s cubic-bezier(.2, 1.4, .3, 1); }
        .cf-submit:hover:not(:disabled) .cf-plane { transform: translate(3px, -3px) rotate(-8deg); }
        .cf-spinner {
          width: 15px; height: 15px; border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, .35); border-top-color: #fff;
          animation: cfSpin .7s linear infinite;
        }
        @keyframes cfSpin { to { transform: rotate(360deg); } }

        .cf-burst { position: absolute; left: 50%; top: 50%; width: 0; height: 0; pointer-events: none; z-index: 3; }
        .cf-burst span {
          position: absolute; left: -4px; top: -4px; width: 8px; height: 8px; border-radius: 2px;
          animation: cfPop .85s cubic-bezier(.16, .84, .3, 1) forwards;
        }
        @keyframes cfPop {
          0%   { opacity: 1; transform: translate(0, 0) scale(.6) rotate(0deg); }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1) rotate(var(--rot)); }
        }

        @media (max-width: 780px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
          .cf-card { padding: 24px 20px !important; }
        }
      `}</style>
    </section>
  );
}

