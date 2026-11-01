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
    back: '#d9381e',
    mid: '#ff7a14',
    front: '#ffc233',
    core: '#fff6c2',
    ember: '#ff7a2e',
    tree: '#05060a',
    far: '#240d0a',
    smoke: '#241211',
  },
  light: {
    back: '#b91c1c',
    mid: '#ea580c',
    front: '#f59e0b',
    core: '#fde68a',
    ember: '#dc2626',
    tree: '#2a170f',
    far: '#7a3a24',
    smoke: '#6b5650',
  },
};
const OPACITY = { dark: 0.6, light: 0.68 };
const SMOKE_FACTOR = { dark: 1, light: 0.5 };
const MAX_JETS = 4;
const MAX_FLARES = 4;

const FIRE_FRAG = `
  ${NOISE_GLSL}
  uniform float uTime;
  uniform float uAspect;
  uniform float uHeight;
  uniform float uGround;
  uniform float uPower;
  uniform float uFlash;
  uniform float uWind;
  uniform float uBright;
  uniform float uReveal;
  uniform float uOpacity;
  uniform vec4  uEr[${MAX_JETS}];
  uniform vec4  uFl[${MAX_FLARES}];
  uniform vec3  uBack;
  uniform vec3  uMid;
  uniform vec3  uFront;
  uniform vec3  uCore;
  varying vec2 vUv;

  float jetBoost(float x) {
    float b = 0.0;
    for (int i = 0; i < ${MAX_JETS}; i++) {
      vec4 e = uEr[i];
      float age = uTime - e.y;
      if (age > 0.0 && age < 2.6) {
        float w = exp(-pow((x - e.x) * uAspect / (0.11 + age * 0.05), 2.0));
        b += w * e.z * 0.62 * exp(-age * 1.05) * smoothstep(0.0, 0.07, age);
      }
    }
    for (int i = 0; i < ${MAX_FLARES}; i++) {
      vec4 e = uFl[i];
      float age = uTime - e.y;
      if (age > 0.0 && age < 1.8) {
        float w = exp(-pow((x - e.x) * uAspect / 0.2, 2.0));
        b += w * e.z * 0.5 * exp(-age * 1.7) * smoothstep(0.0, 0.05, age);
      }
    }
    return b;
  }

  float tongues(float ax, float y, float freq, float hBase, float spd, float seed, out float heat) {
    float res = 0.0;
    heat = 0.0;
    for (int k = 0; k < 2; k++) {
      float fk = float(k);
      float x = ax * freq + fk * 0.5 + seed * 3.17;
      float wob = vnoise(vec2(y * 4.5 - uTime * spd * 1.5 + seed * 5.0 + fk * 9.0, x * 0.45)) - 0.5;
      float xw = x + wob * (0.25 + y * 3.2) * uWind;
      float id = floor(xw);
      float f = fract(xw) - 0.5;
      float r = hash11(id * 1.37 + seed * 11.0 + fk * 5.0);

      float h = hBase * (0.35 + 0.9 * r) * (0.82 + 0.18 * sin(uTime * (1.2 + r * 2.4) + r * 40.0)) * uPower;
      float yy = y / max(h, 0.0001);
      float taper = 1.0 - pow(clamp(yy, 0.0, 1.0), 0.75);
      float lean = (r - 0.5) * 0.5 * yy * yy + sin(uTime * 0.8 + r * 20.0) * 0.12 * yy * uWind;
      float d = abs(f - lean) - 0.5 * taper * (0.8 + 0.3 * r);
      float cover = (1.0 - smoothstep(-0.03, 0.05, d)) * (1.0 - step(1.0, yy));
      res = max(res, cover);
      heat = max(heat, cover * (1.0 - yy));
    }
    return res;
  }

  void over(inout vec4 acc, vec3 c, float a) {
    acc.rgb = c * a + acc.rgb * (1.0 - a);
    acc.a = a + acc.a * (1.0 - a);
  }

  void main() {
    vec2 uv = vUv;
    float ax = uv.x * uAspect;
    float y = max(uv.y - uGround, 0.0);
    float boost = jetBoost(uv.x);

    float maxH = (uHeight + boost) * 1.26 * uPower + 0.01;
    vec4 acc = vec4(0.0);
    if (y <= maxH) {
      float g1; float g2; float g3; float g4;
      float back = tongues(ax, y, 6.0, uHeight + boost, 0.7, 1.0, g1);
      float mid = tongues(ax, y, 9.5, uHeight * 0.72 + boost * 0.8, 1.0, 2.0, g2);
      float front = tongues(ax, y, 14.0, uHeight * 0.48 + boost * 0.6, 1.4, 3.0, g3);
      float core = tongues(ax, y, 20.0, uHeight * 0.27 + boost * 0.45, 1.9, 4.0, g4);

      float streak = 0.88 + 0.12 * vnoise(vec2(ax * 26.0, y * 3.0 - uTime * 2.6));

      over(acc, mix(uBack * 0.9, uBack * 1.3, g1) * streak * uBright, back * 0.82 * (0.55 + 0.45 * smoothstep(0.0, 0.5, g1 + 0.3)));
      over(acc, mix(uMid * 0.95, uMid * 1.3, g2) * streak * uBright, mid * 0.9);
      over(acc, mix(uFront * 1.0, uFront * 1.25, g3) * streak * uBright, front * 0.93);
      over(acc, mix(uFront, uCore, g4) * uBright, core * 0.97);
    }

    float ground = pow(1.0 - y, 8.0) * 0.45 * uPower;
    over(acc, uMid, ground * 0.55 + uFlash * 0.14 * (1.0 - uv.y));

    vec3 col = acc.rgb / max(acc.a, 0.0001);
    gl_FragColor = vec4(col, acc.a * uReveal * uOpacity);
    #include <colorspace_fragment>
  }
`;

