import * as THREE from 'three';
import { hasWebGL, isDarkTheme, observeTheme } from '../utils/scroll';
import { createPointerTracker, damp } from './util';

const TWO_PI = Math.PI * 2;
const TOTAL_NODES = 220;
const RADIUS = 1.6;
const HEIGHT = 6;
const TURNS = 3.5;
const BASE_POINT_SIZE = 55;
const DRIFT_SPEED = 0.06;
const ROT_SPEED = 0.18;
const PUSH_STRENGTH = 0.28;
const POINTER_DAMP = 5.5;

const nodeVertexShader = `
uniform float uTime;
uniform float uDrift;
uniform vec2  uPointer;
uniform float uPointerPower;
uniform float uNodeCount;

attribute float aIndex;
attribute float aArm;
attribute float aSeed;

varying float vBrightness;
varying float vAlpha;

#define TWO_PI 6.2831853

vec3 helixPos(float t, float arm) {
  float angle = t * ${(TURNS * TWO_PI).toFixed(4)} + arm * ${Math.PI.toFixed(4)};
  float x = cos(angle) * ${RADIUS.toFixed(3)};
  float z = sin(angle) * ${RADIUS.toFixed(3)};
  float y = (t - 0.5) * ${HEIGHT.toFixed(3)};
  return vec3(x, y, z);
}

void main() {
  float t = mod((aIndex / uNodeCount) + uDrift, 1.0);
  vec3 pos = helixPos(t, aArm);

  float wave = sin(uTime * 0.7 + aSeed * TWO_PI) * 0.06;
  pos.y += wave;

  vec4 clip = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vec2 ndc  = clip.xy / clip.w;

  float dist = length(ndc - uPointer);
  float push = uPointerPower * smoothstep(0.6, 0.0, dist) * ${PUSH_STRENGTH.toFixed(3)};

  vec2 dir = normalize(ndc - uPointer + 0.0001);
  pos.x += dir.x * push * 0.4;
  pos.z -= dir.y * push * 0.4;

  vBrightness = 0.55 + push * 2.8 + aSeed * 0.25;
  float edgeFade = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.92, t);
  vAlpha = edgeFade * (0.55 + aSeed * 0.35 + push * 1.8);

  gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (${BASE_POINT_SIZE.toFixed(1)} + aSeed * 28.0 + push * 60.0) / -gl_Position.z;
  gl_PointSize = clamp(gl_PointSize, 1.5, 18.0);
}
`;

const strandAFragShader = `
uniform vec3 uColorA;
varying float vBrightness;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float r = dot(uv, uv);
  if (r > 1.0) discard;
  float soft = 1.0 - smoothstep(0.3, 1.0, r);
  gl_FragColor = vec4(uColorA * vBrightness, vAlpha * soft);
}
`;

const strandBFragShader = `
uniform vec3 uColorB;
varying float vBrightness;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float r = dot(uv, uv);
  if (r > 1.0) discard;
  float soft = 1.0 - smoothstep(0.3, 1.0, r);
  gl_FragColor = vec4(uColorB * vBrightness, vAlpha * soft);
}
`;

const rungVertShader = `
uniform float uTime;
uniform float uDrift;
uniform float uNodeCount;
attribute float aIndex;
attribute float aArm;
attribute float aSeed;

#define TWO_PI 6.2831853

vec3 helixPos(float t, float arm) {
  float angle = t * ${(TURNS * TWO_PI).toFixed(4)} + arm * ${Math.PI.toFixed(4)};
  float x = cos(angle) * ${RADIUS.toFixed(3)};
  float z = sin(angle) * ${RADIUS.toFixed(3)};
  float y = (t - 0.5) * ${HEIGHT.toFixed(3)};
  return vec3(x, y, z);
}

varying float vAlpha;

void main() {
  float t = mod((aIndex / uNodeCount) + uDrift, 1.0);
  vec3 pos = helixPos(t, aArm);
  float wave = sin(uTime * 0.7 + aSeed * TWO_PI) * 0.06;
  pos.y += wave;

  float edgeFade = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.94, t);
  vAlpha = edgeFade * 0.22;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const rungFragShader = `
