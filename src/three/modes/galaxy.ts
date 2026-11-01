import * as THREE from 'three';
import {
  clamp,
  clamp01,
  damp,
  easeOutBack,
  easeOutCubic,
  gaussRand,
  DisposableBag,
  ThemePalette,
  SceneContext,
  SceneInstance,
  scaleUniforms,
  swayCamera,
  blendForTheme,
} from '../util';
import { createDustField } from '../dust';

const BG_THEME = {
  dark: { line: 0.42, node: 1, core: 0.5 },
  light: { line: 0.56, node: 0.9, core: 0 },
};

const BG_NODE_VERT = `
  attribute float aSize;
  attribute float aGlow;
  attribute float aFade;
  uniform float uPixelRatio;
  uniform float uScale;
  varying float vGlow;
  varying float vDepth;
  varying float vFade;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (1.0 + aGlow * 1.2) * (uScale / -mv.z);
    vGlow = aGlow;
    vFade = aFade;
    vDepth = clamp((position.z + 380.0) / 540.0, 0.0, 1.0);
  }
`;

const BG_NODE_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  uniform float uCore;
  varying float vGlow;
  varying float vDepth;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float soft = pow(1.0 - d, 1.3);
    float core = pow(1.0 - d, 4.0);
    float a = (soft * 0.7 + core * 0.5) * (0.5 + 0.5 * vDepth) * (1.0 + vGlow * 0.9) * uOpacity * vFade;
    vec3 col = uColor + vec3(core * uCore * (0.4 + vGlow));
    gl_FragColor = vec4(col, min(a, 1.0));
    #include <colorspace_fragment>
  }
`;

const BG_LINE_VERT = `
  attribute float aAlpha;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BG_LINE_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

const Z_MIN = -380;
const Z_MAX = 140;
const PAD_X = 1.08;
const PAD_Y = 1.16;
const RIPPLE_LIFE = 1.7;
const RIPPLE_SPEED = 560;
const MAX_RIPPLES = 3;