const SILHOUETTE_FRAG = `
  ${NOISE_GLSL}
  uniform float uTime;
  uniform float uAspect;
  uniform float uMode;
  uniform float uSmoke;
  uniform float uGround;
  uniform float uWind;
  uniform float uFlash;
  uniform float uReveal;
  uniform float uOpacity;
  uniform vec3  uSmokeCol;
  uniform vec3  uGlow;
  uniform vec3  uTreeCol;
  uniform vec3  uFarCol;
  varying vec2 vUv;

  float rnd(float x) { return fract(sin(x * 127.1 + 11.7) * 43758.5453); }

  float pines(vec2 uv, float freq, float baseH, float varH, float seed) {
    float x = uv.x * uAspect * freq + seed;
    float id = floor(x);
    float f = fract(x);
    float h = baseH + varH * rnd(id + seed);
    float y = max(uv.y - uGround, 0.0001) / h;
    float lean = (rnd(id * 3.1) - 0.5) * 0.16 * y;
    float tri = abs(f - 0.5 + lean) * 2.0;
    float tier = 0.74 + 0.26 * fract(y * 5.0);
    float width = (1.0 - y) * tier;
    return step(tri, width) * (1.0 - step(1.0, y));
  }

  void main() {
    vec2 uv = vUv;

    if (uMode < 0.5) {
      if (uv.y > 0.7) {
        gl_FragColor = vec4(0.0);
      } else {
        vec2 p = vec2(uv.x * uAspect * 1.1 + uTime * 0.03 * uWind, uv.y * 1.5 - uTime * 0.1);
        float s = fbm(p * 1.2);
        float smoke = smoothstep(0.4, 0.85, s);
        float low = pow(1.0 - uv.y, 1.8);
        vec3 col = mix(uSmokeCol, uGlow * 0.5, clamp(low * 0.8 + uFlash * 0.35, 0.0, 1.0));
        float a = smoke * uSmoke * low * 0.5;
        gl_FragColor = vec4(col, a * uReveal * uOpacity);
      }
    } else {
      float far = pines(uv, 13.0, 0.03, 0.05, 3.0);
      float near = pines(uv, 8.0, 0.035, 0.065, 9.0);
      vec3 farCol = mix(uFarCol, uGlow * 0.4, 0.2 + uFlash * 0.35);
      vec3 col = mix(farCol, uTreeCol, near);
      float a = max(far * 0.95, near);
      gl_FragColor = vec4(col, a * uReveal * uOpacity);
    }
    #include <colorspace_fragment>
  }
`;

