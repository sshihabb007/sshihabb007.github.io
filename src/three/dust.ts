import * as THREE from 'three';
import { DisposableBag, SceneContext, scaleUniforms } from './util';

const VERT = `
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

const FRAG = `
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

export function createDustField(
  ctx: SceneContext,
  bag: DisposableBag,
  opts: {
    count: number;
    color: THREE.Color;
    depth?: number;
    zOffset?: number;
    sizeMin?: number;
    sizeRange?: number;
  }
) {
  const { count, color, depth = 700, zOffset = -120, sizeMin = 1.4, sizeRange = 3.2 } = opts;
  const seeds = new Float32Array(count * 4);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    seeds.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    sizes[i] = sizeMin + Math.pow(Math.random(), 3) * sizeRange;
  }
  const geo = bag.track(new THREE.BufferGeometry());
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

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
        uOpacity: { value: 0 },
      },
    },
    ctx.dark
  );
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  pts.position.z = zOffset;
  bag.mount(ctx.scene, pts);

  return {
    material: mat,
    points: pts,
    update(time: number, reveal: number, opacity: number, rise = 1) {
      mat.uniforms.uTime.value = time;
      mat.uniforms.uReveal.value = reveal;
      mat.uniforms.uOpacity.value = opacity;
      mat.uniforms.uRise.value = rise;
    },
    resize() {
      mat.uniforms.uBox.value = getBox();
      mat.uniforms.uScale.value = ctx.camZ();
    },
  };
}

