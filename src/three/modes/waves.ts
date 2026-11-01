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
  NOISE_GLSL,
} from '../util';

const PALETTE = {
  dark: { deep: '#2563eb', crest: '#7dd3fc', foam: '#f0f9ff' },
  light: { deep: '#1d4ed8', crest: '#0284c7', foam: '#0f766e' },
};
const LEVELS = {
  dark: { opacity: 1 },
  light: { opacity: 0.85 },
};

const OCEAN_VERT = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uCam;
  uniform float uHalfW;
  uniform float uGround;
  uniform float uAmp;
  uniform float uReveal;
  uniform vec2  uPointer;
  uniform float uPointerPower;
  uniform vec2  uRipple;
  uniform float uRippleT;

  attribute vec3 aGrid;
  varying float vAlpha;
  varying float vCrest;

  void main() {
    float v = aGrid.y;
    float z = mix(260.0, -1500.0, pow(v, 1.1));
    float g = (uCam - z) / uCam;
    float x = aGrid.x * uHalfW * g * 1.18;

    float t = uTime;
    float h = sin(x * 0.0105 + t * 0.9) * 0.9
            + sin(z * 0.0135 + t * 0.7 + x * 0.004) * 0.75
            + sin((x + z) * 0.0075 + t * 1.25) * 0.55
            + sin((x - z * 1.3) * 0.0042 - t * 0.5) * 0.7;

    vec2 scr = vec2(x / g, (uGround + h * uAmp) / g);
    float pd = distance(scr, uPointer);
    h += sin(pd * 0.055 - t * 5.5) * exp(-pd * 0.011) * 1.3 * uPointerPower;

    float rd = distance(scr, uRipple);
    float ring = exp(-pow((rd - uRippleT * 700.0) / 70.0, 2.0)) * (1.0 - clamp(uRippleT / 1.8, 0.0, 1.0));
    h += ring * 2.4;

    float y = uGround + h * uAmp;
    vec4 mv = viewMatrix * modelMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (3.0 + aGrid.z * 2.0 + max(h, 0.0) * 1.1) * uPixelRatio * (uCam / -mv.z);

    float far  = pow(1.0 - v, 0.85);
    float edge = 1.0 - smoothstep(0.86, 1.0, abs(aGrid.x));
    vCrest = clamp(h * 0.42 + 0.35 + ring * 0.6, 0.0, 1.0);
    vAlpha = far * edge * uReveal * (0.5 + 0.5 * vCrest) * avoidMask(scr, uAvoidMin);
  }