function createConstellationBackground(
  ctx: SceneContext,
  opts: { pulses?: number; linkScale?: number; nodeScale?: number }
): SceneInstance {
  const { pulses = 0, linkScale = 1, nodeScale = 1 } = opts;
  const { scene, camera, size, compact } = ctx;
  const bag = new DisposableBag();
  let dark = ctx.dark;
  let theme = BG_THEME[dark ? 'dark' : 'light'];
  const dprBoost = ctx.dpr >= 1.5 ? 1.3 : 1;
  const color = new THREE.Color();
  const prevSize = { width: size.width, height: size.height };
  const areaDiv = compact ? 17000 : 13000;
  const N = Math.round(clamp(((size.width * size.height) / areaDiv) * nodeScale, 34, (compact ? 52 : 78) * nodeScale));

  const px = new Float32Array(N);
  const py = new Float32Array(N);
  const pz = new Float32Array(N);
  const vx = new Float32Array(N);
  const vy = new Float32Array(N);
  const vz = new Float32Array(N);
  const bx = new Float32Array(N);
  const by = new Float32Array(N);
  const glow = new Float32Array(N);
  const fade = new Float32Array(N).fill(1);
  const sizes = new Float32Array(N);
  const wx = new Float32Array(N);
  const wy = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    px[i] = (Math.random() * 2 - 1) * (size.width / 2) * PAD_X;
    py[i] = (Math.random() * 2 - 1) * (size.height / 2) * PAD_Y;
    pz[i] = Z_MIN + Math.random() * 520;
    const ang = Math.random() * Math.PI * 2;
    const spd = 14 + Math.random() * 20;
    bx[i] = Math.cos(ang) * spd;
    by[i] = Math.sin(ang) * spd;
    vx[i] = bx[i];
    vy[i] = by[i];
    vz[i] = (Math.random() - 0.5) * 8;
    sizes[i] = 6 + Math.random() * 3.6;
  }

  const posAttr = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
  const glowAttr = new THREE.BufferAttribute(glow, 1);
  const fadeAttr = new THREE.BufferAttribute(fade, 1);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  glowAttr.setUsage(THREE.DynamicDrawUsage);
  fadeAttr.setUsage(THREE.DynamicDrawUsage);

  const nodeGeo = bag.track(new THREE.BufferGeometry());
  nodeGeo.setAttribute('position', posAttr);
  nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  nodeGeo.setAttribute('aGlow', glowAttr);
  nodeGeo.setAttribute('aFade', fadeAttr);

  const nodeUniforms = () => ({
    ...scaleUniforms(ctx),
    uColor: { value: color },
    uOpacity: { value: theme.node },
    uCore: { value: theme.core },
  });

  const nodeMat = bag.shader(
    { vertexShader: BG_NODE_VERT, fragmentShader: BG_NODE_FRAG, uniforms: nodeUniforms() },
    dark
  );
  const nodePts = new THREE.Points(nodeGeo, nodeMat);
  nodePts.frustumCulled = false;
  bag.mount(scene, nodePts);

  const maxSegs = N * 9;
  const linePos = new THREE.BufferAttribute(new Float32Array(maxSegs * 2 * 3), 3);
  const lineAlpha = new THREE.BufferAttribute(new Float32Array(maxSegs * 2), 1);
  linePos.setUsage(THREE.DynamicDrawUsage);
  lineAlpha.setUsage(THREE.DynamicDrawUsage);

  const lineGeo = bag.track(new THREE.BufferGeometry());
  lineGeo.setAttribute('position', linePos);
  lineGeo.setAttribute('aAlpha', lineAlpha);
  lineGeo.setDrawRange(0, 0);

  const lineMat = bag.shader(
    {
      vertexShader: BG_LINE_VERT,
      fragmentShader: BG_LINE_FRAG,
      uniforms: { uColor: { value: color }, uOpacity: { value: 1 } },
    },
    dark
  );
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  lines.frustumCulled = false;
  bag.mount(scene, lines);

  const pCount = Math.max(1, pulses);
  const pulsePos = new THREE.BufferAttribute(new Float32Array(pCount * 3), 3);
  const pulseGlow = new THREE.BufferAttribute(new Float32Array(pCount), 1);
  const pulseSizes = new THREE.BufferAttribute(new Float32Array(pCount).fill(8), 1);
  const pulseFade = new THREE.BufferAttribute(new Float32Array(pCount).fill(1), 1);
  pulsePos.setUsage(THREE.DynamicDrawUsage);
  pulseGlow.setUsage(THREE.DynamicDrawUsage);

  const pulseGeo = bag.track(new THREE.BufferGeometry());
  pulseGeo.setAttribute('position', pulsePos);
  pulseGeo.setAttribute('aSize', pulseSizes);
  pulseGeo.setAttribute('aGlow', pulseGlow);
  pulseGeo.setAttribute('aFade', pulseFade);
  pulseGeo.setDrawRange(0, pulses);

  const pulseMat = bag.shader(
    { vertexShader: BG_NODE_VERT, fragmentShader: BG_NODE_FRAG, uniforms: nodeUniforms() },
    dark
  );
  if (pulses > 0) {
    const pulsePts = new THREE.Points(pulseGeo, pulseMat);
    pulsePts.frustumCulled = false;
    bag.mount(scene, pulsePts);
  }

  const pulseStates = Array.from({ length: pulses }, () => ({
    a: Math.floor(Math.random() * N),
    b: -1,
    t: Math.random(),
    speed: 0.5 + Math.random() * 0.6,
  }));

  const circlePts: number[] = [];
  for (let i = 0; i < 128; i++) {
    const ang = (i / 128) * Math.PI * 2;
    circlePts.push(Math.cos(ang), Math.sin(ang), 0);
  }
  const circleGeo = bag.track(new THREE.BufferGeometry());
  circleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(circlePts), 3));

  const ripples: Array<{ x: number; y: number; t: number; active: boolean }> = [];
  const rippleLoops: THREE.LineLoop[] = [];
  const rippleMats: THREE.LineBasicMaterial[] = [];

  for (let i = 0; i < MAX_RIPPLES; i++) {
    const rMat = bag.track(
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: blendForTheme(dark),
      })
    );
    const loop = new THREE.LineLoop(circleGeo, rMat);
    loop.visible = false;
    loop.frustumCulled = false;
    bag.mount(scene, loop);
    rippleLoops.push(loop);
    rippleMats.push(rMat);
    ripples.push({ x: 0, y: 0, t: 0, active: false });
  }

  const camPos = { x: 0, y: 0 };
  const linkDist = () => clamp(size.width * 0.11, 105, 160) * linkScale;
  const pickNeighbour = (idx: number, maxDist: number, prev: number) => {
    let chosen = -1;
    let seen = 0;
    const d2 = maxDist * maxDist;
    for (let j = 0; j < N; j++) {
      if (j === idx || j === prev) continue;
      const dx = px[idx] - px[j];
      const dy = py[idx] - py[j];
      const dz = (pz[idx] - pz[j]) * 0.35;
      if (dx * dx + dy * dy + dz * dz < d2) {
        seen++;
        if (Math.random() * seen < 1) chosen = j;
      }
    }
    return chosen;
  };

  return {
    update(frame) {
      const { dt, progress, pointer, sway, scrollDelta } = frame;
      color.copy(frame.tint);
      camPos.x = damp(camPos.x, Math.sin(progress * Math.PI * 2) * 60 - sway.x * 26, 2.5, dt);
      camPos.y = damp(camPos.y, (progress - 0.5) * 70 + sway.y * 18, 2.5, dt);
      camera.position.set(camPos.x, camPos.y, ctx.camZ());
      camera.lookAt(0, 0, 0);

      let activeRipples = 0;
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripples[i];
        const loop = rippleLoops[i];
        if (!r.active) {
          loop.visible = false;
          continue;
        }
        r.t += dt;
        if (r.t >= RIPPLE_LIFE) {
          r.active = false;
          loop.visible = false;
          continue;
        }
        activeRipples++;
        const k = 1 - r.t / RIPPLE_LIFE;
        const rad = 30 + r.t * RIPPLE_SPEED;
        loop.visible = true;
        loop.position.set(r.x, r.y, 0);
        loop.scale.set(rad, rad, 1);
        rippleMats[i].opacity = 0.32 * k * k * (dark ? 1 : 1.3);
      }

      const halfW = (size.width / 2) * PAD_X;
      const halfH = (size.height / 2) * PAD_Y;
      const relax = 1 - Math.exp(-1.6 * dt);
      const camZ = ctx.camZ();

      for (let i = 0; i < N; i++) {
        let g = 0;
        if (pointer.power > 0.01) {
          const dx = pointer.x - px[i];
          const dy = pointer.y - py[i];
          const dist = Math.hypot(dx, dy);
          if (dist < 230) {
            const p = (1 - dist / 230) * pointer.power;
            const inv = 1 / Math.max(dist, 1);
            vx[i] += dx * inv * p * 26 * dt;
            vy[i] += dy * inv * p * 26 * dt;
            g = Math.max(g, p);
          }
        }
        if (activeRipples > 0) {
          for (let rIdx = 0; rIdx < MAX_RIPPLES; rIdx++) {
            const r = ripples[rIdx];
            if (!r.active) continue;
            const dx = px[i] - r.x;
            const dy = py[i] - r.y;
            const dist = Math.hypot(dx, dy);
            const band = (dist - (30 + r.t * RIPPLE_SPEED)) / 48;
            const w = Math.exp(-band * band) * (1 - r.t / RIPPLE_LIFE);
            if (w > 0.01) {
              const inv = 1 / Math.max(dist, 1);
              vx[i] += dx * inv * w * 900 * dt;
              vy[i] += dy * inv * w * 900 * dt;
              g = Math.max(g, w);
            }
          }
        }

        vx[i] += (bx[i] - vx[i]) * relax;
        vy[i] += (by[i] - vy[i]) * relax;
        const depthNorm = clamp01((pz[i] - Z_MIN) / 520);
        px[i] += vx[i] * dt;
        py[i] += vy[i] * dt - scrollDelta * (0.05 + 0.16 * depthNorm);
        pz[i] += vz[i] * dt;

        if (px[i] < -halfW) {
          px[i] = -halfW;
          vx[i] = Math.abs(vx[i]);
          bx[i] = Math.abs(bx[i]);
        } else if (px[i] > halfW) {
          px[i] = halfW;
          vx[i] = -Math.abs(vx[i]);
          bx[i] = -Math.abs(bx[i]);
        }
        if (py[i] < -halfH) py[i] += 2 * halfH;
        else if (py[i] > halfH) py[i] -= 2 * halfH;

        if (pz[i] < Z_MIN) {
          pz[i] = Z_MIN;
          vz[i] = Math.abs(vz[i]);
        } else if (pz[i] > Z_MAX) {
          pz[i] = Z_MAX;
          vz[i] = -Math.abs(vz[i]);
        }

        glow[i] = damp(glow[i], g, 8, dt);
        const edgeY = Math.abs(py[i]) / (size.height / 2);
        fade[i] = 1 - clamp01((edgeY - 1) / 0.14);

        const persp = (camZ - pz[i]) / camZ;
        wx[i] = px[i] * persp;
        wy[i] = py[i] * persp;
        posAttr.setXYZ(i, wx[i], wy[i], pz[i]);
      }

      posAttr.needsUpdate = true;
      glowAttr.needsUpdate = true;
      fadeAttr.needsUpdate = true;

      const ld = linkDist();
      const ld2 = ld * ld;
      let segCount = 0;
      const lp = linePos.array as Float32Array;
      const la = lineAlpha.array as Float32Array;
      const pushSeg = (
        x1: number,
        y1: number,
        z1: number,
        x2: number,
        y2: number,
        z2: number,
        a1: number,
        a2: number
      ) => {
        if (segCount >= maxSegs) return;
        const idx = segCount * 6;
        lp[idx] = x1;
        lp[idx + 1] = y1;
        lp[idx + 2] = z1;
        lp[idx + 3] = x2;
        lp[idx + 4] = y2;
        lp[idx + 5] = z2;
        la[segCount * 2] = a1;
        la[segCount * 2 + 1] = a2;
        segCount++;
      };

      const baseLineAlpha = theme.line * dprBoost * (pulses > 0 ? 1.1 : 1);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          const dz = (pz[i] - pz[j]) * 0.35;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 >= ld2) continue;
          const prox = 1 - Math.sqrt(d2) / ld;
          const zFactor = 0.45 + 0.55 * clamp01((pz[i] + pz[j] - 2 * Z_MIN) / 1040);
          const alpha = prox * baseLineAlpha * zFactor;
          pushSeg(wx[i], wy[i], pz[i], wx[j], wy[j], pz[j], alpha * fade[i], alpha * fade[j]);
        }
        if (pointer.power > 0.01) {
          const dx = px[i] - pointer.x;
          const dy = py[i] - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 210) {
            const alpha = (1 - dist / 210) * baseLineAlpha * 1.7 * pointer.power;
            pushSeg(wx[i], wy[i], pz[i], pointer.x, pointer.y, 0, alpha * fade[i], alpha);
          }
        }
      }

      lineGeo.setDrawRange(0, segCount * 2);
      linePos.needsUpdate = true;
      lineAlpha.needsUpdate = true;

      if (pulses > 0) {
        for (let i = 0; i < pulses; i++) {
          const ps = pulseStates[i];
          if (ps.b < 0) {
            ps.b = pickNeighbour(ps.a, ld, -1);
            if (ps.b < 0) {
              ps.a = Math.floor(Math.random() * N);
              pulseGlow.setX(i, 0);
              continue;
            }
            ps.t = 0;
          }
          ps.t += dt * ps.speed;
          if (ps.t >= 1) {
            glow[ps.b] = Math.max(glow[ps.b], 1);
            const prev = ps.a;
            ps.a = ps.b;
            ps.b = pickNeighbour(ps.a, ld, prev);
            ps.t = 0;
            if (ps.b < 0) continue;
          }
          const k = ps.t;
          pulsePos.setXYZ(
            i,
            wx[ps.a] + (wx[ps.b] - wx[ps.a]) * k,
            wy[ps.a] + (wy[ps.b] - wy[ps.a]) * k,
            pz[ps.a] + (pz[ps.b] - pz[ps.a]) * k
          );
          pulseGlow.setX(i, 1.1 + Math.sin(k * Math.PI) * 0.5);
        }
        pulsePos.needsUpdate = true;
        pulseGlow.needsUpdate = true;
        pulseMat.uniforms.uOpacity.value = theme.node;
        pulseMat.uniforms.uCore.value = theme.core + 0.15;
      }

      nodeMat.uniforms.uOpacity.value = theme.node;
      nodeMat.uniforms.uCore.value = theme.core;
      for (const m of rippleMats) m.color.copy(color);
    },
    resize() {
      const sx = prevSize.width > 0 ? size.width / prevSize.width : 1;
      const sy = prevSize.height > 0 ? size.height / prevSize.height : 1;
      for (let i = 0; i < N; i++) {
        px[i] *= sx;
        py[i] *= sy;
      }
      prevSize.width = size.width;
      prevSize.height = size.height;
      nodeMat.uniforms.uScale.value = ctx.camZ();
      pulseMat.uniforms.uScale.value = ctx.camZ();
    },
    setTheme(nextDark) {
      dark = nextDark;
      theme = BG_THEME[dark ? 'dark' : 'light'];
      bag.setBlending(dark, rippleMats);
    },
    pointerDown(x, y) {
      const target =
        ripples.find((r) => !r.active) ?? ripples.reduce((a, b) => (a.t > b.t ? a : b));
      target.x = x;
      target.y = y;
      target.t = 0;
      target.active = true;
    },
    dispose() {
      bag.dispose();
    },
  };
}