uniform vec3 uColorA;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(uColorA, vAlpha);
}
`;

export function createPublicationScene(container: HTMLElement): () => void {
  if (!hasWebGL()) return () => {};

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 0, 7);

  const half = Math.ceil(TOTAL_NODES / 2);
  const idxA = new Float32Array(half);
  const armA = new Float32Array(half);
  const seedA = new Float32Array(half);
  const idxB = new Float32Array(half);
  const armB = new Float32Array(half);
  const seedB = new Float32Array(half);
  const idxR = new Float32Array(TOTAL_NODES);
  const armR = new Float32Array(TOTAL_NODES);
  const seedR = new Float32Array(TOTAL_NODES);

  for (let i = 0; i < half; i++) {
    idxA[i] = i;
    armA[i] = 0;
    seedA[i] = Math.random();
    idxB[i] = i;
    armB[i] = 1;
    seedB[i] = Math.random();
    idxR[i * 2] = i;
    armR[i * 2] = 0;
    seedR[i * 2] = seedA[i];
    idxR[i * 2 + 1] = i;
    armR[i * 2 + 1] = 1;
    seedR[i * 2 + 1] = seedB[i];
  }

  const uniforms = {
    uTime: { value: 0 },
    uDrift: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uPointerPower: { value: 0 },
    uNodeCount: { value: half },
    uColorA: { value: new THREE.Color() },
    uColorB: { value: new THREE.Color() },
  };

  const geoA = new THREE.BufferGeometry();
  geoA.setAttribute('aIndex', new THREE.BufferAttribute(idxA, 1));
  geoA.setAttribute('aArm', new THREE.BufferAttribute(armA, 1));
  geoA.setAttribute('aSeed', new THREE.BufferAttribute(seedA, 1));
  const matA = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: nodeVertexShader,
    fragmentShader: strandAFragShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(geoA, matA));

  const geoB = new THREE.BufferGeometry();
  geoB.setAttribute('aIndex', new THREE.BufferAttribute(idxB, 1));
  geoB.setAttribute('aArm', new THREE.BufferAttribute(armB, 1));
  geoB.setAttribute('aSeed', new THREE.BufferAttribute(seedB, 1));
  const matB = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: nodeVertexShader,
    fragmentShader: strandBFragShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(geoB, matB));

  const geoR = new THREE.BufferGeometry();
  geoR.setAttribute('aIndex', new THREE.BufferAttribute(idxR, 1));
  geoR.setAttribute('aArm', new THREE.BufferAttribute(armR, 1));
  geoR.setAttribute('aSeed', new THREE.BufferAttribute(seedR, 1));
  const indices = new Uint16Array(TOTAL_NODES);
  for (let i = 0; i < TOTAL_NODES; i++) indices[i] = i;
  geoR.setIndex(new THREE.BufferAttribute(indices, 1));
  const matR = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: rungVertShader,
    fragmentShader: rungFragShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.LineSegments(geoR, matR));

  const applyTheme = (dark: boolean) => {
    if (dark) {
      uniforms.uColorA.value.setStyle('#38bdf8');
      uniforms.uColorB.value.setStyle('#818cf8');
    } else {
      uniforms.uColorA.value.setStyle('#2563eb');
      uniforms.uColorB.value.setStyle('#6366f1');
    }
  };
  applyTheme(isDarkTheme());
  const stopWatch = observeTheme(applyTheme);
  const pointer = createPointerTracker();

  let pointerPower = 0;
  const resize = () => {
    const w = Math.max(container.clientWidth, 1);
    const h = Math.max(container.clientHeight, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  let raf = 0;
  let last = 0;
  let drift = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) * 0.001, 0.05);
    last = now;
    const t = now * 0.001;

    scene.rotation.y += ROT_SPEED * dt;
    drift = (drift + DRIFT_SPEED * dt) % 1;
    uniforms.uTime.value = t;
    uniforms.uDrift.value = drift;

    if (pointer.moved) {
      const r = container.getBoundingClientRect();
      const nx = ((pointer.x - r.left) / Math.max(r.width, 1) - 0.5) * 2;
      const ny = (-(pointer.y - r.top) / Math.max(r.height, 1) + 0.5) * 2;
      const inside =
        pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom
          ? 1
          : 0;
      pointerPower = damp(pointerPower, inside, POINTER_DAMP, dt);
      uniforms.uPointer.value.set(nx, ny);
      uniforms.uPointerPower.value = pointerPower;
    }

    renderer.render(scene, camera);
  };

  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    stopWatch();
    pointer.dispose();
    ro.disconnect();
    geoA.dispose();
    geoB.dispose();
    geoR.dispose();
    matA.dispose();
    matB.dispose();
    matR.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
