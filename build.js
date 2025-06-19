const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  outfile: 'public/bundle.js',
  sourcemap: true,
  target: ['es2020'],
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  loader: {
    '.png': 'file',
    '.svg': 'file',
  }
}).catch(() => process.exit(1));