const HERO_COLORS = {
  dark: { a: '#7dd3fc', b: '#3b82f6', c: '#2dd4bf', wire: '#7dd3fc' },
  light: { a: '#0284c7', b: '#2563eb', c: '#0d9488', wire: '#2563eb' },
};

const HERO_LEVELS = {
  dark: { wire: 0.34, halo: 0.95, dust: 0.75, comet: 1, core: 0.5 },
  light: { wire: 0.3, halo: 0.8, dust: 0.6, comet: 0.95, core: 0 },
};

const DISC_VERT = `
  uniform float uTime;
  uniform float uSpin;
  uniform float uReveal;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform float uRMin;
  uniform float uRMax;
  uniform vec2  uPointer;
  uniform float uPointerPower;

  attribute vec4  aParams;
  attribute float aSize;

  varying float vT;
  varying float vAlpha;
  varying float vTwinkle;

  void main() {
    float r = aParams.x;
    float seed = aParams.w;
    float t = clamp((r - uRMin) / (uRMax - uRMin), 0.0, 1.0);

    float rv = clamp(uReveal * 1.4 - seed * 0.4, 0.0, 1.0);
    rv = rv * rv * (3.0 - 2.0 * rv);

    float w = mix(1.0, inversesqrt(r / 260.0), 0.4);
    float ang = aParams.y + uSpin * w + (1.0 - rv) * 3.2;
    float rr = r * (1.0 + (1.0 - rv) * 1.7);

    vec3 p = vec3(cos(ang) * rr, aParams.z * rv, sin(ang) * rr);
    p.y += sin(ang * 3.0 + uTime * 0.7 + seed * 6.2831) * (2.5 + 6.0 * t);

    vec4 world = modelMatrix * vec4(p, 1.0);

    vec2 d = world.xy - uPointer;
    float dist = length(d);
    float push = smoothstep(150.0, 0.0, dist) * uPointerPower;
    world.xy += d / max(dist, 1.0) * push * 36.0;
    world.z += push * 60.0;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (uScale / -mv.z) * (1.0 + push * 0.9);

    vT = t;
    vAlpha = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.7, 1.0, t)) * rv;
    vTwinkle = 0.6 + 0.4 * sin(uTime * (0.8 + seed * 1.6) + seed * 47.0);
  }
`;

