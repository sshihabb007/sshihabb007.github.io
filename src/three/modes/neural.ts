import * as THREE from 'three';
import {
  easeOutCubic,
  DisposableBag,
  ThemePalette,
  SceneContext,
  SceneInstance,
  scaleUniforms,
  swayCamera,
  AVOID_GLSL,
  avoidUniformVec,
} from '../util';
import { createDustField } from '../dust';

const BG_PALETTE = {
  dark: { fiber: '#a78bfa', pulse: '#67e8f9', node: '#f0abfc' },
  light: { fiber: '#7c3aed', pulse: '#0891b2', node: '#6d28d9' },
};
const BG_LEVELS = {
  dark: { fiber: 0.5, pulse: 1, node: 0.9 },
  light: { fiber: 0.5, pulse: 0.9, node: 0.8 },
};

const FIBER_COMMON = `
  uniform float uTime;
  uniform float uHalfW;
  uniform float uHalfH;
  uniform float uCam;
  uniform float uScroll;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform vec2  uPointer;
  uniform float uPointerPower;

  vec3 fiberAt(vec4 F, float z, float t) {
    float depth = clamp((z + 380.0) / 520.0, 0.0, 1.0);
    float x = (t * 2.0 - 1.0) * uHalfW * 1.12;
    float span = uHalfH * 2.4;
    float base = mod(F.x * uHalfH + uScroll * (0.05 + 0.16 * depth) + uHalfH * 1.2, span) - uHalfH * 1.2;
    float w = sin(t * F.z * 6.2832 + F.w + uTime * 0.16) + 0.5 * sin(t * F.z * 2.3 * 6.2832 - uTime * 0.11 + F.w * 1.7);
    float y = base + F.y * w;
    float dx = x - uPointer.x;
    y += (uPointer.y - y) * 0.22 * exp(-dx * dx / 80000.0) * uPointerPower * exp(-pow((y - uPointer.y) / 260.0, 2.0));
    return vec3(x, y, base);
  }
  float edgeFade(float base) {
    return 1.0 - smoothstep(0.95, 1.2, abs(base) / uHalfH);
  }
  float depthOf(float z) {
    return clamp((z + 380.0) / 520.0, 0.0, 1.0);
  }
`;

const FIBER_LINE_VERT = `
  ${FIBER_COMMON}
  attribute float aT;
  attribute vec4  aF;
  attribute float aZ;
  varying float vA;

  void main() {
    vec3 f = fiberAt(aF, aZ, aT);
    float g = (uCam - aZ) / uCam;
    gl_Position = projectionMatrix * viewMatrix * vec4(f.xy * g, aZ, 1.0);
    float ig = exp(-pow(distance(f.xy, uPointer) / 170.0, 2.0)) * uPointerPower;
    vA = (0.22 + 0.78 * depthOf(aZ) + ig * 0.7) * edgeFade(f.z) * smoothstep(0.0, 0.07, aT) * smoothstep(1.0, 0.93, aT) * uReveal;
  }
`;

const FIBER_PULSE_VERT = `
  ${FIBER_COMMON}
  attribute vec4  aF;
  attribute vec4  aR;
  attribute float aZ;
  attribute float aTail;
  varying float vA;
  varying float vHead;

  void main() {
    float t = fract(uTime * aR.x + aR.y);
    t = mix(t, 1.0 - t, step(aR.w, 0.0));
    t = clamp(t - aTail * 0.04 * sign(aR.w), 0.0, 1.0);
    vec3 f = fiberAt(aF, aZ, t);
    float g = (uCam - aZ) / uCam;
    vec4 mv = viewMatrix * vec4(f.xy * g, aZ, 1.0);
    gl_Position = projectionMatrix * mv;
    float head = 1.0 - aTail;
    gl_PointSize = aR.z * (0.35 + 0.65 * head) * uPixelRatio * (uCam / -mv.z) * (0.7 + 0.3 * depthOf(aZ));
    float life = sin(t * 3.14159265);
    vA = life * pow(head, 1.4) * edgeFade(f.z) * uReveal;
    vHead = head;
  }
`;