const EMBER_VERT = `
  uniform float uT;
  uniform float uW;
  uniform float uH;
  uniform float uRise;
  uniform float uWind;
  uniform float uGroundPx;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform float uAmp;
  uniform vec3  uHot;
  uniform vec3  uCool;
  attribute vec4 aE;
  varying float vA;
  varying vec3  vC;

  void main() {
    float life = fract(aE.x + uT * (0.06 + aE.z * 0.11));
    float x = (aE.y - 0.5) * uW * 1.15
            + sin(uT * 1.7 + aE.x * 30.0 + life * 9.0) * (10.0 + aE.z * 30.0)
            + uWind * pow(life, 1.4) * uW * 0.5;
    float y = -uH * 0.5 + uGroundPx + pow(life, 0.85) * (uH - uGroundPx) * uRise + sin(uT * 2.3 + aE.x * 40.0) * 6.0;
    gl_Position = projectionMatrix * viewMatrix * vec4(x, y, 0.0, 1.0);
    float flicker = 0.5 + 0.5 * sin(uT * 12.0 + aE.x * 70.0);
    gl_PointSize = (2.0 + aE.w * 4.0) * (1.0 - life * 0.6) * uPixelRatio;
    vA = smoothstep(0.0, 0.04, life) * (1.0 - smoothstep(0.55, 1.0, life)) * (0.4 + 0.6 * flicker) * uReveal * uAmp;
    vC = mix(uHot, uCool, life);
  }
`;

const EMBER_FRAG = `
  uniform float uOpacity;
  varying float vA;
  varying vec3  vC;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(vC, pow(1.0 - d, 1.2) * vA * uOpacity);
    #include <colorspace_fragment>
  }
`;

interface WildfireOpts {
  embers: number;
  height: number;
  power: number;
  smoke: number;
  forest: boolean;
  hero: boolean;
}

