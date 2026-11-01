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
  AvoidRect,
  clamp,
  clamp01,
  createPointerTracker,
  damp,
  easeOutCubic,
  FrameState,
  SceneContext,
  SceneInstance,
} from './util';

export function createHeroScene(container: HTMLElement, avatarSelector: string): () => void {
  const host = container.parentElement ?? container;
  const reduced = prefersReducedMotion();
  const coarse = isCoarsePointer();

  const size = {
    width: Math.max(1, container.clientWidth),
    height: Math.max(1, container.clientHeight),
  };
  const compact = window.innerWidth < 768 || coarse;
  const maxDpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: maxDpr < 2,
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
    transition: 'opacity 1.6s ease',
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
  const rig = new THREE.Group();
  scene.add(rig);

  let dark = isDarkTheme();
  const avoid: AvoidRect = { x0: -1e4, y0: -1e4, x1: -1e4, y1: -1e4 };

  const ctx: SceneContext = {
    scene,
    camera,
    size,
    dpr: maxDpr,
    compact,
    dark,
    camZ,
    rig,
    avoid,
  };

  const anchor = { x: size.width * 0.74, y: size.height * 0.46, size: 350 };
  let measuredOnce = false;

  const measureAvoid = () => {
    const textCol = host.querySelector('.hero-grid > div:first-child') as HTMLElement | null;
    if (!textCol) return;
    let ox = 0;
    let oy = 0;
    let cur: HTMLElement | null = textCol;
    while (cur && cur !== host) {
      ox += cur.offsetLeft;
      oy += cur.offsetTop;
      cur = cur.offsetParent as HTMLElement | null;
    }
    if (cur === host) {
      avoid.x0 = ox - 24 - size.width / 2;
      avoid.x1 = ox + textCol.offsetWidth + 24 - size.width / 2;
      avoid.y1 = -(oy - 12 - size.height / 2);
      avoid.y0 = -(oy + textCol.offsetHeight + 12 - size.height / 2);
    }
  };

  const updateRig = (snap: boolean, dt = 0) => {
    const tx = anchor.x - size.width / 2;
    const ty = -(anchor.y - size.height / 2);
    const wideScale = window.innerWidth > 768 ? clamp((size.width - 700) / 700, 0.88, 1) : 1;
    const targetScale = clamp(anchor.size / 350, 0.5, 1.15) * wideScale;
    if (snap) {
      rig.position.set(tx, ty, 0);
      rig.scale.setScalar(targetScale);
    } else {
      rig.position.x = damp(rig.position.x, tx, 6, dt);
      rig.position.y = damp(rig.position.y, ty, 6, dt);
      rig.scale.setScalar(damp(rig.scale.x, targetScale, 6, dt));
    }
  };

  const measureAnchor = () => {
    const el = host.querySelector(avatarSelector) as HTMLElement | null;
    if (!el) return;
    let cx = el.offsetWidth / 2;
    let cy = el.offsetHeight / 2;
    let cur: HTMLElement | null = el;
    while (cur && cur !== host) {
      cx += cur.offsetLeft;
      cy += cur.offsetTop;
      cur = cur.offsetParent as HTMLElement | null;
    }
    if (cur === host) {
      anchor.x = cx;
      anchor.y = cy;
      anchor.size = el.offsetWidth;
      measureAvoid();
      if (!measuredOnce) {
        measuredOnce = true;
        updateRig(true);
      }
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
    tint: new THREE.Color('#3b82f6'),
  };

  let hadPtr = false;
  let current: SceneInstance | null = null;
  let elapsed = 0;
  let idleClock = 0;
  let frameTick = 0;
  let raf = 0;
  let prevNow = 0;
  let running = false;
  let inView = true;
  let contextLost = false;
  let pendingFadeIn = false;
  let disposed = false;

  const stepScene = (dt: number) => {
    if (!current) return;
    idleClock += dt;
    frameTick++;
    elapsed += dt;
    if (frameTick % 24 === 0) measureAnchor();
    updateRig(false, dt);

    const rect = host.getBoundingClientRect();
    const prog = clamp01(-rect.top / Math.max(1, rect.height));
    frame.progress = prog;
    frame.fade = 1 - easeOutCubic(prog) * 0.92;

    let swayX: number;
    let swayY: number;
    if (ptr.active) {
      const px = ptr.x - rect.left - rect.width / 2;
      const py = -(ptr.y - rect.top - rect.height / 2);
      if (hadPtr) {
        frame.pointer.x = damp(frame.pointer.x, px, 16, dt);
        frame.pointer.y = damp(frame.pointer.y, py, 16, dt);
      } else {
        frame.pointer.x = px;
        frame.pointer.y = py;
      }
      swayX = clamp((ptr.x / window.innerWidth) * 2 - 1, -1, 1);
      swayY = clamp(-((ptr.y / window.innerHeight) * 2 - 1), -1, 1);
    } else {
      swayX = Math.sin(idleClock * 0.32) * 0.45;
      swayY = Math.cos(idleClock * 0.24) * 0.3;
    }

    hadPtr = ptr.active;
    frame.pointer.active = ptr.active;
    frame.pointer.power = damp(frame.pointer.power, ptr.active ? 1 : 0, 5, dt);
    frame.sway.x = damp(frame.sway.x, swayX, 3.2, dt);
    frame.sway.y = damp(frame.sway.y, swayY, 3.2, dt);
    frame.dt = dt;
    frame.elapsed = elapsed;
    current.update(frame);
  };

  const renderStatic = () => {
    stepScene(1e-4);
    renderer.render(scene, camera);
    canvas.style.opacity = '1';
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!current) return;
    const dt = Math.min((now - prevNow) / 1000, 0.05);
    prevNow = now;
    stepScene(dt);
    renderer.render(scene, camera);
    if (pendingFadeIn) {
      pendingFadeIn = false;
      canvas.style.transition = 'opacity 1s ease';
      canvas.style.opacity = '1';
    }
  };

  const start = () => {
    if (running || reduced || !inView || document.hidden || contextLost) return;
    running = true;
    prevNow = performance.now();
    raf = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const syncPlay = () => {
    if (inView && !document.hidden && !contextLost) start();
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
      console.warn(`[HeroScene] could not load "${modeId}" mode:`, err);
      return;
    }
    if (disposed || seq !== loadSeq) return;

    const mountMod = () => {
      if (disposed || seq !== loadSeq) return;
      current?.dispose();
      current = null;
      resetCamera();
      ctx.dpr = Math.min(maxDpr, mod.heroDpr ?? maxDpr);
      renderer.setPixelRatio(ctx.dpr);
      ctx.dark = dark;
      try {
        current = mod.hero(ctx);
      } catch (err) {
        console.warn(`[HeroScene] "${modeId}" mode failed to start:`, err);
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

  const handleResize = () => {
    size.width = Math.max(1, container.clientWidth);
    size.height = Math.max(1, container.clientHeight);
    renderer.setSize(size.width, size.height, false);
    camera.aspect = size.width / size.height;
    camera.position.z = camZ();
    camera.updateProjectionMatrix();
    measureAnchor();
    updateRig(true);
    current?.resize?.();
    if (reduced && current) renderStatic();
  };

  const unsubTheme = observeTheme((nextDark) => {
    dark = nextDark;
    ctx.dark = nextDark;
    current?.setTheme?.(nextDark);
    if (reduced && current) renderStatic();
  });

  const onPointerDown = (e: PointerEvent) => {
    if (!current || !running || reduced || !current.pointerDown) return;
    if ((e.target as HTMLElement | null)?.closest?.('a,button,input,textarea,select,[role="radio"]')) {
      return;
    }
    const rect = host.getBoundingClientRect();
    if (e.clientY < rect.top || e.clientY > rect.bottom) return;
    current.pointerDown(
      e.clientX - rect.left - rect.width / 2,
      -(e.clientY - rect.top - rect.height / 2)
    );
  };
  window.addEventListener('pointerdown', onPointerDown, { passive: true });

  const ro = new ResizeObserver(() => {
    if (container.clientWidth !== size.width || container.clientHeight !== size.height) {
      handleResize();
    }
    measureAnchor();
  });
  ro.observe(container);
  const gridEl = host.querySelector(avatarSelector)?.closest('.hero-grid');
  if (gridEl) ro.observe(gridEl);

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      syncPlay();
    },
    { threshold: 0 }
  );
  io.observe(host);

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

  document.fonts?.ready.then(() => measureAnchor()).catch(() => {});
  measureAnchor();
  updateRig(true);
  activateMode(getAnimationMode());
  start();

  return () => {
    disposed = true;
    window.clearTimeout(swapTimer);
    stop();
    unsubMode();
    unsubTheme();
    ptr.dispose();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('pointerdown', onPointerDown);
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

