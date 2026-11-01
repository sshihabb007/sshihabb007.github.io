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
  dark: { a: '#38bdf8', b: '#a78bfa' },
  light: { a: '#2563eb', b: '#7c3aed' },
};
const OPACITY = { dark: 1, light: 0.85 };

const VERT = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTravel;
  uniform float uTime;
  uniform float uF;
  uniform float uD;
  uniform float uReveal;
  uniform float uRadius;
  uniform float uTwist;
  uniform float uRot;
  uniform float uBoost;
  uniform vec2  uCenter;
  uniform vec2  uSteer;
  uniform vec3  uColA;
  uniform vec3  uColB;
  attribute vec4 aR;
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    bool spoke = aR.w > 0.5;
    float z = spoke ? aR.x : fract(aR.x + uTravel);
    float Z = mix(-uD, 0.93 * uF, z);
    float scale = uF / (uF - Z);
    float near = 1.0 - z;

    float ang = aR.y + z * uTwist + uRot;
    float wob = spoke ? 1.0 : 1.0 + 0.07 * sin(aR.z * 6.2831 + uTime * 0.8 + z * 9.0);
    vec2 p = vec2(cos(ang), sin(ang)) * uRadius * wob * scale;
    vec2 scr = uCenter + uSteer * pow(near, 1.35) + p;
    gl_Position = projectionMatrix * viewMatrix * vec4(scr, 0.0, 1.0);

    float life = smoothstep(0.0, 0.1, z) * (1.0 - smoothstep(0.8, 1.0, z));
    float depthGlow = 0.3 + 0.7 * smoothstep(0.0, 0.65, z);
    float base = spoke ? 0.3 : 0.95;
    vAlpha = life * depthGlow * base * (1.0 + uBoost * 0.7) * uReveal * avoidMask(scr, uAvoidMin);
    vColor = mix(uColA, uColB, spoke ? 0.5 : fract(aR.z * 3.7 + z * 0.5));
  }
`;

const FRAG = `
  uniform float uOpacity;
  varying float vAlpha;
  varying vec3  vColor;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

function createTunnelScene(
  ctx: SceneContext,
  opts: { rings: number; segments: number; spokes: number; hero: boolean },
  heroCtx?: SceneContext
): SceneInstance {
  const bag = new DisposableBag();
  const palette = new ThemePalette(PALETTE, ctx.dark);
  let opacity = OPACITY[ctx.dark ? 'dark' : 'light'];
  const { size, scene } = ctx;
  const { rings, segments, spokes } = opts;

  const verts = (rings * segments + spokes * 12) * 2;
  const aR = new Float32Array(verts * 4);
  let idx = 0;
  const push = (z: number, ang: number, seed: number, spoke: number) => {
    aR.set([z, ang, seed, spoke], idx * 4);
    idx++;
  };

  for (let r = 0; r < rings; r++) {
    const z = r / rings;
    const seed = Math.random();
    for (let s = 0; s < segments; s++) {
      push(z, (s / segments) * Math.PI * 2, seed, 0);
      push(z, ((s + 1) / segments) * Math.PI * 2, seed, 0);
    }
  }
  for (let sp = 0; sp < spokes; sp++) {
    const ang = (sp / spokes) * Math.PI * 2;
    for (let seg = 0; seg < 12; seg++) {
      push((seg / 12) * 0.98, ang, sp / spokes, 1);
      push(((seg + 1) / 12) * 0.98, ang, sp / spokes, 1);
    }
  }

  const geo = bag.track(new THREE.BufferGeometry());
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts * 3), 3));
  geo.setAttribute('aR', new THREE.BufferAttribute(aR, 4));

  const uniforms = {
    uTravel: { value: 0 },
    uTime: { value: 0 },
    uF: { value: ctx.camZ() },
    uD: { value: 2600 },
    uReveal: { value: 0 },
    uRadius: { value: 300 },
    uTwist: { value: 1.2 },
    uRot: { value: 0 },
    uBoost: { value: 0 },
    uCenter: { value: new THREE.Vector2() },
    uSteer: { value: new THREE.Vector2() },
    uColA: { value: palette.cur.a },
    uColB: { value: palette.cur.b },
    uOpacity: { value: opacity },
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uAvoidMin: { value: opts.hero ? 0.3 : 1 },
  };

  const lines = new THREE.LineSegments(
    geo,
    bag.shader({ vertexShader: VERT, fragmentShader: FRAG, uniforms }, ctx.dark)
  );
  lines.frustumCulled = false;
  bag.mount(scene, lines);

  let travel = 0;
  let rot = 0;
  let boost = 0;
  const steer = new THREE.Vector2();

  return {
    update(frame) {
      const { dt, elapsed, fade, progress, sway, scrollSpeed, pointer } = frame;
      ctx.camera.position.set(0, 0, ctx.camZ());
      ctx.camera.lookAt(0, 0, 0);
      palette.update(dt);

      const cx = heroCtx?.rig ? heroCtx.rig.position.x : 0;
      const cy = heroCtx?.rig ? heroCtx.rig.position.y : 0;
      const maxSteer = Math.min(size.width, size.height) * 0.42;
      const idleX = sway.x * size.width * 0.16;
      const idleY = -sway.y * size.height * 0.16;
      const ptrX = (pointer.x - cx) * 1.1;
      const ptrY = (pointer.y - cy) * 1.1;
      const tx = idleX + (ptrX - idleX) * pointer.power;
      const ty = idleY + (ptrY - idleY) * pointer.power;
      const len = Math.hypot(tx, ty);
      const clampScale = len > maxSteer * 2 ? (maxSteer * 2) / len : 1;

      steer.set(damp(steer.x, tx * clampScale, 3, dt), damp(steer.y, ty * clampScale, 3, dt));
      boost = damp(boost, 0, 1.4, dt);
      const spd = opts.hero ? progress * 0.6 : Math.min(scrollSpeed / 1800, 1.4);
      travel += dt * (0.07 + boost * 0.4 + spd * 0.2 + pointer.power * 0.03);
      rot += dt * (0.035 + boost * 0.5 + spd * 0.12);

      uniforms.uTravel.value = travel;
      uniforms.uTime.value = elapsed;
      uniforms.uRot.value = rot;
      uniforms.uBoost.value = boost;
      uniforms.uRadius.value = Math.max(size.width, size.height) * 0.3;
      uniforms.uTwist.value = 1 + (steer.length() / Math.max(maxSteer, 1)) * 0.8;
      uniforms.uReveal.value = easeOutCubic(elapsed / 2.2) * fade;
      uniforms.uOpacity.value = opacity;
      uniforms.uCenter.value.set(cx, cy);
      uniforms.uSteer.value.copy(steer);

      if (heroCtx) {
        uniforms.uAvoid.value = avoidUniformVec(heroCtx.avoid);
      } else {
        uniforms.uColA.value = frame.tint;
      }
    },
    resize() {
      uniforms.uF.value = ctx.camZ();
    },
    setTheme(nextDark) {
      opacity = OPACITY[nextDark ? 'dark' : 'light'];
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
  createTunnelScene(
    ctx,
    {
      rings: ctx.compact ? 20 : 30,
      segments: ctx.compact ? 40 : 64,
      spokes: ctx.compact ? 12 : 20,
      hero: true,
    },
    ctx
  );

export const background = (ctx: SceneContext): SceneInstance =>
  createTunnelScene(ctx, {
    rings: ctx.compact ? 12 : 18,
    segments: ctx.compact ? 32 : 48,
    spokes: ctx.compact ? 8 : 12,
    hero: false,
  });

