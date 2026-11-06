import { useEffect, useRef } from 'react';

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (typeof IntersectionObserver === 'undefined') {
      root.classList.add('visible', 'vis');
      root.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible', 'vis'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === root) {
            if (entry.isIntersecting) {
              root.classList.add('visible', 'vis');
            } else {
              root.classList.remove('visible');
            }
          } else if (entry.isIntersecting) {
            entry.target.classList.add('visible', 'vis');
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -20px 0px' }
    );

    io.observe(root);

    const observeChildren = () => {
      root.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    };
    observeChildren();

    const mo = new MutationObserver(() => observeChildren());
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
  const revealRef = useReveal<HTMLDivElement>();

  return (
    <div ref={revealRef} className="reveal section-header-wrap" style={{ textAlign: 'center' }}>
      <div className="section-label">
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--section-title-color)',
            display: 'inline-block',
          }}
        />
        {label}
      </div>

      <h2
        className="section-heading section-title"
        style={{
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 16,
          color: 'var(--section-title-color)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </h2>

      <div
        style={{
          width: 50,
          height: 4,
          background: 'var(--accent)',
          borderRadius: 10,
          margin: '0 auto',
        }}
      />

      {sub && (
        <p
          style={{
            color: 'var(--muted)',
            marginTop: 16,
            maxWidth: 620,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: '.96rem',
            lineHeight: 1.7,
          }}
        >
          {sub}
        </p>
      )}

      <style>{`
        .section-header-wrap { margin-bottom: 64px; }
        .section-heading { font-size: 2.8rem; }
        @media(max-width:768px){
          .section-header-wrap { margin-bottom: 40px !important; }
          .section-heading { font-size: 1.85rem !important; margin-bottom: 12px !important; }
        }
      `}</style>
    </div>
  );
}
