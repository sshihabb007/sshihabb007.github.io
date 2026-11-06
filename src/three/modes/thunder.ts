import * as THREE from 'three';
import {
  damp,
  easeOutCubic,
  DisposableBag,
  ThemePalette,
  SceneContext,
  SceneInstance,
  NOISE_GLSL,
} from '../util';
import { FULL_QUAD_VERT, createQuadMesh, SparkBurst } from '../stormfx';

const PALETTE = {
  dark: {
    rain: '#a5c8ff',
    bolt: '#ffffff',
    glow: '#7cb0ff',
    cloud: '#0a1124',
    flash: '#c9deff',
    spark: '#e8f1ff',
    cool: '#4f86ff',
  },
  light: {
    rain: '#334b6b',
    bolt: '#fffef7',
    glow: '#3156c8',
    cloud: '#53647b',
    flash: '#eaf4ff',
    spark: '#f4f8ff',
    cool: '#3568d4',
  },
};
const OPACITY = { dark: 1, light: 0.96 };
const MAX_BOLT_PTS = 4200;
const BOLT_POOL = 3;

const RAIN_VERT = `
  uniform float uRainT;
  uniform float uW;
  uniform float uH;
  uniform float uWind;
  uniform float uDensity;
  uniform float uAlpha;
  uniform float uReveal;
  attribute vec4 aD;
  varying float vA;

  void main() {
    float fall = fract(aD.y + uRainT * (0.7 + aD.z * 0.6));
    float y = uH * 0.5 + 80.0 - fall * (uH + 160.0);
    float x = (aD.x - 0.5) * (uW + uH * 0.55) - uWind * y;
    vec2 head = vec2(x, y);
    vec2 v = normalize(vec2(uWind, -1.0));
    float len = 16.0 + aD.z * 34.0 + abs(uWind) * 18.0;
    vec2 p = head - v * len * aD.w;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 0.0, 1.0);
    float shown = step(aD.z, uDensity);
    vA = shown * (1.0 - aD.w * 0.85) * (0.28 + 0.5 * aD.z) * uAlpha * uReveal;
  }
`;

const RAIN_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    gl_FragColor = vec4(uColor, vA * uOpacity);
    #include <colorspace_fragment>
  }
`;

const CLOUD_FRAG = `
  ${NOISE_GLSL}
  uniform float uTime;
  uniform float uAspect;
  uniform float uCloud;
  uniform float uFlash;
  uniform vec2  uFlashAt;
  uniform float uReveal;
  uniform float uOpacity;
  uniform vec3  uCloudCol;
  uniform vec3  uFlashCol;
  varying vec2 vUv;

  void main() {
    vec2 p = vec2(vUv.x * uAspect, vUv.y) * 1.7;
    float n = fbm(p * 1.3 + vec2(uTime * 0.035, uTime * 0.012));
    float m = fbm(p * 2.9 - vec2(uTime * 0.05, 0.0) + 7.0);
    float c = smoothstep(0.32, 0.82, n * 0.72 + m * 0.5);
    float top = smoothstep(0.1, 1.0, vUv.y);
    float dens = c * mix(0.22, 1.0, top) * uCloud;

    vec2 d = (vUv - uFlashAt) * vec2(uAspect, 1.0);
    float glow = exp(-dot(d, d) * 1.6);
    float lit = uFlash * (0.25 + 0.75 * c) * (0.45 + 0.55 * glow);

    vec3 col = mix(uCloudCol, uFlashCol, clamp(lit * 1.4, 0.0, 1.0));
    float a = dens * 0.55 + uFlash * (0.1 + 0.2 * glow) * (0.4 + 0.6 * c);
    gl_FragColor = vec4(col, a * uReveal * uOpacity);
    #include <colorspace_fragment>
  }