const FIBER_NODE_VERT = `
  ${FIBER_COMMON}
  attribute vec4  aF;
  attribute float aZ;
  attribute vec2  aN;
  varying float vA;
  varying float vGlow;

  void main() {
    vec3 f = fiberAt(aF, aZ, aN.x);
    float g = (uCam - aZ) / uCam;
    vec4 mv = viewMatrix * vec4(f.xy * g, aZ, 1.0);
    gl_Position = projectionMatrix * mv;
    float glow = pow(max(0.0, sin(uTime * 0.55 + aN.y * 40.0)), 10.0);
    float ig = exp(-pow(distance(f.xy, uPointer) / 130.0, 2.0)) * uPointerPower;
    vGlow = clamp(glow + ig, 0.0, 1.0);
    gl_PointSize = (4.0 + 5.0 * vGlow) * uPixelRatio * (uCam / -mv.z) * (0.7 + 0.3 * depthOf(aZ));
    vA = (0.3 + 0.7 * depthOf(aZ)) * edgeFade(f.z) * uReveal;
  }
`;

const FIBER_LINE_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    gl_FragColor = vec4(uColor, vA * uOpacity);
    #include <colorspace_fragment>
  }
`;

const FIBER_PULSE_FRAG = `
  uniform vec3  uColor;
  uniform vec3  uHot;
  uniform float uOpacity;
  varying float vA;
  varying float vHead;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core = pow(1.0 - d, 4.0);
    vec3 col = mix(uColor, uHot, core * vHead);
    gl_FragColor = vec4(col, (pow(1.0 - d, 1.5) * 0.8 + core * 0.6) * vA * uOpacity);
    #include <colorspace_fragment>
  }
`;

const FIBER_NODE_FRAG = `
  uniform vec3  uColor;
  uniform vec3  uHot;
  uniform float uOpacity;
  varying float vA;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core = pow(1.0 - d, 3.0);
    vec3 col = mix(uColor, uHot, vGlow);
    gl_FragColor = vec4(col, (pow(1.0 - d, 1.6) * 0.55 + core * 0.5) * vA * uOpacity * (0.55 + 0.9 * vGlow));
    #include <colorspace_fragment>
  }
