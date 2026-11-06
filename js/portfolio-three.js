/* Mehedi Hasan Shihab Portfolio — Vanilla JS 3D WebGL & Animation Engine (Three.js Controller Suite) */
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // three-global-ns:three
  var require_three = __commonJS({
    "three-global-ns:three"(exports, module) {
      module.exports = window.THREE;
    }
  });

  // PortF/src/three/util.ts
  function gaussRand() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function createPointerTracker() {
    const state = {
      x: 0,
      y: 0,
      active: false,
      moved: false,
      dispose: () => {
      }
    };
    const onMove = (e) => {
      state.x = e.clientX;
      state.y = e.clientY;
      state.active = true;
      state.moved = true;
    };
    const onUp = (e) => {
      if (e.pointerType !== "mouse") state.active = false;
    };
    const onLeave = () => {
      state.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    state.dispose = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
    return state;
  }
  function scaleUniforms(ctx) {
    return {
      uPixelRatio: { value: ctx.dpr },
      uScale: { value: ctx.camZ() }
    };
  }
  function swayCamera(ctx, sway, ampX, ampY) {
    ctx.camera.position.set(-sway.x * ampX, -sway.y * ampY, ctx.camZ());
    ctx.camera.lookAt(0, 0, 0);
  }
  var THREE, clamp, clamp01, lerp, damp, easeOutCubic, easeOutBack, blendForTheme, DisposableBag, ThemePalette, AVOID_GLSL, avoidUniformVec, NOISE_GLSL;
  var init_util = __esm({
    "PortF/src/three/util.ts"() {
      "use strict";
      THREE = __toESM(require_three(), 1);
      clamp = (v, min, max) => Math.min(max, Math.max(min, v));
      clamp01 = (v) => clamp(v, 0, 1);
      lerp = (a, b, t) => a + (b - a) * t;
      damp = (cur, tgt, lambda, dt) => lerp(cur, tgt, 1 - Math.exp(-lambda * dt));
      easeOutCubic = (v) => 1 - Math.pow(1 - clamp01(v), 3);
      easeOutBack = (v) => {
        const t = clamp01(v) - 1;
        return 1 + 2.70158 * t * t * t + 1.70158 * t * t;
      };
      blendForTheme = (dark) => dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      DisposableBag = class {
        constructor() {
          __publicField(this, "disposables", []);
          __publicField(this, "objects", []);
          __publicField(this, "materials", []);
        }
        track(item) {
          this.disposables.push(item);
          return item;
        }
        mount(parent, child) {
          parent.add(child);
          this.objects.push(child);
          return child;
        }
        shader(params, dark) {
          const mat = this.track(
            new THREE.ShaderMaterial({
              transparent: true,
              depthWrite: false,
              blending: blendForTheme(dark),
              ...params
            })
          );
          this.materials.push(mat);
          return mat;
        }
        setBlending(dark, extra = []) {
          const b = blendForTheme(dark);
          for (const m of [...this.materials, ...extra]) {
            m.blending = b;
            m.needsUpdate = true;
          }
        }
        dispose() {
          for (const obj of this.objects) obj.removeFromParent();
          for (const d of this.disposables) d.dispose();
          this.objects.length = 0;
          this.disposables.length = 0;
          this.materials.length = 0;
        }
      };
      ThemePalette = class {
        constructor(defs, dark) {
          __publicField(this, "defs");
          __publicField(this, "cur");
          __publicField(this, "tgt");
          this.defs = defs;
          const keys = Object.keys(defs.dark);
          this.cur = {};
          this.tgt = {};
          for (const k of keys) {
            const hex = defs[dark ? "dark" : "light"][k];
            this.cur[k] = new THREE.Color(hex);
            this.tgt[k] = new THREE.Color(hex);
          }
        }
        setTheme(dark) {
          for (const k of Object.keys(this.tgt)) {
            this.tgt[k].set(this.defs[dark ? "dark" : "light"][k]);
          }
        }
        update(dt, speed = 7) {
          const alpha = 1 - Math.exp(-speed * dt);
          for (const k of Object.keys(this.cur)) {
            this.cur[k].lerp(this.tgt[k], alpha);
          }
        }
        snap() {
          for (const k of Object.keys(this.cur)) {
            this.cur[k].copy(this.tgt[k]);
          }
        }
      };
      AVOID_GLSL = `
  uniform vec4 uAvoid;
  float avoidMask(vec2 scr, float minV) {
    vec2 c = (uAvoid.xy + uAvoid.zw) * 0.5;
    vec2 h = (uAvoid.zw - uAvoid.xy) * 0.5;
    vec2 q = abs(scr - c) - h;
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    return mix(minV, 1.0, smoothstep(-30.0, 110.0, dist));
  }
`;
      avoidUniformVec = (a) => a ? { x: a.x0, y: a.y0, z: a.x1, w: a.y1 } : { x: -1e4, y: -1e4, z: -1e4, w: -1e4 };
      NOISE_GLSL = `
  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }
  float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + 17.0;
      a *= 0.5;
    }
    return v;
  }
`;
    }
  });

  // PortF/src/three/dust.ts
  function createDustField(ctx, bag, opts) {
    const { count, color, depth = 700, zOffset = -120, sizeMin = 1.4, sizeRange = 3.2 } = opts;
    const seeds = new Float32Array(count * 4);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seeds.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      sizes[i] = sizeMin + Math.pow(Math.random(), 3) * sizeRange;
    }
    const geo = bag.track(new THREE2.BufferGeometry());
    geo.setAttribute("position", new THREE2.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("aSeed", new THREE2.BufferAttribute(seeds, 4));
    geo.setAttribute("aSize", new THREE2.BufferAttribute(sizes, 1));
    const getBox = () => ({ x: ctx.size.width * 1.15, y: ctx.size.height * 1.1, z: depth });
    const mat = bag.shader(
      {
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          ...scaleUniforms(ctx),
          uTime: { value: 0 },
          uBox: { value: getBox() },
          uReveal: { value: 0 },
          uRise: { value: 1 },
          uColor: { value: color },
          uOpacity: { value: 0 }
        }
      },
      ctx.dark
    );
    const pts = new THREE2.Points(geo, mat);
    pts.frustumCulled = false;
    pts.position.z = zOffset;
    bag.mount(ctx.scene, pts);
    return {
      material: mat,
      points: pts,
      update(time, reveal, opacity, rise = 1) {
        mat.uniforms.uTime.value = time;
        mat.uniforms.uReveal.value = reveal;
        mat.uniforms.uOpacity.value = opacity;
        mat.uniforms.uRise.value = rise;
      },
      resize() {
        mat.uniforms.uBox.value = getBox();
        mat.uniforms.uScale.value = ctx.camZ();
      }
    };
  }
  var THREE2, VERT, FRAG;
  var init_dust = __esm({
    "PortF/src/three/dust.ts"() {
      "use strict";
      THREE2 = __toESM(require_three(), 1);
      init_util();
      VERT = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform vec3  uBox;
  uniform float uReveal;
  uniform float uRise;

  attribute vec4  aSeed;
  attribute float aSize;

  varying float vAlpha;

  void main() {
    float speed = (5.0 + aSeed.w * 12.0) * uRise;
    float ny = fract(aSeed.y + uTime * speed / uBox.y);

    vec3 p = vec3((aSeed.x - 0.5) * uBox.x, (ny - 0.5) * uBox.y, (aSeed.z - 0.5) * uBox.z);
    p.x += sin(uTime * 0.25 + aSeed.w * 40.0) * 14.0;

    vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (uScale / -mv.z);

    float edge = smoothstep(0.0, 0.1, ny) * (1.0 - smoothstep(0.9, 1.0, ny));
    float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed.w * 1.5) + aSeed.w * 30.0);
    vAlpha = edge * uReveal * (0.3 + 0.7 * fract(aSeed.w * 13.7)) * tw;
  }
`;
      FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float a = pow(1.0 - d, 1.8) * vAlpha * uOpacity;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;
    }
  });

  // PortF/src/three/modes/galaxy.ts
  var galaxy_exports = {};
  __export(galaxy_exports, {
    background: () => background,
    hero: () => hero
  });
  function createConstellationBackground(ctx, opts) {
    const { pulses = 0, linkScale = 1, nodeScale = 1 } = opts;
    const { scene, camera, size, compact } = ctx;
    const bag = new DisposableBag();
    let dark = ctx.dark;
    let theme = BG_THEME[dark ? "dark" : "light"];
    const dprBoost = ctx.dpr >= 1.5 ? 1.3 : 1;
    const color = new THREE3.Color();
    const prevSize = { width: size.width, height: size.height };
    const areaDiv = compact ? 17e3 : 13e3;
    const N = Math.round(clamp(size.width * size.height / areaDiv * nodeScale, 34, (compact ? 52 : 78) * nodeScale));
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
    const posAttr = new THREE3.BufferAttribute(new Float32Array(N * 3), 3);
    const glowAttr = new THREE3.BufferAttribute(glow, 1);
    const fadeAttr = new THREE3.BufferAttribute(fade, 1);
    posAttr.setUsage(THREE3.DynamicDrawUsage);
    glowAttr.setUsage(THREE3.DynamicDrawUsage);
    fadeAttr.setUsage(THREE3.DynamicDrawUsage);
    const nodeGeo = bag.track(new THREE3.BufferGeometry());
    nodeGeo.setAttribute("position", posAttr);
    nodeGeo.setAttribute("aSize", new THREE3.BufferAttribute(sizes, 1));
    nodeGeo.setAttribute("aGlow", glowAttr);
    nodeGeo.setAttribute("aFade", fadeAttr);
    const nodeUniforms = () => ({
      ...scaleUniforms(ctx),
      uColor: { value: color },
      uOpacity: { value: theme.node },
      uCore: { value: theme.core }
    });
    const nodeMat = bag.shader(
      { vertexShader: BG_NODE_VERT, fragmentShader: BG_NODE_FRAG, uniforms: nodeUniforms() },
      dark
    );
    const nodePts = new THREE3.Points(nodeGeo, nodeMat);
    nodePts.frustumCulled = false;
    bag.mount(scene, nodePts);
    const maxSegs = N * 9;
    const linePos = new THREE3.BufferAttribute(new Float32Array(maxSegs * 2 * 3), 3);
    const lineAlpha = new THREE3.BufferAttribute(new Float32Array(maxSegs * 2), 1);
    linePos.setUsage(THREE3.DynamicDrawUsage);
    lineAlpha.setUsage(THREE3.DynamicDrawUsage);
    const lineGeo = bag.track(new THREE3.BufferGeometry());
    lineGeo.setAttribute("position", linePos);
    lineGeo.setAttribute("aAlpha", lineAlpha);
    lineGeo.setDrawRange(0, 0);
    const lineMat = bag.shader(
      {
        vertexShader: BG_LINE_VERT,
        fragmentShader: BG_LINE_FRAG,
        uniforms: { uColor: { value: color }, uOpacity: { value: 1 } }
      },
      dark
    );
    const lines = new THREE3.LineSegments(lineGeo, lineMat);
    lines.frustumCulled = false;
    bag.mount(scene, lines);
    const pCount = Math.max(1, pulses);
    const pulsePos = new THREE3.BufferAttribute(new Float32Array(pCount * 3), 3);
    const pulseGlow = new THREE3.BufferAttribute(new Float32Array(pCount), 1);
    const pulseSizes = new THREE3.BufferAttribute(new Float32Array(pCount).fill(8), 1);
    const pulseFade = new THREE3.BufferAttribute(new Float32Array(pCount).fill(1), 1);
    pulsePos.setUsage(THREE3.DynamicDrawUsage);
    pulseGlow.setUsage(THREE3.DynamicDrawUsage);
    const pulseGeo = bag.track(new THREE3.BufferGeometry());
    pulseGeo.setAttribute("position", pulsePos);
    pulseGeo.setAttribute("aSize", pulseSizes);
    pulseGeo.setAttribute("aGlow", pulseGlow);
    pulseGeo.setAttribute("aFade", pulseFade);
    pulseGeo.setDrawRange(0, pulses);
    const pulseMat = bag.shader(
      { vertexShader: BG_NODE_VERT, fragmentShader: BG_NODE_FRAG, uniforms: nodeUniforms() },
      dark
    );
    if (pulses > 0) {
      const pulsePts = new THREE3.Points(pulseGeo, pulseMat);
      pulsePts.frustumCulled = false;
      bag.mount(scene, pulsePts);
    }
    const pulseStates = Array.from({ length: pulses }, () => ({
      a: Math.floor(Math.random() * N),
      b: -1,
      t: Math.random(),
      speed: 0.5 + Math.random() * 0.6
    }));
    const circlePts = [];
    for (let i = 0; i < 128; i++) {
      const ang = i / 128 * Math.PI * 2;
      circlePts.push(Math.cos(ang), Math.sin(ang), 0);
    }
    const circleGeo = bag.track(new THREE3.BufferGeometry());
    circleGeo.setAttribute("position", new THREE3.BufferAttribute(new Float32Array(circlePts), 3));
    const ripples = [];
    const rippleLoops = [];
    const rippleMats = [];
    for (let i = 0; i < MAX_RIPPLES; i++) {
      const rMat = bag.track(
        new THREE3.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: blendForTheme(dark)
        })
      );
      const loop = new THREE3.LineLoop(circleGeo, rMat);
      loop.visible = false;
      loop.frustumCulled = false;
      bag.mount(scene, loop);
      rippleLoops.push(loop);
      rippleMats.push(rMat);
      ripples.push({ x: 0, y: 0, t: 0, active: false });
    }
    const camPos = { x: 0, y: 0 };
    const linkDist = () => clamp(size.width * 0.11, 105, 160) * linkScale;
    const pickNeighbour = (idx, maxDist, prev) => {
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
        const halfW = size.width / 2 * PAD_X;
        const halfH = size.height / 2 * PAD_Y;
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
        const lp = linePos.array;
        const la = lineAlpha.array;
        const pushSeg = (x1, y1, z1, x2, y2, z2, a1, a2) => {
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
        theme = BG_THEME[dark ? "dark" : "light"];
        bag.setBlending(dark, rippleMats);
      },
      pointerDown(x, y) {
        const target = ripples.find((r) => !r.active) ?? ripples.reduce((a, b) => a.t > b.t ? a : b);
        target.x = x;
        target.y = y;
        target.t = 0;
        target.active = true;
      },
      dispose() {
        bag.dispose();
      }
    };
  }
  function createDiscGeo(count) {
    const params = new Float32Array(count * 4);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const inner = Math.random() < 0.12;
      const t = inner ? Math.random() * 0.16 : Math.pow(Math.random(), 0.85);
      const r = R_MIN + 178 * t;
      const spiral = !inner && Math.random() < 0.74;
      const arm = Math.floor(Math.random() * 3);
      const ang = spiral ? arm / 3 * Math.PI * 2 + t * 2.6 + gaussRand() * (0.2 + 0.16 * (1 - t)) : Math.random() * Math.PI * 2;
      const h = gaussRand() * (inner ? 3 : 5 + 16 * t);
      params.set([r, ang, h, Math.random()], i * 4);
      sizes[i] = 1.3 + Math.pow(Math.random(), 4) * 4.8 + (spiral ? 0.25 : 0);
    }
    const geo = new THREE3.BufferGeometry();
    geo.setAttribute("position", new THREE3.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("aParams", new THREE3.BufferAttribute(params, 4));
    geo.setAttribute("aSize", new THREE3.BufferAttribute(sizes, 1));
    return geo;
  }
  function createCometGeo(count) {
    const k = new Float32Array(count);
    for (let i = 0; i < count; i++) k[i] = i / (count - 1);
    const geo = new THREE3.BufferGeometry();
    geo.setAttribute("position", new THREE3.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("aK", new THREE3.BufferAttribute(k, 1));
    return geo;
  }
  function uniqueVertices(edgesGeo) {
    const pos = edgesGeo.getAttribute("position");
    const seen = /* @__PURE__ */ new Set();
    const out = [];
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
    const geo = new THREE3.BufferGeometry();
    geo.setAttribute("position", new THREE3.BufferAttribute(new Float32Array(out), 3));
    return geo;
  }
  function createPlanetGridGeo() {
    const pts = [];
    const addRing = (fn) => {
      for (let i = 0; i < 40; i++) {
        pts.push(
          ...fn(i / 40 * Math.PI * 2),
          ...fn((i + 1) / 40 * Math.PI * 2)
        );
      }
    };
    for (const lat of [-1.05, -0.62, 0, 0.62, 1.05]) {
      addRing((lon) => [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]);
    }
    for (let i = 0; i < 8; i++) {
      const lon = i / 8 * Math.PI * 2;
      addRing((lat) => [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]);
    }
    const geo = new THREE3.BufferGeometry();
    geo.setAttribute("position", new THREE3.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }
  var THREE3, BG_THEME, BG_NODE_VERT, BG_NODE_FRAG, BG_LINE_VERT, BG_LINE_FRAG, Z_MIN, Z_MAX, PAD_X, PAD_Y, RIPPLE_LIFE, RIPPLE_SPEED, MAX_RIPPLES, HERO_COLORS, HERO_LEVELS, DISC_VERT, DISC_FRAG, COMET_VERT, COMET_FRAG, WIRE_PT_VERT, WIRE_PT_FRAG, R_MIN, R_MAX, POLYHEDRA, COMETS, hero, background;
  var init_galaxy = __esm({
    "PortF/src/three/modes/galaxy.ts"() {
      "use strict";
      THREE3 = __toESM(require_three(), 1);
      init_util();
      init_dust();
      BG_THEME = {
        dark: { line: 0.42, node: 1, core: 0.5 },
        light: { line: 0.56, node: 0.9, core: 0 }
      };
      BG_NODE_VERT = `
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
      BG_NODE_FRAG = `
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
      BG_LINE_VERT = `
  attribute float aAlpha;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
      BG_LINE_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;
      Z_MIN = -380;
      Z_MAX = 140;
      PAD_X = 1.08;
      PAD_Y = 1.16;
      RIPPLE_LIFE = 1.7;
      RIPPLE_SPEED = 560;
      MAX_RIPPLES = 3;
      HERO_COLORS = {
        dark: { a: "#7dd3fc", b: "#3b82f6", c: "#2dd4bf", wire: "#7dd3fc" },
        light: { a: "#0284c7", b: "#2563eb", c: "#0d9488", wire: "#2563eb" }
      };
      HERO_LEVELS = {
        dark: { wire: 0.34, halo: 0.95, dust: 0.75, comet: 1, core: 0.5 },
        light: { wire: 0.3, halo: 0.8, dust: 0.6, comet: 0.95, core: 0 }
      };
      DISC_VERT = `
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
      DISC_FRAG = `
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
      COMET_VERT = `
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
      COMET_FRAG = `
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
      WIRE_PT_VERT = `
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uScale;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (uScale / -mv.z);
  }
`;
      WIRE_PT_FRAG = `
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
      R_MIN = 262;
      R_MAX = 440;
      POLYHEDRA = [
        { fx: 0.94, fy: 0.15, z: -140, radius: 74, kind: "geodesic", spin: [0.11, 0.17], mobile: true, delay: 0.9 },
        { fx: 0.5, fy: 0.13, z: -40, radius: 38, kind: "icosa", spin: [0.19, 0.13], mobile: false, delay: 1.2 },
        { fx: 0.52, fy: 0.84, z: 70, radius: 48, kind: "dodeca", spin: [0.14, 0.21], mobile: false, delay: 1.5 },
        { fx: 0.05, fy: 0.9, z: 20, radius: 44, kind: "octa", spin: [0.2, 0.12], mobile: true, delay: 1.8 }
      ];
      COMETS = [
        { radii: [318, 292], tilt: [-0.95, 0.45], speed: 0.42, trail: 1.5, dir: 1, phase: 0.4 },
        { radii: [372, 340], tilt: [-0.78, -0.55], speed: 0.3, trail: 1.25, dir: -1, phase: 2.7 },
        { radii: [296, 268], tilt: [-1.1, 0.05], speed: 0.55, trail: 1.7, dir: 1, phase: 4.6 }
      ];
      hero = (ctx) => {
        const { scene, rig, size, compact } = ctx;
        const bag = new DisposableBag();
        const palette = new ThemePalette(HERO_COLORS, ctx.dark);
        let levels = HERO_LEVELS[ctx.dark ? "dark" : "light"];
        let isDark = ctx.dark;
        const root = bag.mount(rig ?? scene, new THREE3.Group());
        const planetSphereGeo = bag.track(new THREE3.SphereGeometry(1, 32, 22));
        const planetGridGeo = bag.track(createPlanetGridGeo());
        const planets = [
          { kind: "earth", color: "#35d7ff", orbitX: 246, orbitY: 184, phase: 0.35, speed: 0.095, size: compact ? 13 : 19 },
          { kind: "mars", color: "#ff668d", orbitX: 292, orbitY: 214, phase: 2.05, speed: -0.075, size: compact ? 9 : 13 },
          { kind: "jupiter", color: "#ffd166", orbitX: 324, orbitY: 244, phase: 3.72, speed: 0.052, size: compact ? 17 : 25 },
          { kind: "neptune", color: "#9b8cff", orbitX: 274, orbitY: 270, phase: 5.35, speed: -0.043, size: compact ? 14 : 21 }
        ].map((spec, idx) => {
          const material = bag.track(
            new THREE3.MeshBasicMaterial({
              color: spec.color,
              blending: blendForTheme(ctx.dark),
              transparent: true,
              opacity: 0,
              depthWrite: false
            })
          );
          const gridMaterial = bag.track(
            new THREE3.LineBasicMaterial({
              color: spec.color,
              blending: blendForTheme(ctx.dark),
              transparent: true,
              opacity: 0,
              depthWrite: false
            })
          );
          const mesh = new THREE3.Mesh(planetSphereGeo, material);
          mesh.scale.setScalar(spec.size);
          mesh.renderOrder = 2;
          const grid = new THREE3.LineSegments(planetGridGeo, gridMaterial);
          grid.scale.setScalar(spec.size * 1.015);
          grid.rotation.set(0.25 + idx * 0.18, idx * 0.7, -0.2 + idx * 0.12);
          grid.renderOrder = 3;
          const group = bag.mount(root, new THREE3.Group());
          group.add(mesh, grid);
          return { ...spec, group, grid, material, gridMaterial, angle: spec.phase };
        });
        const discGeo = bag.track(createDiscGeo(compact ? 3e3 : 7e3));
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
              uCore: { value: levels.core }
            }
          },
          ctx.dark
        );
        const discPts = new THREE3.Points(discGeo, discMat);
        discPts.frustumCulled = false;
        const discGroup = bag.mount(root, new THREE3.Group());
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
                uCore: { value: levels.core }
              }
            },
            ctx.dark
          );
          const pts = new THREE3.Points(cometGeo, mat);
          pts.frustumCulled = false;
          const grp = bag.mount(root, new THREE3.Group());
          grp.rotation.set(spec.tilt[0], 0, spec.tilt[1]);
          grp.add(pts);
          return { spec, material: mat, phase: spec.phase };
        });
        const dust = createDustField(ctx, bag, { count: compact ? 260 : 640, color: palette.cur.a });
        const wireLineMat = bag.track(
          new THREE3.LineBasicMaterial({
            color: palette.cur.wire,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: blendForTheme(ctx.dark)
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
              uCore: { value: levels.core }
            }
          },
          ctx.dark
        );
        const makeSolid = (kind) => {
          switch (kind) {
            case "icosa":
              return new THREE3.IcosahedronGeometry(1, 0);
            case "octa":
              return new THREE3.OctahedronGeometry(1, 0);
            case "dodeca":
              return new THREE3.DodecahedronGeometry(1, 0);
            case "geodesic":
              return new THREE3.IcosahedronGeometry(1, 1);
          }
        };
        const polys = POLYHEDRA.filter((p) => !compact || p.mobile).map((spec) => {
          const solid = makeSolid(spec.kind);
          const edges = bag.track(new THREE3.EdgesGeometry(solid, 1));
          const verts = bag.track(uniqueVertices(edges));
          solid.dispose();
          const grp = bag.mount(scene, new THREE3.Group());
          const segs = new THREE3.LineSegments(edges, wireLineMat);
          const pts = new THREE3.Points(verts, wirePtMat);
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
            const planetAlpha = easeOutCubic((elapsed - 0.65) / 1.8) * fade;
            for (const pl of planets) {
              pl.angle += dt * pl.speed * (1 + progress * 0.4);
              pl.group.position.set(
                Math.cos(pl.angle) * pl.orbitX,
                Math.sin(pl.angle) * pl.orbitY + progress * 24,
                Math.sin(pl.angle * 1.7) * 55 - 35
              );
              pl.grid.rotation.y += dt * (pl.kind === "jupiter" ? 0.28 : 0.18);
              pl.material.opacity = planetAlpha * (isDark ? 0.1 : 0.045);
              pl.gridMaterial.opacity = planetAlpha * (isDark ? 0.88 : 0.62);
            }
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
            isDark = nextDark;
            levels = HERO_LEVELS[nextDark ? "dark" : "light"];
            palette.setTheme(nextDark);
            bag.setBlending(nextDark, [
              wireLineMat,
              ...planets.flatMap((pl) => [pl.material, pl.gridMaterial])
            ]);
          },
          dispose() {
            bag.dispose();
          }
        };
      };
      background = (ctx) => createConstellationBackground(ctx, {});
    }
  });

  // PortF/src/three/modes/neural.ts
  var neural_exports = {};
  __export(neural_exports, {
    background: () => background2,
    hero: () => hero2
  });
  function buildShell(spec, density, pulseCount) {
    const count = Math.round(spec.count * density);
    const pts = [];
    for (let i = 0; i < count; i++) {
      const y = 1 - 2 * (i + 0.5) / count;
      const rad = Math.sqrt(1 - y * y);
      const theta = i * GOLDEN_ANGLE;
      const r = spec.radius * (0.95 + Math.random() * 0.09);
      pts.push([Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r]);
    }
    const edgeSet = /* @__PURE__ */ new Set();
    const edges = [];
    for (let i = 0; i < count; i++) {
      const dists = [];
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
    const nodeGeometry = new THREE4.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE4.BufferAttribute(nPos, 3));
    nodeGeometry.setAttribute("aSeed", new THREE4.BufferAttribute(nSeeds, 2));
    nodeGeometry.setAttribute("aSize", new THREE4.BufferAttribute(nSizes, 1));
    const ePos = new Float32Array(edges.length * 6);
    const eSeeds = new Float32Array(edges.length * 2);
    edges.forEach(([a, b], idx) => {
      ePos.set(pts[a], idx * 6);
      ePos.set(pts[b], idx * 6 + 3);
      eSeeds[idx * 2] = nSeeds[a * 2];
      eSeeds[idx * 2 + 1] = nSeeds[b * 2];
    });
    const edgeGeometry = new THREE4.BufferGeometry();
    edgeGeometry.setAttribute("position", new THREE4.BufferAttribute(ePos, 3));
    edgeGeometry.setAttribute("aSeed", new THREE4.BufferAttribute(eSeeds, 1));
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
    const pulseGeometry = new THREE4.BufferGeometry();
    pulseGeometry.setAttribute("position", new THREE4.BufferAttribute(new Float32Array(pulseCount * 3), 3));
    pulseGeometry.setAttribute("aA", new THREE4.BufferAttribute(pA, 3));
    pulseGeometry.setAttribute("aB", new THREE4.BufferAttribute(pB, 3));
    pulseGeometry.setAttribute("aRate", new THREE4.BufferAttribute(pRate, 3));
    return { nodeGeometry, edgeGeometry, pulseGeometry };
  }
  var THREE4, BG_PALETTE, BG_LEVELS, FIBER_COMMON, FIBER_LINE_VERT, FIBER_PULSE_VERT, FIBER_NODE_VERT, FIBER_LINE_FRAG, FIBER_PULSE_FRAG, FIBER_NODE_FRAG, background2, HERO_PALETTE, HERO_LEVELS2, SHELL_COMMON, SHELL_NODE_VERT, SHELL_NODE_FRAG, SHELL_EDGE_VERT, SHELL_EDGE_FRAG, SHELL_PULSE_VERT, SHELL_PULSE_FRAG, SHELL_SPECS, GOLDEN_ANGLE, hero2;
  var init_neural = __esm({
    "PortF/src/three/modes/neural.ts"() {
      "use strict";
      THREE4 = __toESM(require_three(), 1);
      init_util();
      init_dust();
      BG_PALETTE = {
        dark: { fiber: "#a78bfa", pulse: "#67e8f9", node: "#f0abfc" },
        light: { fiber: "#7c3aed", pulse: "#0891b2", node: "#6d28d9" }
      };
      BG_LEVELS = {
        dark: { fiber: 0.5, pulse: 1, node: 0.9 },
        light: { fiber: 0.5, pulse: 0.9, node: 0.8 }
      };
      FIBER_COMMON = `
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
      FIBER_LINE_VERT = `
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
      FIBER_PULSE_VERT = `
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
      FIBER_NODE_VERT = `
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
      FIBER_LINE_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    gl_FragColor = vec4(uColor, vA * uOpacity);
    #include <colorspace_fragment>
  }
`;
      FIBER_PULSE_FRAG = `
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
      FIBER_NODE_FRAG = `
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
      background2 = (ctx) => {
        const bag = new DisposableBag();
        const palette = new ThemePalette(BG_PALETTE, ctx.dark);
        let levels = BG_LEVELS[ctx.dark ? "dark" : "light"];
        const { size, compact } = ctx;
        const fiberCount = compact ? 9 : 16;
        const pulseCount = compact ? 14 : 28;
        const fibers = Array.from({ length: fiberCount }, (_, idx2) => ({
          F: [
            idx2 / fiberCount * 2 - 1 + (Math.random() - 0.5) * 0.12,
            26 + Math.random() * 70,
            0.6 + Math.random() * 1.1,
            Math.random() * 6.28
          ],
          z: -380 + Math.random() * 520
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
        const lineGeo = bag.track(new THREE4.BufferGeometry());
        lineGeo.setAttribute("position", new THREE4.BufferAttribute(new Float32Array(idx * 3), 3));
        lineGeo.setAttribute("aT", new THREE4.BufferAttribute(aT, 1));
        lineGeo.setAttribute("aF", new THREE4.BufferAttribute(aF, 4));
        lineGeo.setAttribute("aZ", new THREE4.BufferAttribute(aZ, 1));
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
            Math.random() < 0.5 ? 1 : -1
          ];
          for (let t = 0; t < 5; t++) {
            const k = i * 5 + t;
            pF.set(f.F, k * 4);
            pZ[k] = f.z;
            pR.set(r, k * 4);
            pTail[k] = t / 4;
          }
        }
        const pulseGeo = bag.track(new THREE4.BufferGeometry());
        pulseGeo.setAttribute("position", new THREE4.BufferAttribute(new Float32Array(pVerts * 3), 3));
        pulseGeo.setAttribute("aF", new THREE4.BufferAttribute(pF, 4));
        pulseGeo.setAttribute("aZ", new THREE4.BufferAttribute(pZ, 1));
        pulseGeo.setAttribute("aR", new THREE4.BufferAttribute(pR, 4));
        pulseGeo.setAttribute("aTail", new THREE4.BufferAttribute(pTail, 1));
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
        const nodeGeo = bag.track(new THREE4.BufferGeometry());
        nodeGeo.setAttribute("position", new THREE4.BufferAttribute(new Float32Array(nVerts * 3), 3));
        nodeGeo.setAttribute("aF", new THREE4.BufferAttribute(nF, 4));
        nodeGeo.setAttribute("aZ", new THREE4.BufferAttribute(nZ, 1));
        nodeGeo.setAttribute("aN", new THREE4.BufferAttribute(nN, 2));
        const shared = {
          uTime: { value: 0 },
          uHalfW: { value: size.width / 2 },
          uHalfH: { value: size.height / 2 },
          uCam: { value: ctx.camZ() },
          uScroll: { value: 0 },
          uPixelRatio: { value: ctx.dpr },
          uReveal: { value: 0 },
          uPointer: { value: { x: 1e5, y: 1e5 } },
          uPointerPower: { value: 0 }
        };
        const lineMat = bag.shader(
          {
            vertexShader: FIBER_LINE_VERT,
            fragmentShader: FIBER_LINE_FRAG,
            uniforms: { ...shared, uColor: { value: palette.cur.fiber }, uOpacity: { value: levels.fiber } }
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
              uOpacity: { value: levels.pulse }
            }
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
              uOpacity: { value: levels.node }
            }
          },
          ctx.dark
        );
        for (const obj of [
          new THREE4.LineSegments(lineGeo, lineMat),
          new THREE4.Points(nodeGeo, nodeMat),
          new THREE4.Points(pulseGeo, pulseMat)
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
            levels = BG_LEVELS[nextDark ? "dark" : "light"];
            palette.setTheme(nextDark);
            bag.setBlending(nextDark);
          },
          dispose() {
            bag.dispose();
          }
        };
      };
      HERO_PALETTE = {
        dark: { node: "#7dd3fc", edge: "#38bdf8", hot: "#f0f9ff", pulse: "#c4b5fd" },
        light: { node: "#1d4ed8", edge: "#3b82f6", hot: "#1e3a8a", pulse: "#7c3aed" }
      };
      HERO_LEVELS2 = {
        dark: { opacity: 1, edge: 1, core: 0.55, dust: 0.55 },
        light: { opacity: 0.9, edge: 1.15, core: 0, dust: 0.45 }
      };
      SHELL_COMMON = `
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
      SHELL_NODE_VERT = `
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
      SHELL_NODE_FRAG = `
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
      SHELL_EDGE_VERT = `
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
      SHELL_EDGE_FRAG = `
  uniform vec3  uEdge;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uEdge, vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;
      SHELL_PULSE_VERT = `
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
      SHELL_PULSE_FRAG = `
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
      SHELL_SPECS = [
        { radius: 300, count: 120, neighbours: 3, speed: 0.07, tilt: 0.42, roll: 0.2 },
        { radius: 376, count: 150, neighbours: 3, speed: -0.045, tilt: -0.3, roll: -0.18 }
      ];
      GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
      hero2 = (ctx) => {
        const { rig, compact } = ctx;
        const bag = new DisposableBag();
        const palette = new ThemePalette(HERO_PALETTE, ctx.dark);
        let levels = HERO_LEVELS2[ctx.dark ? "dark" : "light"];
        const root = bag.mount(rig ?? ctx.scene, new THREE4.Group());
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
          uPulse: { value: 0 }
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
              uniforms: { ...shared, ...rUniform, uOpacity: edgeOpacity }
            },
            ctx.dark
          );
          const pMat = bag.shader(
            { vertexShader: SHELL_PULSE_VERT, fragmentShader: SHELL_PULSE_FRAG, uniforms: { ...shared, ...rUniform } },
            ctx.dark
          );
          const grp = bag.mount(root, new THREE4.Group());
          const eLines = new THREE4.LineSegments(g.edgeGeometry, eMat);
          const nPts = new THREE4.Points(g.nodeGeometry, nMat);
          const pPts = new THREE4.Points(g.pulseGeometry, pMat);
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
          sizeRange: 2.2
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
            levels = HERO_LEVELS2[nextDark ? "dark" : "light"];
            palette.setTheme(nextDark);
            bag.setBlending(nextDark);
          },
          pointerDown(x, y) {
            shared.uBurstPos.value = { x, y };
            burstAge = 0;
          },
          dispose() {
            bag.dispose();
          }
        };
      };
    }
  });

  // PortF/src/three/modes/code.ts
  var code_exports = {};
  __export(code_exports, {
    background: () => background3,
    hero: () => hero3
  });
  function createBannerTexture() {
    const w = 1024;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = 96 * BREACH_MESSAGES.length;
    const g = c.getContext("2d");
    if (g) {
      g.fillStyle = "#fff";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = '800 48px "JetBrains Mono", "Fira Code", Consolas, "SF Mono", Menlo, "Courier New", monospace';
      BREACH_MESSAGES.forEach((msg, i) => g.fillText(msg, w / 2, i * 96 + 50));
    }
    const tex = new THREE5.CanvasTexture(c);
    tex.flipY = false;
    tex.generateMipmaps = false;
    tex.minFilter = THREE5.LinearFilter;
    tex.magFilter = THREE5.LinearFilter;
    return tex;
  }
  function createWordsTexture() {
    const c = document.createElement("canvas");
    c.width = WORD_W;
    c.height = WORD_ROW_H * HACKER_WORDS.length;
    const g = c.getContext("2d");
    if (g) {
      g.fillStyle = "#fff";
      g.textAlign = "left";
      g.textBaseline = "middle";
      g.font = '700 30px "JetBrains Mono", "Fira Code", Consolas, "SF Mono", Menlo, "Courier New", monospace';
      HACKER_WORDS.forEach((w, i) => g.fillText(w, 8, i * WORD_ROW_H + WORD_ROW_H / 2 + 2));
    }
    const tex = new THREE5.CanvasTexture(c);
    tex.flipY = false;
    tex.generateMipmaps = false;
    tex.minFilter = THREE5.LinearFilter;
    tex.magFilter = THREE5.LinearFilter;
    return tex;
  }
  function createGlyphTexture() {
    const c = document.createElement("canvas");
    c.width = 384;
    c.height = 192;
    const g = c.getContext("2d");
    if (g) {
      g.fillStyle = "#fff";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = '700 34px "JetBrains Mono", "Fira Code", Consolas, "SF Mono", Menlo, "Courier New", monospace';
      [...GLYPHS].forEach((ch, idx) => {
        g.fillText(ch, idx % ATLAS_COLS * 48 + 24, Math.floor(idx / ATLAS_COLS) * 48 + 26);
      });
    }
    const tex = new THREE5.CanvasTexture(c);
    tex.flipY = false;
    tex.generateMipmaps = false;
    tex.minFilter = THREE5.LinearFilter;
    tex.magFilter = THREE5.LinearFilter;
    return tex;
  }
  function createCodeScene(ctx, opts, heroCtx) {
    const bag = new DisposableBag();
    const palette = new ThemePalette(PALETTE, ctx.dark);
    let dark = ctx.dark;
    const { size } = ctx;
    const rows = Math.ceil(Math.max(size.height, 1200) * 1.7 / opts.cell);
    const count = opts.columns * rows;
    const cells = new Float32Array(count * 4);
    let k = 0;
    for (let col = 0; col < opts.columns; col++) {
      const cx = (col + Math.random() * 0.8) / opts.columns * 2 - 1;
      const cz = Z_FAR + Math.random() * 650;
      const seed = Math.random();
      for (let r = 0; r < rows; r++) {
        cells.set([cx, r, cz, seed], k * 4);
        k++;
      }
    }
    const streamGeo = bag.track(new THREE5.BufferGeometry());
    streamGeo.setAttribute("position", new THREE5.BufferAttribute(new Float32Array(count * 3), 3));
    streamGeo.setAttribute("aCell", new THREE5.BufferAttribute(cells, 4));
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
      uHalfW: { value: size.width / 2 * 1.06 },
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
      uOpacity: { value: opts.opacity[dark ? "dark" : "light"] }
    };
    const streamPts = new THREE5.Points(
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
      uBreachKeep: { value: opts.hero ? 0.05 : 1 }
    };
    const hudMesh = new THREE5.Mesh(
      bag.track(new THREE5.PlaneGeometry(2, 2)),
      bag.shader({ vertexShader: CLIP_QUAD_VERT, fragmentShader: HUD_FRAG, uniforms: hudUniforms, depthTest: false }, dark)
    );
    hudMesh.frustumCulled = false;
    hudMesh.renderOrder = 10;
    bag.mount(ctx.scene, hudMesh);
    const maskUniforms = {
      uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
      uRes: { value: { x: size.width, y: size.height } },
      uColor: { value: new THREE5.Color(dark ? "#0a1120" : "#f1f5f9") },
      uStrength: { value: 0 }
    };
    const maskMesh = new THREE5.Mesh(
      bag.track(new THREE5.PlaneGeometry(2, 2)),
      bag.track(
        new THREE5.ShaderMaterial({
          vertexShader: CLIP_QUAD_VERT,
          fragmentShader: MASK_FRAG,
          uniforms: maskUniforms,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          blending: THREE5.NormalBlending
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
      uSplit: { value: 4e-3 },
      uTime: { value: 0 },
      uAlert: { value: new THREE5.Color("#ff3b5c") },
      uCyan: { value: new THREE5.Color("#26f2ff") }
    };
    const bannerMesh = new THREE5.Mesh(
      bag.track(new THREE5.PlaneGeometry(1, 96 / 1024)),
      bag.shader({ vertexShader: WORLD_QUAD_VERT, fragmentShader: BANNER_FRAG, uniforms: bannerUniforms, depthTest: false }, dark)
    );
    bannerMesh.frustumCulled = false;
    bannerMesh.renderOrder = 11;
    bannerMesh.visible = false;
    if (opts.hero) bag.mount(ctx.scene, bannerMesh);
    const frameUniforms = {
      uSize: { value: { x: 600, y: 120 } },
      uAlpha: { value: 0 },
      uAlert: { value: new THREE5.Color("#ff3b5c") }
    };
    const frameMesh = new THREE5.Mesh(
      bag.track(new THREE5.PlaneGeometry(1, 1)),
      bag.track(
        new THREE5.ShaderMaterial({
          vertexShader: WORLD_QUAD_VERT,
          fragmentShader: FRAME_FRAG,
          uniforms: frameUniforms,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          blending: THREE5.NormalBlending
        })
      )
    );
    frameMesh.frustumCulled = false;
    frameMesh.renderOrder = 10.5;
    frameMesh.visible = false;
    if (opts.hero) bag.mount(ctx.scene, frameMesh);
    const baseQuad = new THREE5.PlaneGeometry(1, 1);
    const instGeo = bag.track(new THREE5.InstancedBufferGeometry());
    instGeo.index = baseQuad.index;
    instGeo.setAttribute("position", baseQuad.getAttribute("position"));
    instGeo.setAttribute("uv", baseQuad.getAttribute("uv"));
    const wSeeds = new Float32Array(opts.words * 2);
    for (let i = 0; i < opts.words; i++) {
      wSeeds[i * 2] = i + Math.random();
      wSeeds[i * 2 + 1] = 5.5 + Math.random() * 4.5;
    }
    instGeo.setAttribute("aSeed", new THREE5.InstancedBufferAttribute(wSeeds, 2));
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
      uOpacity: { value: opts.wordOpacity[dark ? "dark" : "light"] }
    };
    const wordsMesh = new THREE5.Mesh(
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
    const triggerBreach = (dur) => {
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
            const bw = fitsRight ? Math.min(680, (rightBound - leftBound) / 1.07) : Math.min(680, size.width - 28);
            const bh = 96 / 1024 * bw;
            const maxX = size.width / 2 - bw * 1.07 / 2 - 8;
            const bx = fitsRight ? (leftBound + rightBound) / 2 : Math.max(-maxX, Math.min(maxX, heroCtx?.rig ? heroCtx.rig.position.x : 0));
            const by = Math.min((heroCtx?.rig ? heroCtx.rig.position.y : 0) + 268 * rigScale, size.height / 2 - 128);
            const tail = 0.55;
            let alpha = 1;
            let glitching = 0.12;
            if (breachAge < 0.3) {
              alpha = Math.sin(elapsed * 90) > 0 ? 1 : 0.15;
              glitching = 1;
            } else if (breachAge > breachDur - tail) {
              alpha = (breachDur - breachAge) / tail * (Math.sin(elapsed * 70) > -0.2 ? 1 : 0.2);
              glitching = 1;
            }
            bannerMesh.scale.set(bw, bw, 1);
            bannerMesh.position.set(bx + (Math.random() - 0.5) * glitching * 6, by, 0);
            frameMesh.scale.set(bw * 1.07, bh * 2.1, 1);
            frameMesh.position.set(bx, by, 0);
            frameUniforms.uSize.value = { x: bw * 1.07, y: bh * 2.1 };
            frameUniforms.uAlpha.value = alpha * fade;
            bannerUniforms.uAlpha.value = alpha * fade;
            bannerUniforms.uSplit.value = 4e-4 + 0.013 * (glitching > 0.5 ? 1 : 0);
            bannerUniforms.uTime.value = elapsed;
          }
        }
        const speedBoost = opts.hero ? 0 : Math.min(scrollSpeed / 450, 4);
        travel += dt * (1 + burst * 2.4 + speedBoost);
        streamUniforms.uTime.value = elapsed;
        streamUniforms.uTravel.value = travel * 0.5;
        streamUniforms.uReveal.value = easeOutCubic(elapsed / 2.6);
        streamUniforms.uOpacity.value = opts.opacity[dark ? "dark" : "light"] * fade;
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
        wordsUniforms.uOpacity.value = opts.wordOpacity[dark ? "dark" : "light"];
        wordsUniforms.uUnit.value = heroCtx?.rig ? heroCtx.rig.scale.x : 1;
        if (heroCtx) {
          const av = avoidUniformVec(heroCtx.avoid);
          wordsUniforms.uAvoid.value = av;
          maskUniforms.uAvoid.value = av;
          streamUniforms.uFocus.value = {
            x: heroCtx.rig ? heroCtx.rig.position.x : 0,
            y: heroCtx.rig ? heroCtx.rig.position.y : 0
          };
          streamUniforms.uAvoid.value = av;
          hudUniforms.uAvoid.value = av;
        }
      },
      resize() {
        streamUniforms.uCam.value = ctx.camZ();
        streamUniforms.uHalfW.value = size.width / 2 * 1.06;
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
        maskUniforms.uColor.value.set(nextDark ? "#0a1120" : "#f1f5f9");
      },
      dispose() {
        bag.dispose();
      }
    };
  }
  var THREE5, PALETTE, GLYPHS, ATLAS_COLS, ATLAS_ROWS, BREACH_MESSAGES, HACKER_WORDS, WORD_ROW_H, WORD_W, Z_NEAR, Z_FAR, STREAM_VERT, STREAM_FRAG, CLIP_QUAD_VERT, HUD_FRAG, WORLD_QUAD_VERT, BANNER_FRAG, MASK_FRAG, FRAME_FRAG, WORDS_VERT, WORDS_FRAG, hero3, background3;
  var init_code = __esm({
    "PortF/src/three/modes/code.ts"() {
      "use strict";
      THREE5 = __toESM(require_three(), 1);
      init_util();
      PALETTE = {
        dark: { body: "#19f58b", head: "#d9ffec", alert: "#ff2a55", cyan: "#26f2ff" },
        light: { body: "#047857", head: "#022c22", alert: "#be123c", cyan: "#0e7490" }
      };
      GLYPHS = "0123456789ABCDEF>_#$/\\|[]{}<>=+*";
      ATLAS_COLS = 8;
      ATLAS_ROWS = 4;
      BREACH_MESSAGES = [
        "[!] SYSTEM BREACH DETECTED",
        "ACCESS DENIED :: ROOT LOCKED",
        "FIREWALL COMPROMISED",
        "KERNEL PANIC  0xDEADBEEF",
        "UNAUTHORIZED ACCESS",
        "INTRUSION IN PROGRESS"
      ];
      HACKER_WORDS = [
        "> sudo su",
        "> nmap -sS 10.0.0.1",
        "ROOT ACCESS",
        "0DAY EXPLOIT",
        "BRUTE FORCE 87%",
        "INJECTING PAYLOAD...",
        "FIREWALL: OFFLINE",
        "DECRYPTING...",
        "BACKDOOR OPEN",
        "PORT 22 OPEN",
        "TRACE ROUTE FAILED",
        "SHELL SPAWNED",
        "> rm -rf /",
        "SQL INJECTION",
        "PACKET SNIFFER",
        "KEYLOGGER ACTIVE"
      ];
      WORD_ROW_H = 56;
      WORD_W = 512;
      Z_NEAR = 90;
      Z_FAR = -560;
      STREAM_VERT = `
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
      STREAM_FRAG = `
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
      CLIP_QUAD_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;
      HUD_FRAG = `
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
      WORLD_QUAD_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
      BANNER_FRAG = `
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
      MASK_FRAG = `
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
      FRAME_FRAG = `
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
      WORDS_VERT = `
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
      WORDS_FRAG = `
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
      hero3 = (ctx) => createCodeScene(
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
          hero: true
        },
        ctx
      );
      background3 = (ctx) => createCodeScene(ctx, {
        columns: ctx.compact ? 14 : 34,
        cell: ctx.compact ? 18 : 22,
        opacity: { dark: 0.2, light: 0.17 },
        focusMin: 1,
        effects: 0.4,
        hudOpacity: 0.5,
        words: ctx.compact ? 4 : 8,
        wordOpacity: { dark: 0.3, light: 0.28 },
        hero: false
      });
    }
  });

  // PortF/src/three/modes/waves.ts
  var waves_exports = {};
  __export(waves_exports, {
    background: () => background4,
    hero: () => hero4
  });
  function createArcGeo(bag, from, to, segs) {
    const geo = bag.track(new THREE6.BufferGeometry());
    const pts = [];
    const diff = new THREE6.Vector3().subVectors(to, from);
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const jx = i > 0 && i < segs ? (Math.random() - 0.5) * 30 : 0;
      const jy = i > 0 && i < segs ? (Math.random() - 0.5) * 20 : 0;
      pts.push(from.x + diff.x * t + jx, from.y + diff.y * t + jy, from.z);
    }
    geo.setAttribute("position", new THREE6.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }
  var THREE6, PALETTE2, LEVELS, OCEAN_VERT, OCEAN_FRAG, ORB_VERT, ORB_FRAG, RING_VERT, RING_FRAG, hero4, BG_CURTAIN_VERT, BG_CURTAIN_FRAG, background4;
  var init_waves = __esm({
    "PortF/src/three/modes/waves.ts"() {
      "use strict";
      THREE6 = __toESM(require_three(), 1);
      init_util();
      PALETTE2 = {
        dark: { deep: "#2563eb", crest: "#7dd3fc", foam: "#f0f9ff" },
        light: { deep: "#1d4ed8", crest: "#0284c7", foam: "#0f766e" }
      };
      LEVELS = {
        dark: { opacity: 1 },
        light: { opacity: 0.85 }
      };
      OCEAN_VERT = `
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
      OCEAN_FRAG = `
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
      ORB_VERT = `
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
      ORB_FRAG = `
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
      RING_VERT = `
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
      RING_FRAG = `
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
      hero4 = (ctx) => {
        const bag = new DisposableBag();
        const palette = new ThemePalette(PALETTE2, ctx.dark);
        let levels = LEVELS[ctx.dark ? "dark" : "light"];
        const { size } = ctx;
        const cols = ctx.compact ? 70 : 130;
        const rows = ctx.compact ? 44 : 78;
        const total = cols * rows;
        const grid = new Float32Array(total * 3);
        let idx = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const jit = (Math.random() - 0.5) * 0.5;
            grid.set([(c + jit) / (cols - 1) * 2 - 1, r / (rows - 1), Math.random()], idx * 3);
            idx++;
          }
        }
        const oceanGeo = bag.track(new THREE6.BufferGeometry());
        oceanGeo.setAttribute("position", new THREE6.BufferAttribute(new Float32Array(total * 3), 3));
        oceanGeo.setAttribute("aGrid", new THREE6.BufferAttribute(grid, 3));
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
          uOpacity: { value: levels.opacity }
        };
        const oceanPts = new THREE6.Points(
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
        const orbGeo = bag.track(new THREE6.BufferGeometry());
        orbGeo.setAttribute("position", new THREE6.BufferAttribute(orbPos, 3));
        orbGeo.setAttribute("aPhase", new THREE6.BufferAttribute(orbPhase, 1));
        orbGeo.setAttribute("aRadius", new THREE6.BufferAttribute(orbRadius, 1));
        orbGeo.setAttribute("aSpeed", new THREE6.BufferAttribute(orbSpeed, 1));
        orbGeo.setAttribute("aSize", new THREE6.BufferAttribute(orbSize, 1));
        const orbUniforms = {
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uPointer: { value: { x: 1e5, y: 1e5 } },
          uPointerPower: { value: 0 },
          uColor: { value: new THREE6.Color("#7dd3fc") },
          uColorHot: { value: new THREE6.Color("#f0f9ff") }
        };
        const orbMat = bag.track(
          new THREE6.ShaderMaterial({
            vertexShader: ORB_VERT,
            fragmentShader: ORB_FRAG,
            uniforms: orbUniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE6.AdditiveBlending
          })
        );
        const orbPts = new THREE6.Points(orbGeo, orbMat);
        orbPts.frustumCulled = false;
        bag.mount(ctx.scene, orbPts);
        const ringSpecs = ctx.compact ? [
          { r: 200, speed: 0.6, phase: 0, color: "#2563eb" },
          { r: 300, speed: 0.4, phase: 2.1, color: "#7dd3fc" }
        ] : [
          { r: 180, speed: 0.7, phase: 0, color: "#2563eb" },
          { r: 280, speed: 0.45, phase: 1.5, color: "#7dd3fc" },
          { r: 380, speed: 0.3, phase: 3, color: "#0ea5e9" },
          { r: 460, speed: 0.2, phase: 0.8, color: "#38bdf8" }
        ];
        const rings = [];
        for (const spec of ringSpecs) {
          const n = ctx.compact ? 64 : 128;
          const rGeo = bag.track(new THREE6.BufferGeometry());
          const pts = [];
          for (let i = 0; i < n; i++) {
            const ang = i / n * Math.PI * 2;
            pts.push(Math.cos(ang) * spec.r, Math.sin(ang) * spec.r * 0.28, 0);
          }
          rGeo.setAttribute("position", new THREE6.BufferAttribute(new Float32Array(pts), 3));
          const rMat = bag.track(
            new THREE6.ShaderMaterial({
              vertexShader: RING_VERT,
              fragmentShader: RING_FRAG,
              uniforms: {
                uTime: { value: 0 },
                uReveal: { value: 0 },
                uSpeed: { value: spec.speed },
                uPhase: { value: spec.phase },
                uPointer: { value: { x: 1e5, y: 1e5 } },
                uPointerPower: { value: 0 },
                uColor: { value: new THREE6.Color(spec.color) },
                uColorHot: { value: new THREE6.Color("#f0f9ff") }
              },
              transparent: true,
              depthWrite: false,
              blending: THREE6.AdditiveBlending
            })
          );
          const rPts = new THREE6.Points(rGeo, rMat);
          rPts.frustumCulled = false;
          bag.mount(ctx.scene, rPts);
          rings.push({ mat: rMat });
        }
        const arcs = [];
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
          const aGeo = createArcGeo(bag, new THREE6.Vector3(x1, y1, 0), new THREE6.Vector3(x2, y2, 0), 10);
          const aMat = bag.track(
            new THREE6.LineBasicMaterial({
              color: 8246268,
              transparent: true,
              opacity: 0.9,
              blending: THREE6.AdditiveBlending,
              depthWrite: false
            })
          );
          const line = new THREE6.Line(aGeo, aMat);
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
              a.mat.opacity = k < 0.4 ? k / 0.4 * 0.9 : (1 - (k - 0.4) / 0.6) * 0.9 * (0.5 + 0.5 * Math.sin(simTime * 40));
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
            levels = LEVELS[nextDark ? "dark" : "light"];
            palette.setTheme(nextDark);
            bag.setBlending(nextDark);
          },
          pointerDown(x, y) {
            oceanUniforms.uRipple.value = { x, y };
            rippleT = 0;
          },
          dispose() {
            bag.dispose();
          }
        };
      };
      BG_CURTAIN_VERT = `
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
      BG_CURTAIN_FRAG = `
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
      background4 = (ctx) => {
        const bag = new DisposableBag();
        const palette = new ThemePalette(PALETTE2, ctx.dark);
        let levels = LEVELS[ctx.dark ? "dark" : "light"];
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
        const geo = bag.track(new THREE6.BufferGeometry());
        geo.setAttribute("position", new THREE6.BufferAttribute(new Float32Array(total * 3), 3));
        geo.setAttribute("aSeed", new THREE6.BufferAttribute(seeds, 1));
        geo.setAttribute("aColumn", new THREE6.BufferAttribute(colAttr, 1));
        geo.setAttribute("aRow", new THREE6.BufferAttribute(rowAttr, 1));
        geo.setAttribute("aZDepth", new THREE6.BufferAttribute(zDepth, 1));
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
          uOpacity: { value: dark ? 1 : 1.2 }
        };
        const pts = new THREE6.Points(
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
            levels = LEVELS[nextDark ? "dark" : "light"];
            palette.setTheme(nextDark);
            bag.setBlending(nextDark);
          },
          dispose() {
            bag.dispose();
          }
        };
      };
    }
  });

  // PortF/src/three/modes/warp.ts
  var warp_exports = {};
  __export(warp_exports, {
    background: () => background5,
    hero: () => hero5
  });
  function createWarpScene(ctx, opts, heroCtx) {
    const bag = new DisposableBag();
    const palette = new ThemePalette(PALETTE3, ctx.dark);
    let levels = LEVELS2[ctx.dark ? "dark" : "light"];
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
    const lineGeo = bag.track(new THREE7.BufferGeometry());
    lineGeo.setAttribute("position", new THREE7.BufferAttribute(new Float32Array(count * 6), 3));
    lineGeo.setAttribute("aStar", new THREE7.BufferAttribute(lineStars, 4));
    lineGeo.setAttribute("aEnd", new THREE7.BufferAttribute(lineEnd, 1));
    const headGeo = bag.track(new THREE7.BufferGeometry());
    headGeo.setAttribute("position", new THREE7.BufferAttribute(new Float32Array(count * 3), 3));
    headGeo.setAttribute("aStar", new THREE7.BufferAttribute(stars, 4));
    const shared = {
      uPixelRatio: { value: ctx.dpr },
      uTravel: { value: 0 },
      uStreak: { value: 0 },
      uF: { value: ctx.camZ() },
      uD: { value: 2600 },
      uReveal: { value: 0 },
      uCenter: { value: { x: 0, y: 0 } },
      uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
      uAvoidMin: { value: opts.hero ? 0.3 : 1 }
    };
    const lineMat = bag.shader(
      {
        vertexShader: LINE_VERT,
        fragmentShader: LINE_FRAG,
        uniforms: { ...shared, uColor: { value: palette.cur.line }, uOpacity: { value: levels.line } }
      },
      ctx.dark
    );
    const headMat = bag.shader(
      {
        vertexShader: HEAD_VERT,
        fragmentShader: HEAD_FRAG,
        uniforms: { ...shared, uColor: { value: palette.cur.head }, uOpacity: { value: levels.head } }
      },
      ctx.dark
    );
    const lines = new THREE7.LineSegments(lineGeo, lineMat);
    const heads = new THREE7.Points(headGeo, headMat);
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
        levels = LEVELS2[nextDark ? "dark" : "light"];
        palette.setTheme(nextDark);
        bag.setBlending(nextDark);
      },
      pointerDown() {
        boost = 1;
      },
      dispose() {
        bag.dispose();
      }
    };
  }
  var THREE7, PALETTE3, LEVELS2, STAR_COMMON, LINE_VERT, HEAD_VERT, LINE_FRAG, HEAD_FRAG, hero5, background5;
  var init_warp = __esm({
    "PortF/src/three/modes/warp.ts"() {
      "use strict";
      THREE7 = __toESM(require_three(), 1);
      init_util();
      PALETTE3 = {
        dark: { line: "#a5d8ff", head: "#ffffff" },
        light: { line: "#2563eb", head: "#1e3a8a" }
      };
      LEVELS2 = {
        dark: { line: 1, head: 1 },
        light: { line: 0.85, head: 0.9 }
      };
      STAR_COMMON = `
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
      LINE_VERT = `
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
      HEAD_VERT = `
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
      LINE_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;
      HEAD_FRAG = `
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
      hero5 = (ctx) => createWarpScene(ctx, { count: ctx.compact ? 700 : 1500, hero: true }, ctx);
      background5 = (ctx) => createWarpScene(ctx, { count: ctx.compact ? 300 : 620, hero: false });
    }
  });

  // PortF/src/three/modes/tunnel.ts
  var tunnel_exports = {};
  __export(tunnel_exports, {
    background: () => background6,
    hero: () => hero6
  });
  function createTunnelScene(ctx, opts, heroCtx) {
    const bag = new DisposableBag();
    const palette = new ThemePalette(PALETTE4, ctx.dark);
    let opacity = OPACITY[ctx.dark ? "dark" : "light"];
    const { size, scene } = ctx;
    const { rings, segments, spokes } = opts;
    const verts = (rings * segments + spokes * 12) * 2;
    const aR = new Float32Array(verts * 4);
    let idx = 0;
    const push = (z, ang, seed, spoke) => {
      aR.set([z, ang, seed, spoke], idx * 4);
      idx++;
    };
    for (let r = 0; r < rings; r++) {
      const z = r / rings;
      const seed = Math.random();
      for (let s = 0; s < segments; s++) {
        push(z, s / segments * Math.PI * 2, seed, 0);
        push(z, (s + 1) / segments * Math.PI * 2, seed, 0);
      }
    }
    for (let sp = 0; sp < spokes; sp++) {
      const ang = sp / spokes * Math.PI * 2;
      for (let seg = 0; seg < 12; seg++) {
        push(seg / 12 * 0.98, ang, sp / spokes, 1);
        push((seg + 1) / 12 * 0.98, ang, sp / spokes, 1);
      }
    }
    const geo = bag.track(new THREE8.BufferGeometry());
    geo.setAttribute("position", new THREE8.BufferAttribute(new Float32Array(verts * 3), 3));
    geo.setAttribute("aR", new THREE8.BufferAttribute(aR, 4));
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
      uCenter: { value: new THREE8.Vector2() },
      uSteer: { value: new THREE8.Vector2() },
      uColA: { value: palette.cur.a },
      uColB: { value: palette.cur.b },
      uOpacity: { value: opacity },
      uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
      uAvoidMin: { value: opts.hero ? 0.3 : 1 }
    };
    const lines = new THREE8.LineSegments(
      geo,
      bag.shader({ vertexShader: VERT2, fragmentShader: FRAG2, uniforms }, ctx.dark)
    );
    lines.frustumCulled = false;
    bag.mount(scene, lines);
    let travel = 0;
    let rot = 0;
    let boost = 0;
    const steer = new THREE8.Vector2();
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
        const clampScale = len > maxSteer * 2 ? maxSteer * 2 / len : 1;
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
        uniforms.uTwist.value = 1 + steer.length() / Math.max(maxSteer, 1) * 0.8;
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
        opacity = OPACITY[nextDark ? "dark" : "light"];
        palette.setTheme(nextDark);
        bag.setBlending(nextDark);
      },
      pointerDown() {
        boost = 1;
      },
      dispose() {
        bag.dispose();
      }
    };
  }
  var THREE8, PALETTE4, OPACITY, VERT2, FRAG2, hero6, background6;
  var init_tunnel = __esm({
    "PortF/src/three/modes/tunnel.ts"() {
      "use strict";
      THREE8 = __toESM(require_three(), 1);
      init_util();
      PALETTE4 = {
        dark: { a: "#38bdf8", b: "#a78bfa" },
        light: { a: "#2563eb", b: "#7c3aed" }
      };
      OPACITY = { dark: 1, light: 0.85 };
      VERT2 = `
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
      FRAG2 = `
  uniform float uOpacity;
  varying float vAlpha;
  varying vec3  vColor;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;
      hero6 = (ctx) => createTunnelScene(
        ctx,
        {
          rings: ctx.compact ? 20 : 30,
          segments: ctx.compact ? 40 : 64,
          spokes: ctx.compact ? 12 : 20,
          hero: true
        },
        ctx
      );
      background6 = (ctx) => createTunnelScene(ctx, {
        rings: ctx.compact ? 12 : 18,
        segments: ctx.compact ? 32 : 48,
        spokes: ctx.compact ? 8 : 12,
        hero: false
      });
    }
  });

  // PortF/src/three/modes/pulse.ts
  var pulse_exports = {};
  __export(pulse_exports, {
    background: () => background7,
    hero: () => hero7
  });
  function createPulseScene(ctx, opts, heroCtx) {
    const bag = new DisposableBag();
    const palette = new ThemePalette(PALETTE5, ctx.dark);
    let opacity = OPACITY2[ctx.dark ? "dark" : "light"];
    const { size, scene } = ctx;
    const ripples = Array.from({ length: MAX_RIPPLES2 }, () => new THREE9.Vector3(0, 0, -1e4));
    const uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: ctx.dpr },
      uReveal: { value: 0 },
      uAmp: { value: 22 },
      uWide: { value: size.width },
      uPointer: { value: new THREE9.Vector2(-1e4, -1e4) },
      uPointerPower: { value: 0 },
      uRip: { value: ripples },
      uBase: { value: palette.cur.base },
      uHot: { value: palette.cur.hot },
      uWarm: { value: palette.cur.warm },
      uOpacity: { value: opacity },
      uAvoid: { value: { x: -1e4, y: -1e4, z: -1e4, w: -1e4 } },
      uAvoidMin: { value: opts.hero ? 0.3 : 1 }
    };
    const mat = bag.shader({ vertexShader: VERT3, fragmentShader: FRAG3, uniforms }, ctx.dark);
    let geo = new THREE9.BufferGeometry();
    const pts = new THREE9.Points(geo, mat);
    pts.frustumCulled = false;
    bag.mount(scene, pts);
    bag.track({ dispose: () => geo.dispose() });
    let builtW = 0;
    let builtH = 0;
    const buildGrid = () => {
      const sp = opts.spacing;
      const cols = Math.min(110, Math.ceil(size.width / sp) + 2);
      const rows = Math.min(70, Math.ceil(size.height / (sp * 0.866)) + 2);
      const aG = new Float32Array(cols * rows * 3);
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const hx = (c - (cols - 1) / 2 + (r % 2 ? 0.25 : -0.25)) * sp;
          const hy = (r - (rows - 1) / 2) * sp * 0.866;
          aG.set([hx, hy, Math.random()], idx);
          idx += 3;
        }
      }
      const nextGeo = new THREE9.BufferGeometry();
      nextGeo.setAttribute("position", new THREE9.BufferAttribute(new Float32Array(cols * rows * 3), 3));
      nextGeo.setAttribute("aG", new THREE9.BufferAttribute(aG, 3));
      const prev = geo;
      geo = nextGeo;
      pts.geometry = nextGeo;
      prev.dispose();
      builtW = size.width;
      builtH = size.height;
      uniforms.uWide.value = cols * sp;
    };
    buildGrid();
    let ripIdx = 0;
    let lastElapsed = 0;
    const emitRipple = (x, y, t) => {
      ripples[ripIdx].set(x, y, t);
      ripIdx = (ripIdx + 1) % MAX_RIPPLES2;
    };
    let lastPtrX = 0;
    let lastPtrY = 0;
    let lastPtrT = -1;
    let nextIdleDrop = 1.2;
    let nextScrollDrop = 0;
    return {
      update(frame) {
        const { dt, elapsed, fade, scrollSpeed, pointer } = frame;
        lastElapsed = elapsed;
        ctx.camera.position.set(0, 0, ctx.camZ());
        ctx.camera.lookAt(0, 0, 0);
        palette.update(dt);
        if (pointer.power > 0.35 && (lastPtrT < 0 || Math.hypot(pointer.x - lastPtrX, pointer.y - lastPtrY) > 150 && elapsed - lastPtrT > 0.12)) {
          emitRipple(pointer.x, pointer.y, elapsed);
          lastPtrX = pointer.x;
          lastPtrY = pointer.y;
          lastPtrT = elapsed;
        }
        if (elapsed > nextIdleDrop) {
          emitRipple(
            (Math.random() - 0.5) * size.width * 0.9,
            (Math.random() - 0.5) * size.height * 0.9,
            elapsed
          );
          nextIdleDrop = elapsed + 2.4 + Math.random() * 2.2;
        }
        if (!opts.hero && scrollSpeed > 350 && elapsed > nextScrollDrop) {
          emitRipple((Math.random() - 0.5) * size.width, (Math.random() - 0.5) * size.height, elapsed);
          nextScrollDrop = elapsed + Math.max(0.12, 0.6 - scrollSpeed / 5e3);
        }
        uniforms.uTime.value = elapsed;
        uniforms.uPointer.value.set(pointer.x, pointer.y);
        uniforms.uPointerPower.value = pointer.power;
        uniforms.uReveal.value = easeOutCubic(elapsed / 2.2) * fade;
        uniforms.uOpacity.value = opacity;
        if (heroCtx) {
          uniforms.uAvoid.value = avoidUniformVec(heroCtx.avoid);
        } else {
          uniforms.uHot.value = frame.tint;
        }
      },
      resize() {
        if (Math.abs(size.width - builtW) > 24 || Math.abs(size.height - builtH) > 24) {
          buildGrid();
        }
      },
      setTheme(nextDark) {
        opacity = OPACITY2[nextDark ? "dark" : "light"];
        palette.setTheme(nextDark);
        bag.setBlending(nextDark);
      },
      pointerDown(x, y) {
        emitRipple(x, y, lastElapsed);
        emitRipple(x, y, lastElapsed + 0.16);
      },
      dispose() {
        bag.dispose();
      }
    };
  }
  var THREE9, PALETTE5, OPACITY2, MAX_RIPPLES2, VERT3, FRAG3, hero7, background7;
  var init_pulse = __esm({
    "PortF/src/three/modes/pulse.ts"() {
      "use strict";
      THREE9 = __toESM(require_three(), 1);
      init_util();
      PALETTE5 = {
        dark: { base: "#3b82f6", hot: "#e0f2fe", warm: "#a78bfa" },
        light: { base: "#2563eb", hot: "#0f172a", warm: "#7c3aed" }
      };
      OPACITY2 = { dark: 1, light: 0.9 };
      MAX_RIPPLES2 = 8;
      VERT3 = `
  ${AVOID_GLSL}
  uniform float uAvoidMin;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform float uAmp;
  uniform float uWide;
  uniform vec2  uPointer;
  uniform float uPointerPower;
  uniform vec3  uRip[${MAX_RIPPLES2}];
  uniform vec3  uBase;
  uniform vec3  uHot;
  uniform vec3  uWarm;
  attribute vec3 aG;
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    vec2 home = aG.xy;
    vec2 pos = home;
    float energy = 0.0;

    float amb = sin(home.x * 0.009 + uTime * 0.7) * sin(home.y * 0.011 - uTime * 0.55);
    energy += (0.5 + 0.5 * amb) * 0.14;

    for (int i = 0; i < ${MAX_RIPPLES2}; i++) {
      vec3 r = uRip[i];
      float age = uTime - r.z;
      if (age > 0.0 && age < 3.4) {
        vec2 dv = home - r.xy;
        float d = length(dv);
        float radius = age * 430.0;
        float width = 46.0 + age * 34.0;
        float k = (d - radius) / width;
        float ring = exp(-k * k) * exp(-age * 0.85);
        pos += dv / max(d, 1.0) * ring * uAmp;
        energy += ring;
      }
    }

    vec2 pv = home - uPointer;
    float pd = length(pv);
    float lens = exp(-(pd * pd) / (2.0 * 150.0 * 150.0)) * uPointerPower;
    pos -= pv / max(pd, 1.0) * lens * 16.0;
    energy += lens * 0.95;

    gl_Position = projectionMatrix * viewMatrix * vec4(pos, 0.0, 1.0);
    float e = clamp(energy, 0.0, 1.6);
    gl_PointSize = (2.2 + aG.z * 1.0 + e * 4.6) * uPixelRatio;
    vAlpha = (0.55 + e * 0.65) * uReveal * avoidMask(pos, uAvoidMin);

    float across = clamp(home.x / max(uWide, 1.0) + 0.5, 0.0, 1.0);
    vec3 base = mix(uBase, uWarm, across * 0.6);
    vColor = mix(base, uHot, clamp(e, 0.0, 1.0));
  }
