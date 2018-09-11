import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default [{
  input: 'node_modules/broadcast-channel/dist/lib/index.js',
  output: {
    file: 'build/bc.js',
    format: 'iife',
    name: 'BroadcastChannel2',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}, {
  input: 'worker.js',
  output: {
    file: 'build/worker.js',
    format: 'iife',
    sourcemap: true
  }
}];