`;

const OCEAN_FRAG = `
  uniform vec3  uDeep;
  uniform vec3  uCrest;
  uniform vec3  uFoam;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vCrest;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    vec3 col = mix(uDeep, uCrest, smoothstep(0.1, 0.65, vCrest));
    col = mix(col, uFoam, smoothstep(0.75, 1.0, vCrest));
    gl_FragColor = vec4(col, pow(1.0 - d, 1.5) * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

const ORB_VERT = `
  uniform float uTime;
  uniform float uReveal;
  uniform vec2  uPointer;
  uniform float uPointerPower;
  attribute float aPhase;
  attribute float aRadius;
  attribute float aSpeed;
  attribute float aSize;
  varying float vAlpha;
  varying float vProximity;

  void main() {
    float t = uTime * aSpeed + aPhase;
    float x = position.x + cos(t * 0.7 + aPhase * 2.1) * aRadius * 0.35;
    float y = position.y + sin(t * 0.5 + aPhase * 1.7) * aRadius * 0.25
            + sin(uTime * aSpeed * 0.4 + aPhase) * aRadius * 0.15;
    float z = position.z;

    vec2 toPtr = vec2(x, y) - uPointer;
    float dist  = length(toPtr);
    float push  = smoothstep(200.0, 0.0, dist) * uPointerPower;
    vec2 repel  = normalize(toPtr + vec2(0.001)) * push * 55.0;
    x += repel.x;
    y += repel.y;

    vec4 mv = viewMatrix * modelMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;

    float pulse = 0.7 + 0.3 * sin(uTime * aSpeed * 1.5 + aPhase * 3.0);
    float flare = 1.0 + push * 1.8;
    gl_PointSize = aSize * pulse * flare;

    vProximity = push;
    vAlpha = uReveal * pulse * 0.85 * (1.0 + push * 0.5);
  }
`;

const ORB_FRAG = `
  uniform vec3  uColor;
  uniform vec3  uColorHot;
  varying float vAlpha;
  varying float vProximity;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core  = exp(-d * 4.0);
    float halo  = pow(1.0 - d, 2.5) * 0.4;
    vec3  col   = mix(uColor, uColorHot, clamp(vProximity, 0.0, 1.0) * 0.75);
    gl_FragColor = vec4(col, (core + halo) * vAlpha);
    #include <colorspace_fragment>
  }
`;

const RING_VERT = `
  uniform float uTime;
  uniform float uReveal;
  uniform float uSpeed;
  uniform float uPhase;
  uniform vec2  uPointer;
  uniform float uPointerPower;

  varying float vAlpha;
  varying float vNear;

  void main() {
    float pulse = 1.0 + 0.06 * sin(uTime * uSpeed + uPhase);
    vec3 pos = position * pulse;

    vec2 toPtr  = uPointer - pos.xy;
    float pDist = length(toPtr);
    float prox  = smoothstep(500.0, 0.0, pDist) * uPointerPower;
    pos.xy += normalize(toPtr + vec2(0.001)) * prox * 28.0;

    vec4 mv = viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float ptSz = 2.5 + prox * 3.0;
    gl_PointSize = ptSz;

    float fade = 0.5 + 0.5 * sin(uTime * uSpeed * 0.8 + uPhase + position.x * 0.02);
    vAlpha = uReveal * fade * (1.0 + prox * 1.2);
    vNear  = prox;
  }
`;

const RING_FRAG = `
  uniform vec3  uColor;
  uniform vec3  uColorHot;
  varying float vAlpha;
  varying float vNear;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    vec3 col = mix(uColor, uColorHot, vNear * 0.8);
    gl_FragColor = vec4(col, pow(1.0 - d, 1.8) * vAlpha * 0.75);
    #include <colorspace_fragment>
  }
`;

function createArcGeo(bag: DisposableBag, from: THREE.Vector3, to: THREE.Vector3, segs: number) {
  const geo = bag.track(new THREE.BufferGeometry());
  const pts: number[] = [];
  const diff = new THREE.Vector3().subVectors(to, from);
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const jx = i > 0 && i < segs ? (Math.random() - 0.5) * 30 : 0;
    const jy = i > 0 && i < segs ? (Math.random() - 0.5) * 20 : 0;
    pts.push(from.x + diff.x * t + jx, from.y + diff.y * t + jy, from.z);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
  return geo;
}

export const hero = (ctx: SceneContext): SceneInstance => {
  const bag = new DisposableBag();
  const palette = new ThemePalette(PALETTE, ctx.dark);
  let levels = LEVELS[ctx.dark ? 'dark' : 'light'];
  const { size } = ctx;

  const cols = ctx.compact ? 70 : 130;
  const rows = ctx.compact ? 44 : 78;
  const total = cols * rows;
  const grid = new Float32Array(total * 3);
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jit = (Math.random() - 0.5) * 0.5;
      grid.set([((c + jit) / (cols - 1)) * 2 - 1, r / (rows - 1), Math.random()], idx * 3);
      idx++;
    }
  }

  const oceanGeo = bag.track(new THREE.BufferGeometry());
  oceanGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(total * 3), 3));
  oceanGeo.setAttribute('aGrid', new THREE.BufferAttribute(grid, 3));

  const oceanUniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: ctx.dpr },
    uCam: { value: ctx.camZ() },
    uHalfW: { value: size.width / 2 },
    uGround: { value: -size.height * 0.3 },
    uAmp: { value: 46 },
    uReveal: { value: 0 },
    uPointer: { value: { x: 1e5, y: 1e5 } },
    uPointerPower: { value: 0 },
    uRipple: { value: { x: 0, y: 0 } },
    uRippleT: { value: 9 },
    uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
    uAvoidMin: { value: 0.5 },
    uDeep: { value: palette.cur.deep },
    uCrest: { value: palette.cur.crest },
    uFoam: { value: palette.cur.foam },
    uOpacity: { value: levels.opacity },
  };
  const oceanPts = new THREE.Points(
    oceanGeo,
    bag.shader({ vertexShader: OCEAN_VERT, fragmentShader: OCEAN_FRAG, uniforms: oceanUniforms }, ctx.dark)
  );
  oceanPts.frustumCulled = false;
  bag.mount(ctx.scene, oceanPts);

  const orbCount = ctx.compact ? 18 : 32;
  const orbPos = new Float32Array(orbCount * 3);
  const orbPhase = new Float32Array(orbCount);
  const orbRadius = new Float32Array(orbCount);
  const orbSpeed = new Float32Array(orbCount);
  const orbSize = new Float32Array(orbCount);
  for (let i = 0; i < orbCount; i++) {
    const side = Math.random() > 0.35 ? 1 : -1;
    orbPos[i * 3] = (Math.random() * 0.6 + 0.1) * side * (size.width * 0.45);
    orbPos[i * 3 + 1] = (Math.random() - 0.3) * size.height * 0.55;
    orbPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    orbPhase[i] = Math.random() * Math.PI * 2;
    orbRadius[i] = 40 + Math.random() * 80;
    orbSpeed[i] = 0.4 + Math.random() * 0.8;
    orbSize[i] = ctx.dpr * (6 + Math.random() * 18);
  }
  const orbGeo = bag.track(new THREE.BufferGeometry());
  orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPos, 3));
  orbGeo.setAttribute('aPhase', new THREE.BufferAttribute(orbPhase, 1));
  orbGeo.setAttribute('aRadius', new THREE.BufferAttribute(orbRadius, 1));
  orbGeo.setAttribute('aSpeed', new THREE.BufferAttribute(orbSpeed, 1));
  orbGeo.setAttribute('aSize', new THREE.BufferAttribute(orbSize, 1));

  const orbUniforms = {
    uTime: { value: 0 },
    uReveal: { value: 0 },
    uPointer: { value: { x: 1e5, y: 1e5 } },
    uPointerPower: { value: 0 },
    uColor: { value: new THREE.Color('#7dd3fc') },
    uColorHot: { value: new THREE.Color('#f0f9ff') },
  };
  const orbMat = bag.track(
    new THREE.ShaderMaterial({
      vertexShader: ORB_VERT,
      fragmentShader: ORB_FRAG,
      uniforms: orbUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  const orbPts = new THREE.Points(orbGeo, orbMat);
  orbPts.frustumCulled = false;
  bag.mount(ctx.scene, orbPts);

  const ringSpecs = ctx.compact
    ? [
        { r: 200, speed: 0.6, phase: 0, color: '#2563eb' },
        { r: 300, speed: 0.4, phase: 2.1, color: '#7dd3fc' },
      ]
    : [
        { r: 180, speed: 0.7, phase: 0, color: '#2563eb' },
        { r: 280, speed: 0.45, phase: 1.5, color: '#7dd3fc' },
        { r: 380, speed: 0.3, phase: 3, color: '#0ea5e9' },
        { r: 460, speed: 0.2, phase: 0.8, color: '#38bdf8' },
      ];
  const rings: Array<{ mat: THREE.ShaderMaterial }> = [];
  for (const spec of ringSpecs) {
    const n = ctx.compact ? 64 : 128;
    const rGeo = bag.track(new THREE.BufferGeometry());
    const pts: number[] = [];
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      pts.push(Math.cos(ang) * spec.r, Math.sin(ang) * spec.r * 0.28, 0);
    }
    rGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    const rMat = bag.track(
      new THREE.ShaderMaterial({
        vertexShader: RING_VERT,
        fragmentShader: RING_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uSpeed: { value: spec.speed },
          uPhase: { value: spec.phase },
          uPointer: { value: { x: 1e5, y: 1e5 } },
          uPointerPower: { value: 0 },
          uColor: { value: new THREE.Color(spec.color) },
          uColorHot: { value: new THREE.Color('#f0f9ff') },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    const rPts = new THREE.Points(rGeo, rMat);
    rPts.frustumCulled = false;
    bag.mount(ctx.scene, rPts);
    rings.push({ mat: rMat });
  }

  const arcs: Array<{ line: THREE.Line; mat: THREE.LineBasicMaterial; ttl: number; life: number }> = [];
  let arcTimer = 0;
  const nextArcInterval = () => 1.8 + Math.random() * 3.5;
  let arcNext = nextArcInterval();

  const spawnArc = () => {
    const maxArcs = ctx.compact ? 2 : 4;
    if (arcs.length >= maxArcs) return;
    const hw = size.width * 0.5;
    const hh = size.height * 0.5;
    const x1 = (Math.random() - 0.5) * hw * 1.2;
    const y1 = hh * (0.2 + Math.random() * 0.5);
    const x2 = x1 + (Math.random() - 0.5) * hw * 0.7;
    const y2 = y1 - hh * (0.3 + Math.random() * 0.4);
    const aGeo = createArcGeo(bag, new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0), 10);
    const aMat = bag.track(
      new THREE.LineBasicMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const line = new THREE.Line(aGeo, aMat);
    line.frustumCulled = false;
    bag.mount(ctx.scene, line);
    arcs.push({ line, mat: aMat, ttl: 0.18 + Math.random() * 0.22, life: 0 });
  };

  let simTime = 0;
  let rippleT = 9;

  return {
    update(frame) {
      const { dt, elapsed, fade, pointer, sway } = frame;
      ctx.camera.position.set(-sway.x * 26, -sway.y * 14, ctx.camZ());
      ctx.camera.lookAt(0, 0, 0);
      palette.update(dt);
      rippleT += dt;
      simTime += dt * (1 + frame.progress * 2);
      const rev = easeOutCubic(elapsed / 2.4) * fade;

      oceanUniforms.uTime.value = simTime;
      oceanUniforms.uReveal.value = rev;
      oceanUniforms.uOpacity.value = levels.opacity;
      oceanUniforms.uPointer.value = pointer;
      oceanUniforms.uPointerPower.value = damp(oceanUniforms.uPointerPower.value, pointer.power * fade, 8, dt);
      oceanUniforms.uRippleT.value = rippleT;
      oceanUniforms.uAvoid.value = avoidUniformVec(ctx.avoid);

      orbUniforms.uTime.value = simTime;
      orbUniforms.uReveal.value = rev * 0.9;
      orbUniforms.uPointer.value = pointer;
      orbUniforms.uPointerPower.value = damp(orbUniforms.uPointerPower.value, pointer.power * fade, 8, dt);
      orbUniforms.uColor.value.copy(palette.cur.crest);
      orbUniforms.uColorHot.value.copy(palette.cur.foam);

      for (const r of rings) {
        const u = r.mat.uniforms;
        u.uTime.value = simTime;
        u.uReveal.value = rev;
        u.uPointer.value = pointer;
        u.uPointerPower.value = damp(u.uPointerPower.value, pointer.power * fade, 8, dt);
      }

      arcTimer += dt;
      if (arcTimer >= arcNext) {
        arcTimer = 0;
        arcNext = nextArcInterval();
        spawnArc();
      }
      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i];
        a.life += dt;
        const k = a.life / a.ttl;
        a.mat.opacity =
          k < 0.4
            ? (k / 0.4) * 0.9
            : (1 - (k - 0.4) / 0.6) * 0.9 * (0.5 + 0.5 * Math.sin(simTime * 40));
        if (a.life >= a.ttl) {
          a.line.removeFromParent();
          arcs.splice(i, 1);
        }
      }
    },
    resize() {
      oceanUniforms.uCam.value = ctx.camZ();
      oceanUniforms.uHalfW.value = size.width / 2;
      oceanUniforms.uGround.value = -size.height * 0.3;
    },
    setTheme(nextDark) {
      levels = LEVELS[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
    },
    pointerDown(x, y) {
      oceanUniforms.uRipple.value = { x, y };
      rippleT = 0;
    },
    dispose() {
      bag.dispose();
    },
  };
};

const BG_CURTAIN_VERT = `
  ${NOISE_GLSL}
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform float uHalfW;
  uniform float uHalfH;
  uniform vec2  uPointer;
  uniform float uPointerPower;

  attribute float aSeed;
  attribute float aColumn;
  attribute float aRow;
  attribute float aZDepth;

  varying float vAlpha;
  varying float vBand;
  varying float vProx;

  void main() {
    float col = aColumn;
    float row = aRow;

    float wave1 = sin(col * 6.28318 * 2.0 + uTime * 0.38 + aSeed * 2.1) * 0.022;
    float wave2 = sin(col * 6.28318 * 3.7 + uTime * 0.25 - aSeed * 1.3) * 0.015;
    float wave3 = sin(col * 6.28318 * 5.1 + uTime * 0.14 + aSeed * 0.9) * 0.008;
    float xOff  = (wave1 + wave2 + wave3) * 1.5;

    float yShimmer = sin(uTime * 0.22 + col * 4.3 + aSeed) * 0.055
                   + sin(uTime * 0.11 + col * 7.1 - aSeed * 0.7) * 0.025;

    float noise = fbm(vec2(col * 5.0, row * 3.0 + uTime * 0.09));

    float nx = col + xOff + (noise - 0.5) * 0.04;
    float ny = row + yShimmer + (noise - 0.5) * 0.02;

    float x = (nx * 2.0 - 1.0) * uHalfW;
    float y = (ny * 2.0 - 1.0) * uHalfH;

    vec2 toPtr  = vec2(x, y) - uPointer;
    float pDist = length(toPtr);
    float prox  = smoothstep(320.0, 0.0, pDist) * uPointerPower;
    vec2 repel  = normalize(toPtr + vec2(0.001)) * prox * 70.0;
    x += repel.x;
    y += repel.y;
    float liftZ = prox * 80.0;

    vec4 mv = viewMatrix * modelMatrix * vec4(x, y, aZDepth + liftZ, 1.0);
    gl_Position = projectionMatrix * mv;

    float baseSz = mix(5.5, 1.8, row);
    float pulse  = 0.7 + 0.3 * sin(uTime * (0.6 + aSeed * 0.4) + col * 9.0 + row * 5.0);
    gl_PointSize = baseSz * pulse * uPixelRatio * (1.0 + prox * 1.5);

    float bandY = smoothstep(0.0, 0.30, 1.0 - row) * smoothstep(1.0, 0.50, 1.0 - row);
    float edgeX = smoothstep(0.0, 0.06, col) * smoothstep(1.0, 0.94, col);
    vBand  = sin(col * 6.28318 * (2.0 + aSeed * 1.5) + uTime * 0.30 + aSeed * 3.7) * 0.5 + 0.5;
    vAlpha = bandY * edgeX * (0.55 + 0.45 * vBand) * uReveal * pulse * (1.0 + prox * 0.8);
    vProx  = prox;
  }
`;

const BG_CURTAIN_FRAG = `
  uniform vec3  uDeep;
  uniform vec3  uCrest;
  uniform vec3  uFoam;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vBand;
  varying float vProx;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;

    vec3 col = mix(uDeep, uCrest, smoothstep(0.15, 0.60, vBand));
    col = mix(col, uFoam, smoothstep(0.65, 1.0, vBand) * 0.65);
    col = mix(col, uFoam, vProx * 0.7);

    float soft = pow(1.0 - d, 1.6);
    float core = pow(1.0 - d, 5.0) * 0.4;
    gl_FragColor = vec4(col, (soft + core) * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

export const background = (ctx: SceneContext): SceneInstance => {
  const bag = new DisposableBag();
  const palette = new ThemePalette(PALETTE, ctx.dark);
  let levels = LEVELS[ctx.dark ? 'dark' : 'light'];
  let dark = ctx.dark;
  const { size } = ctx;

  const cols = ctx.compact ? 70 : 130;
  const rows = ctx.compact ? 50 : 90;
  const total = cols * rows;
  const seeds = new Float32Array(total);
  const colAttr = new Float32Array(total);
  const rowAttr = new Float32Array(total);
  const zDepth = new Float32Array(total);
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      seeds[idx] = Math.random();
      colAttr[idx] = (c + (Math.random() - 0.5) * 0.7) / (cols - 1);
      rowAttr[idx] = (r + (Math.random() - 0.5) * 0.7) / (rows - 1);
      zDepth[idx] = -80 - Math.random() * 350;
      idx++;
    }
  }

  const geo = bag.track(new THREE.BufferGeometry());
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(total * 3), 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute('aColumn', new THREE.BufferAttribute(colAttr, 1));
  geo.setAttribute('aRow', new THREE.BufferAttribute(rowAttr, 1));
  geo.setAttribute('aZDepth', new THREE.BufferAttribute(zDepth, 1));

  const uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: ctx.dpr },
    uReveal: { value: 0 },
    uHalfW: { value: size.width / 2 },
    uHalfH: { value: size.height / 2 },
    uPointer: { value: { x: 1e5, y: 1e5 } },
    uPointerPower: { value: 0 },
    uDeep: { value: palette.cur.deep },
    uCrest: { value: palette.cur.crest },
    uFoam: { value: palette.cur.foam },
    uOpacity: { value: dark ? 1 : 1.2 },
  };
  const pts = new THREE.Points(
    geo,
    bag.shader({ vertexShader: BG_CURTAIN_VERT, fragmentShader: BG_CURTAIN_FRAG, uniforms }, dark)
  );
  pts.frustumCulled = false;
  bag.mount(ctx.scene, pts);

  let simTime = 0;

  return {
    update(frame) {
      const { dt, scrollSpeed, pointer } = frame;
      simTime += dt * (1 + Math.min(scrollSpeed / 600, 2.5));
      palette.update(dt);
      uniforms.uTime.value = simTime;
      uniforms.uReveal.value = easeOutCubic(Math.min(simTime / 2.8, 1));
      uniforms.uOpacity.value = levels.opacity * (dark ? 1 : 1.4);
      uniforms.uPointer.value = pointer;
      uniforms.uPointerPower.value = damp(uniforms.uPointerPower.value, pointer.power, 7, dt);
    },
    resize() {
      uniforms.uHalfW.value = size.width / 2;
      uniforms.uHalfH.value = size.height / 2;
    },
    setTheme(nextDark) {
      dark = nextDark;
      levels = LEVELS[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark);
    },
    dispose() {
      bag.dispose();
    },
  };
};