`;

export const background = (ctx: SceneContext): SceneInstance => {
  const bag = new DisposableBag();
  const palette = new ThemePalette(BG_PALETTE, ctx.dark);
  let levels = BG_LEVELS[ctx.dark ? 'dark' : 'light'];
  const { size, compact } = ctx;
  const fiberCount = compact ? 9 : 16;
  const pulseCount = compact ? 14 : 28;

  const fibers = Array.from({ length: fiberCount }, (_, idx) => ({
    F: [
      (idx / fiberCount) * 2 - 1 + (Math.random() - 0.5) * 0.12,
      26 + Math.random() * 70,
      0.6 + Math.random() * 1.1,
      Math.random() * 6.28,
    ],
    z: -380 + Math.random() * 520,
  }));

  const aT = new Float32Array(fiberCount * 64 * 2);
  const aF = new Float32Array(fiberCount * 64 * 2 * 4);
  const aZ = new Float32Array(fiberCount * 64 * 2);
  let idx = 0;
  fibers.forEach((f) => {
    for (let s = 0; s < 64; s++) {
      for (const t of [s / 64, (s + 1) / 64]) {
        aT[idx] = t;
        aF.set(f.F, idx * 4);
        aZ[idx] = f.z;
        idx++;
      }
    }
  });
  const lineGeo = bag.track(new THREE.BufferGeometry());
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(idx * 3), 3));
  lineGeo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
  lineGeo.setAttribute('aF', new THREE.BufferAttribute(aF, 4));
  lineGeo.setAttribute('aZ', new THREE.BufferAttribute(aZ, 1));

  const pVerts = pulseCount * 5;
  const pF = new Float32Array(pVerts * 4);
  const pZ = new Float32Array(pVerts);
  const pR = new Float32Array(pVerts * 4);
  const pTail = new Float32Array(pVerts);
  for (let i = 0; i < pulseCount; i++) {
    const f = fibers[Math.floor(Math.random() * fiberCount)];
    const r = [
      0.05 + Math.random() * 0.09,
      Math.random(),
      8 + Math.random() * 4,
      Math.random() < 0.5 ? 1 : -1,
    ];
    for (let t = 0; t < 5; t++) {
      const k = i * 5 + t;
      pF.set(f.F, k * 4);
      pZ[k] = f.z;
      pR.set(r, k * 4);
      pTail[k] = t / 4;
    }
  }
  const pulseGeo = bag.track(new THREE.BufferGeometry());
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pVerts * 3), 3));
  pulseGeo.setAttribute('aF', new THREE.BufferAttribute(pF, 4));
  pulseGeo.setAttribute('aZ', new THREE.BufferAttribute(pZ, 1));
  pulseGeo.setAttribute('aR', new THREE.BufferAttribute(pR, 4));
  pulseGeo.setAttribute('aTail', new THREE.BufferAttribute(pTail, 1));

  const nVerts = fiberCount * 6;
  const nF = new Float32Array(nVerts * 4);
  const nZ = new Float32Array(nVerts);
  const nN = new Float32Array(nVerts * 2);
  fibers.forEach((f, fIdx) => {
    for (let i = 0; i < 6; i++) {
      const k = fIdx * 6 + i;
      nF.set(f.F, k * 4);
      nZ[k] = f.z;
      nN[k * 2] = (i + 0.5 + (Math.random() - 0.5) * 0.7) / 6;
      nN[k * 2 + 1] = Math.random();
    }
  });
  const nodeGeo = bag.track(new THREE.BufferGeometry());
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nVerts * 3), 3));
  nodeGeo.setAttribute('aF', new THREE.BufferAttribute(nF, 4));
  nodeGeo.setAttribute('aZ', new THREE.BufferAttribute(nZ, 1));
  nodeGeo.setAttribute('aN', new THREE.BufferAttribute(nN, 2));

  const shared = {
    uTime: { value: 0 },
    uHalfW: { value: size.width / 2 },
    uHalfH: { value: size.height / 2 },
    uCam: { value: ctx.camZ() },
    uScroll: { value: 0 },
    uPixelRatio: { value: ctx.dpr },
    uReveal: { value: 0 },
    uPointer: { value: { x: 1e5, y: 1e5 } },
    uPointerPower: { value: 0 },
  };

  const lineMat = bag.shader(
    {
      vertexShader: FIBER_LINE_VERT,
      fragmentShader: FIBER_LINE_FRAG,
      uniforms: { ...shared, uColor: { value: palette.cur.fiber }, uOpacity: { value: levels.fiber } },
    },
    ctx.dark
  );
  const pulseMat = bag.shader(
    {
      vertexShader: FIBER_PULSE_VERT,
      fragmentShader: FIBER_PULSE_FRAG,
      uniforms: {
        ...shared,
        uColor: { value: palette.cur.pulse },
        uHot: { value: palette.cur.node },
        uOpacity: { value: levels.pulse },
      },
    },
    ctx.dark
  );
  const nodeMat = bag.shader(
    {
      vertexShader: FIBER_NODE_VERT,
      fragmentShader: FIBER_NODE_FRAG,
      uniforms: {
        ...shared,
        uColor: { value: palette.cur.fiber },
        uHot: { value: palette.cur.node },
        uOpacity: { value: levels.node },
      },
    },
    ctx.dark
  );

  for (const obj of [
    new THREE.LineSegments(lineGeo, lineMat),
    new THREE.Points(nodeGeo, nodeMat),
    new THREE.Points(pulseGeo, pulseMat),
  ]) {
    obj.frustumCulled = false;
    bag.mount(ctx.scene, obj);
  }

  let scrollAcc = 0;

  return {
    update(frame) {
      const { dt, elapsed, pointer, sway, scrollDelta } = frame;
      palette.update(dt);
      ctx.camera.position.set(-sway.x * 20, -sway.y * 12, ctx.camZ());
      ctx.camera.lookAt(0, 0, 0);
      scrollAcc -= scrollDelta;
      shared.uTime.value = elapsed;
      shared.uScroll.value = scrollAcc;
      shared.uReveal.value = easeOutCubic(elapsed / 2.6);
      shared.uPointer.value = pointer;
      shared.uPointerPower.value = pointer.power;
      lineMat.uniforms.uOpacity.value = levels.fiber;
      pulseMat.uniforms.uOpacity.value = levels.pulse;
      nodeMat.uniforms.uOpacity.value = levels.node;
    },
    resize() {
      shared.uHalfW.value = size.width / 2;
      shared.uHalfH.value = size.height / 2;
      shared.uCam.value = ctx.camZ();
    },
    setTheme(nextDark) {
      levels = BG_LEVELS[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
    },
    dispose() {
      bag.dispose();
    },
  };
};

const HERO_PALETTE = {
  dark: { node: '#7dd3fc', edge: '#38bdf8', hot: '#f0f9ff', pulse: '#c4b5fd' },
  light: { node: '#1d4ed8', edge: '#3b82f6', hot: '#1e3a8a', pulse: '#7c3aed' },
};
const HERO_LEVELS = {
  dark: { opacity: 1, edge: 1, core: 0.55, dust: 0.55 },
  light: { opacity: 0.9, edge: 1.15, core: 0, dust: 0.45 },
};

const SHELL_COMMON = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTime;
  uniform float uReveal;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform float uUnit;
  uniform float uR;
  uniform vec2  uPointer;
  uniform float uPointerPower;
  uniform vec2  uBurstPos;
  uniform float uBurstR;
  uniform float uBurst;

  float depthOf(vec3 local) {
    vec3 dir = mat3(modelMatrix) * local;
    return clamp(0.5 + 0.5 * dir.z / (uR * uUnit), 0.0, 1.0);
  }
  float igniteAt(vec2 xy) {
    float ig = smoothstep(160.0, 0.0, length(xy - uPointer)) * uPointerPower;
    float off = (length(xy - uBurstPos) - uBurstR) / 55.0;
    return ig + exp(-off * off) * uBurst;
  }
`;

