import * as THREE from 'three';
import {
  damp,
  easeOutCubic,
  DisposableBag,
  ThemePalette,
  SceneContext,
  SceneInstance,
  scaleUniforms,
  swayCamera,
  AVOID_GLSL,
  avoidUniformVec,
  NOISE_GLSL,
} from '../util';

const PALETTE = {
  dark: { body: '#19f58b', head: '#d9ffec', alert: '#ff2a55', cyan: '#26f2ff' },
  light: { body: '#047857', head: '#022c22', alert: '#be123c', cyan: '#0e7490' },
};

const GLYPHS = '0123456789ABCDEF>_#$/\\|[]{}<>=+*';
const ATLAS_COLS = 8;
const ATLAS_ROWS = 4;

const BREACH_MESSAGES = [
  '[!] SYSTEM BREACH DETECTED',
  'ACCESS DENIED :: ROOT LOCKED',
  'FIREWALL COMPROMISED',
  'KERNEL PANIC  0xDEADBEEF',
  'UNAUTHORIZED ACCESS',
  'INTRUSION IN PROGRESS',
];

const HACKER_WORDS = [
  '> sudo su',
  '> nmap -sS 10.0.0.1',
  'ROOT ACCESS',
  '0DAY EXPLOIT',
  'BRUTE FORCE 87%',
  'INJECTING PAYLOAD...',
  'FIREWALL: OFFLINE',
  'DECRYPTING...',
  'BACKDOOR OPEN',
  'PORT 22 OPEN',
  'TRACE ROUTE FAILED',
  'SHELL SPAWNED',
  '> rm -rf /',
  'SQL INJECTION',
  'PACKET SNIFFER',
  'KEYLOGGER ACTIVE',
];

const WORD_ROW_H = 56;
const WORD_W = 512;
const Z_NEAR = 90;
const Z_FAR = -560;

const STREAM_VERT = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTime;
  uniform float uTravel;
  uniform float uReveal;
  uniform float uPixelRatio;
  uniform float uCam;
  uniform float uCell;
  uniform float uRows;
  uniform float uHalfW;
  uniform float uHalfH;
  uniform vec2  uFocus;
  uniform float uFocusR;
  uniform float uFocusMin;
  uniform vec2  uPointer;
  uniform float uPointerPower;
  uniform float uBurst;
  uniform float uBreach;
  uniform float uZNear;
  uniform float uZFar;

  attribute vec4 aCell;

  varying float vGlyph;
  varying float vHead;
  varying float vAlpha;
  varying float vAlert;

  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  void main() {
    float seed = aCell.w;
    float row = aCell.y;
    float g = (uCam - aCell.z) / uCam;

    float trail = mix(9.0, 24.0, hash11(seed * 3.1));
    float cycle = uRows + trail * 2.0;
    float speed = mix(5.0, 14.0, hash11(seed * 7.7));
    float head = mod(uTravel * speed + hash11(seed * 1.9) * cycle, cycle) - trail;
    float d = head - row;

    float on = step(0.0, d) * step(d, trail);
    float k = 1.0 - d / trail;
    float isHead = smoothstep(1.4, 0.0, d);
    float a = on * (pow(k, 1.6) * 0.75 + isHead * 0.95);

    vec2 scr = vec2(aCell.x * uHalfW, (uHalfH + 40.0) - row * uCell / g);
    float tband = floor(row / 5.0);
    float tslot = floor(uTime * 16.0);
    float tearOn = step(0.6, hash11(tband * 3.7 + tslot * 1.3));
    scr.x += uBreach * tearOn * (hash11(tband * 9.1 + tslot) - 0.5) * 130.0;
    float depthMix = clamp((aCell.z - uZFar) / (uZNear - uZFar), 0.0, 1.0);
    a *= mix(0.3, 1.0, depthMix);

    float rv = smoothstep(seed * 0.6, seed * 0.6 + 0.3, uReveal);
    float focus = mix(uFocusMin, 1.0, smoothstep(uFocusR, uFocusR * 0.3, distance(scr, uFocus)));
    float ig = smoothstep(140.0, 0.0, distance(scr, uPointer)) * uPointerPower;
    a = (a * focus * rv + ig * 0.55 * on) * (1.0 + uBurst * 0.6 + uBreach * 0.9) * avoidMask(scr, uAvoidMin);

    if (a < 0.012) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vGlyph = 0.0; vHead = 0.0; vAlpha = 0.0; vAlert = 0.0;
      return;
    }

    vec3 world = vec3(scr.x * g, (uHalfH + 40.0) * g - row * uCell, aCell.z);
    vec4 mv = viewMatrix * modelMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uCell * 1.32 * uPixelRatio * (uCam / -mv.z);

    float rate = mix(1.4, 11.0, isHead);
    vGlyph = floor(hash11(row * 13.7 + seed * 91.3 + floor(uTime * rate + seed * 7.0 + row * 0.37)) * 32.0);
    vHead = clamp(isHead + ig * 0.6, 0.0, 1.0);
    vAlert = max(step(0.92, hash11(seed * 5.5)), uBreach * step(0.3, hash11(seed * 2.7 + row * 0.13 + floor(uTime * 10.0))));
    vAlpha = min(a, 1.0);
  }