`;

const BOLT_VERT = `
  uniform float uAge;
  uniform float uSize;
  uniform float uAlpha;
  uniform float uPixelRatio;
  attribute vec3 aB;
  varying float vA;

  void main() {
    gl_Position = projectionMatrix * viewMatrix * vec4(position.xy, 0.0, 1.0);
    float grow = clamp(uAge / 0.11, 0.0, 1.0);
    float shown = step(aB.x, grow) * step(0.0, uAge);
    float flick = 0.62 + 0.38 * sin(uAge * 64.0 + aB.z * 6.2831);
    float strobe = uAge < 0.5 ? 1.0 : 0.0;
    float fade = 1.0 - smoothstep(0.3, 1.15, uAge);
    float tip = 1.0 + 1.6 * smoothstep(0.1, 0.0, abs(aB.x - grow)) * step(uAge, 0.12);
    gl_PointSize = uSize * (0.55 + 0.45 * aB.y) * tip * uPixelRatio;
    vA = shown * aB.y * mix(flick, 1.0, 1.0 - strobe) * fade * uAlpha;
  }
`;

const BOLT_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(uColor, pow(1.0 - d, 1.15) * vA * uOpacity);
    #include <colorspace_fragment>
  }
`;

function subdivideBolt(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  disp: number,
  depth: number
): Array<[number, number]> {
  if (depth === 0) return [[x1, y1], [x2, y2]];
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const off = (Math.random() - 0.5) * 2 * disp;
  const nx = mx + (-dy / len) * off;
  const ny = my + (dx / len) * off;
  const left = subdivideBolt(x1, y1, nx, ny, disp / 2, depth - 1);
  const right = subdivideBolt(nx, ny, x2, y2, disp / 2, depth - 1);
  return left.concat(right.slice(1));
}

function generateBolt(x1: number, y1: number, x2: number, y2: number) {
  const pos = new Float32Array(MAX_BOLT_PTS * 3);
  const info = new Float32Array(MAX_BOLT_PTS * 3);
  let count = 0;

  const pushPt = (x: number, y: number, g: number, br: number) => {
    if (count >= MAX_BOLT_PTS) return;
    pos[count * 3] = x;
    pos[count * 3 + 1] = y;
    info[count * 3] = g;
    info[count * 3 + 1] = br;
    info[count * 3 + 2] = Math.random();
    count++;
  };

  const rasterize = (
    poly: Array<[number, number]>,
    gStart: number,
    gEnd: number,
    br: number,
    stepPx: number
  ) => {
    let totalLen = 0;
    for (let i = 1; i < poly.length; i++) {
      totalLen += Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]);
    }
    let acc = 0;
    for (let i = 1; i < poly.length; i++) {
      const [ax, ay] = poly[i - 1];
      const [bx, by] = poly[i];
      const segLen = Math.hypot(bx - ax, by - ay);
      const steps = Math.max(1, Math.round(segLen / stepPx));
      for (let s = 0; s < steps; s++) {
        const k = s / steps;
        const t = (acc + segLen * k) / (totalLen || 1);
        pushPt(ax + (bx - ax) * k, ay + (by - ay) * k, gStart + (gEnd - gStart) * t, br);
      }
      acc += segLen;
    }
  };

  const trunk = subdivideBolt(x1, y1, x2, y2, Math.hypot(x2 - x1, y2 - y1) * 0.16, 7);
  rasterize(trunk, 0, 1, 1, 3);

  let trunkLen = 0;
  const dists = [0];
  for (let i = 1; i < trunk.length; i++) {
    trunkLen += Math.hypot(trunk[i][0] - trunk[i - 1][0], trunk[i][1] - trunk[i - 1][1]);
    dists.push(trunkLen);
  }

  for (let i = 4; i < trunk.length - 6; i++) {
    if (Math.random() > 0.075) continue;
    const [bx, by] = trunk[i];
    const g = dists[i] / (trunkLen || 1);
    const side = Math.random() < 0.5 ? -1 : 1;
    const ang = Math.PI / 2 + side * (0.35 + Math.random() * 0.75);
    const len = 70 + Math.random() * 230;
    const branch = subdivideBolt(
      bx,
      by,
      bx + Math.cos(ang - Math.PI) * len * -1,
      by - Math.abs(Math.sin(ang)) * len,
      len * 0.2,
      5
    );
    rasterize(branch, g, Math.min(1, g + 0.18), 0.55, 4);
    if (Math.random() < 0.5) {
      const [sx, sy] = branch[Math.floor(branch.length * 0.55)];
      const twig = subdivideBolt(
        sx,
        sy,
        sx + side * (30 + Math.random() * 90),
        sy - (40 + Math.random() * 90),
        24,
        4
      );
      rasterize(twig, Math.min(1, g + 0.1), Math.min(1, g + 0.22), 0.35, 4);
    }
  }

  return { pos, info, count };
}

