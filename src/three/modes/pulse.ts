import * as THREE from 'three';
import {
  easeOutCubic,
  DisposableBag,
  ThemePalette,
  SceneContext,
  SceneInstance,
  AVOID_GLSL,
  avoidUniformVec,
} from '../util';

const PALETTE = {
  dark: { base: '#3b82f6', hot: '#e0f2fe', warm: '#a78bfa' },
  light: { base: '#2563eb', hot: '#0f172a', warm: '#7c3aed' },
};
const OPACITY = { dark: 1, light: 0.9 };
const MAX_RIPPLES = 8;

const VERT = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform float uAmp;
  uniform float uWide;
  uniform vec2  uPointer;
  uniform float uPointerPower;
  uniform vec3  uRip[${MAX_RIPPLES}];
  uniform vec3  uBase;
  uniform vec3  uHot;
  uniform vec3  uWarm;
  attribute vec3 aG;
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    vec2 home = aG.xy;
    vec2 pos = home;
    float energy = 0.0;

    float amb = sin(home.x * 0.009 + uTime * 0.7) * sin(home.y * 0.011 - uTime * 0.55);
    energy += (0.5 + 0.5 * amb) * 0.14;

    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      vec3 r = uRip[i];
      float age = uTime - r.z;
      if (age > 0.0 && age < 3.4) {
        vec2 dv = home - r.xy;
        float d = length(dv);
        float radius = age * 430.0;
        float width = 46.0 + age * 34.0;
        float k = (d - radius) / width;
        float ring = exp(-k * k) * exp(-age * 0.85);
        pos += dv / max(d, 1.0) * ring * uAmp;
        energy += ring;
      }
    }

    vec2 pv = home - uPointer;
    float pd = length(pv);
    float lens = exp(-(pd * pd) / (2.0 * 150.0 * 150.0)) * uPointerPower;
    pos -= pv / max(pd, 1.0) * lens * 16.0;
    energy += lens * 0.95;

    gl_Position = projectionMatrix * viewMatrix * vec4(pos, 0.0, 1.0);
    float e = clamp(energy, 0.0, 1.6);
    gl_PointSize = (2.2 + aG.z * 1.0 + e * 4.6) * uPixelRatio;
    vAlpha = (0.55 + e * 0.65) * uReveal * avoidMask(pos, uAvoidMin);

    float across = clamp(home.x / max(uWide, 1.0) + 0.5, 0.0, 1.0);
    vec3 base = mix(uBase, uWarm, across * 0.6);
    vColor = mix(base, uHot, clamp(e, 0.0, 1.0));
  }
