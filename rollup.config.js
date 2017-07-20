import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';
import resolve from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

// Removed 'external-helpers' from .babelrc and add it here
// Otherwise Mocha doesn't work (ReferenceError: babelHelpers is not defined).
// See https://github.com/storybooks/storybook/issues/1320
let rc = babelrc();
rc.exclude = 'node_modules/**';
rc.plugins = rc.plugins || [];
rc.plugins.push('external-helpers');
let plugins = [
  babel(rc),
];

if (process.env.BUILD !== 'production') {
  plugins.push(istanbul({
    exclude: ['test/**/*', 'node_modules/**/*']
  }));
}

export default {
  entry: 'lib/index.js',
  plugins: plugins,
  external: external,
  targets: [
    {
      dest: pkg.main,
      format: 'es',
      moduleName: 'jincu',
	  plugins: [ resolve() ],
      sourceMap: true
    },
    {
      dest: pkg.module,
      format: 'es',
      moduleName: 'jincu',
	  plugins: [ resolve() ],
      sourceMap: true
    }
  ]
};
