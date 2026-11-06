import type { AnimationModeId } from '../animationStore';
import type { ModeModule } from '../util';

export async function loadMode(mode: AnimationModeId): Promise<ModeModule> {
  switch (mode) {
    case 'galaxy':
      return import('./galaxy');
    case 'neural':
      return import('./neural');
    case 'code':
      return import('./code');
    case 'waves':
      return import('./waves');
    case 'warp':
      return import('./warp');
    case 'tunnel':
      return import('./tunnel');
    case 'pulse':
      return import('./pulse');
    case 'thunder':
      return import('./thunder');
    case 'wildfire':
      return import('./wildfire');
    case 'sketch':
      return import('./sketch');
  }
}
