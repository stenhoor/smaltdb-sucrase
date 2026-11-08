/**
 * @smaltworks/smaltdb-sucrase: strips TypeScript types at run time, so TypeScript written against smaltdb (smaltdf frames, a
 * script in a TypeScript tab) can run in the page without the TypeScript compiler.
 *
 * It uses sucrase's `typescript` transform only: types, interfaces, `as` and `satisfies`, and imports used only as
 * types are removed, and everything else is left as written. ES modules stay ES modules, modern syntax is not
 * lowered, and line numbers are kept, so an error's line in the output is its line in the source. Types are not
 * checked.
 */
import { transform } from 'sucrase';

declare const __PLUGIN_VERSION__: string | undefined;
const VERSION = typeof __PLUGIN_VERSION__ === 'string' ? __PLUGIN_VERSION__ : '0.0.0';

/** Something that turns TypeScript into JavaScript an app can run. Other transpilers can be offered the same way. */
export interface Transpiler {
  name: string;
  version: string;
  /** JavaScript for `code`. Throws a SyntaxError, with the line and column, for code that doesn't parse. */
  transpile(code: string, options?: TranspileOptions): string;
}

export interface TranspileOptions {
  /** The file name, used in error messages. */
  filename?: string;
  /** Also accept JSX (TSX). Default false: `<T>x` is a type assertion. */
  jsx?: boolean;
}

/** TypeScript to JavaScript: types removed, nothing else changed. */
export function transpile(code: string, options: TranspileOptions = {}): string {
  try {
    return transform(code, {
      transforms: options.jsx ? ['typescript', 'jsx'] : ['typescript'],
      disableESTransforms: true,
      filePath: options.filename,
      production: true,
    }).code;
  } catch (e) {
    throw syntaxError(e, options.filename);
  }
}

/** sucrase's errors as a SyntaxError that says where: "Unexpected token (3:7)" becomes "line 3, column 7: …" (both 1-based). */
function syntaxError(e: unknown, filename: string | undefined): Error {
  if (!(e instanceof Error)) return new SyntaxError(String(e));
  const message = e.message.replace(/^Error transforming [^:]*:\s*/, '');
  const m = /^(.*?)\s*\((\d+):(\d+)\)$/.exec(message);
  const where = m ? `line ${m[2]}, column ${m[3]}` : '';
  const text = m ? m[1] : message;
  const err = new SyntaxError([filename, where].filter(Boolean).join(', ') + (filename || where ? ': ' : '') + text);
  if (m) Object.assign(err, { line: Number(m[2]), column: Number(m[3]) });
  return err;
}

const sucrase: Transpiler = { name: '@smaltworks/smaltdb-sucrase', version: VERSION, transpile };
export default sucrase;
