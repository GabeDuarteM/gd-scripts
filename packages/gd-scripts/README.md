<div align="center">
  <h1>🛠 gd-scripts 📦</h1>

  <p>CLI with common scripts to build, test and run my projects, inspired from <a href="https://github.com/kentcdodds/kcd-scripts">kcd-scripts</a>.</p>
</div>

<p align="center">
  <a href="https://github.com/GabrielDuarteM/gd-scripts/actions?query=workflow%3ACI+branch%3Amaster">
    <img src="https://github.com/GabrielDuarteM/gd-scripts/workflows/CI/badge.svg" alt="CI Status">
  </a>
  <a href="https://www.npmjs.com/package/gd-scripts">
    <img src="https://img.shields.io/npm/v/gd-scripts.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/gd-scripts">
    <img src="https://img.shields.io/npm/dw/gd-scripts.svg" alt="npm downloads">
  </a>
</p>

## Introduction

This is a CLI that abstracts away all configuration for my open source projects
including linting, testing, building, running, and more.

## Installation

npm:

```
npm install --save-dev gd-scripts
```

yarn:

```
yarn add -D gd-scripts
```

## Usage

This is a CLI and exposes a bin called `gd-scripts`. I don't really plan on
documenting or testing it super duper well because it's really specific to my
needs. You'll find all available scripts in `packages/gd-scripts/src/scripts`.

This project is also used to run scripts like building and testing on itself.
If you look in the `package.json`, you'll find scripts with `node src {scriptName}`.
This serves as an example of some of the things you can do with `gd-scripts`.

### Configuration

Unlike `react-scripts`, `gd-scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `gd-scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`gd-scripts` will use that instead of it's own internal config. In addition,
`gd-scripts` exposes its configuration so you can use it and override only
the parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

> Note: `gd-scripts` intentionally does not merge things for you when you start
> extending configs to make it less magical and more straightforward. Extending
> can take place on your terms. I think this is actually a great way to do this.

#### eslint

To enable editor support for eslint, you can create a `.eslintrc.js` file on the
root folder, containing:

```
module.exports = require('gd-scripts/eslint')
```

Or if you want to extend it:

```
const baseConfig = require('gd-scripts/eslint')

const extendedConfig = {
  // ...
}

module.exports = {
  ...baseConfig,
  ...extendedConfig,
}
```

#### prettier

To enable editor support for prettier, you can create a `.prettierrc.js` file on the
root folder, containing:

```
module.exports = require('gd-scripts/prettier')
```

#### typescript

To enable editor support for typescript, you can create a `tsconfig.json` file on the
root folder, containing:

```
{
  "extends": "./node_modules/gd-scripts/typescript.json"
}
```

Or if you want to extend it:

```
{
  "extends": "./node_modules/gd-scripts/typescript.json",
  "compilerOptions": {
    // ...
  }
}
```

#### semantic-release

In order to use the default config for semantic-release, you can add a `release.config.js`
file on the root of your project, containing:

```
module.exports = require('gd-scripts/release.config')
```

Or if you want to extend it:

```
const baseConfig = require('gd-scripts/release.config')

const extendedConfig = {
  // ...
}

module.exports = {
  ...baseConfig,
  ...extendedConfig,
}
```

## Inspiration

This is inspired by `kcd-scripts`, which is heavy inspired by `react-scripts`.

## LICENSE

MIT