const SHELL_NODE_VERT = `
  ${SHELL_COMMON}
  attribute vec2  aSeed;
  attribute float aSize;
  varying float vAlpha;
  varying float vDepth;
  varying float vFire;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    float depth = depthOf(position);
    float rv = smoothstep(aSeed.x * 0.8, aSeed.x * 0.8 + 0.2, uReveal);
    float self = pow(max(0.0, sin(uTime * (0.5 + aSeed.x * 0.9) + aSeed.y * 6.2831)), 18.0);
    float fire = clamp(self + igniteAt(world.xy), 0.0, 1.6);

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    float keep = avoidMask(world.xy, uAvoidMin);
    gl_PointSize = aSize * uPixelRatio * (uScale / -mv.z) * (0.55 + 0.45 * depth) * (1.0 + fire * 1.3) * rv;
    vAlpha = rv * (0.32 + 0.68 * depth) * keep;
    vDepth = depth;
    vFire = fire;
  }
`;

const SHELL_NODE_FRAG = `
  uniform vec3  uNode;
  uniform vec3  uEdge;
  uniform vec3  uHot;
  uniform float uOpacity;
  uniform float uCore;
  varying float vAlpha;
  varying float vDepth;
  varying float vFire;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float soft = pow(1.0 - d, 1.5);
    float core = pow(1.0 - d, 5.0);
    vec3 col = mix(uEdge, uNode, vDepth);
    col = mix(col, uHot, clamp(vFire, 0.0, 1.0) * 0.75);
    col += vec3(core * uCore * (0.3 + vFire));
    float a = (soft * 0.85 + core * 0.6) * vAlpha * uOpacity * (1.0 + vFire * 0.7);
    gl_FragColor = vec4(col, min(a, 1.0));
    #include <colorspace_fragment>
  }
`;

const SHELL_EDGE_VERT = `
  ${SHELL_COMMON}
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    float depth = depthOf(position);
    float rv = smoothstep(aSeed * 0.8, aSeed * 0.8 + 0.25, uReveal);
    vAlpha = rv * (0.07 + 0.36 * depth + igniteAt(world.xy) * 0.55) * avoidMask(world.xy, uAvoidMin);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const SHELL_EDGE_FRAG = `
  uniform vec3  uEdge;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uEdge, vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

const SHELL_PULSE_VERT = `
  ${SHELL_COMMON}
  uniform float uPulse;
  attribute vec3 aA;
  attribute vec3 aB;
  attribute vec3 aRate;
  varying float vAlpha;
  varying float vDepth;

  void main() {
    float f = fract(uTime * aRate.x + aRate.y);
    vec3 p = mix(aA, aB, f);
    float env = sin(f * 3.14159265);
    float depth = depthOf(p);

    vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aRate.z * uPixelRatio * (uScale / -mv.z) * (0.6 + 0.4 * depth) * (0.35 + 0.65 * env) * uPulse;
    vAlpha = env * (0.35 + 0.65 * depth) * uPulse * avoidMask((modelMatrix * vec4(p, 1.0)).xy, uAvoidMin);
    vDepth = depth;
  }
`;

