let cancelScroll: (() => void) | null = null;
let programmaticScroll = false;

export const isProgrammaticScroll = () => programmaticScroll;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

export const isDarkTheme = () =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('dark');

export function observeTheme(cb: (dark: boolean) => void) {
  const obs = new MutationObserver(() => cb(isDarkTheme()));
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => obs.disconnect();
}

let webglSupportedCache: boolean | undefined;
export function hasWebGL(): boolean {
  if (webglSupportedCache !== undefined) return webglSupportedCache;
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    webglSupportedCache = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webglSupportedCache = false;
  }
  return webglSupportedCache;
}

export function onIdle(cb: () => void, timeout = 1500): () => void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = (window as Window & typeof globalThis).requestIdleCallback(cb, { timeout });
    return () => (window as Window & typeof globalThis).cancelIdleCallback(id);
  }
  const id = setTimeout(cb, 200);
  return () => clearTimeout(id);
}

function getNavHeight(): number {
  const nav = document.querySelector('nav');
  const inner = nav?.firstElementChild as HTMLElement | null;
  if (!nav || !inner) return 0;
  const cs = getComputedStyle(nav);
  return inner.offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + 1;
}

const maxScrollY = () =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

function targetScrollY(el: HTMLElement): number {
  if (el.id === 'home') return 0;
  const pt = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const extra = window.innerWidth <= 768 ? 20 : 28;
  return Math.min(maxScrollY(), Math.max(0, Math.round(top + pt - getNavHeight() - extra)));
}

function animateScrollTo(computeY: () => number, targetId?: string) {
  cancelScroll?.();
  const startY = window.scrollY;
  const destY = computeY();
  const dist = Math.abs(destY - startY);
  if (dist < 2) return;
  if (prefersReducedMotion()) {
    window.scrollTo({ top: destY, behavior: 'instant' as ScrollBehavior });
    return;
  }
  const duration = Math.min(1500, Math.max(650, 480 + dist * 0.3));
  let raf = 0;
  let stopped = false;
  const start = performance.now();
  programmaticScroll = true;
  if (targetId) {
    window.dispatchEvent(new CustomEvent('nav:target', { detail: targetId }));
  }
  const stop = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchstart', stop);
    window.removeEventListener('keydown', stop);
    window.removeEventListener('pointerdown', stop);
    programmaticScroll = false;
    if (cancelScroll === stop) cancelScroll = null;
    window.dispatchEvent(new Event('scroll'));
  };
  cancelScroll = stop;
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('keydown', stop);
  window.addEventListener('pointerdown', stop, { passive: true });

  const step = (now: number) => {
    if (stopped) return;
    const t = Math.min(1, (now - start) / duration);
    const goal = computeY();
    const y = startY + (goal - startY) * easeInOutCubic(t);
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    if (t < 1) {
      raf = requestAnimationFrame(step);
    } else {
      window.scrollTo({ top: computeY(), behavior: 'instant' as ScrollBehavior });
      stop();
    }
  };
  raf = requestAnimationFrame(step);
}

export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  animateScrollTo(() => targetScrollY(el), id);
  return true;
}

export function scrollToTop() {
  animateScrollTo(() => 0, 'home');
}

export function bindHashAnchorClicks(): () => void {
  const handler = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) return;
    const id = decodeURIComponent((anchor.getAttribute('href') || '').slice(1));
    if (id && scrollToSection(id)) {
      e.preventDefault();
    }
  };
  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
}

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
export function safeHref(raw?: string | null): string {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return '';
  if (/^(\/|#|\.\/|\.\.\/)/.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed, 'https://placeholder.invalid');
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
      return ALLOWED_PROTOCOLS.has(parsed.protocol) ? trimmed : '#';
    }
    return trimmed;
  } catch {
    return '#';
  }
}