function createThunderScene(
  ctx: SceneContext,
  opts: { drops: number; hero: boolean }
): SceneInstance {
  const bag = new DisposableBag();
  const palette = new ThemePalette(PALETTE, ctx.dark);
  let opacity = OPACITY[ctx.dark ? 'dark' : 'light'];
  let dark = ctx.dark;
  const { size, scene } = ctx;

  const shared = {
    uPixelRatio: { value: ctx.dpr },
    uOpacity: { value: opacity },
    uReveal: { value: 0 },
  };

  const cloudMat = bag.shader(
    {
      vertexShader: FULL_QUAD_VERT,
      fragmentShader: CLOUD_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: size.width / size.height },
        uCloud: { value: opts.hero ? 1 : 0.6 },
        uFlash: { value: 0 },
        uFlashAt: { value: new THREE.Vector2(0.5, 0.85) },
        uReveal: shared.uReveal,
        uOpacity: shared.uOpacity,
        uCloudCol: { value: palette.cur.cloud },
        uFlashCol: { value: palette.cur.flash },
      },
    },
    dark
  );
  const cloudQuad = createQuadMesh(bag, scene, cloudMat);

  const drops = opts.drops;
  const aD = new Float32Array(drops * 2 * 4);
  for (let i = 0; i < drops; i++) {
    const lane = Math.random();
    const phase = Math.random();
    const seed = Math.random();
    aD.set([lane, phase, seed, 0], i * 8);
    aD.set([lane, phase, seed, 1], i * 8 + 4);
  }
  const rainGeo = bag.track(new THREE.BufferGeometry());
  rainGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(drops * 2 * 3), 3));
  rainGeo.setAttribute('aD', new THREE.BufferAttribute(aD, 4));

  const rainMat = bag.shader(
    {
      vertexShader: RAIN_VERT,
      fragmentShader: RAIN_FRAG,
      uniforms: {
        uRainT: { value: 0 },
        uW: { value: size.width },
        uH: { value: size.height },
        uWind: { value: 0.3 },
        uDensity: { value: 0.5 },
        uAlpha: { value: 1 },
        uReveal: shared.uReveal,
        uOpacity: shared.uOpacity,
        uColor: { value: palette.cur.rain },
      },
    },
    dark
  );
  const rainLines = new THREE.LineSegments(rainGeo, rainMat);
  rainLines.frustumCulled = false;
  bag.mount(scene, rainLines);

  const bolts: Array<{
    geo: THREE.BufferGeometry;
    coreMat: THREE.ShaderMaterial;
    glowMat: THREE.ShaderMaterial;
    age: number;
  }> = [];

  for (let i = 0; i < BOLT_POOL; i++) {
    const geo = bag.track(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_BOLT_PTS * 3), 3));
    geo.setAttribute('aB', new THREE.BufferAttribute(new Float32Array(MAX_BOLT_PTS * 3), 3));
    geo.setDrawRange(0, 0);

    const makeUniforms = (color: { value: THREE.Color }, sz: number, alpha: number) => ({
      uAge: { value: -1 },
      uSize: { value: sz },
      uAlpha: { value: alpha },
      uPixelRatio: shared.uPixelRatio,
      uOpacity: shared.uOpacity,
      uColor: color,
    });

    const isLight = !dark;
    const glowMat = bag.shader(
      {
        vertexShader: BOLT_VERT,
        fragmentShader: BOLT_FRAG,
        uniforms: makeUniforms({ value: palette.cur.glow }, isLight ? 28 : 22, isLight ? 0.78 : 0.5),
      },
      dark
    );
    const coreMat = bag.shader(
      {
        vertexShader: BOLT_VERT,
        fragmentShader: BOLT_FRAG,
        uniforms: makeUniforms({ value: palette.cur.bolt }, isLight ? 8 : 6.5, isLight ? 1.15 : 1),
      },
      dark
    );
    for (const m of [glowMat, coreMat]) {
      const p = new THREE.Points(geo, m);
      p.frustumCulled = false;
      bag.mount(scene, p);
    }
    bolts.push({ geo, coreMat, glowMat, age: 1e9 });
  }

  const sparks: SparkBurst[] = [];
  for (let i = 0; i < BOLT_POOL; i++) {
    sparks.push(
      new SparkBurst(bag, scene, dark, {
        count: opts.hero ? 150 : 110,
        gravity: -520,
        drag: 2.2,
        speed: [160, 720],
        life: [0.45, 1.15],
        size: 7,
        ringSpeed: 760,
        coreSize: 260,
        hot: palette.cur.spark,
        cool: palette.cur.cool,
        ring: palette.cur.glow,
        shared,
      })
    );
  }

  let rainT = 0;
  let boltCursor = 0;
  let sparkCursor = 0;
  let strikeAge = 1e9;
  let sheetAge = 1e9;
  let flashX = 0.5;
  let shake = 0;
  let stormSurge = 0;
  let nextAutoBolt = opts.hero ? 1.6 : 4.2;
  let nextSheet = 2.5;
  let lastElapsed = 0;
  const delayedStrikes: Array<{ at: number; x: number; y: number; power: number }> = [];

  const strike = (x: number, y: number, power = 1) => {
    const b = bolts[boltCursor];
    const sp = sparks[sparkCursor];
    boltCursor = (boltCursor + 1) % BOLT_POOL;
    sparkCursor = (sparkCursor + 1) % BOLT_POOL;

    const topY = size.height / 2 + 40;
    const boltData = generateBolt(
      x + (Math.random() - 0.5) * Math.min(size.width * 0.35, 320),
      topY,
      x,
      y
    );
    (b.geo.getAttribute('position') as THREE.BufferAttribute).set(boltData.pos);
    (b.geo.getAttribute('aB') as THREE.BufferAttribute).set(boltData.info);
    b.geo.getAttribute('position').needsUpdate = true;
    b.geo.getAttribute('aB')!.needsUpdate = true;
    b.geo.setDrawRange(0, boltData.count);
    b.age = 0;

    if (opts.hero || power >= 0.7) sp.fire(x, y);
    strikeAge = 0;
    flashX = Math.min(1, Math.max(0, x / size.width + 0.5));
    shake = Math.max(shake, (opts.hero ? 0.55 : 0.12) + (opts.hero ? 0.45 : 0.12) * power);
    stormSurge = Math.max(stormSurge, power);
  };

  return {
    update(frame) {
      const { dt, elapsed, scrollSpeed } = frame;
      lastElapsed = elapsed;
      palette.update(dt);

      for (let i = delayedStrikes.length - 1; i >= 0; i--) {
        if (lastElapsed >= delayedStrikes[i].at) {
          const s = delayedStrikes.splice(i, 1)[0];
          strike(s.x, s.y, s.power);
        }
      }

      if (elapsed > nextAutoBolt) {
        const power = opts.hero ? 0.6 : 0.42;
        strike(
          (Math.random() - 0.5) * size.width * (opts.hero ? 0.85 : 0.7),
          -size.height * (0.02 + Math.random() * 0.4),
          power
        );
        nextAutoBolt = elapsed + (opts.hero ? 2.6 + Math.random() * 3.2 : 5.5 + Math.random() * 4.5);
      }

      if (elapsed > nextSheet) {
        sheetAge = 0;
        flashX = Math.random();
        nextSheet = elapsed + (opts.hero ? 4 : 5.5) + Math.random() * 4;
      }

      strikeAge += dt;
      sheetAge += dt;
      shake = damp(shake, 0, 3.4, dt);
      stormSurge = damp(stormSurge, 0, 1.1, dt);

      const boltFlash =
        Math.exp(-strikeAge * 5.5) +
        0.65 * Math.exp(-Math.max(strikeAge - 0.17, 0) * 6.5) * (strikeAge > 0.17 ? 1 : 0);
      const sheetFlash = 0.55 * Math.exp(-sheetAge * 3.2) * (0.6 + 0.4 * Math.sin(sheetAge * 40));
      const flash = Math.min(1.25, Math.max(boltFlash, sheetFlash));
      const wind = 0.26 + 0.1 * Math.sin(elapsed * 0.45) + Math.min(scrollSpeed / 6000, 0.25);

      rainT += dt * (0.55 + stormSurge * 0.5);
      rainMat.uniforms.uRainT.value = rainT;
      rainMat.uniforms.uW.value = size.width;
      rainMat.uniforms.uH.value = size.height;
      rainMat.uniforms.uWind.value = wind;
      rainMat.uniforms.uDensity.value = Math.min(1, (opts.hero ? 0.74 : 0.5) + stormSurge * 0.35);
      rainMat.uniforms.uAlpha.value = 1 + flash * 0.5;

      cloudMat.uniforms.uTime.value = elapsed;
      cloudMat.uniforms.uAspect.value = size.width / size.height;
      cloudMat.uniforms.uFlash.value = flash * (dark ? 1 : 0.95);
      cloudMat.uniforms.uFlashAt.value.set(flashX, 0.82);
      cloudQuad.fit(size);

      for (const b of bolts) {
        b.age += dt;
        const a = b.age < 1.6 ? b.age : -1;
        b.coreMat.uniforms.uAge.value = a;
        b.glowMat.uniforms.uAge.value = a;
      }
      for (const sp of sparks) sp.update(dt);

      const jitter = shake * shake * 16;
      ctx.camera.position.set(
        (Math.random() - 0.5) * jitter,
        (Math.random() - 0.5) * jitter,
        ctx.camZ()
      );
      ctx.camera.lookAt(ctx.camera.position.x, ctx.camera.position.y, 0);
      shared.uReveal.value = easeOutCubic(elapsed / 1.2);
      shared.uOpacity.value = opacity;
    },
    resize() {
      rainMat.uniforms.uW.value = size.width;
      rainMat.uniforms.uH.value = size.height;
    },
    setTheme(nextDark) {
      dark = nextDark;
      opacity = OPACITY[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
      for (const b of bolts) {
        b.glowMat.uniforms.uSize.value = nextDark ? 22 : 28;
        b.glowMat.uniforms.uAlpha.value = nextDark ? 0.5 : 0.78;
        b.coreMat.uniforms.uSize.value = nextDark ? 6.5 : 8;
        b.coreMat.uniforms.uAlpha.value = nextDark ? 1 : 1.15;
      }
    },
    pointerDown(x, y) {
      strike(x, y, 1);
      const side = Math.random() < 0.5 ? -1 : 1;
      delayedStrikes.push({
        at: lastElapsed + 0.14,
        x: x + side * (120 + Math.random() * 200),
        y: y - Math.random() * 120,
        power: 0.7,
      });
    },
    dispose() {
      bag.dispose();
    },
  };
}

export const hero = (ctx: SceneContext): SceneInstance =>
  createThunderScene(ctx, { drops: ctx.compact ? 950 : 2100, hero: true });

export const background = (ctx: SceneContext): SceneInstance =>
  createThunderScene(ctx, { drops: ctx.compact ? 480 : 1000, hero: false });

export const heroDpr = 1.25;
export const backgroundDpr = 1;
