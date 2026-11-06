import React from 'react';
import type { AnimationModeId } from '../three/animationStore';

export function AnimationIcon({ mode, size = 20 }: { mode: AnimationModeId; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (mode) {
    case 'galaxy':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="12" rx="9.2" ry="3.9" transform="rotate(-28 12 12)" />
          <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'neural':
      return (
        <svg {...common}>
          <circle cx="6" cy="7" r="2" />
          <circle cx="18" cy="7" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="M8 7h8M7.2 8.8l3.8 7.4M16.8 8.8l-3.8 7.4" />
        </svg>
      );
    case 'code':
      return (
        <svg {...common}>
          <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.6 6l-3.2 12" />
        </svg>
      );
    case 'waves':
      return (
        <svg {...common}>
          <path d="M2.5 10c2.4-3.6 4.8-3.6 7.2 0s4.8 3.6 7.2 0 3-2.4 4.6-2" />
          <path d="M2.5 16c2.4-3.6 4.8-3.6 7.2 0s4.8 3.6 7.2 0 3-2.4 4.6-2" />
        </svg>
      );
    case 'warp':
      return (
        <svg {...common}>
          <path d="M8.6 8.6L4 4M15.4 8.6L20 4M8.6 15.4L4 20M15.4 15.4L20 20" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'tunnel':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <rect x="7" y="7" width="10" height="10" rx="2.4" />
          <rect x="10.4" y="10.4" width="3.2" height="3.2" rx="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'pulse':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="5.6" />
          <circle cx="12" cy="12" r="9.2" strokeDasharray="2 3" />
        </svg>
      );
    case 'thunder':
      return (
        <svg {...common}>
          <path d="M7 15.5A4.5 4.5 0 0 1 7.5 6.6 5.5 5.5 0 0 1 18 8.2a3.6 3.6 0 0 1-.5 7.3" />
          <path d="M12.6 11.5 9.8 16h3.4l-1.6 4.5 4.2-6h-3.3z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'wildfire':
      return (
        <svg {...common}>
          <path d="M12 3c.6 3.3 4.8 5.3 4.8 10a4.8 4.8 0 0 1-9.6 0c0-1.9.9-3.1 1.9-4.2.2 1.4.9 2.2 1.7 2.7C10.4 8.2 10.8 5.6 12 3z" />
          <path d="M12 21a2.3 2.3 0 0 1-2.3-2.3c0-1.3 1-2 2.3-3.2 1.3 1.2 2.3 1.9 2.3 3.2A2.3 2.3 0 0 1 12 21z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'sketch':
      return (
        <svg {...common}>
          <path d="m4 17 9.8-9.8 3 3L7 20l-4 1z" />
          <path d="m12.5 8.5 3 3M17.4 3.8l.8 1.7 1.8.3-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.3z" />
          <path d="M5 4h4M3 8h3" />
        </svg>
      );
  }
}

export function SocialIcon({ platform, size = 20 }: { platform: string; size?: number }) {
  switch (platform) {
    case 'phone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'email':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M2 6.5V18a2 2 0 0 0 2 2h2V9.8l6 4.5 6-4.5V20h2a2 2 0 0 0 2-2V6.5a2 2 0 0 0-3.2-1.6L12 10 5.2 4.9A2 2 0 0 0 2 6.5Z" fill="#EA4335" />
          <path d="M2 6.5V18a2 2 0 0 0 2 2h2V9.8L2 6.8V6.5Z" fill="#4285F4" />
          <path d="M22 6.5V18a2 2 0 0 1-2 2h-2V9.8l4-3V6.5Z" fill="#34A853" />
          <path d="M18 9.8V4.9l1.8-1.3A2 2 0 0 1 22 5.2v1.6l-4 3Z" fill="#FBBC05" opacity=".9" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.82 14.01c-.24.68-1.41 1.3-1.96 1.38-.5.08-1.14.11-1.84-.11-.42-.14-.97-.32-1.67-.62-2.94-1.27-4.86-4.23-5.01-4.43-.15-.2-1.2-1.59-1.2-3.04 0-1.45.76-2.16 1.03-2.45.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.04.91 2.19.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.49.22.57.35.07.12.07.72-.17 1.4Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
        </svg>
      );
    case 'github':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95Z" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" stroke="#34A853" strokeWidth="2.3" />
        </svg>
      );
  }
}

function normalizeServiceIconKey(raw?: string): string {
  if (!raw) return 'fullstack';
  const t = raw.toLowerCase().trim();
  if (t === 'database' || t === 'db' || t.includes('database') || t.includes('data manag') || t.includes('sql')) return 'database';
  if (t === 'fullstack' || t.includes('full-stack') || t.includes('full stack')) return 'fullstack';
  if (t === 'code' || t.includes('coding') || t.includes('software')) return 'code';
  if (t === 'frontend' || t.includes('front-end') || t.includes('ui/ux')) return 'frontend';
  if (t === 'backend' || t.includes('back-end') || t.includes('server')) return 'backend';
  if (t === 'ai' || t === 'ml' || t.includes('ai') || t.includes('machine learning') || t.includes('brain')) return 'ai';
  if (t === 'api' || t.includes('api') || t.includes('rest') || t.includes('microservices')) return 'api';
  if (t === 'cloud' || t.includes('cloud') || t.includes('gcp') || t.includes('aws')) return 'cloud';
  if (t === 'devops' || t.includes('devops') || t.includes('ci/cd') || t.includes('deployment')) return 'devops';
  if (t === 'performance' || t.includes('perform') || t.includes('optimiz') || t.includes('speed')) return 'performance';
  if (t === 'seo' || t.includes('seo') || t.includes('ranking')) return 'seo';
  if (t === 'security' || t.includes('security') || t.includes('auth')) return 'security';
  if (t === 'mobile' || t.includes('mobile') || t.includes('responsive') || t.includes('app')) return 'mobile';
  if (t === 'architecture' || t.includes('system design') || t.includes('architecture')) return 'architecture';
  if (t === 'testing' || t.includes('testing') || t.includes('qa')) return 'testing';
  if (t === 'ecommerce' || t.includes('e-commerce') || t.includes('ecommerce') || t.includes('shop')) return 'ecommerce';
  if (t === 'tools' || t.includes('tool') || t.includes('maint') || t.includes('debug')) return 'tools';
  return 'fullstack';
}

export function ServiceIcon({
  icon = 'fullstack',
  size = 28,
  color = 'currentColor',
  className = '',
  style,
}: {
  icon?: string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const key = normalizeServiceIconKey(icon);
  const stroke = color || 'currentColor';
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: className || undefined,
    style,
  };

  switch (key) {
    case 'fullstack':
      return (
        <svg {...props}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      );
    case 'code':
      return (
        <svg {...props}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <rect x="2" y="4" width="20" height="16" rx="2" opacity="0.4" />
        </svg>
      );
    case 'frontend':
      return (
        <svg {...props}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <line x1="2" y1="8" x2="22" y2="8" />
          <line x1="6" y1="5.5" x2="6.01" y2="5.5" strokeWidth="2.5" />
          <line x1="9" y1="5.5" x2="9.01" y2="5.5" strokeWidth="2.5" />
          <line x1="12" y1="5.5" x2="12.01" y2="5.5" strokeWidth="2.5" />
        </svg>
      );
    case 'backend':
      return (
        <svg {...props}>
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2.5" />
          <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2.5" />
          <line x1="10" y1="6" x2="14" y2="6" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
      );
    case 'database':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M21 5v7" />
        </svg>
      );
    case 'ai':
      return (
        <svg {...props}>
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
          <line x1="6" y1="12" x2="8" y2="12" />
          <line x1="16" y1="12" x2="18" y2="12" />
          <line x1="7" y1="8" x2="9" y2="8" />
          <line x1="15" y1="8" x2="17" y2="8" />
        </svg>
      );
    case 'api':
      return (
        <svg {...props}>
          <rect x="2" y="2" width="8" height="8" rx="2" />
          <rect x="14" y="2" width="8" height="8" rx="2" />
          <rect x="8" y="14" width="8" height="8" rx="2" />
          <line x1="6" y1="10" x2="6" y2="12" />
          <line x1="18" y1="10" x2="18" y2="12" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="12" y1="12" x2="12" y2="14" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...props}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <polyline points="12 13 12 9 10 11" opacity="0.6" />
        </svg>
      );
    case 'devops':
      return (
        <svg {...props}>
          <path d="M4 17l6-6-6-6" />
          <line x1="12" y1="19" x2="20" y2="19" />
          <path d="M16 8l4 4-4 4" opacity="0.6" />
        </svg>
      );
    case 'performance':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'seo':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <polyline points="8 13 11 9 14 11" strokeWidth="1.75" />
        </svg>
      );
    case 'security':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case 'mobile':
      return (
        <svg {...props}>
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
        </svg>
      );
    case 'architecture':
      return (
        <svg {...props}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'testing':
      return (
        <svg {...props}>
          <path d="M10 2v7.31M14 2v7.31" />
          <path d="M8.5 2h7" />
          <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
          <circle cx="11" cy="15" r="1" fill={stroke} />
          <circle cx="13" cy="18" r="1" fill={stroke} />
        </svg>
      );
    case 'ecommerce':
      return (
        <svg {...props}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
  }
}

