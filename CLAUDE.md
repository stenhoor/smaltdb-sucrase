# CLAUDE.md

This repository is `@smaltworks/smaltdb-sucrase`, an optional plugin for [smaltdb](https://github.com/stenhoor/smaltdb):
it strips TypeScript types at run time with [sucrase](https://github.com/alangpierce/sucrase), so an app can run
TypeScript written against smaltdb (smaltdf frames, a TypeScript tab) without the TypeScript compiler. It does not run
in the engine: an app calls `transpile()` in the page. It exists because of the owner's decision of 2026-11-08
(smalt-brand DECISIONS.md, "Outside code: ask first, and plugins carry it"): outside code a feature needs goes in a
plugin, never in core. Several Claude Code sessions work on the smalt repos in parallel and cannot see each other: this
file is the shared starting point, and its working rules match smaltdb's `CLAUDE.md`.

## Brand: read smalt-brand first

Before changing this repository's site, README, or how it describes the product, read smalt-brand's
[BRAND.md](https://github.com/stenhoor/smalt-brand/blob/main/BRAND.md) (the family table, and "Sites and READMEs", the
standard every product site and README follows) and
[DECISIONS.md](https://github.com/stenhoor/smalt-brand/blob/main/DECISIONS.md). A newer decision there wins over any
copy here: lines and roles change, and a copy taken before the change is out of date.

- Copy brand files and the site kit (`themes/vitepress/`) unchanged. To change them, change smalt-brand first, then
  copy them again.
- A change to this product's status or to what it does comes with a smalt-brand PR that updates smaltworks.dev (its
  status page and this product's page), linked with `Depends on:`.

## Commands

| Command | What it does | When |
|---|---|---|
| `npm ci` | Installs dependencies | First |
| `npm run check` | `npm run typecheck` (builds first: the tests import the built package), then `npm test` (`node --test`) | Before every commit |
| `npm run build` | `dist/index.js` and its type declarations | Packaging checks |

## Rules for this plugin

- One dependency: `sucrase` (MIT), pinned exactly. It is never bundled into `dist/` (the build keeps every dependency
  external), so npm installs it with its own licence. Upgrading it, or adding any dependency, needs the owner's
  agreement.
- Only sucrase's `typescript` transform (and `jsx` when asked): the output keeps ES modules, modern syntax and line
  numbers. Nothing is lowered and types are not checked.
- No smaltdb imports: the plugin works on text, and apps decide where its output runs.
- Don't reformat files with Prettier.

## Working rules for sessions

- One task per branch and PR. Do not add unrelated work to an open PR: it holds up everything else in it.
- Mark unfinished work clearly, and open a PR only when CI passes.
- Read review comments on your PR and answer them with commits that say what they address.
- When a PR depends on another repo's PR, add a line such as `Depends on: stenhoor/smalt-brand#2`.
- **Ask before adding outside code.** Ask the owner, and wait for a yes, before adding a package (a dependency of any
  kind, or a pin in `packed.json`), copying or bundling in someone else's code, or loading code from another site at run
  time (a CDN such as jsDelivr). Say what it is, its licence and size, what it's for, and why our own code can't do it.
  Outside code that a feature needs goes in a plugin, so it is named and optional, never in core.

## Issues

Follow smaltdb's `CLAUDE.md` ("Issues").

## Cross-repo impact

- smaltui pins this repository in its `packed.json` and bundles it, with sucrase and their notices, into
  `vendor/smaltdb-sucrase/` for its TypeScript tabs. After a change here, update that pin.
- Brand assets and voice come from `stenhoor/smalt-brand`. A plugin uses smaltdb's brand, with no mark of its own.
