const esbuild = require('esbuild');
require('dotenv').config()

esbuild.build({
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  outfile: 'public/bundle.js',
  sourcemap: true,
  target: ['es2020'],
  define: {
    'process.env.NODE_ENV': '"development"',
    'import.meta.env.VITE_FIREBASE_API_KEY': `"${process.env.VITE_FIREBASE_API_KEY}"`,
    'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': `"${process.env.VITE_FIREBASE_AUTH_DOMAIN}"`,
    'import.meta.env.VITE_FIREBASE_PROJECT_ID': `"${process.env.VITE_FIREBASE_PROJECT_ID}"`,
    'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': `"${process.env.VITE_FIREBASE_STORAGE_BUCKET}"`,
    'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': `"${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID}"`,
    'import.meta.env.VITE_FIREBASE_APP_ID': `"${process.env.VITE_FIREBASE_APP_ID}"`,
    'import.meta.env.VITE_DATABASE_URL': `"${process.env.VITE_DATABASE_URL}"`,
  },
  loader: {
    '.png': 'file',
    '.svg': 'file',
  }
}).catch(() => process.exit(1));