export function CertBrandIcon({ type }: { type: 'google' | 'gemini' | 'faculty' | 'student' }) {
  if (type === 'gemini') {
    return <img src="/asset/gemini-sparkle.svg" alt="Gemini AI" style={{ width: 32, height: 32, objectFit: 'contain' }} />;
  }
  if (type === 'faculty') {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
      </svg>
    );
  }
  if (type === 'student') {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
        <circle cx="19" cy="19" r="2" />
      </svg>
    );
  }
  return (
    <svg width="30" height="30" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" />
    </svg>
  );
}

export function ProjectIllustration({ iconKey, accent, size = 56 }: { iconKey: string; accent: string; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: accent,
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (iconKey) {
    case 'ai-voice':
      return (
        <svg {...p}>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      );
    case 'agent':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
          <circle cx="5" cy="6" r="2" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="18" r="2" />
          <path d="M6.7 7.3 9.7 10M17.3 7.3 14.3 10M6.7 16.7 9.7 14M17.3 16.7 14.3 14" />
        </svg>
      );
    case 'crm':
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'shield':
    case 'shield-law':
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'healthcare':
      return (
        <svg {...p}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case 'network':
    case 'institute':
    case 'corporate':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case 'download':
      return (
        <svg {...p}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
    case 'cart':
    case 'devices':
    case 'smartphone':
    case 'tag':
      return (
        <svg {...p}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    case 'bot':
      return (
        <svg {...p}>
          <rect x="3" y="8" width="18" height="12" rx="3" />
          <path d="M12 3v5M8 13h.01M16 13h.01M9 17h6" />
        </svg>
      );
    case 'hospital':
      return (
        <svg {...p}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M12 8v6M9 11h6M9 21v-3h6v3" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...p}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'calculator':
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h8" />
        </svg>
      );
    case 'audit':
    case 'chart':
      return (
        <svg {...p}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}

export const SunIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const MoonIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const MenuIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const CloseIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const DownloadIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const SendIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const ExternalLinkIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const ChevronUpIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const ChevronLeftIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const MapPinIcon: React.FC<{ size?: number }> = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const GlobeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const AwardSealIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
