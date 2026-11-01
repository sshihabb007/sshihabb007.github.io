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
  dark: { outer: '#3b82f6', inner: '#e0f2fe', core: '#7dd3fc', accent: '#a78bfa' },
  light: { outer: '#1d4ed8', inner: '#0f766e', core: '#2563eb', accent: '#7c3aed' },
};
const OPACITY = { dark: 1, light: 0.85 };
const TRAIL_LEN = 24;
const RING_PTS = 150;

const DISC_VERT = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform float uReach;
  uniform float uCore;
  uniform float uSpin;
  uniform float uRot;
  uniform float uBurst;
  uniform float uTilt;
  uniform vec2  uWell;
  uniform vec2  uVel;
  uniform vec3  uOuter;
  uniform vec3  uInner;
  attribute vec4 aP;
  varying float vAlpha;
  varying float vColorMix;
  varying vec3  vColor;

  void main() {
    float rate = 0.04 + aP.z * 0.05;
    float life = fract(aP.x + uTime * rate);
    float inv = 1.0 - life;

    float breathe = 1.0 + 0.04 * sin(uTime * 0.9 + aP.y);
    float r = uCore + uReach * pow(inv, 1.2) * breathe;
    r += uBurst * uReach * 0.4 * sin(life * 3.14159) * (0.4 + aP.z);

    float a = aP.y + uSpin * pow(life, 1.8) + uRot;
    vec2 d = vec2(cos(a), sin(a)) * r;
    d.y *= uTilt;
    float cr = cos(uRot * 0.35);
    float sr = sin(uRot * 0.35);
    d = vec2(d.x * cr - d.y * sr, d.x * sr + d.y * cr);

    vec2 wake = -uVel * 0.16 * smoothstep(0.05, 1.0, r / uReach);
    vec2 scr = uWell + d + wake;
    gl_Position = projectionMatrix * viewMatrix * vec4(scr, 0.0, 1.0);

    float heat = clamp(1.0 - smoothstep(0.0, uReach * 0.5, r) + uBurst * 0.5, 0.0, 1.0);
    gl_PointSize = (1.8 + aP.w * 2.4 + heat * 3.0) * uPixelRatio;
    float fadeIn = smoothstep(0.0, 0.08, life);
    float fadeOut = 1.0 - smoothstep(0.94, 1.0, life);
    vAlpha = fadeIn * fadeOut * (0.4 + 0.6 * heat + 0.2 * aP.w) * uReveal * avoidMask(scr, uAvoidMin);
    vColor = mix(uOuter, uInner, heat);
  }
