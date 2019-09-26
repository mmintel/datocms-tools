import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

export default {
  input: 'lib/index.js',
  output: {
    name: 'DatoCMSTools',
    file: 'dist/lib.min.js',
    format: 'umd',
  },
  plugins: [
    terser(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
