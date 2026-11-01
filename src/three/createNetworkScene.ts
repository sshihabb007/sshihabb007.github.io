import * as THREE from 'three';
import {
  isCoarsePointer,
  isDarkTheme,
  observeTheme,
  prefersReducedMotion,
} from '../utils/scroll';
import { getAnimationMode, subscribeAnimationMode } from './animationStore';
import { loadMode } from './modes';
import {
  clamp,
  clamp01,
  createPointerTracker,
  damp,
  FrameState,
  SceneContext,
  SceneInstance,
} from './util';

const SECTION_TINTS: Record<string, [string, string]> = {
  education: ['#60a5fa', '#2563eb'],
  skills: ['#2dd4bf', '#0d9488'],
  services: ['#a78bfa', '#7c3aed'],
  experience: ['#818cf8', '#4f46e5'],
  projects: ['#38bdf8', '#0284c7'],
  tools: ['#22d3ee', '#0891b2'],
  publications: ['#22d3ee', '#0891b2'],
  certifications: ['#60a5fa', '#2563eb'],
  contact: ['#2dd4bf', '#0d9488'],
};

const SECTION_KEYS = Object.keys(SECTION_TINTS);
const DEFAULT_SECTION = 'education';

export function createNetworkScene(container: HTMLElement): () => void {
  const reduced = prefersReducedMotion();
  const coarse = isCoarsePointer();

  const size = {
    width: Math.max(1, window.innerWidth),
    height: Math.max(1, window.innerHeight),
  };
  const maxDpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: 'default',
  });
  renderer.setPixelRatio(maxDpr);
  renderer.setSize(size.width, size.height, false);
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    display: 'block',
    opacity: '0',
    transition: 'opacity 1.4s ease',
  });
  container.appendChild(canvas);

  const camZ = () => size.height / 2 / Math.tan(THREE.MathUtils.degToRad(20));
  const camera = new THREE.PerspectiveCamera(40, size.width / size.height, 10, 6000);
  const resetCamera = () => {
    camera.position.set(0, 0, camZ());
    camera.rotation.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  resetCamera();

  const scene = new THREE.Scene();
  let dark = isDarkTheme();

  const ctx: SceneContext = {
    scene,
    camera,
    size,
    dpr: maxDpr,
    compact: coarse || window.innerWidth < 768,
    dark,
    camZ,
  };

  let activeSection = DEFAULT_SECTION;
  const curTint = new THREE.Color();
  const tgtTint = new THREE.Color();
  const pickTintHex = () => (SECTION_TINTS[activeSection] ?? SECTION_TINTS[DEFAULT_SECTION])[dark ? 0 : 1];
  curTint.set(pickTintHex());
  tgtTint.copy(curTint);

  const homeEl = document.getElementById('home');
  let coveredByHero = false;
  let scrollProgress = 0;
  let lastScrollY = window.scrollY;
  let smoothSpeed = 0;

  const checkHeroCover = () => {
    if (!homeEl) return;
    const rect = homeEl.getBoundingClientRect();
    coveredByHero = rect.top <= 0 && rect.bottom >= window.innerHeight;
  };

  const sampleSections = () => {
    const maxS = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress = clamp01(window.scrollY / maxS);
    checkHeroCover();
    let found = DEFAULT_SECTION;
    for (const key of SECTION_KEYS) {
      const el = document.getElementById(key);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
        found = key;
      }
    }
    if (found !== activeSection) {
      activeSection = found;
      tgtTint.set(pickTintHex());
    }
  };

  const ptr = createPointerTracker();
  const frame: FrameState = {
    dt: 0,
    elapsed: 0,
    fade: 1,
    progress: 0,
    pointer: { x: 1e5, y: 1e5, power: 0, active: false },
    sway: { x: 0, y: 0 },
    scrollDelta: 0,
    scrollSpeed: 0,
    tint: curTint,
  };

  let hadPtr = false;
  let current: SceneInstance | null = null;
  let elapsed = 0;
  let idleClock = 0;
  let frameTick = 0;
  let raf = 0;
  let prevNow = 0;
  let running = false;
  let contextLost = false;
  let pendingFadeIn = false;
  let disposed = false;

  const stepScene = (dt: number) => {
    if (!current) return;
    idleClock += dt;
    frameTick++;
    elapsed += dt;
    if (frameTick % 8 === 1) sampleSections();
    curTint.lerp(tgtTint, 1 - Math.exp(-4 * dt));

    const y = window.scrollY;
    const dy = y - lastScrollY;
    lastScrollY = y;
    frame.scrollDelta = clamp(dy, -160, 160);
    smoothSpeed = damp(smoothSpeed, Math.abs(dy) / Math.max(dt, 0.001), 6, dt);
    frame.scrollSpeed = Math.min(smoothSpeed, 6000);
    frame.progress = scrollProgress;

    if (ptr.active) {
      const px = ptr.x - size.width / 2;
      const py = -(ptr.y - size.height / 2);
      if (hadPtr) {
        frame.pointer.x = damp(frame.pointer.x, px, 22, dt);
        frame.pointer.y = damp(frame.pointer.y, py, 22, dt);
      } else {
        frame.pointer.x = px;
        frame.pointer.y = py;
      }
    }
    hadPtr = ptr.active;
    frame.pointer.active = ptr.active;
    frame.pointer.power = damp(frame.pointer.power, ptr.active ? 1 : 0, 7, dt);

    const swayX = ptr.active ? clamp((ptr.x / size.width) * 2 - 1, -1, 1) : Math.sin(idleClock * 0.11) * 0.4;
    const swayY = ptr.active ? clamp((ptr.y / size.height) * 2 - 1, -1, 1) : Math.cos(idleClock * 0.09) * 0.25;
    frame.sway.x = damp(frame.sway.x, swayX, 2.2, dt);
    frame.sway.y = damp(frame.sway.y, swayY, 2.2, dt);
    frame.dt = dt;
    frame.elapsed = elapsed;
    current.update(frame);
  };

  const renderStatic = () => {
    sampleSections();
    curTint.copy(tgtTint);
    stepScene(1e-4);
    renderer.render(scene, camera);
    canvas.style.opacity = '1';
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!current) return;
    const dt = Math.min((now - prevNow) / 1000, 0.05);
    prevNow = now;
    if (coveredByHero) {
      lastScrollY = window.scrollY;
      checkHeroCover();
      if (!coveredByHero) sampleSections();
    } else {
      stepScene(dt);
      renderer.render(scene, camera);
      if (pendingFadeIn) {
        pendingFadeIn = false;
        canvas.style.transition = 'opacity 1s ease';
        canvas.style.opacity = '1';
      }
    }
  };

  const start = () => {
    if (running || reduced || document.hidden || contextLost) return;
    running = true;
    prevNow = performance.now();
    raf = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const syncPlay = () => {
    if (!document.hidden && !contextLost) start();
    else stop();
  };

  let loadSeq = 0;
  let swapTimer = 0;

  const activateMode = async (modeId: ReturnType<typeof getAnimationMode>) => {
    const seq = ++loadSeq;
    window.clearTimeout(swapTimer);
    let mod;
    try {
      mod = await loadMode(modeId);
    } catch (err) {
      console.warn(`[Background] could not load "${modeId}" mode:`, err);
      return;
    }
    if (disposed || seq !== loadSeq) return;

    const mountMod = () => {
      if (disposed || seq !== loadSeq) return;
      current?.dispose();
      current = null;
      resetCamera();
      ctx.dpr = Math.min(maxDpr, mod.backgroundDpr ?? maxDpr);
      renderer.setPixelRatio(ctx.dpr);
      ctx.dark = dark;
      try {
        current = mod.background(ctx);
      } catch (err) {
        console.warn(`[Background] "${modeId}" mode failed to start:`, err);
        return;
      }
      elapsed = reduced ? 8 : 0;
      if (reduced) renderStatic();
      else pendingFadeIn = true;
    };

    if (!current || reduced) {
      mountMod();
    } else {
      canvas.style.transition = 'opacity .28s ease';
      canvas.style.opacity = '0';
      swapTimer = window.setTimeout(mountMod, 300);
    }
  };

  const unsubMode = subscribeAnimationMode((m) => activateMode(m));

  const unsubTheme = observeTheme((nextDark) => {
    dark = nextDark;
    ctx.dark = nextDark;
    tgtTint.set(pickTintHex());
    current?.setTheme?.(nextDark);
    if (reduced && current) renderStatic();
  });

  const onPointerDown = (e: PointerEvent) => {
    if (
      current &&
      running &&
      !reduced &&
      !coveredByHero &&
      current.pointerDown &&
      (e.button === 0 || e.pointerType !== 'mouse')
    ) {
      current.pointerDown(e.clientX - size.width / 2, -(e.clientY - size.height / 2));
    }
  };
  window.addEventListener('pointerdown', onPointerDown, { passive: true });

  const onResize = () => {
    size.width = Math.max(1, window.innerWidth);
    size.height = Math.max(1, window.innerHeight);
    renderer.setSize(size.width, size.height, false);
    camera.aspect = size.width / size.height;
    camera.position.z = camZ();
    camera.updateProjectionMatrix();
    current?.resize?.();
    if (reduced && current) renderStatic();
  };
  window.addEventListener('resize', onResize);

  const onVis = () => syncPlay();
  document.addEventListener('visibilitychange', onVis);

  const onLost = (e: Event) => {
    e.preventDefault();
    contextLost = true;
    stop();
  };
  const onRestored = () => {
    contextLost = false;
    syncPlay();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  sampleSections();
  activateMode(getAnimationMode());
  start();

  return () => {
    disposed = true;
    window.clearTimeout(swapTimer);
    stop();
    unsubMode();
    unsubTheme();
    ptr.dispose();
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    current?.dispose();
    current = null;
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}

