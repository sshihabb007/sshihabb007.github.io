import * as THREE from 'three';
import { DisposableBag } from './util';

const SPARK_VERT = `
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

const RING_VERT = `
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

const CORE_VERT = `
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

const DOT_FRAG = `
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

const CORE_FRAG = `
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

export const FULL_QUAD_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function createQuadMesh(
  bag: DisposableBag,
  scene: THREE.Scene,
  mat: THREE.Material,
  renderOrder = -1
) {
  const geo = bag.track(new THREE.PlaneGeometry(1, 1));
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = renderOrder;
  bag.mount(scene, mesh);
  return {
    mesh,
    fit: (size: { width: number; height: number }) => mesh.scale.set(size.width, size.height, 1),
  };
}

export class SparkBurst {
  age = 1e9;
  origin = new THREE.Vector2();
  sparkMat: THREE.ShaderMaterial;
  ringMat: THREE.ShaderMaterial;
  coreMat: THREE.ShaderMaterial;

  constructor(
    bag: DisposableBag,
    scene: THREE.Scene,
    dark: boolean,
    opts: {
      count: number;
      gravity: number;
      drag: number;
      speed: [number, number];
      life: [number, number];
      size: number;
      ringSpeed: number;
      coreSize: number;
      hot: THREE.Color;
      cool: THREE.Color;
      ring: THREE.Color;
      shared: { uPixelRatio: { value: number }; uOpacity: { value: number } };
    }
  ) {
    const count = opts.count;
    const vData = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const spd = opts.speed[0] + Math.random() * (opts.speed[1] - opts.speed[0]);
      const life = opts.life[0] + Math.random() * (opts.life[1] - opts.life[0]);
      vData.set([Math.random() * Math.PI * 2, spd, life, Math.random()], i * 4);
    }
    const sparkGeo = bag.track(new THREE.BufferGeometry());
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    sparkGeo.setAttribute('aV', new THREE.BufferAttribute(vData, 4));

    const ringCount = 140;
    const angles = new Float32Array(ringCount);
    for (let i = 0; i < ringCount; i++) angles[i] = (i / ringCount) * Math.PI * 2;
    const ringGeo = bag.track(new THREE.BufferGeometry());
    ringGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ringCount * 3), 3));
    ringGeo.setAttribute('aAng', new THREE.BufferAttribute(angles, 1));

    const coreGeo = bag.track(new THREE.BufferGeometry());
    coreGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));

    const baseUniforms = {
      uOrigin: { value: this.origin },
      uAge: { value: -1 },
      uPixelRatio: opts.shared.uPixelRatio,
      uOpacity: opts.shared.uOpacity,
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
          uCool: { value: opts.cool },
        },
      },
      dark
    );

    this.ringMat = bag.shader(
      {
        vertexShader: RING_VERT,
        fragmentShader: DOT_FRAG,
        uniforms: {
          ...baseUniforms,
          uSpeed: { value: opts.ringSpeed },
          uColor: { value: opts.ring },
        },
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
          uColor: { value: opts.hot },
        },
      },
      dark
    );

    for (const [g, m] of [
      [sparkGeo, this.sparkMat],
      [ringGeo, this.ringMat],
      [coreGeo, this.coreMat],
    ] as const) {
      const p = new THREE.Points(g, m);
      p.frustumCulled = false;
      bag.mount(scene, p);
    }
  }

  fire(x: number, y: number): void {
    this.origin.set(x, y);
    this.age = 0;
  }

  update(dt: number): void {
    this.age += dt;
    const a = this.age < 2 ? this.age : -1;
    this.sparkMat.uniforms.uAge.value = a;
    this.ringMat.uniforms.uAge.value = a;
    this.coreMat.uniforms.uAge.value = a;
  }
}

