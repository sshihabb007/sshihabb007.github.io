import { useEffect, useRef } from 'react';

export function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observeAll = () => {
      root.querySelectorAll('.reveal:not(.vis)').forEach((el) => io.observe(el));
    };

    observeAll();

    const mo = new MutationObserver(() => observeAll());
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return ref;
}

interface SectionHeaderProps {
  label: string;
  title: string;
  sub?: string;
}

export function SectionHeader({ label, title, sub }: SectionHeaderProps) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 40 }} className="reveal">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span
          style={{
            width: 30,
            height: 2,
            background: 'var(--accent)',
            borderRadius: 2,
            display: 'inline-block',
          }}
        />
        <span
          style={{
            fontSize: '.78rem',
            fontWeight: 700,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 30,
            height: 2,
            background: 'var(--accent)',
            borderRadius: 2,
            display: 'inline-block',
          }}
        />
      </div>

      <h2
        className="syne"
        style={{
          fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-.02em',
          color: 'var(--text)',
        }}
      >
        {title}
      </h2>

      {sub && (
        <p
          style={{
            color: 'var(--text2)',
            marginTop: 12,
            maxWidth: 580,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: '.96rem',
            lineHeight: 1.7,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