const DISC_FRAG = `
  uniform vec3  uColA;
  uniform vec3  uColB;
  uniform vec3  uColC;
  uniform float uOpacity;
  uniform float uCore;

  varying float vT;
  varying float vAlpha;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float soft = pow(1.0 - d, 1.6);
    float core = pow(1.0 - d, 6.0);

    vec3 col = mix(uColA, uColB, smoothstep(0.0, 0.45, vT));
    col = mix(col, uColC, smoothstep(0.45, 1.0, vT));
    col += vec3(core * uCore);

    float a = (soft * 0.95 + core * 0.65) * vAlpha * vTwinkle * uOpacity;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

const COMET_VERT = `
  uniform float uPhase;
  uniform vec2  uRadii;
  uniform float uTrail;
  uniform float uDir;
  uniform float uPixelRatio;
  uniform float uScale;

  attribute float aK;
  varying float vK;

  void main() {
    float phi = uPhase - aK * uTrail * uDir;
    vec3 p = vec3(cos(phi) * uRadii.x, sin(phi * 2.0) * 7.0, sin(phi) * uRadii.y);

    vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float head = 1.0 - aK;
    gl_PointSize = (1.6 + 11.0 * pow(head, 3.0)) * uPixelRatio * (uScale / -mv.z);
    vK = aK;
  }
