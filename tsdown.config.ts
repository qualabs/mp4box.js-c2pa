import { defineConfig } from 'tsdown';

const PUBLISH_TO_NPM = process.env.PUBLISH_MODE === 'true';

// IIFE build with globalName for tests
const iifeBuild = defineConfig({
  entry: { 'mp4box.all': 'entries/all.ts' },
  target: 'es2017',
  format: ['iife'],
  globalName: 'MP4Box',
  tsconfig: 'tsconfig.build.json',
  sourcemap: true,
  minify: true,
  dts: false,
});

// CJS and ESM builds for distribution
const regularBuild = defineConfig({
  entry: {
    'mp4box.all': 'entries/all.ts',
    'mp4box.simple': 'entries/simple.ts',
  },
  target: 'es2022',
  format: ['cjs', 'esm'],
  tsconfig: 'tsconfig.build.json',
  sourcemap: true,
  minify: false,
  clean: PUBLISH_TO_NPM,
  dts: true,
});

const c2paDemoBuild = defineConfig({
  entry: { 'c2pa.engine': 'demo/c2pa/engine.js' },
  outDir: 'demo/c2pa',
  target: 'es2017',
  format: ['iife'],
  globalName: 'C2PA',
  sourcemap: true,
  minify: true,
  dts: false,
  clean: false,
});

const build: Array<typeof iifeBuild | typeof regularBuild | typeof c2paDemoBuild> = [];
if (PUBLISH_TO_NPM) {
  build.push(regularBuild);
} else {
  build.push(iifeBuild, regularBuild, c2paDemoBuild);
}

export default build;
