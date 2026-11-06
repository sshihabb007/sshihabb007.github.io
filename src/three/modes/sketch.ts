import type { SceneInstance } from '../util';

const createNoopScene = (): SceneInstance => ({
  update() {},
  setTheme() {},
  dispose() {},
});

export const hero = (): SceneInstance => createNoopScene();
export const background = (): SceneInstance => createNoopScene();

