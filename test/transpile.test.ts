// Runs against the built package (npm test builds first), imported by its name.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import sucrase, { transpile } from '@smaltworks/smaltdb-sucrase';

const run = (js: string): unknown => new Function(`return (() => { ${js.replace(/^export /gm, '')} })()`)();

test('types are removed and nothing else changes', () => {
  const ts = 'const n: number = 2 as number;\ninterface Row { a: string }\ntype Id = number;\nreturn n satisfies number;';
  const js = transpile(ts);
  assert.doesNotMatch(js, /number|interface|type Id|satisfies/);
  assert.equal(run(js), 2);
  assert.equal(transpile('const a = 1;\nconst b = [a, 2].map((x) => x * 2);'), 'const a = 1;\nconst b = [a, 2].map((x) => x * 2);');
});

test('line numbers are kept, so errors point at the source line', () => {
  const ts = "import type { Frame } from '@smaltdb/df';\ninterface A {\n  a: string;\n}\nconst x = 1;";
  const js = transpile(ts);
  assert.equal(js.split('\n').length, ts.split('\n').length);
  assert.equal(js.split('\n')[4], 'const x = 1;');
});

test('ES modules and modern syntax stay as written; imports used only as types go', () => {
  const js = transpile("import { table, col, type Expr } from '@smaltdb/df';\nimport type { X } from 'y';\nexport const t = table('orders')?.head?.(1) ?? null;\nlet e: Expr | X = col('a');");
  assert.match(js, /^import \{ table, col,\s*\} from '@smaltdb\/df';/);
  assert.doesNotMatch(js, /from 'y'/);
  assert.match(js, /export const t = table\('orders'\)\?\.head\?\.\(1\) \?\? null;/);
});

test('enums and parameter properties become JavaScript', () => {
  assert.equal(run(transpile('enum E { A, B }\nreturn E.B;')), 1);
  assert.equal(run(transpile('class P { constructor(public x: number) {} }\nreturn new P(3).x;')), 3);
});

test('async code and top-level await are left alone', () => {
  assert.equal(transpile('const rows = await db.query(`SELECT 1`);'), 'const rows = await db.query(`SELECT 1`);');
});

test('a syntax error is a SyntaxError with its line and column', () => {
  assert.throws(() => transpile('const a = 1;\nconst b: number = ;'), (e: unknown) => {
    assert.ok(e instanceof SyntaxError);
    assert.equal(e.message, 'line 2, column 19: Unexpected token');
    assert.deepEqual([(e as unknown as { line: number }).line, (e as unknown as { column: number }).column], [2, 19]);
    return true;
  });
  assert.throws(() => transpile('let = ;', { filename: 'tab.ts' }), (e: unknown) => {
    assert.equal(String(e), 'SyntaxError: tab.ts, line 1, column 5: Unexpected token');
    return true;
  });
});

test('<T>x is a type assertion unless jsx is on', () => {
  assert.equal(run(transpile('const v = <number>(1 + 1);\nreturn v;')), 2);
  assert.match(transpile('const el = <div>hi</div>;', { jsx: true }), /createElement|jsx/);
});

test('the default export names the transpiler', () => {
  assert.equal(sucrase.name, '@smaltworks/smaltdb-sucrase');
  assert.match(sucrase.version, /^\d+\.\d+\.\d+$/);
  assert.equal(sucrase.transpile, transpile);
});