const SHELL_PULSE_FRAG = `
  uniform vec3  uPulseColor;
  uniform float uOpacity;
  uniform float uCore;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float soft = pow(1.0 - d, 1.4);
    float core = pow(1.0 - d, 4.0);
    vec3 col = uPulseColor + vec3(core * (0.25 + uCore));
    gl_FragColor = vec4(col, (soft * 0.8 + core * 0.7) * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

const SHELL_SPECS = [
  { radius: 300, count: 120, neighbours: 3, speed: 0.07, tilt: 0.42, roll: 0.2 },
  { radius: 376, count: 150, neighbours: 3, speed: -0.045, tilt: -0.3, roll: -0.18 },
];

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function buildShell(
  spec: (typeof SHELL_SPECS)[number],
  density: number,
  pulseCount: number
) {
  const count = Math.round(spec.count * density);
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const rad = Math.sqrt(1 - y * y);
    const theta = i * GOLDEN_ANGLE;
    const r = spec.radius * (0.95 + Math.random() * 0.09);
    pts.push([Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r]);
  }

  const edgeSet = new Set<string>();
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    const dists: Array<[number, number]> = [];
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      const dz = pts[i][2] - pts[j][2];
      dists.push([dx * dx + dy * dy + dz * dz, j]);
    }
    dists.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < spec.neighbours; k++) {
      const n = dists[k][1];
      const key = i < n ? `${i}-${n}` : `${n}-${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([i, n]);
      }
    }
  }

  const nSeeds = new Float32Array(count * 2);
  const nSizes = new Float32Array(count);
  const nPos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    nPos.set(pts[i], i * 3);
    nSeeds[i * 2] = Math.random();
    nSeeds[i * 2 + 1] = Math.random();
    nSizes[i] = 3.4 + Math.pow(Math.random(), 3) * 5.5;
  }
  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
  nodeGeometry.setAttribute('aSeed', new THREE.BufferAttribute(nSeeds, 2));
  nodeGeometry.setAttribute('aSize', new THREE.BufferAttribute(nSizes, 1));

  const ePos = new Float32Array(edges.length * 6);
  const eSeeds = new Float32Array(edges.length * 2);
  edges.forEach(([a, b], idx) => {
    ePos.set(pts[a], idx * 6);
    ePos.set(pts[b], idx * 6 + 3);
    eSeeds[idx * 2] = nSeeds[a * 2];
    eSeeds[idx * 2 + 1] = nSeeds[b * 2];
  });
  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  edgeGeometry.setAttribute('aSeed', new THREE.BufferAttribute(eSeeds, 1));

  const pA = new Float32Array(pulseCount * 3);
  const pB = new Float32Array(pulseCount * 3);
  const pRate = new Float32Array(pulseCount * 3);
  for (let i = 0; i < pulseCount; i++) {
    const [a, b] = edges[Math.floor(Math.random() * edges.length)];
    const flip = Math.random() < 0.5;
    pA.set(pts[flip ? a : b], i * 3);
    pB.set(pts[flip ? b : a], i * 3);
    pRate.set([0.28 + Math.random() * 0.5, Math.random(), 6 + Math.random() * 3], i * 3);
  }
  const pulseGeometry = new THREE.BufferGeometry();
  pulseGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pulseCount * 3), 3));
  pulseGeometry.setAttribute('aA', new THREE.BufferAttribute(pA, 3));
  pulseGeometry.setAttribute('aB', new THREE.BufferAttribute(pB, 3));
  pulseGeometry.setAttribute('aRate', new THREE.BufferAttribute(pRate, 3));

  return { nodeGeometry, edgeGeometry, pulseGeometry };
}

