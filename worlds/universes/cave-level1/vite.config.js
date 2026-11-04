import { fileURLToPath } from 'node:url';

export default {
  resolve: {
    alias: {
      three: fileURLToPath(new URL('../../renzos-cave/node_modules/three/build/three.module.js', import.meta.url))
    }
  }
};