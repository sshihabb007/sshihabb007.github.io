/* ==========================================================================
   Mehedi Hasan Shihab Portfolio — Vanilla JS SVG Icon & Doodle Library
   ========================================================================== */
(function () {
  function animationIcon(mode, size) {
    const s = size || 20;
    const attrs = `width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
    switch (mode) {
      case 'galaxy':
        return `<svg ${attrs}><ellipse cx="12" cy="12" rx="9.2" ry="3.9" transform="rotate(-28 12 12)" /><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" /></svg>`;
      case 'neural':
        return `<svg ${attrs}><circle cx="6" cy="7" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="12" cy="18" r="2" /><path d="M8 7h8M7.2 8.8l3.8 7.4M16.8 8.8l-3.8 7.4" /></svg>`;
      case 'code':
        return `<svg ${attrs}><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.6 6l-3.2 12" /></svg>`;
      case 'waves':
        return `<svg ${attrs}><path d="M2.5 10c2.4-3.6 4.8-3.6 7.2 0s4.8 3.6 7.2 0 3-2.4 4.6-2" /><path d="M2.5 16c2.4-3.6 4.8-3.6 7.2 0s4.8 3.6 7.2 0 3-2.4 4.6-2" /></svg>`;
      case 'warp':
        return `<svg ${attrs}><path d="M8.6 8.6L4 4M15.4 8.6L20 4M8.6 15.4L4 20M15.4 15.4L20 20" /><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" /></svg>`;
      case 'tunnel':
        return `<svg ${attrs}><rect x="3" y="3" width="18" height="18" rx="4" /><rect x="7" y="7" width="10" height="10" rx="2.4" /><rect x="10.4" y="10.4" width="3.2" height="3.2" rx="1" fill="currentColor" stroke="none" /></svg>`;
      case 'pulse':
        return `<svg ${attrs}><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="5.6" /><circle cx="12" cy="12" r="9.2" stroke-dasharray="2 3" /></svg>`;
      case 'thunder':
        return `<svg ${attrs}><path d="M7 15.5A4.5 4.5 0 0 1 7.5 6.6 5.5 5.5 0 0 1 18 8.2a3.6 3.6 0 0 1-.5 7.3" /><path d="M12.6 11.5 9.8 16h3.4l-1.6 4.5 4.2-6h-3.3z" fill="currentColor" stroke="none" /></svg>`;
      case 'wildfire':
        return `<svg ${attrs}><path d="M12 3c.6 3.3 4.8 5.3 4.8 10a4.8 4.8 0 0 1-9.6 0c0-1.9.9-3.1 1.9-4.2.2 1.4.9 2.2 1.7 2.7C10.4 8.2 10.8 5.6 12 3z" /><path d="M12 21a2.3 2.3 0 0 1-2.3-2.3c0-1.3 1-2 2.3-3.2 1.3 1.2 2.3 1.9 2.3 3.2A2.3 2.3 0 0 1 12 21z" fill="currentColor" stroke="none" /></svg>`;
      case 'sketch':
      default:
        return `<svg ${attrs}><path d="m4 17 9.8-9.8 3 3L7 20l-4 1z" /><path d="m12.5 8.5 3 3M17.4 3.8l.8 1.7 1.8.3-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.3z" /><path d="M5 4h4M3 8h3" /></svg>`;
    }
  }

  function socialIcon(platform, size) {
    const s = size || 20;
    switch (platform) {
      case 'phone':
        return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>`;
      case 'email':
        return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M2 6.5V18a2 2 0 0 0 2 2h2V9.8l6 4.5 6-4.5V20h2a2 2 0 0 0 2-2V6.5a2 2 0 0 0-3.2-1.6L12 10 5.2 4.9A2 2 0 0 0 2 6.5Z" fill="#EA4335" /><path d="M2 6.5V18a2 2 0 0 0 2 2h2V9.8L2 6.8V6.5Z" fill="#4285F4" /><path d="M22 6.5V18a2 2 0 0 1-2 2h-2V9.8l4-3V6.5Z" fill="#34A853" /><path d="M18 9.8V4.9l1.8-1.3A2 2 0 0 1 22 5.2v1.6l-4 3Z" fill="#FBBC05" opacity=".9" /></svg>`;
      case 'whatsapp':
        return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#25D366"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.82 14.01c-.24.68-1.41 1.3-1.96 1.38-.5.08-1.14.11-1.84-.11-.42-.14-.97-.32-1.67-.62-2.94-1.27-4.86-4.23-5.01-4.43-.15-.2-1.2-1.59-1.2-3.04 0-1.45.76-2.16 1.03-2.45.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.04.91 2.19.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.49.22.57.35.07.12.07.72-.17 1.4Z" /></svg>`;
      case 'linkedin':
        return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#0A66C2"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" /></svg>`;
      case 'github':
        return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" /></svg>`;
      case 'facebook':
        return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="#1877F2"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95Z" /></svg>`;
      default:
        return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" stroke="#34A853" stroke-width="2.3" /></svg>`;
    }
  }

  function normalizeServiceIconKey(raw) {
    if (!raw) return 'fullstack';
    const t = String(raw).toLowerCase().trim();
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

  function serviceIcon(icon, size, color, className) {
    const key = normalizeServiceIconKey(icon);
    const s = size || 28;
    const stroke = color || 'currentColor';
    const cls = className ? ` class="${className}"` : '';
    const attrs = `width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}`;
    switch (key) {
      case 'fullstack':
        return `<svg ${attrs}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></svg>`;
      case 'code':
        return `<svg ${attrs}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><rect x="2" y="4" width="20" height="16" rx="2" opacity="0.4" /></svg>`;
      case 'frontend':
        return `<svg ${attrs}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><line x1="2" y1="8" x2="22" y2="8" /><line x1="6" y1="5.5" x2="6.01" y2="5.5" stroke-width="2.5" /><line x1="9" y1="5.5" x2="9.01" y2="5.5" stroke-width="2.5" /><line x1="12" y1="5.5" x2="12.01" y2="5.5" stroke-width="2.5" /></svg>`;
      case 'backend':
        return `<svg ${attrs}><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" stroke-width="2.5" /><line x1="6" y1="18" x2="6.01" y2="18" stroke-width="2.5" /><line x1="10" y1="6" x2="14" y2="6" /><line x1="10" y1="18" x2="14" y2="18" /></svg>`;
      case 'database':
        return `<svg ${attrs}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M21 5v7" /></svg>`;
      case 'ai':
        return `<svg ${attrs}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" /><line x1="6" y1="12" x2="8" y2="12" /><line x1="16" y1="12" x2="18" y2="12" /><line x1="7" y1="8" x2="9" y2="8" /><line x1="15" y1="8" x2="17" y2="8" /></svg>`;
      case 'api':
        return `<svg ${attrs}><rect x="2" y="2" width="8" height="8" rx="2" /><rect x="14" y="2" width="8" height="8" rx="2" /><rect x="8" y="14" width="8" height="8" rx="2" /><line x1="6" y1="10" x2="6" y2="12" /><line x1="18" y1="10" x2="18" y2="12" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="12" y1="12" x2="12" y2="14" /></svg>`;
      case 'cloud':
        return `<svg ${attrs}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /><polyline points="12 13 12 9 10 11" opacity="0.6" /></svg>`;
      case 'devops':
        return `<svg ${attrs}><path d="M4 17l6-6-6-6" /><line x1="12" y1="19" x2="20" y2="19" /><path d="M16 8l4 4-4 4" opacity="0.6" /></svg>`;
      case 'performance':
        return `<svg ${attrs}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>`;
      case 'seo':
        return `<svg ${attrs}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><polyline points="8 13 11 9 14 11" stroke-width="1.75" /></svg>`;
      case 'security':
        return `<svg ${attrs}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>`;
      case 'mobile':
        return `<svg ${attrs}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="2.5" /></svg>`;
      case 'architecture':
        return `<svg ${attrs}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>`;
      case 'testing':
        return `<svg ${attrs}><path d="M10 2v7.31M14 2v7.31" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><circle cx="11" cy="15" r="1" fill="${stroke}" /><circle cx="13" cy="18" r="1" fill="${stroke}" /></svg>`;
      case 'ecommerce':
        return `<svg ${attrs}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>`;
      default:
        return `<svg ${attrs}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>`;
    }
  }

  function certBrandIcon(type) {
    if (type === 'gemini') {
      return `<img src="./asset/gemini-sparkle.svg" alt="Gemini AI" style="width:32px;height:32px;object-fit:contain;" />`;
    }
    if (type === 'faculty') {
      return `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" /></svg>`;
    }
    if (type === 'student') {
      return `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" /><circle cx="19" cy="19" r="2" /></svg>`;
    }
    return `<svg width="30" height="30" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" /></svg>`;
  }

  function projectIllustration(iconKey, accent, size) {
    const s = size || 56;
    const attrs = `width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`;
    switch (iconKey) {
      case 'ai-voice':
        return `<svg ${attrs}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>`;
      case 'agent':
        return `<svg ${attrs}><circle cx="12" cy="12" r="3" /><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="M6.7 7.3 9.7 10M17.3 7.3 14.3 10M6.7 16.7 9.7 14M17.3 16.7 14.3 14" /></svg>`;
      case 'crm':
        return `<svg ${attrs}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>`;
      case 'shield':
      case 'shield-law':
        return `<svg ${attrs}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>`;
      case 'healthcare':
        return `<svg ${attrs}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>`;
      case 'network':
      case 'institute':
      case 'corporate':
        return `<svg ${attrs}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>`;
      case 'download':
        return `<svg ${attrs}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>`;
      case 'cart':
      case 'devices':
      case 'smartphone':
      case 'tag':
        return `<svg ${attrs}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>`;
      case 'bot':
        return `<svg ${attrs}><rect x="3" y="8" width="18" height="12" rx="3" /><path d="M12 3v5M8 13h.01M16 13h.01M9 17h6" /></svg>`;
      case 'hospital':
        return `<svg ${attrs}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M12 8v6M9 11h6M9 21v-3h6v3" /></svg>`;
      case 'bolt':
        return `<svg ${attrs}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>`;
      case 'calculator':
        return `<svg ${attrs}><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h8" /></svg>`;
      case 'audit':
      case 'chart':
        return `<svg ${attrs}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>`;
      default:
        return `<svg ${attrs}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>`;
    }
  }

  function sunIcon(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>`;
  }

  function moonIcon(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>`;
  }

  function menuIcon(size = 24) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>`;
  }

  function closeIcon(size = 24) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>`;
  }

  function downloadIcon(size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>`;
  }

  function sendIcon(size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>`;
  }

  function externalLinkIcon(size = 14) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>`;
  }

  function chevronUpIcon(size = 24) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15" /></svg>`;
  }

  function chevronLeftIcon(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>`;
  }

  function chevronRightIcon(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>`;
  }

  function mapPinIcon(size = 13) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>`;
  }

  function arrowRightIcon(size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>`;
  }

  function eyePeekIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>`;
  }

  function infoDocIcon() {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>`;
  }

  function certArrowUpRight() {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>`;
  }

  function certSealSvg() {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.4 1.7 2.9-.2 1.2 2.7 2.5 1.5-.6 2.9 1.1 2.7-1.9 2.2-.2 2.9-2.8.9-1.8 2.3-2.8-1.1-2.8 1.1-1.8-2.3-2.8-.9-.2-2.9L2.3 14.3l1.1-2.7-.6-2.9 2.5-1.5 1.2-2.7 2.9.2z" opacity=".35" /><polyline points="8.5 12.2 11 14.7 15.7 9.7" /></svg>`;
  }

  function checkTickSvg() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7" /></svg>`;
  }

  function sketchHeaderDoodleSvg() {
    return `<svg class="sketch-header-doodle" viewBox="0 0 48 32" aria-hidden="true"><path d="m4 23 15-15 8 8-15 15-9 2zM16 11l8 8M28 9l5-5 11 11-5 5M31 6l-3-3" /><path d="M33 27h11M36 23h8" /></svg>`;
  }

  function cyberCursorSvg() {
    return `<svg viewBox="0 0 88 88" width="88" height="88"><circle cx="44" cy="44" r="17" /><g class="cyber-xhair__dash"><path d="M44 15.5a28.5 28.5 0 0 1 24.7 14.2" /><path d="M72.5 44a28.5 28.5 0 0 1-14.2 24.7" /><path d="M44 72.5a28.5 28.5 0 0 1-24.7-14.2" /><path d="M15.5 44a28.5 28.5 0 0 1 14.2-24.7" /></g><path d="M44 2v18M44 68v18M2 44h18M68 44h18" /><circle cx="44" cy="44" r="1.8" class="cyber-xhair__dot" /></svg>`;
  }

  function neuralBrainSvg() {
    return `<svg viewBox="0 0 240 170" role="presentation">
      <defs>
        <linearGradient id="neuralBrainStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#55e5ff" />
          <stop offset="1" stop-color="#a78bfa" />
        </linearGradient>
      </defs>
      <path class="neural-brain-outline" d="M119 25C105 10 82 15 76 32 57 24 39 39 43 58 22 65 25 91 43 101 32 119 48 138 70 132 80 151 103 148 119 133 135 150 159 147 168 132 190 139 208 120 197 102 216 87 210 63 194 57 199 38 180 24 162 31 152 13 131 14 119 25Z" />
      <path class="neural-brain-fold" d="M119 27C112 46 126 54 118 72 111 90 126 104 119 132M77 34C86 43 84 54 75 62 66 71 72 82 83 86M158 34C148 43 151 54 161 62 171 70 164 82 154 87M54 99C68 94 77 102 78 115M184 99C169 94 160 103 159 116M91 37C101 42 103 52 98 61M146 39C136 45 136 55 141 64M90 106C101 97 109 101 115 112M146 104C137 96 129 100 124 112" />
      <g class="neural-brain-links">
        <path d="M52 72 77 55 99 63 119 47 143 58 166 47 190 68M47 99 76 87 96 99 119 83 144 97 167 83 196 98M68 121 91 111 119 123 145 111 171 123M77 55 76 87 91 111M99 63 96 99 91 111M119 47 119 83 119 123M143 58 144 97 145 111M166 47 167 83 171 123" />
      </g>
      <g class="neural-brain-nodes">
        <circle cx="52" cy="72" r="3" />
        <circle cx="77" cy="55" r="3.5" />
        <circle cx="99" cy="63" r="3" />
        <circle cx="119" cy="47" r="4" />
        <circle cx="143" cy="58" r="3" />
        <circle cx="166" cy="47" r="3.5" />
        <circle cx="190" cy="68" r="3" />
        <circle cx="47" cy="99" r="3" />
        <circle cx="76" cy="87" r="3.5" />
        <circle cx="96" cy="99" r="3" />
        <circle cx="119" cy="83" r="4" />
        <circle cx="144" cy="97" r="3.5" />
        <circle cx="167" cy="83" r="3" />
        <circle cx="196" cy="98" r="3" />
        <circle cx="68" cy="121" r="3" />
        <circle cx="91" cy="111" r="3.5" />
        <circle cx="119" cy="123" r="4" />
        <circle cx="145" cy="111" r="3" />
        <circle cx="171" cy="123" r="3.5" />
      </g>
      <circle class="neural-brain-signal" cx="119" cy="83" r="7" />
    </svg>`;
  }

  function sketchHeroDoodlesSvg() {
    return `
      <svg class="sketch-hero-doodles-desktop" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(770 82) rotate(-8)">
          <ellipse cx="50" cy="40" rx="45" ry="17" />
          <ellipse cx="50" cy="40" rx="45" ry="17" transform="rotate(60 50 40)" />
          <ellipse cx="50" cy="40" rx="45" ry="17" transform="rotate(120 50 40)" />
          <circle cx="50" cy="40" r="5" />
          <text x="23" y="91" class="sketch-label">React</text>
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(1230 142) rotate(7)">
          <path d="m45 2 39 22v45L45 91 6 69V24zM45 2v44m39-22L45 46 6 24m39 22v45" />
          <text x="19" y="56" class="sketch-label">node</text>
          <text x="12" y="112" class="sketch-label">Node.js</text>
        </g>
        <g class="sketch-doodle sketch-doodle--purple" transform="translate(670 112) rotate(-3)">
          <rect x="2" y="5" width="132" height="82" rx="5" />
          <path d="M2 25h132M15 15h2m10 0h2" />
          <path d="m25 44-12 9 12 9m24-18 12 9-12 9m-8-15-8 21" />
          <text x="74" y="57" class="sketch-label">build</text>
        </g>
        <g class="sketch-doodle sketch-doodle--orange" transform="translate(100 660) rotate(5)">
          <rect x="4" y="4" width="118" height="74" rx="5" />
          <path d="M4 23h118M18 14h2m10 0h2" />
          <path d="m28 39-10 8 10 8m19-16 10 8-10 8m-7-13-7 19" />
          <text x="20" y="101" class="sketch-label">Software Eng.</text>
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(1230 655) rotate(-6)">
          <path d="M8 80V34L63 5l57 29v46H8zM0 35 63 0l65 35M48 80V53h31v27M96 15h17v18" />
          <path d="M35 33c-13 4-18 18-9 25l10-5 5 12 9-9-6-13 13-8-4-8-15 5z" />
          <text x="22" y="105" class="sketch-label">Gemini AI</text>
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(1050 455) rotate(7)">
          <path d="M32 3C17 3 6 15 6 29c0 13 9 21 21 24l-4 15 15-13c13-4 21-14 21-27C59 14 48 3 32 3z" />
          <path d="m20 22 8 7-8 7m17-14 8 7-8 7m-4-12-4 12" />
        </g>
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(965 680) rotate(5)">
          <path d="M8 8h42v32H8zM17 18h24M17 26h16M17 34h20" />
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(755 760) rotate(-4)">
          <path d="m4 22 13 13L43 8M2 42h48" />
        </g>
        <g class="sketch-doodle sketch-doodle--orange" transform="translate(520 115) rotate(8)">
          <circle cx="18" cy="18" r="14" />
          <path d="m12 18 5 5 9-11" />
        </g>
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(305 392) rotate(-5)">
          <path d="M8 10h54v40H8zM22 22l-8 8 8 8m24-16 8 8-8 8m-7-19-7 22" />
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(1110 318) rotate(6)">
          <circle cx="10" cy="12" r="5" />
          <circle cx="55" cy="5" r="5" />
          <circle cx="38" cy="43" r="5" />
          <circle cx="83" cy="32" r="5" />
          <path d="m15 11 35-5m3 4-13 28m-1 1 40-5" />
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(840 660) rotate(-7)">
          <path d="m28 2 7 17 18-7-8 17 18 7-19 4 6 18-16-10-10 17-3-19-19 4 13-14L2 25l19 1z" />
        </g>
        <g class="sketch-doodle sketch-doodle--purple" transform="translate(1050 120) rotate(4)">
          <rect x="5" y="6" width="60" height="43" rx="4" />
          <path d="M5 18h60M16 12h2m8 0h2m-9 17h36M17 37h24" />
        </g>
        <g class="sketch-doodle sketch-doodle--orange" transform="translate(275 750) rotate(8)">
          <path d="M7 11h45v34H7zM17 11V5h25v6M17 23h25M17 32h25M17 40h15" />
        </g>
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(1330 430) rotate(-5)">
          <path d="M6 16c0-7 8-11 15-7 5-7 16-5 18 3 8-1 13 5 10 12-2 6-10 8-17 5-6 6-18 4-21-2-5 0-7-5-5-11z" />
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(625 795) rotate(-4)">
          <path d="m5 21 11 11 23-26M2 43h44" />
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(715 245) rotate(5)">
          <circle cx="8" cy="8" r="4" />
          <circle cx="39" cy="8" r="4" />
          <circle cx="24" cy="34" r="4" />
          <path d="M12 8h23M10 12l11 18m16-18L27 30" />
        </g>
      </svg>

      <svg class="sketch-hero-doodles-mobile" viewBox="0 0 420 900" preserveAspectRatio="xMidYMid meet">
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(16 92) rotate(-8)">
          <ellipse cx="40" cy="32" rx="35" ry="13" />
          <ellipse cx="40" cy="32" rx="35" ry="13" transform="rotate(60 40 32)" />
          <ellipse cx="40" cy="32" rx="35" ry="13" transform="rotate(120 40 32)" />
          <circle cx="40" cy="32" r="4" />
          <text x="16" y="76" class="sketch-label">React</text>
        </g>
        <g class="sketch-doodle sketch-doodle--purple" transform="translate(294 55) rotate(4)">
          <rect x="3" y="4" width="86" height="56" rx="5" />
          <path d="M3 18h86M13 11h2m8 0h2m-8 23-9 7 9 7m20-14 9 7-9 7m-5-12-6 18" />
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(314 275) rotate(7)">
          <path d="m35 2 30 17v35L35 71 5 54V19zM35 2v34m30-17L35 36 5 19m30 17v35" />
          <text x="13" y="46" class="sketch-label">node</text>
        </g>
        <g class="sketch-doodle sketch-doodle--orange" transform="translate(18 430) rotate(5)">
          <rect x="3" y="4" width="74" height="52" rx="5" />
          <path d="M3 17h74M13 11h2m8 0h2m-7 21-8 6 8 6m18-12 8 6-8 6m-5-11-6 16" />
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(333 515) rotate(-7)">
          <path d="m22 2 6 14 15-4-8 13 14 7-16 3 4 15-13-9-9 14-2-16-16 3 11-12L0 18l16 1z" />
        </g>
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(307 715) rotate(-5)">
          <path d="M3 13c0-6 7-9 13-5 4-6 13-4 15 3 6-1 10 4 8 10-2 5-8 7-14 4-5 5-15 3-18-2-4 0-6-5-4-10z" />
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(25 760) rotate(-5)">
          <circle cx="8" cy="8" r="4" />
          <circle cx="43" cy="5" r="4" />
          <circle cx="27" cy="35" r="4" />
          <path d="m12 8 27-3m1 6L29 32" />
        </g>
      </svg>`;
  }

  function sketchBackdropSvg() {
    return `<div class="sketch-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(88 160) rotate(-7)">
          <path d="M4 22 49 4l43 18v54L49 94 4 76z" />
          <path d="m4 22 45 19 43-19M49 41v53" />
          <path d="m22 35 8 4-8 4m15 4h14" />
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(1210 195) rotate(5)">
          <rect x="4" y="8" width="126" height="82" rx="7" />
          <path d="M4 28h126M18 18h2m11 0h2" />
          <path d="m53 47-12 9 12 9m25-18 12 9-12 9m-9-14-8 20" />
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(135 610) rotate(4)">
          <ellipse cx="58" cy="20" rx="48" ry="15" />
          <path d="M10 20v52c0 9 22 16 48 16s48-7 48-16V20M10 46c0 9 22 16 48 16s48-7 48-16" />
          <path d="m43 37 12 11-12 11m28-22L59 59" />
        </g>
        <g class="sketch-doodle sketch-doodle--orange" transform="translate(1190 620) rotate(-6)">
          <path d="M8 82V34L66 5l58 29v48H8zM0 35 66 0l66 35M51 82V53h30v29M24 49h13m60 0h13" />
          <path d="M100 15h17v18" />
        </g>
        <g class="sketch-doodle sketch-doodle--purple" transform="translate(670 110) rotate(3)">
          <path d="M9 9h52v52H9zM22 23h25M22 34h25M22 45h16" />
          <path d="m80 42 28-28 15 15-28 28-19 5zM108 14l15 15" />
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(605 730) rotate(-3)">
          <path d="M10 28c0-12 10-20 22-20 9 0 16 5 20 13 5-8 12-13 21-13 12 0 22 8 22 20 0 19-43 49-43 49S10 47 10 28z" />
        </g>
        <g class="sketch-doodle sketch-doodle--purple" transform="translate(360 75) rotate(-8)">
          <path d="M10 10h24v24H10zM16 17h12M16 23h10M16 29h8" />
        </g>
        <g class="sketch-doodle sketch-doodle--orange" transform="translate(985 85) rotate(9)">
          <path d="m8 28 24-24 12 12-24 24-16 4zM27 9l12 12M4 44l8-2" />
        </g>
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(520 425) rotate(5)">
          <path d="m8 18 14-14 14 14-14 14zM22 4v28M8 18h28" />
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(1040 470) rotate(-6)">
          <path d="M7 5h28v28H7zM13 12h16M13 19h12M13 26h9" />
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(300 805) rotate(-5)">
          <path d="M8 20h34M25 4v32M12 8l26 25M38 8 12 33" />
        </g>
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(890 790) rotate(8)">
          <path d="M8 28 27 5l19 23zM27 5v23M8 28h38" />
        </g>
        <g class="sketch-doodle sketch-doodle--orange" transform="translate(65 405) rotate(8)">
          <path d="M7 6h36v28H7zM14 14l7 6-7 6m14-2h8" />
        </g>
        <g class="sketch-doodle sketch-doodle--purple" transform="translate(1330 405) rotate(-8)">
          <circle cx="22" cy="22" r="18" />
          <path d="m15 21 5 5 10-11" />
        </g>
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(280 280) rotate(-6)">
          <path d="m8 20 14-14 14 14-14 14zM8 20h28M22 6v28" />
          <circle cx="22" cy="20" r="5" />
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(1120 300) rotate(7)">
          <rect x="6" y="7" width="72" height="54" rx="4" />
          <path d="M6 22h72M17 15h2m9 0h2m9 0h2M18 34h48M18 44h36M18 54h42" />
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(760 285) rotate(-5)">
          <path d="M10 14c0-6 7-10 15-7 7-6 18-2 17 6 8 0 12 8 7 14-3 4-10 6-18 5-10 5-22 0-22-8-7-2-7-8 1-10z" />
          <path d="M22 23c8-9 15 8 24-3" />
        </g>
        <g class="sketch-doodle sketch-doodle--orange" transform="translate(470 185) rotate(8)">
          <path d="M26 3 32 18 48 11 41 27 56 33 40 38 46 54 31 46 23 61 20 44 3 47 14 34 3 22 20 23z" />
        </g>
        <g class="sketch-doodle sketch-doodle--purple" transform="translate(1010 520) rotate(5)">
          <path d="M6 12h62v42H6zM18 12V5h38v7M18 26h38M18 36h38M18 46h25" />
        </g>
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(185 455) rotate(8)">
          <path d="M8 10h46v34H8zM19 51h24M31 44v7M18 20h8m5 0h15M18 29h25" />
        </g>
        <g class="sketch-doodle sketch-doodle--green" transform="translate(725 585) rotate(-7)">
          <circle cx="13" cy="28" r="7" />
          <circle cx="54" cy="10" r="7" />
          <circle cx="61" cy="51" r="7" />
          <circle cx="100" cy="28" r="7" />
          <path d="m20 25 27-12m9 4 3 27m7 7 27-20m-66 0 27 0" />
        </g>
        <g class="sketch-doodle sketch-doodle--orange" transform="translate(1280 510) rotate(-8)">
          <path d="M7 12h48v36H7zM19 12V5h24v7M18 22h26M18 31h26M18 40h17" />
          <path d="m62 24 7 7 13-15" />
        </g>
        <g class="sketch-doodle sketch-doodle--pink" transform="translate(460 690) rotate(6)">
          <path d="m24 3 6 17 18-7-8 17 18 7-18 5 7 18-17-9-9 17-4-19-19 4 13-14L0 25l19 1z" />
        </g>
        <g class="sketch-doodle sketch-doodle--purple" transform="translate(850 180) rotate(-5)">
          <path d="M9 7h44v38H9zM20 19l-8 7 8 7m19-14 8 7-8 7m-5-17-7 20" />
        </g>
        <g class="sketch-doodle sketch-doodle--blue" transform="translate(75 745) rotate(5)">
          <path d="M10 22c0-8 8-13 17-9 5-8 18-7 21 2 9-2 15 5 12 12-2 7-11 9-18 6-7 7-21 5-24-2-6 0-8-4-8-9z" />
        </g>
      </svg>
    </div>`;
  }

  window.PortfolioIcons = {
    animationIcon,
    socialIcon,
    serviceIcon,
    certBrandIcon,
    projectIllustration,
    sunIcon,
    moonIcon,
    menuIcon,
    closeIcon,
    downloadIcon,
    sendIcon,
    externalLinkIcon,
    chevronUpIcon,
    chevronLeftIcon,
    chevronRightIcon,
    mapPinIcon,
    arrowRightIcon,
    eyePeekIcon,
    infoDocIcon,
    certArrowUpRight,
    certSealSvg,
    checkTickSvg,
    sketchHeaderDoodleSvg,
    cyberCursorSvg,
    neuralBrainSvg,
    sketchHeroDoodlesSvg,
    sketchBackdropSvg,
  };
})();