`;
      FRAG3 = `
  uniform float uOpacity;
  varying float vAlpha;
  varying vec3  vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(vColor, pow(1.0 - d, 1.3) * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;
      hero7 = (ctx) => createPulseScene(ctx, { spacing: ctx.compact ? 40 : 32, hero: true }, ctx);
      background7 = (ctx) => createPulseScene(ctx, { spacing: ctx.compact ? 46 : 38, hero: false });
    }
  });

  // PortF/src/three/stormfx.ts
  function createQuadMesh(bag, scene, mat, renderOrder = -1) {
    const geo = bag.track(new THREE10.PlaneGeometry(1, 1));
    const mesh = new THREE10.Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = renderOrder;
    bag.mount(scene, mesh);
    return {
      mesh,
      fit: (size) => mesh.scale.set(size.width, size.height, 1)
    };
  }
  var THREE10, SPARK_VERT, RING_VERT2, CORE_VERT, DOT_FRAG, CORE_FRAG, FULL_QUAD_VERT, SparkBurst;
  var init_stormfx = __esm({
    "PortF/src/three/stormfx.ts"() {
      "use strict";
      THREE10 = __toESM(require_three(), 1);
      SPARK_VERT = `
  uniform vec2  uOrigin;
  uniform float uAge;
  uniform float uGravity;
  uniform float uDrag;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3  uHot;
  uniform vec3  uCool;
  attribute vec4 aV;
  varying float vA;
  varying vec3  vC;

  void main() {
    float t = uAge / aV.z;
    float alive = step(0.0, uAge) * step(t, 1.0);
    float d = aV.y * (1.0 - exp(-uDrag * uAge)) / uDrag;
    vec2 p = uOrigin + vec2(cos(aV.x), sin(aV.x)) * d + vec2(0.0, uGravity * uAge * uAge * 0.5);
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 0.0, 1.0);
    float k = clamp(t, 0.0, 1.0);
    gl_PointSize = uSize * (1.0 - k * 0.65) * (0.55 + aV.w * 0.9) * uPixelRatio;
    vA = alive * pow(1.0 - k, 1.3);
    vC = mix(uHot, uCool, k);
  }
`;
      RING_VERT2 = `
  uniform vec2  uOrigin;
  uniform float uAge;
  uniform float uSpeed;
  uniform float uPixelRatio;
  uniform vec3  uColor;
  attribute float aAng;
  varying float vA;
  varying vec3  vC;

  void main() {
    float on = step(0.0, uAge) * (1.0 - step(1.1, uAge));
    float r = uAge * uSpeed;
    vec2 p = uOrigin + vec2(cos(aAng), sin(aAng)) * r;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 0.0, 1.0);
    gl_PointSize = (5.0 - uAge * 3.2) * uPixelRatio;
    vA = on * pow(max(1.0 - uAge / 1.1, 0.0), 1.6);
    vC = uColor;
  }
`;
      CORE_VERT = `
  uniform vec2  uOrigin;
  uniform float uAge;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3  uColor;
  varying float vA;
  varying vec3  vC;

  void main() {
    gl_Position = projectionMatrix * viewMatrix * vec4(uOrigin, 0.0, 1.0);
    float k = clamp(uAge / 0.55, 0.0, 1.0);
    gl_PointSize = uSize * (0.35 + 0.9 * (1.0 - pow(1.0 - k, 2.0))) * uPixelRatio;
    vA = step(0.0, uAge) * pow(1.0 - k, 2.0);
    vC = uColor;
  }
`;
      DOT_FRAG = `
  uniform float uOpacity;
  varying float vA;
  varying vec3  vC;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(vC, pow(1.0 - d, 1.3) * vA * uOpacity);
    #include <colorspace_fragment>
  }
`;
      CORE_FRAG = `
  uniform float uOpacity;
  varying float vA;
  varying vec3  vC;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float hot = pow(1.0 - d, 6.0);
    gl_FragColor = vec4(mix(vC, vec3(1.0), hot), (pow(1.0 - d, 2.0) * 0.8 + hot) * vA * uOpacity);
    #include <colorspace_fragment>
  }
`;
      FULL_QUAD_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
      SparkBurst = class {
        constructor(bag, scene, dark, opts) {
          __publicField(this, "age", 1e9);
          __publicField(this, "origin", new THREE10.Vector2());
          __publicField(this, "sparkMat");
          __publicField(this, "ringMat");
          __publicField(this, "coreMat");
          const count = opts.count;
          const vData = new Float32Array(count * 4);
          for (let i = 0; i < count; i++) {
            const spd = opts.speed[0] + Math.random() * (opts.speed[1] - opts.speed[0]);
            const life = opts.life[0] + Math.random() * (opts.life[1] - opts.life[0]);
            vData.set([Math.random() * Math.PI * 2, spd, life, Math.random()], i * 4);
          }
          const sparkGeo = bag.track(new THREE10.BufferGeometry());
          sparkGeo.setAttribute("position", new THREE10.BufferAttribute(new Float32Array(count * 3), 3));
          sparkGeo.setAttribute("aV", new THREE10.BufferAttribute(vData, 4));
          const ringCount = 140;
          const angles = new Float32Array(ringCount);
          for (let i = 0; i < ringCount; i++) angles[i] = i / ringCount * Math.PI * 2;
          const ringGeo = bag.track(new THREE10.BufferGeometry());
          ringGeo.setAttribute("position", new THREE10.BufferAttribute(new Float32Array(ringCount * 3), 3));
          ringGeo.setAttribute("aAng", new THREE10.BufferAttribute(angles, 1));
          const coreGeo = bag.track(new THREE10.BufferGeometry());
          coreGeo.setAttribute("position", new THREE10.BufferAttribute(new Float32Array(3), 3));
          const baseUniforms = {
            uOrigin: { value: this.origin },
            uAge: { value: -1 },
            uPixelRatio: opts.shared.uPixelRatio,
            uOpacity: opts.shared.uOpacity
          };
          this.sparkMat = bag.shader(
            {
              vertexShader: SPARK_VERT,
              fragmentShader: DOT_FRAG,
              uniforms: {
                ...baseUniforms,
                uGravity: { value: opts.gravity },
                uDrag: { value: opts.drag },
                uSize: { value: opts.size },
                uHot: { value: opts.hot },
                uCool: { value: opts.cool }
              }
            },
            dark
          );
          this.ringMat = bag.shader(
            {
              vertexShader: RING_VERT2,
              fragmentShader: DOT_FRAG,
              uniforms: {
                ...baseUniforms,
                uSpeed: { value: opts.ringSpeed },
                uColor: { value: opts.ring }
              }
            },
            dark
          );
          this.coreMat = bag.shader(
            {
              vertexShader: CORE_VERT,
              fragmentShader: CORE_FRAG,
              uniforms: {
                ...baseUniforms,
                uSize: { value: opts.coreSize },
                uColor: { value: opts.hot }
              }
            },
            dark
          );
          for (const [g, m] of [
            [sparkGeo, this.sparkMat],
            [ringGeo, this.ringMat],
            [coreGeo, this.coreMat]
          ]) {
            const p = new THREE10.Points(g, m);
            p.frustumCulled = false;
            bag.mount(scene, p);
          }
        }
        fire(x, y) {
          this.origin.set(x, y);
          this.age = 0;
        }
        update(dt) {
          this.age += dt;
          const a = this.age < 2 ? this.age : -1;
          this.sparkMat.uniforms.uAge.value = a;
          this.ringMat.uniforms.uAge.value = a;
          this.coreMat.uniforms.uAge.value = a;
        }
      };
    }
  });

  // PortF/src/three/modes/thunder.ts
  var thunder_exports = {};
  __export(thunder_exports, {
    background: () => background8,
    backgroundDpr: () => backgroundDpr,
    hero: () => hero8,
    heroDpr: () => heroDpr
  });
  function subdivideBolt(x1, y1, x2, y2, disp, depth) {
    if (depth === 0) return [[x1, y1], [x2, y2]];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const off = (Math.random() - 0.5) * 2 * disp;
    const nx = mx + -dy / len * off;
    const ny = my + dx / len * off;
    const left = subdivideBolt(x1, y1, nx, ny, disp / 2, depth - 1);
    const right = subdivideBolt(nx, ny, x2, y2, disp / 2, depth - 1);
    return left.concat(right.slice(1));
  }
  function generateBolt(x1, y1, x2, y2) {
    const pos = new Float32Array(MAX_BOLT_PTS * 3);
    const info = new Float32Array(MAX_BOLT_PTS * 3);
    let count = 0;
    const pushPt = (x, y, g, br) => {
      if (count >= MAX_BOLT_PTS) return;
      pos[count * 3] = x;
      pos[count * 3 + 1] = y;
      info[count * 3] = g;
      info[count * 3 + 1] = br;
      info[count * 3 + 2] = Math.random();
      count++;
    };
    const rasterize = (poly, gStart, gEnd, br, stepPx) => {
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
  function createThunderScene(ctx, opts) {
    const bag = new DisposableBag();
    const palette = new ThemePalette(PALETTE6, ctx.dark);
    let opacity = OPACITY3[ctx.dark ? "dark" : "light"];
    let dark = ctx.dark;
    const { size, scene } = ctx;
    const shared = {
      uPixelRatio: { value: ctx.dpr },
      uOpacity: { value: opacity },
      uReveal: { value: 0 }
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
          uFlashAt: { value: new THREE11.Vector2(0.5, 0.85) },
          uReveal: shared.uReveal,
          uOpacity: shared.uOpacity,
          uCloudCol: { value: palette.cur.cloud },
          uFlashCol: { value: palette.cur.flash }
        }
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
    const rainGeo = bag.track(new THREE11.BufferGeometry());
    rainGeo.setAttribute("position", new THREE11.BufferAttribute(new Float32Array(drops * 2 * 3), 3));
    rainGeo.setAttribute("aD", new THREE11.BufferAttribute(aD, 4));
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
          uColor: { value: palette.cur.rain }
        }
      },
      dark
    );
    const rainLines = new THREE11.LineSegments(rainGeo, rainMat);
    rainLines.frustumCulled = false;
    bag.mount(scene, rainLines);
    const bolts = [];
    for (let i = 0; i < BOLT_POOL; i++) {
      const geo = bag.track(new THREE11.BufferGeometry());
      geo.setAttribute("position", new THREE11.BufferAttribute(new Float32Array(MAX_BOLT_PTS * 3), 3));
      geo.setAttribute("aB", new THREE11.BufferAttribute(new Float32Array(MAX_BOLT_PTS * 3), 3));
      geo.setDrawRange(0, 0);
      const makeUniforms = (color, sz, alpha) => ({
        uAge: { value: -1 },
        uSize: { value: sz },
        uAlpha: { value: alpha },
        uPixelRatio: shared.uPixelRatio,
        uOpacity: shared.uOpacity,
        uColor: color
      });
      const isLight = !dark;
      const glowMat = bag.shader(
        {
          vertexShader: BOLT_VERT,
          fragmentShader: BOLT_FRAG,
          uniforms: makeUniforms({ value: palette.cur.glow }, isLight ? 28 : 22, isLight ? 0.78 : 0.5)
        },
        dark
      );
      const coreMat = bag.shader(
        {
          vertexShader: BOLT_VERT,
          fragmentShader: BOLT_FRAG,
          uniforms: makeUniforms({ value: palette.cur.bolt }, isLight ? 8 : 6.5, isLight ? 1.15 : 1)
        },
        dark
      );
      for (const m of [glowMat, coreMat]) {
        const p = new THREE11.Points(geo, m);
        p.frustumCulled = false;
        bag.mount(scene, p);
      }
      bolts.push({ geo, coreMat, glowMat, age: 1e9 });
    }
    const sparks = [];
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
          shared
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
    const delayedStrikes = [];
    const strike = (x, y, power = 1) => {
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
      b.geo.getAttribute("position").set(boltData.pos);
      b.geo.getAttribute("aB").set(boltData.info);
      b.geo.getAttribute("position").needsUpdate = true;
      b.geo.getAttribute("aB").needsUpdate = true;
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
        const boltFlash = Math.exp(-strikeAge * 5.5) + 0.65 * Math.exp(-Math.max(strikeAge - 0.17, 0) * 6.5) * (strikeAge > 0.17 ? 1 : 0);
        const sheetFlash = 0.55 * Math.exp(-sheetAge * 3.2) * (0.6 + 0.4 * Math.sin(sheetAge * 40));
        const flash = Math.min(1.25, Math.max(boltFlash, sheetFlash));
        const wind = 0.26 + 0.1 * Math.sin(elapsed * 0.45) + Math.min(scrollSpeed / 6e3, 0.25);
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
        opacity = OPACITY3[nextDark ? "dark" : "light"];
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
          power: 0.7
        });
      },
      dispose() {
        bag.dispose();
      }
    };
  }
  var THREE11, PALETTE6, OPACITY3, MAX_BOLT_PTS, BOLT_POOL, RAIN_VERT, RAIN_FRAG, CLOUD_FRAG, BOLT_VERT, BOLT_FRAG, hero8, background8, heroDpr, backgroundDpr;
  var init_thunder = __esm({
    "PortF/src/three/modes/thunder.ts"() {
      "use strict";
      THREE11 = __toESM(require_three(), 1);
      init_util();
      init_stormfx();
      PALETTE6 = {
        dark: {
          rain: "#a5c8ff",
          bolt: "#ffffff",
          glow: "#7cb0ff",
          cloud: "#0a1124",
          flash: "#c9deff",
          spark: "#e8f1ff",
          cool: "#4f86ff"
        },
        light: {
          rain: "#334b6b",
          bolt: "#fffef7",
          glow: "#3156c8",
          cloud: "#53647b",
          flash: "#eaf4ff",
          spark: "#f4f8ff",
          cool: "#3568d4"
        }
      };
      OPACITY3 = { dark: 1, light: 0.96 };
      MAX_BOLT_PTS = 4200;
      BOLT_POOL = 3;
      RAIN_VERT = `
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
      RAIN_FRAG = `
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    gl_FragColor = vec4(uColor, vA * uOpacity);
    #include <colorspace_fragment>
  }
`;
      CLOUD_FRAG = `
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
      BOLT_VERT = `
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
      BOLT_FRAG = `
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
      hero8 = (ctx) => createThunderScene(ctx, { drops: ctx.compact ? 950 : 2100, hero: true });
      background8 = (ctx) => createThunderScene(ctx, { drops: ctx.compact ? 480 : 1e3, hero: false });
      heroDpr = 1.25;
      backgroundDpr = 1;
    }
  });

  // PortF/src/three/modes/wildfire.ts
  var wildfire_exports = {};
  __export(wildfire_exports, {
    background: () => background9,
    backgroundDpr: () => backgroundDpr2,
    hero: () => hero9,
    heroDpr: () => heroDpr2
  });
  function createWildfireScene(ctx, opts) {
    const bag = new DisposableBag();
    const palette = new ThemePalette(PALETTE7, ctx.dark);
    let opacity = OPACITY4[ctx.dark ? "dark" : "light"];
    let smokeFactor = SMOKE_FACTOR[ctx.dark ? "dark" : "light"];
    let dark = ctx.dark;
    const { size, scene } = ctx;
    const shared = {
      uPixelRatio: { value: ctx.dpr },
      uOpacity: { value: opacity },
      uReveal: { value: 0 }
    };
    const makeSilUniforms = (mode) => ({
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
      uFarCol: { value: palette.cur.far }
    });
    const makeSilMat = (mode) => bag.track(
      new THREE12.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE12.NormalBlending,
        vertexShader: FULL_QUAD_VERT,
        fragmentShader: SILHOUETTE_FRAG,
        uniforms: makeSilUniforms(mode)
      })
    );
    const smokeMat = makeSilMat(0);
    const smokeQuad = createQuadMesh(bag, scene, smokeMat, -3);
    const forestMat = opts.forest ? makeSilMat(1) : null;
    const forestQuad = forestMat ? createQuadMesh(bag, scene, forestMat, -1) : null;
    const jets = Array.from({ length: MAX_JETS }, () => new THREE12.Vector4(0.5, -1e4, 1, 0));
    const flares = Array.from({ length: MAX_FLARES }, () => new THREE12.Vector4(0.5, -1e4, 1, 0));
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
          uCore: { value: palette.cur.core }
        }
      },
      dark
    );
    const fireQuad = createQuadMesh(bag, scene, fireMat, -2);
    const aE = new Float32Array(opts.embers * 4);
    for (let i = 0; i < opts.embers; i++) {
      aE.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    }
    const emberGeo = bag.track(new THREE12.BufferGeometry());
    emberGeo.setAttribute("position", new THREE12.BufferAttribute(new Float32Array(opts.embers * 3), 3));
    emberGeo.setAttribute("aE", new THREE12.BufferAttribute(aE, 4));
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
          uCool: { value: palette.cur.ember }
        }
      },
      dark
    );
    const emberPts = new THREE12.Points(emberGeo, emberMat);
    emberPts.frustumCulled = false;
    emberPts.renderOrder = 1;
    bag.mount(scene, emberPts);
    const bursts = [];
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
          shared
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
    const ignite = (x, y, strength) => {
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
          targetIntensity = Math.random() < 0.38 ? 0.12 + Math.random() * 0.2 : 0.85 + Math.random() * 0.4;
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
        opacity = OPACITY4[nextDark ? "dark" : "light"];
        smokeFactor = SMOKE_FACTOR[nextDark ? "dark" : "light"];
        palette.setTheme(nextDark);
        bag.setBlending(nextDark);
      },
      pointerDown(x, y) {
        ignite(x, y, 1);
      },
      dispose() {
        bag.dispose();
      }
    };
  }
  var THREE12, PALETTE7, OPACITY4, SMOKE_FACTOR, MAX_JETS, MAX_FLARES, FIRE_FRAG, SILHOUETTE_FRAG, EMBER_VERT, EMBER_FRAG, hero9, background9, heroDpr2, backgroundDpr2;
  var init_wildfire = __esm({
    "PortF/src/three/modes/wildfire.ts"() {
      "use strict";
      THREE12 = __toESM(require_three(), 1);
      init_util();
      init_stormfx();
      PALETTE7 = {
        dark: {
          back: "#d9381e",
          mid: "#ff7a14",
          front: "#ffc233",
          core: "#fff6c2",
          ember: "#ff7a2e",
          tree: "#05060a",
          far: "#240d0a",
          smoke: "#241211"
        },
        light: {
          back: "#b91c1c",
          mid: "#ea580c",
          front: "#f59e0b",
          core: "#fde68a",
          ember: "#dc2626",
          tree: "#2a170f",
          far: "#7a3a24",
          smoke: "#6b5650"
        }
      };
      OPACITY4 = { dark: 0.6, light: 0.68 };
      SMOKE_FACTOR = { dark: 1, light: 0.5 };
      MAX_JETS = 4;
      MAX_FLARES = 4;
      FIRE_FRAG = `
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
      SILHOUETTE_FRAG = `
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
      EMBER_VERT = `
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
      EMBER_FRAG = `
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
      hero9 = (ctx) => createWildfireScene(ctx, {
        embers: ctx.compact ? 360 : 800,
        height: 0.34,
        power: 1,
        smoke: 0.6,
        forest: true,
        hero: true
      });
      background9 = (ctx) => createWildfireScene(ctx, {
        embers: ctx.compact ? 200 : 380,
        height: 0.2,
        power: 0.9,
        smoke: 0.35,
        forest: false,
        hero: false
      });
      heroDpr2 = 1;
      backgroundDpr2 = 1;
    }
  });

  // PortF/src/three/modes/sketch.ts
  var sketch_exports = {};
  __export(sketch_exports, {
    background: () => background10,
    hero: () => hero10
  });
  var createNoopScene, hero10, background10;
  var init_sketch = __esm({
    "PortF/src/three/modes/sketch.ts"() {
      "use strict";
      createNoopScene = () => ({
        update() {
        },
        setTheme() {
        },
        dispose() {
        }
      });
      hero10 = () => createNoopScene();
      background10 = () => createNoopScene();
    }
  });

  // PortF/src/three/animationStore.ts
  var ANIMATION_MODES = [
    { id: "galaxy", label: "Galaxy", blurb: "Orbiting stardust" },
    { id: "neural", label: "Neural", blurb: "Living synapse network" },
    { id: "code", label: "Code", blurb: "Falling code streams" },
    { id: "waves", label: "Waves", blurb: "Rippling particle ocean" },
    { id: "warp", label: "Warp", blurb: "Hyperspace streaks" },
    { id: "tunnel", label: "Tunnel", blurb: "Steer through light rings" },
    { id: "pulse", label: "Pulse", blurb: "Ripples on a dot grid" },
    { id: "thunder", label: "Thunderstorm", blurb: "Click to call lightning" },
    { id: "wildfire", label: "Wild Fire", blurb: "Click to ignite" },
    { id: "sketch", label: "Sketch", blurb: "A quiet crayon doodle" }
  ];
  var DEFAULT_ANIMATION_MODE = "galaxy";
  var STORAGE_KEY = "portfolio-animation-mode";
  var DEFAULT_STORAGE_KEY = "portfolio-default-animation";
  function isValidMode(val) {
    return !!val && ANIMATION_MODES.some((m) => m.id === val);
  }
  function readStoredKey(key) {
    if (typeof window === "undefined") return null;
    try {
      const val = localStorage.getItem(key);
      return isValidMode(val) ? val : null;
    } catch {
      return null;
    }
  }
  function applyModeToDocument(mode) {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.animationMode = mode;
    }
  }
  var explicitMode = readStoredKey(STORAGE_KEY);
  var currentMode = explicitMode ?? readStoredKey(DEFAULT_STORAGE_KEY) ?? DEFAULT_ANIMATION_MODE;
  applyModeToDocument(currentMode);
  var listeners = /* @__PURE__ */ new Set();
  function getAnimationMode() {
    return currentMode;
  }
  function setAnimationMode(mode) {
    explicitMode = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
    }
    if (mode !== currentMode) {
      currentMode = mode;
      applyModeToDocument(mode);
      listeners.forEach((fn) => fn(mode));
    }
  }
  function subscribeAnimationMode(fn) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }

  // PortF/src/three/createHeroScene.ts
  var THREE13 = __toESM(require_three(), 1);

  // PortF/src/utils/scroll.ts
  var cancelScroll = null;
  var programmaticScroll = false;
  var easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  var prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isCoarsePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  var isDarkTheme = () => typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  function observeTheme(cb) {
    const obs = new MutationObserver(() => cb(isDarkTheme()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return () => obs.disconnect();
  }
  var webglSupportedCache;
  function hasWebGL() {
    if (webglSupportedCache !== void 0) return webglSupportedCache;
    if (typeof document === "undefined") return false;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      webglSupportedCache = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupportedCache = false;
    }
    return webglSupportedCache;
  }
  function onIdle(cb, timeout = 1500) {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id2 = window.requestIdleCallback(cb, { timeout });
      return () => window.cancelIdleCallback(id2);
    }
    const id = setTimeout(cb, 200);
    return () => clearTimeout(id);
  }
  function getNavHeight() {
    const nav = document.querySelector("nav");
    const inner = nav?.firstElementChild;
    if (!nav || !inner) return 0;
    const cs = getComputedStyle(nav);
    return inner.offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + 1;
  }
  var maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  function targetScrollY(el) {
    if (el.id === "home") return 0;
    const pt = parseFloat(getComputedStyle(el).paddingTop) || 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const extra = window.innerWidth <= 768 ? 20 : 28;
    return Math.min(maxScrollY(), Math.max(0, Math.round(top + pt - getNavHeight() - extra)));
  }
  function animateScrollTo(computeY, targetId) {
    cancelScroll?.();
    const startY = window.scrollY;
    const destY = computeY();
    const dist = Math.abs(destY - startY);
    if (dist < 2) return;
    if (prefersReducedMotion()) {
      window.scrollTo({ top: destY, behavior: "instant" });
      return;
    }
    const duration = Math.min(1500, Math.max(650, 480 + dist * 0.3));
    let raf = 0;
    let stopped = false;
    const start = performance.now();
    programmaticScroll = true;
    if (targetId) {
      window.dispatchEvent(new CustomEvent("nav:target", { detail: targetId }));
    }
    const stop = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("pointerdown", stop);
      programmaticScroll = false;
      if (cancelScroll === stop) cancelScroll = null;
      window.dispatchEvent(new Event("scroll"));
    };
    cancelScroll = stop;
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    window.addEventListener("pointerdown", stop, { passive: true });
    const step = (now) => {
      if (stopped) return;
      const t = Math.min(1, (now - start) / duration);
      const goal = computeY();
      const y = startY + (goal - startY) * easeInOutCubic(t);
      window.scrollTo({ top: y, behavior: "instant" });
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        window.scrollTo({ top: computeY(), behavior: "instant" });
        stop();
      }
    };
    raf = requestAnimationFrame(step);
  }
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return false;
    animateScrollTo(() => targetScrollY(el), id);
    return true;
  }
  function scrollToTop() {
    animateScrollTo(() => 0, "home");
  }
  function bindHashAnchorClicks() {
    const handler = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = e.target?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = decodeURIComponent((anchor.getAttribute("href") || "").slice(1));
      if (id && scrollToSection(id)) {
        e.preventDefault();
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }

  // PortF/src/three/modes/index.ts
  async function loadMode(mode) {
    switch (mode) {
      case "galaxy":
        return Promise.resolve().then(() => (init_galaxy(), galaxy_exports));
      case "neural":
        return Promise.resolve().then(() => (init_neural(), neural_exports));
      case "code":
        return Promise.resolve().then(() => (init_code(), code_exports));
      case "waves":
        return Promise.resolve().then(() => (init_waves(), waves_exports));
      case "warp":
        return Promise.resolve().then(() => (init_warp(), warp_exports));
      case "tunnel":
        return Promise.resolve().then(() => (init_tunnel(), tunnel_exports));
      case "pulse":
        return Promise.resolve().then(() => (init_pulse(), pulse_exports));
      case "thunder":
        return Promise.resolve().then(() => (init_thunder(), thunder_exports));
      case "wildfire":
        return Promise.resolve().then(() => (init_wildfire(), wildfire_exports));
      case "sketch":
        return Promise.resolve().then(() => (init_sketch(), sketch_exports));
    }
  }

  // PortF/src/three/createHeroScene.ts
  init_util();
  function createHeroScene(container, avatarSelector) {
    const host = container.parentElement ?? container;
    const reduced = prefersReducedMotion();
    const coarse = isCoarsePointer();
    const size = {
      width: Math.max(1, container.clientWidth),
      height: Math.max(1, container.clientHeight)
    };
    const compact = window.innerWidth < 768 || coarse;
    const maxDpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    const renderer = new THREE13.WebGLRenderer({
      alpha: true,
      antialias: maxDpr < 2,
      powerPreference: "default"
    });
    renderer.setPixelRatio(maxDpr);
    renderer.setSize(size.width, size.height, false);
    renderer.setClearColor(0, 0);
    const canvas = renderer.domElement;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      opacity: "0",
      transition: "opacity 1.6s ease"
    });
    container.appendChild(canvas);
    const camZ = () => size.height / 2 / Math.tan(THREE13.MathUtils.degToRad(20));
    const camera = new THREE13.PerspectiveCamera(40, size.width / size.height, 10, 6e3);
    const resetCamera = () => {
      camera.position.set(0, 0, camZ());
      camera.rotation.set(0, 0, 0);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    resetCamera();
    const scene = new THREE13.Scene();
    const rig = new THREE13.Group();
    scene.add(rig);
    let dark = isDarkTheme();
    const avoid = { x0: -1e4, y0: -1e4, x1: -1e4, y1: -1e4 };
    const ctx = {
      scene,
      camera,
      size,
      dpr: maxDpr,
      compact,
      dark,
      camZ,
      rig,
      avoid
    };
    const anchor = { x: size.width * 0.74, y: size.height * 0.46, size: 350 };
    let measuredOnce = false;
    const measureAvoid = () => {
      const textCol = host.querySelector(".hero-grid > div:first-child");
      if (!textCol) return;
      let ox = 0;
      let oy = 0;
      let cur = textCol;
      while (cur && cur !== host) {
        ox += cur.offsetLeft;
        oy += cur.offsetTop;
        cur = cur.offsetParent;
      }
      if (cur === host) {
        avoid.x0 = ox - 24 - size.width / 2;
        avoid.x1 = ox + textCol.offsetWidth + 24 - size.width / 2;
        avoid.y1 = -(oy - 12 - size.height / 2);
        avoid.y0 = -(oy + textCol.offsetHeight + 12 - size.height / 2);
      }
    };
    const updateRig = (snap, dt = 0) => {
      const tx = anchor.x - size.width / 2;
      const ty = -(anchor.y - size.height / 2);
      const wideScale = window.innerWidth > 768 ? clamp((size.width - 700) / 700, 0.88, 1) : 1;
      const targetScale = clamp(anchor.size / 350, 0.5, 1.15) * wideScale;
      if (snap) {
        rig.position.set(tx, ty, 0);
        rig.scale.setScalar(targetScale);
      } else {
        rig.position.x = damp(rig.position.x, tx, 6, dt);
        rig.position.y = damp(rig.position.y, ty, 6, dt);
        rig.scale.setScalar(damp(rig.scale.x, targetScale, 6, dt));
      }
    };
    const measureAnchor = () => {
      const el = host.querySelector(avatarSelector);
      if (!el) return;
      let cx = el.offsetWidth / 2;
      let cy = el.offsetHeight / 2;
      let cur = el;
      while (cur && cur !== host) {
        cx += cur.offsetLeft;
        cy += cur.offsetTop;
        cur = cur.offsetParent;
      }
      if (cur === host) {
        anchor.x = cx;
        anchor.y = cy;
        anchor.size = el.offsetWidth;
        measureAvoid();
        if (!measuredOnce) {
          measuredOnce = true;
          updateRig(true);
        }
      }
    };
    const ptr = createPointerTracker();
    const frame = {
      dt: 0,
      elapsed: 0,
      fade: 1,
      progress: 0,
      pointer: { x: 1e5, y: 1e5, power: 0, active: false },
      sway: { x: 0, y: 0 },
      scrollDelta: 0,
      scrollSpeed: 0,
      tint: new THREE13.Color("#3b82f6")
    };
    let hadPtr = false;
    let current = null;
    let elapsed = 0;
    let idleClock = 0;
    let frameTick = 0;
    let raf = 0;
    let prevNow = 0;
    let running = false;
    let inView = true;
    let contextLost = false;
    let pendingFadeIn = false;
    let disposed = false;
    const stepScene = (dt) => {
      if (!current) return;
      idleClock += dt;
      frameTick++;
      elapsed += dt;
      if (frameTick % 24 === 0) measureAnchor();
      updateRig(false, dt);
      const rect = host.getBoundingClientRect();
      const prog = clamp01(-rect.top / Math.max(1, rect.height));
      frame.progress = prog;
      frame.fade = 1 - easeOutCubic(prog) * 0.92;
      let swayX;
      let swayY;
      if (ptr.active) {
        const px = ptr.x - rect.left - rect.width / 2;
        const py = -(ptr.y - rect.top - rect.height / 2);
        if (hadPtr) {
          frame.pointer.x = damp(frame.pointer.x, px, 16, dt);
          frame.pointer.y = damp(frame.pointer.y, py, 16, dt);
        } else {
          frame.pointer.x = px;
          frame.pointer.y = py;
        }
        swayX = clamp(ptr.x / window.innerWidth * 2 - 1, -1, 1);
        swayY = clamp(-(ptr.y / window.innerHeight * 2 - 1), -1, 1);
      } else {
        swayX = Math.sin(idleClock * 0.32) * 0.45;
        swayY = Math.cos(idleClock * 0.24) * 0.3;
      }
      hadPtr = ptr.active;
      frame.pointer.active = ptr.active;
      frame.pointer.power = damp(frame.pointer.power, ptr.active ? 1 : 0, 5, dt);
      frame.sway.x = damp(frame.sway.x, swayX, 3.2, dt);
      frame.sway.y = damp(frame.sway.y, swayY, 3.2, dt);
      frame.dt = dt;
      frame.elapsed = elapsed;
      current.update(frame);
    };
    const renderStatic = () => {
      stepScene(1e-4);
      renderer.render(scene, camera);
      canvas.style.opacity = "1";
    };
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!current) return;
      const dt = Math.min((now - prevNow) / 1e3, 0.05);
      prevNow = now;
      stepScene(dt);
      renderer.render(scene, camera);
      if (pendingFadeIn) {
        pendingFadeIn = false;
        canvas.style.transition = "opacity 1s ease";
        canvas.style.opacity = "1";
      }
    };
    const start = () => {
      if (running || reduced || !inView || document.hidden || contextLost) return;
      running = true;
      prevNow = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const syncPlay = () => {
      if (inView && !document.hidden && !contextLost) start();
      else stop();
    };
    let loadSeq = 0;
    let swapTimer = 0;
    const activateMode = async (modeId) => {
      const seq = ++loadSeq;
      window.clearTimeout(swapTimer);
      let mod;
      try {
        mod = await loadMode(modeId);
      } catch (err) {
        console.warn(`[HeroScene] could not load "${modeId}" mode:`, err);
        return;
      }
      if (disposed || seq !== loadSeq) return;
      const mountMod = () => {
        if (disposed || seq !== loadSeq) return;
        current?.dispose();
        current = null;
        resetCamera();
        ctx.dpr = Math.min(maxDpr, mod.heroDpr ?? maxDpr);
        renderer.setPixelRatio(ctx.dpr);
        ctx.dark = dark;
        try {
          current = mod.hero(ctx);
        } catch (err) {
          console.warn(`[HeroScene] "${modeId}" mode failed to start:`, err);
          return;
        }
        elapsed = reduced ? 8 : 0;
        if (reduced) renderStatic();
        else pendingFadeIn = true;
      };
      if (!current || reduced) {
        mountMod();
      } else {
        canvas.style.transition = "opacity .28s ease";
        canvas.style.opacity = "0";
        swapTimer = window.setTimeout(mountMod, 300);
      }
    };
    const unsubMode = subscribeAnimationMode((m) => activateMode(m));
    const handleResize = () => {
      size.width = Math.max(1, container.clientWidth);
      size.height = Math.max(1, container.clientHeight);
      renderer.setSize(size.width, size.height, false);
      camera.aspect = size.width / size.height;
      camera.position.z = camZ();
      camera.updateProjectionMatrix();
      measureAnchor();
      updateRig(true);
      current?.resize?.();
      if (reduced && current) renderStatic();
    };
    const unsubTheme = observeTheme((nextDark) => {
      dark = nextDark;
      ctx.dark = nextDark;
      current?.setTheme?.(nextDark);
      if (reduced && current) renderStatic();
    });
    const onPointerDown = (e) => {
      if (!current || !running || reduced || !current.pointerDown) return;
      if (e.target?.closest?.('a,button,input,textarea,select,[role="radio"]')) {
        return;
      }
      const rect = host.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      current.pointerDown(
        e.clientX - rect.left - rect.width / 2,
        -(e.clientY - rect.top - rect.height / 2)
      );
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    const ro = new ResizeObserver(() => {
      if (container.clientWidth !== size.width || container.clientHeight !== size.height) {
        handleResize();
      }
      measureAnchor();
    });
    ro.observe(container);
    const gridEl = host.querySelector(avatarSelector)?.closest(".hero-grid");
    if (gridEl) ro.observe(gridEl);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncPlay();
      },
      { threshold: 0 }
    );
    io.observe(host);
    const onVis = () => syncPlay();
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e) => {
      e.preventDefault();
      contextLost = true;
      stop();
    };
    const onRestored = () => {
      contextLost = false;
      syncPlay();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    document.fonts?.ready.then(() => measureAnchor()).catch(() => {
    });
    measureAnchor();
    updateRig(true);
    activateMode(getAnimationMode());
    start();
    return () => {
      disposed = true;
      window.clearTimeout(swapTimer);
      stop();
      unsubMode();
      unsubTheme();
      ptr.dispose();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      current?.dispose();
      current = null;
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }

  // PortF/src/three/createNetworkScene.ts
  var THREE14 = __toESM(require_three(), 1);
  init_util();
  var SECTION_TINTS = {
    education: ["#60a5fa", "#2563eb"],
    skills: ["#2dd4bf", "#0d9488"],
    services: ["#a78bfa", "#7c3aed"],
    experience: ["#818cf8", "#4f46e5"],
    projects: ["#38bdf8", "#0284c7"],
    tools: ["#22d3ee", "#0891b2"],
    publications: ["#22d3ee", "#0891b2"],
    certifications: ["#60a5fa", "#2563eb"],
    contact: ["#2dd4bf", "#0d9488"]
  };
  var SECTION_KEYS = Object.keys(SECTION_TINTS);
  var DEFAULT_SECTION = "education";
  function createNetworkScene(container) {
    const reduced = prefersReducedMotion();
    const coarse = isCoarsePointer();
    const size = {
      width: Math.max(1, window.innerWidth),
      height: Math.max(1, window.innerHeight)
    };
    const maxDpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    const renderer = new THREE14.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "default"
    });
    renderer.setPixelRatio(maxDpr);
    renderer.setSize(size.width, size.height, false);
    renderer.setClearColor(0, 0);
    const canvas = renderer.domElement;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      opacity: "0",
      transition: "opacity 1.4s ease"
    });
    container.appendChild(canvas);
    const camZ = () => size.height / 2 / Math.tan(THREE14.MathUtils.degToRad(20));
    const camera = new THREE14.PerspectiveCamera(40, size.width / size.height, 10, 6e3);
    const resetCamera = () => {
      camera.position.set(0, 0, camZ());
      camera.rotation.set(0, 0, 0);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    resetCamera();
    const scene = new THREE14.Scene();
    let dark = isDarkTheme();
    const ctx = {
      scene,
      camera,
      size,
      dpr: maxDpr,
      compact: coarse || window.innerWidth < 768,
      dark,
      camZ
    };
    let activeSection = DEFAULT_SECTION;
    const curTint = new THREE14.Color();
    const tgtTint = new THREE14.Color();
    const pickTintHex = () => (SECTION_TINTS[activeSection] ?? SECTION_TINTS[DEFAULT_SECTION])[dark ? 0 : 1];
    curTint.set(pickTintHex());
    tgtTint.copy(curTint);
    const homeEl = document.getElementById("home");
    let coveredByHero = false;
    let scrollProgress = 0;
    let lastScrollY = window.scrollY;
    let smoothSpeed = 0;
    const checkHeroCover = () => {
      if (!homeEl) return;
      const rect = homeEl.getBoundingClientRect();
      coveredByHero = rect.top <= 0 && rect.bottom >= window.innerHeight;
    };
    const sampleSections = () => {
      const maxS = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = clamp01(window.scrollY / maxS);
      checkHeroCover();
      let found = DEFAULT_SECTION;
      for (const key of SECTION_KEYS) {
        const el = document.getElementById(key);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          found = key;
        }
      }
      if (found !== activeSection) {
        activeSection = found;
        tgtTint.set(pickTintHex());
      }
    };
    const ptr = createPointerTracker();
    const frame = {
      dt: 0,
      elapsed: 0,
      fade: 1,
      progress: 0,
      pointer: { x: 1e5, y: 1e5, power: 0, active: false },
      sway: { x: 0, y: 0 },
      scrollDelta: 0,
      scrollSpeed: 0,
      tint: curTint
    };
    let hadPtr = false;
    let current = null;
    let elapsed = 0;
    let idleClock = 0;
    let frameTick = 0;
    let raf = 0;
    let prevNow = 0;
    let running = false;
    let contextLost = false;
    let pendingFadeIn = false;
    let disposed = false;
    const stepScene = (dt) => {
      if (!current) return;
      idleClock += dt;
      frameTick++;
      elapsed += dt;
      if (frameTick % 8 === 1) sampleSections();
      curTint.lerp(tgtTint, 1 - Math.exp(-4 * dt));
      const y = window.scrollY;
      const dy = y - lastScrollY;
      lastScrollY = y;
      frame.scrollDelta = clamp(dy, -160, 160);
      smoothSpeed = damp(smoothSpeed, Math.abs(dy) / Math.max(dt, 1e-3), 6, dt);
      frame.scrollSpeed = Math.min(smoothSpeed, 6e3);
      frame.progress = scrollProgress;
      if (ptr.active) {
        const px = ptr.x - size.width / 2;
        const py = -(ptr.y - size.height / 2);
        if (hadPtr) {
          frame.pointer.x = damp(frame.pointer.x, px, 22, dt);
          frame.pointer.y = damp(frame.pointer.y, py, 22, dt);
        } else {
          frame.pointer.x = px;
          frame.pointer.y = py;
        }
      }
      hadPtr = ptr.active;
      frame.pointer.active = ptr.active;
      frame.pointer.power = damp(frame.pointer.power, ptr.active ? 1 : 0, 7, dt);
      const swayX = ptr.active ? clamp(ptr.x / size.width * 2 - 1, -1, 1) : Math.sin(idleClock * 0.11) * 0.4;
      const swayY = ptr.active ? clamp(ptr.y / size.height * 2 - 1, -1, 1) : Math.cos(idleClock * 0.09) * 0.25;
      frame.sway.x = damp(frame.sway.x, swayX, 2.2, dt);
      frame.sway.y = damp(frame.sway.y, swayY, 2.2, dt);
      frame.dt = dt;
      frame.elapsed = elapsed;
      current.update(frame);
    };
    const renderStatic = () => {
      sampleSections();
      curTint.copy(tgtTint);
      stepScene(1e-4);
      renderer.render(scene, camera);
      canvas.style.opacity = "1";
    };
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!current) return;
      const dt = Math.min((now - prevNow) / 1e3, 0.05);
      prevNow = now;
      if (coveredByHero) {
        lastScrollY = window.scrollY;
        checkHeroCover();
        if (!coveredByHero) sampleSections();
      } else {
        stepScene(dt);
        renderer.render(scene, camera);
        if (pendingFadeIn) {
          pendingFadeIn = false;
          canvas.style.transition = "opacity 1s ease";
          canvas.style.opacity = "1";
        }
      }
    };
    const start = () => {
      if (running || reduced || document.hidden || contextLost) return;
      running = true;
      prevNow = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const syncPlay = () => {
      if (!document.hidden && !contextLost) start();
      else stop();
    };
    let loadSeq = 0;
    let swapTimer = 0;
    const activateMode = async (modeId) => {
      const seq = ++loadSeq;
      window.clearTimeout(swapTimer);
      let mod;
      try {
        mod = await loadMode(modeId);
      } catch (err) {
        console.warn(`[Background] could not load "${modeId}" mode:`, err);
        return;
      }
      if (disposed || seq !== loadSeq) return;
      const mountMod = () => {
        if (disposed || seq !== loadSeq) return;
        current?.dispose();
        current = null;
        resetCamera();
        ctx.dpr = Math.min(maxDpr, mod.backgroundDpr ?? maxDpr);
        renderer.setPixelRatio(ctx.dpr);
        ctx.dark = dark;
        try {
          current = mod.background(ctx);
        } catch (err) {
          console.warn(`[Background] "${modeId}" mode failed to start:`, err);
          return;
        }
        elapsed = reduced ? 8 : 0;
        if (reduced) renderStatic();
        else pendingFadeIn = true;
      };
      if (!current || reduced) {
        mountMod();
      } else {
        canvas.style.transition = "opacity .28s ease";
        canvas.style.opacity = "0";
        swapTimer = window.setTimeout(mountMod, 300);
      }
    };
    const unsubMode = subscribeAnimationMode((m) => activateMode(m));
    const unsubTheme = observeTheme((nextDark) => {
      dark = nextDark;
      ctx.dark = nextDark;
      tgtTint.set(pickTintHex());
      current?.setTheme?.(nextDark);
      if (reduced && current) renderStatic();
    });
    const onPointerDown = (e) => {
      if (current && running && !reduced && !coveredByHero && current.pointerDown && (e.button === 0 || e.pointerType !== "mouse")) {
        current.pointerDown(e.clientX - size.width / 2, -(e.clientY - size.height / 2));
      }
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    const onResize = () => {
      size.width = Math.max(1, window.innerWidth);
      size.height = Math.max(1, window.innerHeight);
      renderer.setSize(size.width, size.height, false);
      camera.aspect = size.width / size.height;
      camera.position.z = camZ();
      camera.updateProjectionMatrix();
      current?.resize?.();
      if (reduced && current) renderStatic();
    };
    window.addEventListener("resize", onResize);
    const onVis = () => syncPlay();
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e) => {
      e.preventDefault();
      contextLost = true;
      stop();
    };
    const onRestored = () => {
      contextLost = false;
      syncPlay();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    sampleSections();
    activateMode(getAnimationMode());
    start();
    return () => {
      disposed = true;
      window.clearTimeout(swapTimer);
      stop();
      unsubMode();
      unsubTheme();
      ptr.dispose();
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      current?.dispose();
      current = null;
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }

  // PortF/src/three/createPublicationScene.ts
  var THREE15 = __toESM(require_three(), 1);
  init_util();
  var TWO_PI = Math.PI * 2;
  var TOTAL_NODES = 220;
  var RADIUS = 1.6;
  var HEIGHT = 6;
  var TURNS = 3.5;
  var BASE_POINT_SIZE = 55;
  var DRIFT_SPEED = 0.06;
  var ROT_SPEED = 0.18;
  var PUSH_STRENGTH = 0.28;
  var POINTER_DAMP = 5.5;
  var nodeVertexShader = `
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
  var strandAFragShader = `
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
  var strandBFragShader = `
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
  var rungVertShader = `
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
  var rungFragShader = `
uniform vec3 uColorA;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(uColorA, vAlpha);
}
`;
  function createPublicationScene(container) {
    if (!hasWebGL()) return () => {
    };
    const renderer = new THREE15.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    container.appendChild(renderer.domElement);
    const scene = new THREE15.Scene();
    const camera = new THREE15.PerspectiveCamera(45, 1, 0.1, 50);
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
      uPointer: { value: new THREE15.Vector2(0, 0) },
      uPointerPower: { value: 0 },
      uNodeCount: { value: half },
      uColorA: { value: new THREE15.Color() },
      uColorB: { value: new THREE15.Color() }
    };
    const geoA = new THREE15.BufferGeometry();
    geoA.setAttribute("aIndex", new THREE15.BufferAttribute(idxA, 1));
    geoA.setAttribute("aArm", new THREE15.BufferAttribute(armA, 1));
    geoA.setAttribute("aSeed", new THREE15.BufferAttribute(seedA, 1));
    const matA = new THREE15.ShaderMaterial({
      uniforms,
      vertexShader: nodeVertexShader,
      fragmentShader: strandAFragShader,
      transparent: true,
      depthWrite: false,
      blending: THREE15.AdditiveBlending
    });
    scene.add(new THREE15.Points(geoA, matA));
    const geoB = new THREE15.BufferGeometry();
    geoB.setAttribute("aIndex", new THREE15.BufferAttribute(idxB, 1));
    geoB.setAttribute("aArm", new THREE15.BufferAttribute(armB, 1));
    geoB.setAttribute("aSeed", new THREE15.BufferAttribute(seedB, 1));
    const matB = new THREE15.ShaderMaterial({
      uniforms,
      vertexShader: nodeVertexShader,
      fragmentShader: strandBFragShader,
      transparent: true,
      depthWrite: false,
      blending: THREE15.AdditiveBlending
    });
    scene.add(new THREE15.Points(geoB, matB));
    const geoR = new THREE15.BufferGeometry();
    geoR.setAttribute("aIndex", new THREE15.BufferAttribute(idxR, 1));
    geoR.setAttribute("aArm", new THREE15.BufferAttribute(armR, 1));
    geoR.setAttribute("aSeed", new THREE15.BufferAttribute(seedR, 1));
    const indices = new Uint16Array(TOTAL_NODES);
    for (let i = 0; i < TOTAL_NODES; i++) indices[i] = i;
    geoR.setIndex(new THREE15.BufferAttribute(indices, 1));
    const matR = new THREE15.ShaderMaterial({
      uniforms,
      vertexShader: rungVertShader,
      fragmentShader: rungFragShader,
      transparent: true,
      depthWrite: false,
      blending: THREE15.AdditiveBlending
    });
    scene.add(new THREE15.LineSegments(geoR, matR));
    const applyTheme = (dark) => {
      if (dark) {
        uniforms.uColorA.value.setStyle("#38bdf8");
        uniforms.uColorB.value.setStyle("#818cf8");
      } else {
        uniforms.uColorA.value.setStyle("#2563eb");
        uniforms.uColorB.value.setStyle("#6366f1");
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
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) * 1e-3, 0.05);
      last = now;
      const t = now * 1e-3;
      scene.rotation.y += ROT_SPEED * dt;
      drift = (drift + DRIFT_SPEED * dt) % 1;
      uniforms.uTime.value = t;
      uniforms.uDrift.value = drift;
      if (pointer.moved) {
        const r = container.getBoundingClientRect();
        const nx = ((pointer.x - r.left) / Math.max(r.width, 1) - 0.5) * 2;
        const ny = (-(pointer.y - r.top) / Math.max(r.height, 1) + 0.5) * 2;
        const inside = pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom ? 1 : 0;
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

  // PortF/src/utils/techColor.ts
  function hashTechHue(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
      h = (h * 31 + name.charCodeAt(i)) % 360;
    }
    return h;
  }

  // PortF/portfolio-three-entry.ts
  window.PortfolioEngine = {
    ANIMATION_MODES,
    DEFAULT_ANIMATION_MODE,
    getAnimationMode,
    setAnimationMode,
    subscribeAnimationMode,
    createHeroScene,
    createNetworkScene,
    createPublicationScene,
    hasWebGL,
    onIdle,
    isDarkTheme,
    observeTheme,
    prefersReducedMotion,
    scrollToSection,
    scrollToTop,
    bindHashAnchorClicks,
    hashTechHue
  };
})();