export const hero = (ctx: SceneContext): SceneInstance => {
  const { rig, compact } = ctx;
  const bag = new DisposableBag();
  const palette = new ThemePalette(HERO_PALETTE, ctx.dark);
  let levels = HERO_LEVELS[ctx.dark ? 'dark' : 'light'];

  const root = bag.mount(rig ?? ctx.scene, new THREE.Group());
  const shared = {
    ...scaleUniforms(ctx),
    uTime: { value: 0 },
    uReveal: { value: 0 },
    uUnit: { value: 1 },
    uPointer: { value: { x: 1e5, y: 1e5 } },
    uPointerPower: { value: 0 },
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uAvoidMin: { value: 0.3 },
    uBurstPos: { value: { x: 0, y: 0 } },
    uBurstR: { value: 0 },
    uBurst: { value: 0 },
    uNode: { value: palette.cur.node },
    uEdge: { value: palette.cur.edge },
    uHot: { value: palette.cur.hot },
    uPulseColor: { value: palette.cur.pulse },
    uOpacity: { value: levels.opacity },
    uCore: { value: levels.core },
    uPulse: { value: 0 },
  };

  const edgeOpacity = { value: levels.edge };
  const density = compact ? 0.6 : 1;
  const shells = SHELL_SPECS.map((spec) => {
    const g = buildShell(spec, density, compact ? 10 : 20);
    bag.track(g.nodeGeometry);
    bag.track(g.edgeGeometry);
    bag.track(g.pulseGeometry);
    const rUniform = { uR: { value: spec.radius } };
    const nMat = bag.shader(
      { vertexShader: SHELL_NODE_VERT, fragmentShader: SHELL_NODE_FRAG, uniforms: { ...shared, ...rUniform } },
      ctx.dark
    );
    const eMat = bag.shader(
      {
        vertexShader: SHELL_EDGE_VERT,
        fragmentShader: SHELL_EDGE_FRAG,
        uniforms: { ...shared, ...rUniform, uOpacity: edgeOpacity },
      },
      ctx.dark
    );
    const pMat = bag.shader(
      { vertexShader: SHELL_PULSE_VERT, fragmentShader: SHELL_PULSE_FRAG, uniforms: { ...shared, ...rUniform } },
      ctx.dark
    );
    const grp = bag.mount(root, new THREE.Group());
    const eLines = new THREE.LineSegments(g.edgeGeometry, eMat);
    const nPts = new THREE.Points(g.nodeGeometry, nMat);
    const pPts = new THREE.Points(g.pulseGeometry, pMat);
    eLines.frustumCulled = false;
    nPts.frustumCulled = false;
    pPts.frustumCulled = false;
    grp.add(eLines, nPts, pPts);
    return { spec, group: grp, angle: Math.random() * Math.PI * 2 };
  });

  const dust = createDustField(ctx, bag, {
    count: compact ? 120 : 260,
    color: palette.cur.node,
    sizeMin: 1.2,
    sizeRange: 2.2,
  });

  let burstAge = 99;

  return {
    update(frame) {
      const { dt, elapsed, fade, progress, pointer, sway } = frame;
      swayCamera(ctx, sway, 40, 26);
      palette.update(dt);
      burstAge += dt;

      shared.uTime.value = elapsed;
      shared.uReveal.value = easeOutCubic(elapsed / 3.4);
      shared.uPulse.value = easeOutCubic((elapsed - 2.2) / 1.5) * fade;
      shared.uUnit.value = rig ? rig.scale.x : 1;
      shared.uOpacity.value = levels.opacity * fade;
      shared.uCore.value = levels.core;
      edgeOpacity.value = levels.edge * fade;
      shared.uPointer.value = pointer;
      shared.uAvoid.value = avoidUniformVec(ctx.avoid);
      shared.uPointerPower.value = pointer.power * fade;
      shared.uBurstR.value = burstAge * 640;
      shared.uBurst.value = Math.max(0, 1 - burstAge / 1.5) * fade;

      for (const s of shells) {
        s.angle += dt * s.spec.speed * (1 + progress * 2.4);
        s.group.rotation.set(s.spec.tilt + sway.y * 0.16, s.angle + sway.x * 0.1, s.spec.roll);
      }

      dust.update(elapsed, easeOutCubic(elapsed / 2.4) * fade, levels.dust, 0.6);
      root.position.y = progress * 36;
    },
    resize() {
      shared.uScale.value = ctx.camZ();
      dust.resize();
    },
    setTheme(nextDark) {
      levels = HERO_LEVELS[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
    },
    pointerDown(x, y) {
      shared.uBurstPos.value = { x, y };
      burstAge = 0;
    },
    dispose() {
      bag.dispose();
    },
  };
};