`;

const COMET_FRAG = `
  uniform vec3  uHead;
  uniform vec3  uTail;
  uniform float uOpacity;
  uniform float uCore;

  varying float vK;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float head = 1.0 - vK;
    float soft = pow(1.0 - d, 1.5);
    float core = pow(1.0 - d, 5.0);
    vec3 col = mix(uTail, uHead, pow(head, 2.0));
    col += vec3(core * uCore * pow(head, 3.0));
    float a = (soft * 0.8 + core * 0.7) * pow(head, 1.6) * uOpacity;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

const WIRE_PT_VERT = `
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uScale;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (uScale / -mv.z);
  }
`;

const WIRE_PT_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  uniform float uCore;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float soft = pow(1.0 - d, 1.4);
    float core = pow(1.0 - d, 5.0);
    gl_FragColor = vec4(uColor + vec3(core * uCore), (soft * 0.75 + core * 0.5) * uOpacity);
    #include <colorspace_fragment>
  }
`;

const R_MIN = 262;
const R_MAX = 440;

function createDiscGeo(count: number) {
  const params = new Float32Array(count * 4);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const inner = Math.random() < 0.12;
    const t = inner ? Math.random() * 0.16 : Math.pow(Math.random(), 0.85);
    const r = R_MIN + 178 * t;
    const spiral = !inner && Math.random() < 0.74;
    const arm = Math.floor(Math.random() * 3);
    const ang = spiral
      ? (arm / 3) * Math.PI * 2 + t * 2.6 + gaussRand() * (0.2 + 0.16 * (1 - t))
      : Math.random() * Math.PI * 2;
    const h = gaussRand() * (inner ? 3 : 5 + 16 * t);
    params.set([r, ang, h, Math.random()], i * 4);
    sizes[i] = 1.3 + Math.pow(Math.random(), 4) * 4.8 + (spiral ? 0.25 : 0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute('aParams', new THREE.BufferAttribute(params, 4));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  return geo;
}

function createCometGeo(count: number) {
  const k = new Float32Array(count);
  for (let i = 0; i < count; i++) k[i] = i / (count - 1);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute('aK', new THREE.BufferAttribute(k, 1));
  return geo;
}

function uniqueVertices(edgesGeo: THREE.BufferGeometry) {
  const pos = edgesGeo.getAttribute('position');
  const seen = new Set<string>();
  const out: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(x, y, z);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(out), 3));
  return geo;
}

const POLYHEDRA = [
  { fx: 0.94, fy: 0.15, z: -140, radius: 74, kind: 'geodesic' as const, spin: [0.11, 0.17], mobile: true, delay: 0.9 },
  { fx: 0.5, fy: 0.13, z: -40, radius: 38, kind: 'icosa' as const, spin: [0.19, 0.13], mobile: false, delay: 1.2 },
  { fx: 0.52, fy: 0.84, z: 70, radius: 48, kind: 'dodeca' as const, spin: [0.14, 0.21], mobile: false, delay: 1.5 },
  { fx: 0.05, fy: 0.9, z: 20, radius: 44, kind: 'octa' as const, spin: [0.2, 0.12], mobile: true, delay: 1.8 },
];

const COMETS = [
  { radii: [318, 292], tilt: [-0.95, 0.45], speed: 0.42, trail: 1.5, dir: 1, phase: 0.4 },
  { radii: [372, 340], tilt: [-0.78, -0.55], speed: 0.3, trail: 1.25, dir: -1, phase: 2.7 },
  { radii: [296, 268], tilt: [-1.1, 0.05], speed: 0.55, trail: 1.7, dir: 1, phase: 4.6 },
];

export const hero = (ctx: SceneContext): SceneInstance => {
  const { scene, rig, size, compact } = ctx;
  const bag = new DisposableBag();
  const palette = new ThemePalette(HERO_COLORS, ctx.dark);
  let levels = HERO_LEVELS[ctx.dark ? 'dark' : 'light'];

  const root = bag.mount(rig ?? scene, new THREE.Group());
  const discGeo = bag.track(createDiscGeo(compact ? 3000 : 7000));
  const discMat = bag.shader(
    {
      vertexShader: DISC_VERT,
      fragmentShader: DISC_FRAG,
      uniforms: {
        ...scaleUniforms(ctx),
        uTime: { value: 0 },
        uSpin: { value: 0 },
        uReveal: { value: 0 },
        uRMin: { value: R_MIN },
        uRMax: { value: R_MAX },
        uPointer: { value: { x: 1e5, y: 1e5 } },
        uPointerPower: { value: 0 },
        uColA: { value: palette.cur.a },
        uColB: { value: palette.cur.b },
        uColC: { value: palette.cur.c },
        uOpacity: { value: levels.halo },
        uCore: { value: levels.core },
      },
    },
    ctx.dark
  );

  const discPts = new THREE.Points(discGeo, discMat);
  discPts.frustumCulled = false;
  const discGroup = bag.mount(root, new THREE.Group());
  discGroup.add(discPts);

  const cometGeo = bag.track(createCometGeo(compact ? 44 : 72));
  const comets = COMETS.map((spec) => {
    const mat = bag.shader(
      {
        vertexShader: COMET_VERT,
        fragmentShader: COMET_FRAG,
        uniforms: {
          ...scaleUniforms(ctx),
          uPhase: { value: spec.phase },
          uRadii: { value: { x: spec.radii[0], y: spec.radii[1] } },
          uTrail: { value: spec.trail },
          uDir: { value: spec.dir },
          uHead: { value: palette.cur.a },
          uTail: { value: palette.cur.b },
          uOpacity: { value: 0 },
          uCore: { value: levels.core },
        },
      },
      ctx.dark
    );
    const pts = new THREE.Points(cometGeo, mat);
    pts.frustumCulled = false;
    const grp = bag.mount(root, new THREE.Group());
    grp.rotation.set(spec.tilt[0], 0, spec.tilt[1]);
    grp.add(pts);
    return { spec, material: mat, phase: spec.phase };
  });

  const dust = createDustField(ctx, bag, { count: compact ? 260 : 640, color: palette.cur.a });
  const wireLineMat = bag.track(
    new THREE.LineBasicMaterial({
      color: palette.cur.wire,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: blendForTheme(ctx.dark),
    })
  );
  const wirePtMat = bag.shader(
    {
      vertexShader: WIRE_PT_VERT,
      fragmentShader: WIRE_PT_FRAG,
      uniforms: {
        ...scaleUniforms(ctx),
        uSize: { value: 5 },
        uColor: { value: palette.cur.wire },
        uOpacity: { value: 0 },
        uCore: { value: levels.core },
      },
    },
    ctx.dark
  );

  const makeSolid = (kind: 'icosa' | 'octa' | 'dodeca' | 'geodesic') => {
    switch (kind) {
      case 'icosa':
        return new THREE.IcosahedronGeometry(1, 0);
      case 'octa':
        return new THREE.OctahedronGeometry(1, 0);
      case 'dodeca':
        return new THREE.DodecahedronGeometry(1, 0);
      case 'geodesic':
        return new THREE.IcosahedronGeometry(1, 1);
    }
  };

  const polys = POLYHEDRA.filter((p) => !compact || p.mobile).map((spec) => {
    const solid = makeSolid(spec.kind);
    const edges = bag.track(new THREE.EdgesGeometry(solid, 1));
    const verts = bag.track(uniqueVertices(edges));
    solid.dispose();
    const grp = bag.mount(scene, new THREE.Group());
    const segs = new THREE.LineSegments(edges, wireLineMat);
    const pts = new THREE.Points(verts, wirePtMat);
    segs.frustumCulled = false;
    pts.frustumCulled = false;
    grp.add(segs, pts);
    grp.scale.setScalar(1e-4);
    return { spec, group: grp, seed: Math.random() * 10, baseX: 0, baseY: 0, radius: 1 };
  });

  const placePolys = () => {
    const s = compact ? 0.7 : 1;
    for (const p of polys) {
      p.baseX = (p.spec.fx - 0.5) * size.width;
      p.baseY = -(p.spec.fy - 0.5) * size.height;
      p.radius = p.spec.radius * s;
    }
  };
  placePolys();

  let spin = 0;

  return {
    update(frame) {
      const { dt, elapsed, fade, progress, pointer, sway } = frame;
      swayCamera(ctx, sway, 46, 30);
      palette.update(dt);
      const reveal = easeOutCubic(elapsed / 3.2);
      const dustReveal = easeOutCubic(elapsed / 2.4);
      spin += dt * (0.085 + progress * 0.45);

      const u = discMat.uniforms;
      u.uTime.value = elapsed;
      u.uSpin.value = spin;
      u.uReveal.value = reveal;
      u.uOpacity.value = levels.halo * fade;
      u.uCore.value = levels.core;
      u.uPointer.value = pointer;
      u.uPointerPower.value = pointer.power;

      discGroup.rotation.x = -0.98 + Math.sin(elapsed * 0.21) * 0.04 + sway.y * 0.1;
      discGroup.rotation.z = -0.32 + Math.cos(elapsed * 0.17) * 0.035 - sway.x * 0.08;
      discGroup.rotation.y = sway.x * 0.06;

      const cometReveal = easeOutCubic((elapsed - 1.3) / 1.6);
      for (const c of comets) {
        c.phase += dt * c.spec.speed * c.spec.dir;
        c.material.uniforms.uPhase.value = c.phase;
        c.material.uniforms.uOpacity.value = levels.comet * cometReveal * fade;
        c.material.uniforms.uCore.value = levels.core;
      }

      dust.update(elapsed, dustReveal * fade, levels.dust);
      wireLineMat.opacity = levels.wire * fade;
      wirePtMat.uniforms.uOpacity.value = clamp01(levels.wire * 2.4) * fade;
      wirePtMat.uniforms.uCore.value = levels.core;
      wireLineMat.color.copy(palette.cur.wire);

      for (const p of polys) {
        const { spec, group } = p;
        const r = easeOutBack((elapsed - spec.delay) / 1.4);
        group.scale.setScalar(Math.max(1e-4, p.radius * r));
        group.rotation.x += dt * spec.spin[0];
        group.rotation.y += dt * spec.spin[1];
        group.position.set(
          p.baseX + Math.sin(elapsed * 0.4 + p.seed) * 8,
          p.baseY + Math.sin(elapsed * 0.55 + p.seed * 2) * 12 + progress * 60,
          spec.z
        );
      }
      root.position.y = progress * 40;
    },
    resize() {
      dust.resize();
      for (const m of bag.materials) {
        if (m.uniforms.uScale) m.uniforms.uScale.value = ctx.camZ();
      }
      placePolys();
    },
    setTheme(nextDark) {
      levels = HERO_LEVELS[nextDark ? 'dark' : 'light'];
      palette.setTheme(nextDark);
      bag.setBlending(nextDark, [wireLineMat]);
    },
    dispose() {
      bag.dispose();
    },
  };
};

export const background = (ctx: SceneContext): SceneInstance =>
  createConstellationBackground(ctx, {});

