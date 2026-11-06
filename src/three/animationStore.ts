export type AnimationModeId =
  | 'galaxy'
  | 'neural'
  | 'code'
  | 'waves'
  | 'warp'
  | 'tunnel'
  | 'pulse'
  | 'thunder'
  | 'wildfire'
  | 'sketch';

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
  { id: 'pulse', label: 'Pulse', blurb: 'Ripples on a dot grid' },
  { id: 'thunder', label: 'Thunderstorm', blurb: 'Click to call lightning' },
  { id: 'wildfire', label: 'Wild Fire', blurb: 'Click to ignite' },
  { id: 'sketch', label: 'Sketch', blurb: 'A quiet crayon doodle' },
];

export const DEFAULT_ANIMATION_MODE: AnimationModeId = 'galaxy';
const STORAGE_KEY = 'portfolio-animation-mode';
const DEFAULT_STORAGE_KEY = 'portfolio-default-animation';

function isValidMode(val: string | null): val is AnimationModeId {
  return !!val && ANIMATION_MODES.some((m) => m.id === val);
}

function readStoredKey(key: string): AnimationModeId | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(key);
    return isValidMode(val) ? val : null;
  } catch {
    return null;
  }
}

function applyModeToDocument(mode: AnimationModeId): void {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.animationMode = mode;
  }
}

let explicitMode: AnimationModeId | null = readStoredKey(STORAGE_KEY);
let currentMode: AnimationModeId =
  explicitMode ?? readStoredKey(DEFAULT_STORAGE_KEY) ?? DEFAULT_ANIMATION_MODE;
applyModeToDocument(currentMode);

const listeners = new Set<(mode: AnimationModeId) => void>();

export function getAnimationMode(): AnimationModeId {
  return currentMode;
}

export function setAnimationMode(mode: AnimationModeId): void {
  explicitMode = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore storage errors
  }
  if (mode !== currentMode) {
    currentMode = mode;
    applyModeToDocument(mode);
    listeners.forEach((fn) => fn(mode));
  }
}

export function subscribeAnimationMode(fn: (mode: AnimationModeId) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