`;

const DISC_FRAG = `
  uniform float uOpacity;
  varying float vAlpha;
  varying vec3  vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(vColor, pow(1.0 - d, 1.5) * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

const COMET_VERT = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform float uReach;
  uniform float uRot;
  uniform float uTilt;
  uniform float uBurst;
  uniform vec2  uWell;
  uniform vec2  uVel;
  uniform vec3  uColA;
  uniform vec3  uColB;
  attribute vec2 aC;
  varying float vAlpha;
  varying vec3  vColor;

  float h(float p) { return fract(sin(p * 127.1 + 3.7) * 43758.5453); }

  void main() {
    float id = aC.x;
    float k = aC.y / ${(TRAIL_LEN - 1).toFixed(1)};
    float dir = h(id * 9.1) > 0.5 ? 1.0 : -1.0;
    float speed = (0.28 + 0.4 * h(id * 3.3)) * dir;
    float rad = uReach * (0.2 + 0.5 * h(id * 7.1));
    float tilt = 0.4 + 0.4 * h(id * 5.7);
    float rot = h(id * 2.9) * 6.2831 + uRot * 0.25;

    float a = uTime * speed + id * 2.399 - k * 0.55 * dir;
    float rr = rad * (1.0 + 0.08 * sin(uTime * 0.7 + id)) + uBurst * uReach * 0.25;
    vec2 d = vec2(cos(a) * rr, sin(a) * rr * tilt);
    d = vec2(d.x * cos(rot) - d.y * sin(rot), d.x * sin(rot) + d.y * cos(rot));
    d.y *= uTilt / 0.58;

    vec2 scr = uWell + d - uVel * 0.1 * k;
    gl_Position = projectionMatrix * viewMatrix * vec4(scr, 0.0, 1.0);

    float front = 0.75 + 0.35 * sin(a);
    float fall = 1.0 - k;
    gl_PointSize = (2.0 + 5.5 * fall * fall) * front * uPixelRatio;
    vAlpha = fall * fall * 0.95 * uReveal * avoidMask(scr, uAvoidMin);
    vColor = mix(uColB, uColA, fall);
  }
`;

const RING_VERT = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform float uReach;
  uniform float uTilt;
  uniform vec2  uWell;
  uniform vec2  uAge;
  attribute vec2 aA;
  varying float vAlpha;

  void main() {
    float age = aA.y < 0.5 ? uAge.x : uAge.y;
    float on = step(0.0, age) * (1.0 - step(1.7, age));
    float radius = age * uReach * 1.35;
    vec2 d = vec2(cos(aA.x), sin(aA.x)) * radius;
    d.y *= uTilt;
    vec2 scr = uWell + d;
    gl_Position = projectionMatrix * viewMatrix * vec4(scr, 0.0, 1.0);
    gl_PointSize = (3.4 - age * 1.2) * uPixelRatio;
    vAlpha = on * pow(max(1.0 - age / 1.7, 0.0), 1.4) * uReveal * avoidMask(scr, uAvoidMin);
  }
`;

const RING_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(uColor, pow(1.0 - d, 1.2) * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

const CORE_VERT = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uPulse;
  uniform float uReveal;
  uniform vec2  uWell;
  varying float vAlpha;
  void main() {
    gl_Position = projectionMatrix * viewMatrix * vec4(uWell, 0.0, 1.0);
    gl_PointSize = uSize * uPixelRatio * (1.0 + uPulse * 0.8);
    vAlpha = (0.55 + uPulse * 0.45) * uReveal * avoidMask(uWell, uAvoidMin);
  }
`;

const CORE_FRAG = `
  uniform vec3  uColor;
  uniform vec3  uAccent;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uPulse;
  varying float vAlpha;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float d = length(q) * 2.0;
    if (d > 1.0) discard;
    float glow = pow(1.0 - d, 2.4);
    float hot = pow(1.0 - d, 8.0);

    float ringR = 0.36 + 0.025 * sin(uTime * 2.4);
    float ring = exp(-pow((d - ringR) / 0.03, 2.0)) * (0.55 + 0.45 * sin(uTime * 3.1 + d * 12.0));
    float cross = (exp(-abs(q.x) * 70.0) + exp(-abs(q.y) * 70.0)) * pow(1.0 - d, 1.6) * (0.35 + 0.5 * uPulse);

    vec3 col = mix(uColor, vec3(1.0), hot);
    col = mix(col, uAccent, ring * 0.6);
    float a = glow * 0.55 + hot * 0.6 + ring * 0.55 + cross * 0.7;
    gl_FragColor = vec4(col, a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

function createVortexScene(
  ctx: SceneContext,
  opts: { count: number; comets: number; hero: boolean },
  heroCtx?: SceneContext
): SceneInstance {
  const bag = new DisposableBag();
  const palette = new ThemePalette(PALETTE, ctx.dark);
  let opacity = OPACITY[ctx.dark ? 'dark' : 'light'];
  const { size, scene } = ctx;

  const aP = new Float32Array(opts.count * 4);
  for (let i = 0; i < opts.count; i++) {
    aP.set([Math.random(), Math.random() * Math.PI * 2, Math.random(), Math.random()], i * 4);
  }
  const discGeo = bag.track(new THREE.BufferGeometry());
  discGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(opts.count * 3), 3));
  discGeo.setAttribute('aP', new THREE.BufferAttribute(aP, 4));

  const cCount = opts.comets * TRAIL_LEN;
  const aC = new Float32Array(cCount * 2);
  for (let i = 0; i < opts.comets; i++) {
    for (let t = 0; t < TRAIL_LEN; t++) {
      aC.set([i + 1, t], (i * TRAIL_LEN + t) * 2);
    }
  }
  const cometGeo = bag.track(new THREE.BufferGeometry());
  cometGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cCount * 3), 3));
  cometGeo.setAttribute('aC', new THREE.BufferAttribute(aC, 2));

  const aA = new Float32Array(RING_PTS * 2 * 2);
  for (let r = 0; r < 2; r++) {
    for (let i = 0; i < RING_PTS; i++) {
      aA.set([(i / RING_PTS) * Math.PI * 2, r], (r * RING_PTS + i) * 2);
    }
  }
  const ringGeo = bag.track(new THREE.BufferGeometry());
  ringGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(RING_PTS * 2 * 3), 3));
  ringGeo.setAttribute('aA', new THREE.BufferAttribute(aA, 2));

  const coreGeo = bag.track(new THREE.BufferGeometry());
  coreGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));

  const shared = {
    uPixelRatio: { value: ctx.dpr },
    uReveal: { value: 0 },
    uWell: { value: new THREE.Vector2() },
    uVel: { value: new THREE.Vector2() },
    uReach: { value: 400 },
    uRot: { value: 0 },
    uBurst: { value: 0 },
    uTilt: { value: 0.58 },
    uTime: { value: 0 },
    uOpacity: { value: opacity },
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uAvoidMin: { value: opts.hero ? 0.5 : 1 },
  };

  const discMat = bag.shader(
    {
      vertexShader: DISC_VERT,
      fragmentShader: DISC_FRAG,
      uniforms: {
        ...shared,
        uCore: { value: 14 },
        uSpin: { value: 9.5 },
        uOuter: { value: palette.cur.outer },
        uInner: { value: palette.cur.inner },
      },
    },
    ctx.dark
  );
  const cometMat = bag.shader(
    {
      vertexShader: COMET_VERT,
      fragmentShader: DISC_FRAG,
      uniforms: { ...shared, uColA: { value: palette.cur.inner }, uColB: { value: palette.cur.accent } },
    },
    ctx.dark
  );
  const ringMat = bag.shader(
    {
      vertexShader: RING_VERT,
      fragmentShader: RING_FRAG,
      uniforms: { ...shared, uAge: { value: new THREE.Vector2(-1, -1) }, uColor: { value: palette.cur.inner } },
    },
    ctx.dark
  );
  const coreMat = bag.shader(
    {
      vertexShader: CORE_VERT,
      fragmentShader: CORE_FRAG,
      uniforms: {
        ...shared,
        uSize: { value: 170 },
        uPulse: { value: 0 },
        uColor: { value: palette.cur.core },
        uAccent: { value: palette.cur.accent },
      },
    },
    ctx.dark
  );

  for (const [g, m] of [
    [discGeo, discMat],
    [cometGeo, cometMat],
    [ringGeo, ringMat],
    [coreGeo, coreMat],
  ] as const) {
    const pts = new THREE.Points(g, m);
    pts.frustumCulled = false;
    bag.mount(scene, pts);
  }

  let rot = 0;
  let burst = 0;
  const ringAge = new THREE.Vector2(-1, -1);
  const firedAt = [-1e9, -1e9];
  let lastElapsed = 0;
  const well = new THREE.Vector2();
  const vel = new THREE.Vector2();
  let initialized = false;

  return {
    update(frame) {
      const { dt, elapsed, fade, progress, scrollSpeed, pointer } = frame;
      ctx.camera.position.set(0, 0, ctx.camZ());
      ctx.camera.lookAt(0, 0, 0);
      palette.update(dt);

      const homeX = heroCtx?.rig ? heroCtx.rig.position.x : Math.sin(elapsed * 0.21) * size.width * 0.1;
      const homeY = heroCtx?.rig ? heroCtx.rig.position.y : Math.cos(elapsed * 0.17) * size.height * 0.07;
      const tx = homeX + (pointer.x - homeX) * pointer.power;
      const ty = homeY + (pointer.y - homeY) * pointer.power;
      const prevX = well.x;
      const prevY = well.y;

      if (initialized) {
        well.set(damp(well.x, tx, 5, dt), damp(well.y, ty, 5, dt));
      } else {
        well.set(tx, ty);
        initialized = true;
      }

      const vx = Math.max(-1400, Math.min(1400, (well.x - prevX) / Math.max(dt, 0.001)));
      const vy = Math.max(-1400, Math.min(1400, (well.y - prevY) / Math.max(dt, 0.001)));
      vel.set(damp(vel.x, vx, 10, dt), damp(vel.y, vy, 10, dt));

      burst = damp(burst, 0, 1.8, dt);
      const spd = opts.hero ? progress * 0.5 : Math.min(scrollSpeed / 1600, 1.6);
      rot += dt * (0.18 + burst * 2.2 + spd * 0.7 + pointer.power * 0.25);
      lastElapsed = elapsed;
      ringAge.set(elapsed - firedAt[0], elapsed - firedAt[1]);

      const reach = Math.max(size.width, size.height) * (opts.hero ? 0.42 : 0.5);
      shared.uTime.value = elapsed;
      shared.uReach.value = reach;
      shared.uRot.value = rot;
      shared.uBurst.value = burst;
      shared.uTilt.value = 0.58 + 0.12 * Math.sin(elapsed * 0.3);
      shared.uWell.value.copy(well);
      shared.uVel.value.copy(vel);
      shared.uReveal.value = easeOutCubic(elapsed / 2.2) * fade;
      shared.uOpacity.value = opacity;

      ringMat.uniforms.uAge.value.copy(ringAge);
      coreMat.uniforms.uPulse.value = Math.min(1, burst + pointer.power * 0.25);
      coreMat.uniforms.uSize.value = Math.min(size.width, size.height) * 0.2;

      if (heroCtx) {
        shared.uAvoid.value = avoidUniformVec(heroCtx.avoid);
      } else {
        discMat.uniforms.uOuter.value = frame.tint;
      }
    },
    resize() {},
    setTheme(nextDark) {
      opacity = OPACITY[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
    },
    pointerDown() {
      burst = 1;
      firedAt[0] = lastElapsed;
      firedAt[1] = lastElapsed + 0.17;
    },
    dispose() {
      bag.dispose();
    },
  };
}

export const hero = (ctx: SceneContext): SceneInstance =>
  createVortexScene(ctx, { count: ctx.compact ? 1400 : 2800, comets: ctx.compact ? 3 : 6, hero: true }, ctx);

export const background = (ctx: SceneContext): SceneInstance =>
  createVortexScene(ctx, { count: ctx.compact ? 600 : 1300, comets: ctx.compact ? 2 : 4, hero: false });

