export type AnimationModeId =
  | 'galaxy'
  | 'neural'
  | 'code'
  | 'waves'
  | 'warp'
  | 'tunnel'
  | 'vortex'
  | 'pulse'
  | 'thunder'
  | 'wildfire';

export interface AnimationModeMeta {
  id: AnimationModeId;
  label: string;
  blurb: string;
}

export const ANIMATION_MODES: AnimationModeMeta[] = [
  { id: 'galaxy', label: 'Galaxy', blurb: 'Orbiting stardust' },
  { id: 'neural', label: 'Neural', blurb: 'Living synapse network' },
  { id: 'code', label: 'Code', blurb: 'Falling code streams' },
  { id: 'waves', label: 'Waves', blurb: 'Rippling particle ocean' },
  { id: 'warp', label: 'Warp', blurb: 'Hyperspace streaks' },
  { id: 'tunnel', label: 'Tunnel', blurb: 'Steer through light rings' },
  { id: 'vortex', label: 'Vortex', blurb: 'Gravity well follows you' },
  { id: 'pulse', label: 'Pulse', blurb: 'Ripples on a dot grid' },
  { id: 'thunder', label: 'Thunderstorm', blurb: 'Click to call lightning' },
  { id: 'wildfire', label: 'Wild Fire', blurb: 'Click to ignite' },
];

export const DEFAULT_ANIMATION_MODE: AnimationModeId = 'galaxy';
const STORAGE_KEY = 'portfolio-animation-mode';

function isValidMode(val: string | null): val is AnimationModeId {
  return !!val && ANIMATION_MODES.some((m) => m.id === val);
}

function readStoredMode(): AnimationModeId | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return isValidMode(val) ? val : null;
  } catch {
    return null;
  }
}

let currentMode: AnimationModeId = readStoredMode() ?? DEFAULT_ANIMATION_MODE;
const listeners = new Set<(mode: AnimationModeId) => void>();

export function getAnimationMode(): AnimationModeId {
  return currentMode;
}

export function setAnimationMode(mode: AnimationModeId): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore storage errors
  }
  if (mode !== currentMode) {
    currentMode = mode;
    listeners.forEach((fn) => fn(mode));
  }
}

export function subscribeAnimationMode(fn: (mode: AnimationModeId) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