function createWildfireScene(ctx: SceneContext, opts: WildfireOpts): SceneInstance {
  const bag = new DisposableBag();
  const palette = new ThemePalette(PALETTE, ctx.dark);
  let opacity = OPACITY[ctx.dark ? 'dark' : 'light'];
  let smokeFactor = SMOKE_FACTOR[ctx.dark ? 'dark' : 'light'];
  let dark = ctx.dark;
  const { size, scene } = ctx;

  const shared = {
    uPixelRatio: { value: ctx.dpr },
    uOpacity: { value: opacity },
    uReveal: { value: 0 },
  };

  const makeSilUniforms = (mode: number) => ({
    uTime: { value: 0 },
    uAspect: { value: size.width / size.height },
    uMode: { value: mode },
    uSmoke: { value: opts.smoke * smokeFactor },
    uGround: { value: 0 },
    uWind: { value: 1 },
    uFlash: { value: 0 },
    uReveal: shared.uReveal,
    uOpacity: shared.uOpacity,
    uSmokeCol: { value: palette.cur.smoke },
    uGlow: { value: palette.cur.mid },
    uTreeCol: { value: palette.cur.tree },
    uFarCol: { value: palette.cur.far },
  });

  const makeSilMat = (mode: number) =>
    bag.track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        vertexShader: FULL_QUAD_VERT,
        fragmentShader: SILHOUETTE_FRAG,
        uniforms: makeSilUniforms(mode),
      })
    );

  const smokeMat = makeSilMat(0);
  const smokeQuad = createQuadMesh(bag, scene, smokeMat, -3);
  const forestMat = opts.forest ? makeSilMat(1) : null;
  const forestQuad = forestMat ? createQuadMesh(bag, scene, forestMat, -1) : null;

  const jets = Array.from({ length: MAX_JETS }, () => new THREE.Vector4(0.5, -1e4, 1, 0));
  const flares = Array.from({ length: MAX_FLARES }, () => new THREE.Vector4(0.5, -1e4, 1, 0));

  const fireMat = bag.shader(
    {
      vertexShader: FULL_QUAD_VERT,
      fragmentShader: FIRE_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: size.width / size.height },
        uHeight: { value: opts.height },
        uGround: { value: 0 },
        uPower: { value: opts.power },
        uFlash: { value: 0 },
        uWind: { value: 1 },
        uBright: { value: dark ? 2.1 : 1.2 },
        uReveal: shared.uReveal,
        uOpacity: shared.uOpacity,
        uEr: { value: jets },
        uFl: { value: flares },
        uBack: { value: palette.cur.back },
        uMid: { value: palette.cur.mid },
        uFront: { value: palette.cur.front },
        uCore: { value: palette.cur.core },
      },
    },
    dark
  );
  const fireQuad = createQuadMesh(bag, scene, fireMat, -2);

  const aE = new Float32Array(opts.embers * 4);
  for (let i = 0; i < opts.embers; i++) {
    aE.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const emberGeo = bag.track(new THREE.BufferGeometry());
  emberGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(opts.embers * 3), 3));
  emberGeo.setAttribute('aE', new THREE.BufferAttribute(aE, 4));

  const emberMat = bag.shader(
    {
      vertexShader: EMBER_VERT,
      fragmentShader: EMBER_FRAG,
      uniforms: {
        uT: { value: 0 },
        uW: { value: size.width },
        uH: { value: size.height },
        uRise: { value: opts.hero ? 0.95 : 0.6 },
        uWind: { value: 0.4 },
        uGroundPx: { value: 0 },
        uAmp: { value: 1 },
        uPixelRatio: shared.uPixelRatio,
        uReveal: shared.uReveal,
        uOpacity: shared.uOpacity,
        uHot: { value: palette.cur.core },
        uCool: { value: palette.cur.ember },
      },
    },
    dark
  );
  const emberPts = new THREE.Points(emberGeo, emberMat);
  emberPts.frustumCulled = false;
  emberPts.renderOrder = 1;
  bag.mount(scene, emberPts);

  const bursts: SparkBurst[] = [];
  for (let i = 0; i < MAX_JETS; i++) {
    bursts.push(
      new SparkBurst(bag, scene, dark, {
        count: opts.hero ? 150 : 100,
        gravity: 360,
        drag: 1.6,
        speed: [140, 700],
        life: [0.7, 2],
        size: 9,
        ringSpeed: 620,
        coreSize: 440,
        hot: palette.cur.core,
        cool: palette.cur.back,
        ring: palette.cur.mid,
        shared,
      })
    );
  }

  let emberTime = 0;
  let jetCursor = 0;
  let blastAge = 1e9;
  let shake = 0;
  let surge = 0;
  let intensity = 0.8;
  let targetIntensity = 0.8;
  let nextIntensityShift = 1.2;
  let nextFlare = 0.8;
  let flareCursor = 0;
  let lastElapsed = 0;

  const ignite = (x: number, y: number, strength: number) => {
    const b = bursts[jetCursor];
    jets[jetCursor].set(Math.min(1, Math.max(0, x / size.width + 0.5)), lastElapsed, strength, 0);
    jetCursor = (jetCursor + 1) % MAX_JETS;
    b.fire(x, y);
    blastAge = 0;
    shake = Math.max(shake, 0.5 + 0.5 * strength);
    surge = Math.max(surge, strength);
  };

  return {
    update(frame) {
      const { dt, elapsed, scrollSpeed } = frame;
      lastElapsed = elapsed;
      palette.update(dt);

      if (elapsed > nextIntensityShift) {
        targetIntensity =
          Math.random() < 0.38 ? 0.12 + Math.random() * 0.2 : 0.85 + Math.random() * 0.4;
        nextIntensityShift = elapsed + 1.1 + Math.random() * 2.2;
      }
      intensity = damp(intensity, targetIntensity, targetIntensity > intensity ? 10 : 1.7, dt);

      if (elapsed > nextFlare) {
        flares[flareCursor].set(Math.random(), elapsed, 0.55 + Math.random() * 0.6, 0);
        flareCursor = (flareCursor + 1) % MAX_FLARES;
        nextFlare = elapsed + 0.9 + Math.random() * 1.9;
      }

      blastAge += dt;
      shake = damp(shake, 0, 3.2, dt);
      surge = damp(surge, 0, 1, dt);

      const flash = Math.exp(-blastAge * 4.2) * (dark ? 1 : 0.7);
      const wind = 1 + surge * 0.8 + Math.min(scrollSpeed / 2500, 1);
      emberTime += dt * (1 + surge * 1.2);
      const groundPx = opts.hero ? 74 : 0;
      const groundUv = groundPx / size.height;
      const aspect = size.width / size.height;

      for (const m of [fireMat, smokeMat, forestMat]) {
        if (!m) continue;
        m.uniforms.uTime.value = elapsed;
        m.uniforms.uAspect.value = aspect;
        m.uniforms.uFlash.value = flash;
        m.uniforms.uWind.value = wind;
        m.uniforms.uGround.value = groundUv;
      }

      smokeMat.uniforms.uSmoke.value = opts.smoke * smokeFactor;
      fireMat.uniforms.uBright.value = damp(fireMat.uniforms.uBright.value, dark ? 2.1 : 1.2, 6, dt);
      fireMat.uniforms.uPower.value = opts.power * (0.18 + 0.82 * intensity) * (1 + surge * 0.3);

      fireQuad.fit(size);
      smokeQuad.fit(size);
      forestQuad?.fit(size);

      emberMat.uniforms.uT.value = emberTime;
      emberMat.uniforms.uW.value = size.width;
      emberMat.uniforms.uH.value = size.height;
      emberMat.uniforms.uGroundPx.value = groundPx;
      emberMat.uniforms.uAmp.value = 0.25 + 0.75 * Math.min(intensity, 1);
      emberMat.uniforms.uWind.value = 0.5 + Math.sin(elapsed * 0.4) * 0.25 + surge * 0.6;

      for (const b of bursts) b.update(dt);

      const jitter = shake * shake * 20;
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
      emberMat.uniforms.uW.value = size.width;
      emberMat.uniforms.uH.value = size.height;
    },
    setTheme(nextDark) {
      dark = nextDark;
      opacity = OPACITY[nextDark ? 'dark' : 'light'];
      smokeFactor = SMOKE_FACTOR[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
    },
    pointerDown(x, y) {
      ignite(x, y, 1);
    },
    dispose() {
      bag.dispose();
    },
  };
}

export const hero = (ctx: SceneContext): SceneInstance =>
  createWildfireScene(ctx, {
    embers: ctx.compact ? 360 : 800,
    height: 0.34,
    power: 1,
    smoke: 0.6,
    forest: true,
    hero: true,
  });

export const background = (ctx: SceneContext): SceneInstance =>
  createWildfireScene(ctx, {
    embers: ctx.compact ? 200 : 380,
    height: 0.2,
    power: 0.9,
    smoke: 0.35,
    forest: false,
    hero: false,
  });

export const heroDpr = 1;
export const backgroundDpr = 1;

