/** @type {import('tailwindcss').Config} */
// Shared Tailwind CSS configuration (also embedded inline in index.html for zero-build serving)
window.TAILWIND_PORTFOLIO_CONFIG = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'DM Sans', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        kalam: ['Kalam', 'cursive'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        accent: 'var(--accent)',
        accent2: 'var(--accent2)',
        accent3: 'var(--accent3)',
        accent4: 'var(--accent4)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
      maxWidth: {
        portfolio: '1360px',
      },
    },
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.TAILWIND_PORTFOLIO_CONFIG;
}

