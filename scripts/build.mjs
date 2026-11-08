// Builds dist/index.js and its declarations. sucrase is never bundled: it stays an import, installed by npm with its
// own licence (smaltdb ADR 0012). An app bundles it into its own page, with its notice.
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

rmSync('dist', { recursive: true, force: true });
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
await build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  sourcemap: true,
  external: [...Object.keys(pkg.dependencies ?? {})],
  define: { __PLUGIN_VERSION__: JSON.stringify(pkg.version) },
  logLevel: 'warning',
});
writeFileSync(
  'tsconfig.build.json',
  JSON.stringify({
    extends: './tsconfig.json',
    compilerOptions: { noEmit: false, declaration: true, emitDeclarationOnly: true, outDir: 'dist', rootDir: 'src' },
    include: ['src'],
  }),
);
try {
  const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');
  execFileSync(process.execPath, [tsc, '-p', 'tsconfig.build.json'], { stdio: 'inherit' });
} finally {
  rmSync('tsconfig.build.json');
}
console.log(`built ${pkg.name}`);
