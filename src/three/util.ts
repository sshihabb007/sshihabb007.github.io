import * as THREE from 'three';

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const clamp01 = (v: number) => clamp(v, 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const damp = (cur: number, tgt: number, lambda: number, dt: number) =>
  lerp(cur, tgt, 1 - Math.exp(-lambda * dt));
export const easeOutCubic = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);
export const easeOutBack = (v: number) => {
  const t = clamp01(v) - 1;
  return 1 + 2.70158 * t * t * t + 1.70158 * t * t;
};

export function gaussRand(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export interface PointerTracker {
  x: number;
  y: number;
  active: boolean;
  moved: boolean;
  dispose: () => void;
}

export function createPointerTracker(): PointerTracker {
  const state: PointerTracker = {
    x: 0,
    y: 0,
    active: false,
    moved: false,
    dispose: () => {},
  };
  const onMove = (e: PointerEvent) => {
    state.x = e.clientX;
    state.y = e.clientY;
    state.active = true;
    state.moved = true;
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') state.active = false;
  };
  const onLeave = () => {
    state.active = false;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onMove, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('pointercancel', onUp, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  state.dispose = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    document.documentElement.removeEventListener('pointerleave', onLeave);
  };
  return state;
}

export interface AvoidRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  size: { width: number; height: number };
  dpr: number;
  compact: boolean;
  dark: boolean;
  camZ: () => number;
  rig?: THREE.Group;
  avoid?: AvoidRect;
}

export interface FrameState {
  dt: number;
  elapsed: number;
  fade: number;
  progress: number;
  pointer: { x: number; y: number; power: number; active: boolean };
  sway: { x: number; y: number };
  scrollDelta: number;
  scrollSpeed: number;
  tint: THREE.Color;
}

export interface SceneInstance {
  update: (frame: FrameState) => void;
  resize?: () => void;
  setTheme?: (dark: boolean) => void;
  pointerDown?: (x: number, y: number) => void;
  dispose: () => void;
}

export interface ModeModule {
  hero: (ctx: SceneContext) => SceneInstance;
  background: (ctx: SceneContext) => SceneInstance;
  heroDpr?: number;
  backgroundDpr?: number;
}

export const blendForTheme = (dark: boolean): THREE.Blending =>
  dark ? THREE.AdditiveBlending : THREE.NormalBlending;

export class DisposableBag {
  disposables: Array<{ dispose: () => void }> = [];
  objects: THREE.Object3D[] = [];
  materials: THREE.ShaderMaterial[] = [];

  track<T extends { dispose: () => void }>(item: T): T {
    this.disposables.push(item);
    return item;
  }

  mount<T extends THREE.Object3D>(parent: THREE.Object3D, child: T): T {
    parent.add(child);
    this.objects.push(child);
    return child;
  }

  shader(params: THREE.ShaderMaterialParameters, dark: boolean): THREE.ShaderMaterial {
    const mat = this.track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: blendForTheme(dark),
        ...params,
      })
    );
    this.materials.push(mat);
    return mat;
  }

  setBlending(dark: boolean, extra: THREE.Material[] = []): void {
    const b = blendForTheme(dark);
    for (const m of [...this.materials, ...extra]) {
      m.blending = b;
      m.needsUpdate = true;
    }
  }

  dispose(): void {
    for (const obj of this.objects) obj.removeFromParent();
    for (const d of this.disposables) d.dispose();
    this.objects.length = 0;
    this.disposables.length = 0;
    this.materials.length = 0;
  }
}

export class ThemePalette<K extends string> {
  defs: { dark: Record<K, string>; light: Record<K, string> };
  cur: Record<K, THREE.Color>;
  tgt: Record<K, THREE.Color>;

  constructor(defs: { dark: Record<K, string>; light: Record<K, string> }, dark: boolean) {
    this.defs = defs;
    const keys = Object.keys(defs.dark) as K[];
    this.cur = {} as Record<K, THREE.Color>;
    this.tgt = {} as Record<K, THREE.Color>;
    for (const k of keys) {
      const hex = defs[dark ? 'dark' : 'light'][k];
      this.cur[k] = new THREE.Color(hex);
      this.tgt[k] = new THREE.Color(hex);
    }
  }

  setTheme(dark: boolean): void {
    for (const k of Object.keys(this.tgt) as K[]) {
      this.tgt[k].set(this.defs[dark ? 'dark' : 'light'][k]);
    }
  }

  update(dt: number, speed = 7): void {
    const alpha = 1 - Math.exp(-speed * dt);
    for (const k of Object.keys(this.cur) as K[]) {
      this.cur[k].lerp(this.tgt[k], alpha);
    }
  }
}

export function scaleUniforms(ctx: SceneContext) {
  return {
    uPixelRatio: { value: ctx.dpr },
    uScale: { value: ctx.camZ() },
  };
}

export function swayCamera(
  ctx: SceneContext,
  sway: { x: number; y: number },
  ampX: number,
  ampY: number
) {
  ctx.camera.position.set(-sway.x * ampX, -sway.y * ampY, ctx.camZ());
  ctx.camera.lookAt(0, 0, 0);
}

export const AVOID_GLSL = `
  uniform vec4 uAvoid;
  float avoidMask(vec2 scr, float minV) {
    vec2 c = (uAvoid.xy + uAvoid.zw) * 0.5;
    vec2 h = (uAvoid.zw - uAvoid.xy) * 0.5;
    vec2 q = abs(scr - c) - h;
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    return mix(minV, 1.0, smoothstep(-30.0, 110.0, dist));
  }
`;

export const avoidUniformVec = (a?: AvoidRect) =>
  a ? { x: a.x0, y: a.y0, z: a.x1, w: a.y1 } : { x: -1e4, y: -1e4, z: -1e4, w: -1e4 };

export const NOISE_GLSL = `
  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }
  float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + 17.0;
      a *= 0.5;
    }
    return v;
  }
`;

