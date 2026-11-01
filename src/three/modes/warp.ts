import * as THREE from 'three';
import {
  damp,
  easeOutCubic,
  DisposableBag,
  ThemePalette,
  SceneContext,
  SceneInstance,
  AVOID_GLSL,
  avoidUniformVec,
} from '../util';

const PALETTE = {
  dark: { line: '#a5d8ff', head: '#ffffff' },
  light: { line: '#2563eb', head: '#1e3a8a' },
};
const LEVELS = {
  dark: { line: 1, head: 1 },
  light: { line: 0.85, head: 0.9 },
};

const STAR_COMMON = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTravel;
  uniform float uStreak;
  uniform float uPixelRatio;
  uniform float uF;
  uniform float uD;
  uniform float uReveal;
  uniform vec2  uCenter;
  attribute vec4 aStar;

  vec3 starAt(float tail) {
    float z = fract(aStar.z + uTravel * (0.35 + aStar.w * 0.65));
    float Z = mix(-uD, 0.93 * uF, z);
    float len = uD * (0.008 + uStreak * 0.07) * (0.5 + aStar.w);
    float zz = Z - tail * len;
    float scale = uF / (uF - zz);
    return vec3(uCenter + aStar.xy * scale, z);
  }
`;

const LINE_VERT = `
  ${STAR_COMMON}
  attribute float aEnd;
  varying float vAlpha;

  void main() {
    vec3 s = starAt(1.0 - aEnd);
    gl_Position = projectionMatrix * viewMatrix * vec4(s.xy, 0.0, 1.0);
    float z = s.z;
    float life = smoothstep(0.0, 0.12, z) * (1.0 - smoothstep(0.9, 1.0, z));
    vAlpha = life * (0.2 + 0.8 * z) * aEnd * uReveal * avoidMask(s.xy, uAvoidMin);
  }
`;

const HEAD_VERT = `
  ${STAR_COMMON}
  varying float vAlpha;

  void main() {
    vec3 s = starAt(0.0);
    gl_Position = projectionMatrix * viewMatrix * vec4(s.xy, 0.0, 1.0);
    float z = s.z;
    float life = smoothstep(0.0, 0.12, z) * (1.0 - smoothstep(0.9, 1.0, z));
    gl_PointSize = (1.2 + 3.4 * z) * (0.6 + aStar.w * 0.8) * uPixelRatio;
    vAlpha = life * (0.25 + 0.75 * z) * uReveal * avoidMask(s.xy, uAvoidMin);
  }
