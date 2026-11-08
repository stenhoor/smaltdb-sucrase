# @smaltworks/smaltdb-sucrase

<a href="https://smaltworks.dev/stability"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/stenhoor/smalt-brand/main/badges/work-in-progress-on-dark.svg"><img alt="Work in progress. Come build with us." src="https://raw.githubusercontent.com/stenhoor/smalt-brand/main/badges/work-in-progress.svg" height="56"></picture></a>

[smaltworks.dev](https://smaltworks.dev/products/plugins)

Runs TypeScript written against [smaltdb](https://github.com/stenhoor/smaltdb) in the browser, with no TypeScript
compiler: [sucrase](https://github.com/alangpierce/sucrase) removes the types, and everything else stays as written.
ES modules stay ES modules, modern syntax is kept, and line numbers don't move, so an error's line is the line you
wrote. Types are not checked.

```sh
npm install @smaltworks/smaltdb-sucrase   # not on npm yet: pin it to a commit, as the other smaltdb plugins are
```

```ts
import { transpile } from '@smaltworks/smaltdb-sucrase';

const js = transpile("const n: number = 2;\ntable('orders').head(n)");
// "const n = 2;\ntable('orders').head(n)"
```

- `transpile(code, { filename?, jsx? })` returns JavaScript, or throws a `SyntaxError` that says where:
  `tab.ts, line 2, column 19: Unexpected token`, with `line` and `column` on the error.
- The default export is a `Transpiler` (`{ name, version, transpile }`), the shape an app takes when it offers more
  than one way to compile TypeScript.

sucrase is a dependency, never bundled into `dist/`, so npm installs it with its own licence. An app that bundles it
into a page takes about 200 KB (48 KB gzipped) and carries the notices of sucrase and the packages it uses
(`@jridgewell/*`, `lines-and-columns`: MIT; `ts-interface-checker`: Apache-2.0).

## Development

```sh
npm ci
npm run check   # type-check, then build and run the tests against the built package
```

<a href="https://smaltworks.dev"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/stenhoor/smalt-brand/main/badges/a-smaltworks-project-on-dark.svg"><img alt="A smaltworks project" src="https://raw.githubusercontent.com/stenhoor/smalt-brand/main/badges/a-smaltworks-project.svg" height="28"></picture></a>

MIT License.