`;

const FRAG = `
  uniform float uOpacity;
  varying float vAlpha;
  varying vec3  vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(vColor, pow(1.0 - d, 1.3) * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

function createPulseScene(
  ctx: SceneContext,
  opts: { spacing: number; hero: boolean },
  heroCtx?: SceneContext
): SceneInstance {
  const bag = new DisposableBag();
  const palette = new ThemePalette(PALETTE, ctx.dark);
  let opacity = OPACITY[ctx.dark ? 'dark' : 'light'];
  const { size, scene } = ctx;

  const ripples = Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector3(0, 0, -1e4));
  const uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: ctx.dpr },
    uReveal: { value: 0 },
    uAmp: { value: 22 },
    uWide: { value: size.width },
    uPointer: { value: new THREE.Vector2(-1e4, -1e4) },
    uPointerPower: { value: 0 },
    uRip: { value: ripples },
    uBase: { value: palette.cur.base },
    uHot: { value: palette.cur.hot },
    uWarm: { value: palette.cur.warm },
    uOpacity: { value: opacity },
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uAvoidMin: { value: opts.hero ? 0.3 : 1 },
  };

  const mat = bag.shader({ vertexShader: VERT, fragmentShader: FRAG, uniforms }, ctx.dark);
  let geo = new THREE.BufferGeometry();
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  bag.mount(scene, pts);
  bag.track({ dispose: () => geo.dispose() });

  let builtW = 0;
  let builtH = 0;
  const buildGrid = () => {
    const sp = opts.spacing;
    const cols = Math.min(110, Math.ceil(size.width / sp) + 2);
    const rows = Math.min(70, Math.ceil(size.height / (sp * 0.866)) + 2);
    const aG = new Float32Array(cols * rows * 3);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hx = (c - (cols - 1) / 2 + (r % 2 ? 0.25 : -0.25)) * sp;
        const hy = (r - (rows - 1) / 2) * sp * 0.866;
        aG.set([hx, hy, Math.random()], idx);
        idx += 3;
      }
    }
    const nextGeo = new THREE.BufferGeometry();
    nextGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cols * rows * 3), 3));
    nextGeo.setAttribute('aG', new THREE.BufferAttribute(aG, 3));
    const prev = geo;
    geo = nextGeo;
    pts.geometry = nextGeo;
    prev.dispose();
    builtW = size.width;
    builtH = size.height;
    uniforms.uWide.value = cols * sp;
  };
  buildGrid();

  let ripIdx = 0;
  let lastElapsed = 0;
  const emitRipple = (x: number, y: number, t: number) => {
    ripples[ripIdx].set(x, y, t);
    ripIdx = (ripIdx + 1) % MAX_RIPPLES;
  };

  let lastPtrX = 0;
  let lastPtrY = 0;
  let lastPtrT = -1;
  let nextIdleDrop = 1.2;
  let nextScrollDrop = 0;

  return {
    update(frame) {
      const { dt, elapsed, fade, scrollSpeed, pointer } = frame;
      lastElapsed = elapsed;
      ctx.camera.position.set(0, 0, ctx.camZ());
      ctx.camera.lookAt(0, 0, 0);
      palette.update(dt);

      if (
        pointer.power > 0.35 &&
        (lastPtrT < 0 || (Math.hypot(pointer.x - lastPtrX, pointer.y - lastPtrY) > 150 && elapsed - lastPtrT > 0.12))
      ) {
        emitRipple(pointer.x, pointer.y, elapsed);
        lastPtrX = pointer.x;
        lastPtrY = pointer.y;
        lastPtrT = elapsed;
      }

      if (elapsed > nextIdleDrop) {
        emitRipple(
          (Math.random() - 0.5) * size.width * 0.9,
          (Math.random() - 0.5) * size.height * 0.9,
          elapsed
        );
        nextIdleDrop = elapsed + 2.4 + Math.random() * 2.2;
      }

      if (!opts.hero && scrollSpeed > 350 && elapsed > nextScrollDrop) {
        emitRipple((Math.random() - 0.5) * size.width, (Math.random() - 0.5) * size.height, elapsed);
        nextScrollDrop = elapsed + Math.max(0.12, 0.6 - scrollSpeed / 5000);
      }

      uniforms.uTime.value = elapsed;
      uniforms.uPointer.value.set(pointer.x, pointer.y);
      uniforms.uPointerPower.value = pointer.power;
      uniforms.uReveal.value = easeOutCubic(elapsed / 2.2) * fade;
      uniforms.uOpacity.value = opacity;

      if (heroCtx) {
        uniforms.uAvoid.value = avoidUniformVec(heroCtx.avoid);
      } else {
        uniforms.uHot.value = frame.tint;
      }
    },
    resize() {
      if (Math.abs(size.width - builtW) > 24 || Math.abs(size.height - builtH) > 24) {
        buildGrid();
      }
    },
    setTheme(nextDark) {
      opacity = OPACITY[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
    },
    pointerDown(x, y) {
      emitRipple(x, y, lastElapsed);
      emitRipple(x, y, lastElapsed + 0.16);
    },
    dispose() {
      bag.dispose();
    },
  };
}

export const hero = (ctx: SceneContext): SceneInstance =>
  createPulseScene(ctx, { spacing: ctx.compact ? 40 : 32, hero: true }, ctx);

export const background = (ctx: SceneContext): SceneInstance =>
  createPulseScene(ctx, { spacing: ctx.compact ? 46 : 38, hero: false });