`;

const STREAM_FRAG = `
  uniform sampler2D uAtlas;
  uniform vec3  uBody;
  uniform vec3  uHeadColor;
  uniform vec3  uAlert;
  uniform float uOpacity;

  varying float vGlyph;
  varying float vHead;
  varying float vAlpha;
  varying float vAlert;

  void main() {
    float col = mod(vGlyph, ${ATLAS_COLS}.0);
    float row = floor(vGlyph / ${ATLAS_COLS}.0);
    vec2 uv = (vec2(col, row) + gl_PointCoord) / vec2(${ATLAS_COLS}.0, ${ATLAS_ROWS}.0);
    float a = texture2D(uAtlas, uv).a;
    vec3 c = mix(uBody, uHeadColor, vHead);
    c = mix(c, uAlert, vAlert * 0.85);
    gl_FragColor = vec4(c, a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

const CLIP_QUAD_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const HUD_FRAG = `
  ${NOISE_GLSL}
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uPointer;
  uniform float uPointerPower;
  uniform vec2  uBurstPos;
  uniform float uBurstT;
  uniform float uOpacity;
  uniform float uEffects;
  uniform float uReveal;
  uniform vec3  uBody;
  uniform vec3  uAlert;
  uniform vec3  uCyan;
  uniform float uBreach;
  uniform float uBreachLevel;
  uniform float uBreachKeep;
  varying vec2 vUv;

  void main() {
    vec2 scr = (vUv - 0.5) * uRes;
    float keep = avoidMask(scr, uAvoidMin);

    float lines = pow(0.5 + 0.5 * sin(vUv.y * uRes.y * 1.5708), 4.0) * 0.06;
    float by = 1.0 - fract(uTime * 0.075);
    float bar = exp(-pow((vUv.y - by) * 26.0, 2.0)) * 0.16 + exp(-pow((vUv.y - by) * 190.0, 2.0)) * 0.22;

    float slot = floor(uTime * 7.0);
    float gate = step(0.86, hash21(vec2(slot, 3.1)));
    float gy = hash21(vec2(slot, 7.7));
    float gh = 0.008 + 0.04 * hash21(vec2(slot, 9.9));
    float inBand = gate * step(abs(vUv.y - gy), gh);
    float blocks = step(0.5, hash21(vec2(floor(vUv.x * uRes.x / 16.0), floor(vUv.y * uRes.y / 5.0) + slot)));
    float glitch = inBand * (0.25 + 0.75 * blocks) * 0.45;

    float hud = (lines + bar + glitch) * keep * uEffects;

    vec2 d = scr - uPointer;
    float r = length(d);
    float ang = atan(d.y, d.x);
    float ring1 = smoothstep(1.3, 0.0, abs(r - 30.0));
    float ring2 = smoothstep(1.1, 0.0, abs(r - 44.0)) * step(0.5, fract(ang * 0.95493 + uTime * 0.25));
    vec2 q = abs(d);
    float tick = step(min(q.x, q.y), 0.9) * step(54.0, max(q.x, q.y)) * step(max(q.x, q.y), 72.0);
    float dot0 = smoothstep(2.4, 0.0, r);
    float reticle = (ring1 * 0.9 + ring2 * 0.7 + tick + dot0) * uPointerPower;

    float br = smoothstep(2.0, 0.0, abs(length(scr - uBurstPos) - uBurstT * 950.0)) * (1.0 - clamp(uBurstT / 1.1, 0.0, 1.0));

    vec3 col = mix(uBody, uAlert, clamp(glitch * 2.2, 0.0, 0.8) + br * 0.35);
    float a = (hud * uReveal + reticle * 0.75 + br * 0.75) * uOpacity;

    float redA = 0.0;
    float cyanA = 0.0;
    if (uBreach > 0.001) {
      float bslot = floor(uTime * 24.0);
      for (int i = 0; i < 7; i++) {
        float fi = float(i);
        float y = hash21(vec2(bslot, fi * 7.3));
        float h = 0.003 + 0.028 * hash21(vec2(bslot, fi * 3.1));
        float m = step(abs(vUv.y - y), h) * step(0.3, hash21(vec2(bslot, fi)));
        float isCyan = step(0.5, hash21(vec2(bslot, fi * 5.9)));
        float notch = 0.55 + 0.45 * step(0.4, hash21(vec2(floor(vUv.x * uRes.x / 40.0), bslot + fi)));
        redA += m * (1.0 - isCyan) * notch * 0.6;
        cyanA += m * isCyan * notch * 0.5;
      }
      float aspect = uRes.x / uRes.y;
      float vig = smoothstep(0.3, 1.0, length((vUv - 0.5) * vec2(aspect, 1.0)) * 1.25);
      float flick = 0.5 + 0.5 * step(0.5, hash21(vec2(floor(uTime * 30.0), 1.7)));
      float stat = step(0.72, hash21(floor(gl_FragCoord.xy / 2.0) + bslot)) * 0.13;
      float roll = exp(-pow((vUv.y - fract(uTime * 1.9)) * 34.0, 2.0)) * 0.32;
      redA += vig * flick * 0.5 + stat + roll;
      float k = uBreach * uBreachLevel * avoidMask(scr, uBreachKeep);
      redA *= k;
      cyanA *= k;
    }
    float breachA = redA + cyanA;
    vec3 breachCol = (uAlert * redA + uCyan * cyanA) / max(breachA, 0.0001);
    float total = clamp(a, 0.0, 1.0) + breachA;
    col = mix(col, breachCol, breachA / max(total, 0.0001));
    gl_FragColor = vec4(col, clamp(total, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

const WORLD_QUAD_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BANNER_FRAG = `
  uniform sampler2D uMap;
  uniform float uMsg;
  uniform float uN;
  uniform float uAlpha;
  uniform float uSplit;
  uniform float uTime;
  uniform vec3  uAlert;
  uniform vec3  uCyan;
  varying vec2 vUv;

  float h1(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
  vec2 muv(vec2 uv, float dx) { return vec2(uv.x + dx, (uMsg + (1.0 - uv.y)) / uN); }

  void main() {
    float slice = floor(vUv.y * 9.0);
    float jit = (h1(slice + floor(uTime * 22.0) * 3.3) - 0.5) * uSplit * 5.0;
    vec2 uv = vec2(vUv.x + jit, vUv.y);
    float a1 = texture2D(uMap, muv(uv, uSplit)).a;
    float a2 = texture2D(uMap, muv(uv, -uSplit)).a;
    float sum = a1 + a2 * 0.8;
    vec3 col = (uAlert * a1 + uCyan * a2 * 0.8) / max(sum, 0.0001);
    float g = clamp((uSplit - 0.0006) / 0.012, 0.0, 1.0);
    float scan = mix(1.0, 0.78 + 0.22 * sin(vUv.y * 160.0), g);
    gl_FragColor = vec4(col, clamp(max(a1, a2), 0.0, 1.0) * uAlpha * scan);
    #include <colorspace_fragment>
  }
`;

const MASK_FRAG = `
  ${AVOID_GLSL}
  uniform vec2  uRes;
  uniform vec3  uColor;
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    vec2 scr = (vUv - 0.5) * uRes;
    float inside = 1.0 - avoidMask(scr, 0.0);
    gl_FragColor = vec4(uColor, inside * uStrength);
    #include <colorspace_fragment>
  }
`;

const FRAME_FRAG = `
  uniform vec2  uSize;
  uniform float uAlpha;
  uniform vec3  uAlert;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * uSize;
    vec2 d = min(p, uSize - p);
    float edge = min(d.x, d.y);
    float border = smoothstep(2.4, 0.9, edge);
    float bracket = max(step(d.x, 26.0) * step(d.y, 4.0), step(d.y, 26.0) * step(d.x, 4.0));
    float lines = 0.5 + 0.5 * sin(p.y * 1.7);
    vec3 fill = vec3(0.035, 0.0, 0.05) + vec3(0.09, 0.0, 0.02) * lines * 0.35;
    vec3 col = mix(fill, uAlert, max(border * 0.85, bracket));
    float a = mix(0.8, 1.0, max(border, bracket));
    gl_FragColor = vec4(col, a * uAlpha);
    #include <colorspace_fragment>
  }
`;

const WORDS_VERT = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTime;
  uniform float uHalfW;
  uniform float uHalfH;
  uniform float uN;
  uniform float uWordW;
  uniform float uUnit;
  uniform float uReveal;
  attribute vec2 aSeed;
  varying vec2 vUv;
  varying float vAlpha;
  varying float vWord;
  varying float vType;
  varying float vProg;

  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  void main() {
    float id = aSeed.x;
    float t = uTime / aSeed.y + id * 7.13;
    float cyc = floor(t);
    float ph = fract(t);

    vec2 pos = vec2((hash11(id * 3.1 + cyc * 7.7) - 0.5) * uHalfW * 1.76, (hash11(id * 5.9 + cyc * 2.3) - 0.5) * uHalfH * 1.8);
    vWord = floor(hash11(id * 9.7 + cyc * 1.9) * uN);
    vType = step(0.8, hash11(id * 2.2 + cyc * 4.1));

    float life = smoothstep(0.0, 0.07, ph) * (1.0 - smoothstep(0.8, 0.95, ph));
    float flick = 1.0 - 0.75 * step(0.94, hash11(floor(uTime * 28.0) + id * 13.0));
    vAlpha = life * flick * uReveal * avoidMask(pos, uAvoidMin);
    vProg = smoothstep(0.03, 0.3, ph) * 0.8;
    vUv = uv;

    vec2 size = vec2(uWordW, uWordW * ${WORD_ROW_H}.0 / ${WORD_W}.0) * uUnit;
    gl_Position = projectionMatrix * viewMatrix * vec4(pos + position.xy * size, 0.0, 1.0);
  }
`;

const WORDS_FRAG = `
  uniform sampler2D uAtlas;
  uniform vec3  uBody;
  uniform vec3  uAlert;
  uniform float uOpacity;
  uniform float uN;
  uniform float uTime;
  varying vec2 vUv;
  varying float vAlpha;
  varying float vWord;
  varying float vType;
  varying float vProg;

  void main() {
    if (vAlpha < 0.005 || vUv.x > vProg) discard;
    float a = texture2D(uAtlas, vec2(vUv.x, (vWord + (1.0 - vUv.y)) / uN)).a;
    float caret = step(abs(vUv.x - vProg), 0.012) * step(vProg, 0.79) * step(0.5, fract(uTime * 3.0)) * step(0.2, vUv.y) * step(vUv.y, 0.8);
    vec3 col = mix(uBody, uAlert, vType);
    gl_FragColor = vec4(col, max(a, caret) * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

function createBannerTexture() {
  const w = 1024;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = 96 * BREACH_MESSAGES.length;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '800 48px "JetBrains Mono", "Fira Code", Consolas, "SF Mono", Menlo, "Courier New", monospace';
    BREACH_MESSAGES.forEach((msg, i) => g.fillText(msg, w / 2, i * 96 + 50));
  }
  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function createWordsTexture() {
  const c = document.createElement('canvas');
  c.width = WORD_W;
  c.height = WORD_ROW_H * HACKER_WORDS.length;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#fff';
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.font = '700 30px "JetBrains Mono", "Fira Code", Consolas, "SF Mono", Menlo, "Courier New", monospace';
    HACKER_WORDS.forEach((w, i) => g.fillText(w, 8, i * WORD_ROW_H + WORD_ROW_H / 2 + 2));
  }
  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function createGlyphTexture() {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 192;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '700 34px "JetBrains Mono", "Fira Code", Consolas, "SF Mono", Menlo, "Courier New", monospace';
    [...GLYPHS].forEach((ch, idx) => {
      g.fillText(ch, (idx % ATLAS_COLS) * 48 + 24, Math.floor(idx / ATLAS_COLS) * 48 + 26);
    });
  }
  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

interface CodeSceneOpts {
  columns: number;
  cell: number;
  opacity: { dark: number; light: number };
  focusMin: number;
  effects: number;
  hudOpacity: number;
  words: number;
  wordOpacity: { dark: number; light: number };
  hero: boolean;
}

function createCodeScene(
  ctx: SceneContext,
  opts: CodeSceneOpts,
  heroCtx?: SceneContext
): SceneInstance {
  const bag = new DisposableBag();
  const palette = new ThemePalette(PALETTE, ctx.dark);
  let dark = ctx.dark;
  const { size } = ctx;

  const rows = Math.ceil((Math.max(size.height, 1200) * 1.7) / opts.cell);
  const count = opts.columns * rows;
  const cells = new Float32Array(count * 4);
  let k = 0;
  for (let col = 0; col < opts.columns; col++) {
    const cx = ((col + Math.random() * 0.8) / opts.columns) * 2 - 1;
    const cz = Z_FAR + Math.random() * 650;
    const seed = Math.random();
    for (let r = 0; r < rows; r++) {
      cells.set([cx, r, cz, seed], k * 4);
      k++;
    }
  }

  const streamGeo = bag.track(new THREE.BufferGeometry());
  streamGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  streamGeo.setAttribute('aCell', new THREE.BufferAttribute(cells, 4));

  const glyphTex = bag.track(createGlyphTexture());
  const avoidMin = opts.hero ? 0 : 1;

  const streamUniforms = {
    uPixelRatio: scaleUniforms(ctx).uPixelRatio,
    uTime: { value: 0 },
    uTravel: { value: 0 },
    uReveal: { value: 0 },
    uCam: { value: ctx.camZ() },
    uCell: { value: opts.cell },
    uRows: { value: rows },
    uHalfW: { value: (size.width / 2) * 1.06 },
    uHalfH: { value: size.height / 2 },
    uFocus: { value: { x: 0, y: 0 } },
    uFocusR: { value: 640 },
    uFocusMin: { value: opts.focusMin },
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uAvoidMin: { value: avoidMin },
    uPointer: { value: { x: 1e5, y: 1e5 } },
    uPointerPower: { value: 0 },
    uBurst: { value: 0 },
    uZNear: { value: Z_NEAR },
    uZFar: { value: Z_FAR },
    uAtlas: { value: glyphTex },
    uBody: { value: palette.cur.body },
    uHeadColor: { value: palette.cur.head },
    uAlert: { value: palette.cur.alert },
    uBreach: { value: 0 },
    uOpacity: { value: opts.opacity[dark ? 'dark' : 'light'] },
  };

  const streamPts = new THREE.Points(
    streamGeo,
    bag.shader({ vertexShader: STREAM_VERT, fragmentShader: STREAM_FRAG, uniforms: streamUniforms }, dark)
  );
  streamPts.frustumCulled = false;
  bag.mount(ctx.scene, streamPts);

  const hudUniforms = {
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uAvoidMin: { value: opts.hero ? 0.03 : 1 },
    uTime: { value: 0 },
    uRes: { value: { x: size.width, y: size.height } },
    uPointer: { value: { x: 1e5, y: 1e5 } },
    uPointerPower: { value: 0 },
    uBurstPos: { value: { x: 0, y: 0 } },
    uBurstT: { value: 9 },
    uOpacity: { value: opts.hudOpacity },
    uEffects: { value: opts.effects },
    uReveal: { value: 0 },
    uBody: { value: palette.cur.body },
    uAlert: { value: palette.cur.alert },
    uCyan: { value: palette.cur.cyan },
    uBreach: { value: 0 },
    uBreachLevel: { value: opts.hero ? 1 : 0.4 },
    uBreachKeep: { value: opts.hero ? 0.05 : 1 },
  };
  const hudMesh = new THREE.Mesh(
    bag.track(new THREE.PlaneGeometry(2, 2)),
    bag.shader({ vertexShader: CLIP_QUAD_VERT, fragmentShader: HUD_FRAG, uniforms: hudUniforms, depthTest: false }, dark)
  );
  hudMesh.frustumCulled = false;
  hudMesh.renderOrder = 10;
  bag.mount(ctx.scene, hudMesh);

  const maskUniforms = {
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uRes: { value: { x: size.width, y: size.height } },
    uColor: { value: new THREE.Color(dark ? '#0a1120' : '#f1f5f9') },
    uStrength: { value: 0 },
  };
  const maskMesh = new THREE.Mesh(
    bag.track(new THREE.PlaneGeometry(2, 2)),
    bag.track(
      new THREE.ShaderMaterial({
        vertexShader: CLIP_QUAD_VERT,
        fragmentShader: MASK_FRAG,
        uniforms: maskUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NormalBlending,
      })
    )
  );
  maskMesh.frustumCulled = false;
  maskMesh.renderOrder = 10.2;
  if (opts.hero) bag.mount(ctx.scene, maskMesh);

  const bannerUniforms = {
    uMap: { value: bag.track(createBannerTexture()) },
    uMsg: { value: 0 },
    uN: { value: BREACH_MESSAGES.length },
    uAlpha: { value: 0 },
    uSplit: { value: 0.004 },
    uTime: { value: 0 },
    uAlert: { value: new THREE.Color('#ff3b5c') },
    uCyan: { value: new THREE.Color('#26f2ff') },
  };
  const bannerMesh = new THREE.Mesh(
    bag.track(new THREE.PlaneGeometry(1, 96 / 1024)),
    bag.shader({ vertexShader: WORLD_QUAD_VERT, fragmentShader: BANNER_FRAG, uniforms: bannerUniforms, depthTest: false }, dark)
  );
  bannerMesh.frustumCulled = false;
  bannerMesh.renderOrder = 11;
  bannerMesh.visible = false;
  if (opts.hero) bag.mount(ctx.scene, bannerMesh);

  const frameUniforms = {
    uSize: { value: { x: 600, y: 120 } },
    uAlpha: { value: 0 },
    uAlert: { value: new THREE.Color('#ff3b5c') },
  };
  const frameMesh = new THREE.Mesh(
    bag.track(new THREE.PlaneGeometry(1, 1)),
    bag.track(
      new THREE.ShaderMaterial({
        vertexShader: WORLD_QUAD_VERT,
        fragmentShader: FRAME_FRAG,
        uniforms: frameUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NormalBlending,
      })
    )
  );
  frameMesh.frustumCulled = false;
  frameMesh.renderOrder = 10.5;
  frameMesh.visible = false;
  if (opts.hero) bag.mount(ctx.scene, frameMesh);

  const baseQuad = new THREE.PlaneGeometry(1, 1);
  const instGeo = bag.track(new THREE.InstancedBufferGeometry());
  instGeo.index = baseQuad.index;
  instGeo.setAttribute('position', baseQuad.getAttribute('position'));
  instGeo.setAttribute('uv', baseQuad.getAttribute('uv'));
  const wSeeds = new Float32Array(opts.words * 2);
  for (let i = 0; i < opts.words; i++) {
    wSeeds[i * 2] = i + Math.random();
    wSeeds[i * 2 + 1] = 5.5 + Math.random() * 4.5;
  }
  instGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(wSeeds, 2));
  instGeo.instanceCount = opts.words;

  const wordsUniforms = {
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uAvoidMin: { value: avoidMin },
    uTime: { value: 0 },
    uHalfW: { value: size.width / 2 },
    uHalfH: { value: size.height / 2 },
    uN: { value: HACKER_WORDS.length },
    uWordW: { value: ctx.compact ? 250 : 340 },
    uUnit: { value: 1 },
    uReveal: { value: 0 },
    uAtlas: { value: bag.track(createWordsTexture()) },
    uBody: { value: palette.cur.body },
    uAlert: { value: palette.cur.alert },
    uOpacity: { value: opts.wordOpacity[dark ? 'dark' : 'light'] },
  };
  const wordsMesh = new THREE.Mesh(
    instGeo,
    bag.shader({ vertexShader: WORDS_VERT, fragmentShader: WORDS_FRAG, uniforms: wordsUniforms, depthTest: false }, dark)
  );
  wordsMesh.frustumCulled = false;
  wordsMesh.renderOrder = 9;
  bag.mount(ctx.scene, wordsMesh);

  let travel = 0;
  let burst = 0;
  let burstT = 9;
  let breachAge = 99;
  let breachDur = 1.7;
  let nextBreach = (opts.hero ? 5 : 12) + Math.random() * 4;
  let msgIdx = Math.floor(Math.random() * BREACH_MESSAGES.length);

  const triggerBreach = (dur: number) => {
    breachAge = 0;
    breachDur = dur;
    msgIdx = (msgIdx + 1 + Math.floor(Math.random() * 2)) % BREACH_MESSAGES.length;
    bannerUniforms.uMsg.value = msgIdx;
  };

  return {
    update(frame) {
      const { dt, elapsed, fade, pointer, sway, scrollSpeed } = frame;
      swayCamera(ctx, sway, 30, 20);
      palette.update(dt);
      burst = damp(burst, 0, 2.2, dt);
      burstT += dt;
      breachAge += dt;

      if (elapsed > nextBreach && breachAge > breachDur) {
        triggerBreach(opts.hero ? 2.6 : 1.1);
        nextBreach = elapsed + (opts.hero ? 9 + Math.random() * 7 : 16 + Math.random() * 10);
      }

      let breach = 0;
      if (breachAge < breachDur) {
        const kProg = breachAge / breachDur;
        const ramp = Math.min(1, breachAge / 0.06);
        const strobe = Math.sin(elapsed * 71) > -0.35 ? 1 : 0.3;
        breach = ramp * Math.pow(1 - kProg, 0.75) * strobe;
        ctx.camera.position.x += (Math.random() - 0.5) * breach * (opts.hero ? 10 : 5);
        ctx.camera.position.y += (Math.random() - 0.5) * breach * (opts.hero ? 7 : 3.5);
      }
      streamUniforms.uBreach.value = breach;
      hudUniforms.uBreach.value = breach * fade;

      if (opts.hero) {
        const active = breachAge < breachDur;
        bannerMesh.visible = active;
        frameMesh.visible = active;
        if (active) {
          const rigScale = heroCtx?.rig ? heroCtx.rig.scale.x : 1;
          const leftBound = heroCtx?.avoid ? heroCtx.avoid.x1 + 14 : -size.width / 2 + 14;
          const rightBound = size.width / 2 - 10;
          const fitsRight = rightBound - leftBound > 300;
          const bw = fitsRight
            ? Math.min(680, (rightBound - leftBound) / 1.07)
            : Math.min(680, size.width - 28);
          const bh = (96 / 1024) * bw;
          const maxX = size.width / 2 - (bw * 1.07) / 2 - 8;
          const bx = fitsRight
            ? (leftBound + rightBound) / 2
            : Math.max(-maxX, Math.min(maxX, heroCtx?.rig ? heroCtx.rig.position.x : 0));
          const by = Math.min((heroCtx?.rig ? heroCtx.rig.position.y : 0) + 268 * rigScale, size.height / 2 - 128);
          const tail = 0.55;
          let alpha = 1;
          let glitching = 0.12;
          if (breachAge < 0.3) {
            alpha = Math.sin(elapsed * 90) > 0 ? 1 : 0.15;
            glitching = 1;
          } else if (breachAge > breachDur - tail) {
            alpha = ((breachDur - breachAge) / tail) * (Math.sin(elapsed * 70) > -0.2 ? 1 : 0.2);
            glitching = 1;
          }
          bannerMesh.scale.set(bw, bw, 1);
          bannerMesh.position.set(bx + (Math.random() - 0.5) * glitching * 6, by, 0);
          frameMesh.scale.set(bw * 1.07, bh * 2.1, 1);
          frameMesh.position.set(bx, by, 0);
          frameUniforms.uSize.value = { x: bw * 1.07, y: bh * 2.1 };
          frameUniforms.uAlpha.value = alpha * fade;
          bannerUniforms.uAlpha.value = alpha * fade;
          bannerUniforms.uSplit.value = 0.0004 + 0.013 * (glitching > 0.5 ? 1 : 0);
          bannerUniforms.uTime.value = elapsed;
        }
      }

      const speedBoost = opts.hero ? 0 : Math.min(scrollSpeed / 450, 4);
      travel += dt * (1 + burst * 2.4 + speedBoost);
      streamUniforms.uTime.value = elapsed;
      streamUniforms.uTravel.value = travel * 0.5;
      streamUniforms.uReveal.value = easeOutCubic(elapsed / 2.6);
      streamUniforms.uOpacity.value = opts.opacity[dark ? 'dark' : 'light'] * fade;
      streamUniforms.uPointer.value = pointer;
      streamUniforms.uPointerPower.value = pointer.power * fade;
      streamUniforms.uBurst.value = burst;

      hudUniforms.uTime.value = elapsed;
      hudUniforms.uReveal.value = easeOutCubic(elapsed / 2) * fade;
      hudUniforms.uPointer.value = pointer;
      hudUniforms.uPointerPower.value = 0;
      hudUniforms.uBurstT.value = burstT;
      hudUniforms.uOpacity.value = opts.hudOpacity * fade * (dark ? 1 : 0.85);
      maskUniforms.uStrength.value = 0.62 * easeOutCubic(elapsed / 1.2) * fade;

      wordsUniforms.uTime.value = elapsed;
      wordsUniforms.uReveal.value = easeOutCubic(elapsed / 2.2) * fade;
      wordsUniforms.uOpacity.value = opts.wordOpacity[dark ? 'dark' : 'light'];
      wordsUniforms.uUnit.value = heroCtx?.rig ? heroCtx.rig.scale.x : 1;

      if (heroCtx) {
        const av = avoidUniformVec(heroCtx.avoid);
        wordsUniforms.uAvoid.value = av;
        maskUniforms.uAvoid.value = av;
        streamUniforms.uFocus.value = {
          x: heroCtx.rig ? heroCtx.rig.position.x : 0,
          y: heroCtx.rig ? heroCtx.rig.position.y : 0,
        };
        streamUniforms.uAvoid.value = av;
        hudUniforms.uAvoid.value = av;
      }
    },
    resize() {
      streamUniforms.uCam.value = ctx.camZ();
      streamUniforms.uHalfW.value = (size.width / 2) * 1.06;
      streamUniforms.uHalfH.value = size.height / 2;
      hudUniforms.uRes.value = { x: size.width, y: size.height };
      wordsUniforms.uHalfW.value = size.width / 2;
      wordsUniforms.uHalfH.value = size.height / 2;
      maskUniforms.uRes.value = { x: size.width, y: size.height };
    },
    setTheme(nextDark) {
      dark = nextDark;
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
      maskUniforms.uColor.value.set(nextDark ? '#0a1120' : '#f1f5f9');
    },
    dispose() {
      bag.dispose();
    },
  };
}

export const hero = (ctx: SceneContext): SceneInstance =>
  createCodeScene(
    ctx,
    {
      columns: ctx.compact ? 30 : 66,
      cell: ctx.compact ? 17 : 20,
      opacity: { dark: 0.42, light: 0.36 },
      focusMin: 0.2,
      effects: 0.75,
      hudOpacity: 0.9,
      words: ctx.compact ? 8 : 14,
      wordOpacity: { dark: 0.78, light: 0.66 },
      hero: true,
    },
    ctx
  );

export const background = (ctx: SceneContext): SceneInstance =>
  createCodeScene(ctx, {
    columns: ctx.compact ? 14 : 34,
    cell: ctx.compact ? 18 : 22,
    opacity: { dark: 0.2, light: 0.17 },
    focusMin: 1,
    effects: 0.4,
    hudOpacity: 0.5,
    words: ctx.compact ? 4 : 8,
    wordOpacity: { dark: 0.3, light: 0.28 },
    hero: false,
  });