`;

const LINE_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

const HEAD_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(uColor, pow(1.0 - d, 1.4) * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

function createWarpScene(
  ctx: SceneContext,
  opts: { count: number; hero: boolean },
  heroCtx?: SceneContext
): SceneInstance {
  const bag = new DisposableBag();
  const palette = new ThemePalette(PALETTE, ctx.dark);
  let levels = LEVELS[ctx.dark ? 'dark' : 'light'];
  const { size, scene } = ctx;
  const count = opts.count;
  const maxR = Math.max(size.width, size.height, 900) * 0.5;
  const stars = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const r = 28 + Math.sqrt(Math.random()) * maxR;
    const ang = Math.random() * Math.PI * 2;
    stars.set([Math.cos(ang) * r, Math.sin(ang) * r, Math.random(), Math.random()], i * 4);
  }

  const lineStars = new Float32Array(count * 8);
  const lineEnd = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    lineStars.set(stars.subarray(i * 4, i * 4 + 4), i * 8);
    lineStars.set(stars.subarray(i * 4, i * 4 + 4), i * 8 + 4);
    lineEnd[i * 2] = 0;
    lineEnd[i * 2 + 1] = 1;
  }

  const lineGeo = bag.track(new THREE.BufferGeometry());
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 6), 3));
  lineGeo.setAttribute('aStar', new THREE.BufferAttribute(lineStars, 4));
  lineGeo.setAttribute('aEnd', new THREE.BufferAttribute(lineEnd, 1));

  const headGeo = bag.track(new THREE.BufferGeometry());
  headGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  headGeo.setAttribute('aStar', new THREE.BufferAttribute(stars, 4));

  const shared = {
    uPixelRatio: { value: ctx.dpr },
    uTravel: { value: 0 },
    uStreak: { value: 0 },
    uF: { value: ctx.camZ() },
    uD: { value: 2600 },
    uReveal: { value: 0 },
    uCenter: { value: { x: 0, y: 0 } },
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uAvoidMin: { value: opts.hero ? 0.3 : 1 },
  };

  const lineMat = bag.shader(
    {
      vertexShader: LINE_VERT,
      fragmentShader: LINE_FRAG,
      uniforms: { ...shared, uColor: { value: palette.cur.line }, uOpacity: { value: levels.line } },
    },
    ctx.dark
  );
  const headMat = bag.shader(
    {
      vertexShader: HEAD_VERT,
      fragmentShader: HEAD_FRAG,
      uniforms: { ...shared, uColor: { value: palette.cur.head }, uOpacity: { value: levels.head } },
    },
    ctx.dark
  );

  const lines = new THREE.LineSegments(lineGeo, lineMat);
  const heads = new THREE.Points(headGeo, headMat);
  lines.frustumCulled = false;
  heads.frustumCulled = false;
  bag.mount(scene, lines);
  bag.mount(scene, heads);

  let travel = 0;
  let streak = 0;
  let boost = 0;
  let steerX = 0;
  let steerY = 0;

  return {
    update(frame) {
      const { dt, elapsed, fade, progress, sway, scrollSpeed, pointer } = frame;
      ctx.camera.position.set(-sway.x * 10, -sway.y * 7, ctx.camZ());
      ctx.camera.lookAt(0, 0, 0);
      palette.update(dt);
      boost = damp(boost, 0, 1.6, dt);

      const speedFactor = opts.hero ? progress * 0.6 : Math.min(scrollSpeed / 1800, 1.2);
      streak = damp(streak, 0.2 + boost * 0.9 + speedFactor + pointer.power * 0.12, 3, dt);
      travel += dt * (0.06 + boost * 0.25 + speedFactor * 0.12 + pointer.power * 0.02);

      shared.uTravel.value = travel;
      shared.uStreak.value = streak;
      shared.uReveal.value = easeOutCubic(elapsed / 2.2) * fade;
      lineMat.uniforms.uOpacity.value = levels.line;
      headMat.uniforms.uOpacity.value = levels.head;

      const cx = heroCtx?.rig ? heroCtx.rig.position.x : -sway.x * 40;
      const cy = heroCtx?.rig ? heroCtx.rig.position.y : sway.y * 26;
      steerX = damp(steerX, (pointer.x - cx) * 0.45 * pointer.power, 3.2, dt);
      steerY = damp(steerY, (pointer.y - cy) * 0.45 * pointer.power, 3.2, dt);
      shared.uCenter.value = { x: cx + steerX, y: cy + steerY };

      if (heroCtx) {
        shared.uAvoid.value = avoidUniformVec(heroCtx.avoid);
      } else {
        lineMat.uniforms.uColor.value = frame.tint;
      }
    },
    resize() {
      shared.uF.value = ctx.camZ();
    },
    setTheme(nextDark) {
      levels = LEVELS[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
    },
    pointerDown() {
      boost = 1;
    },
    dispose() {
      bag.dispose();
    },
  };
}

export const hero = (ctx: SceneContext): SceneInstance =>
  createWarpScene(ctx, { count: ctx.compact ? 700 : 1500, hero: true }, ctx);

export const background = (ctx: SceneContext): SceneInstance =>
  createWarpScene(ctx, { count: ctx.compact ? 300 : 620, hero: false });

