<div align="center">
  <h1>🛠 gd-scripts 📦</h1>

  <p>CLI with common scripts for my projects, <strike>copied</strike> inspired from <a href="https://github.com/kentcdodds/kcd-scripts">kcd-scripts</a>.</p>
</div>

<p align="center">
  <a href="https://travis-ci.org/GabrielDuarteM/gd-scripts">
    <img src="https://img.shields.io/travis/GabrielDuarteM/gd-scripts/master.svg" alt="Travis branch">
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  </a>
  <a href="https://www.npmjs.com/package/gd-scripts">
    <img src="https://img.shields.io/npm/dw/gd-scripts.svg" alt="npm downloads">
  </a>
</p>

## Introduction

This is a CLI that abstracts away all configuration for my open source projects
for linting, testing, building, and more.

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
needs. You'll find all available scripts in `src/scripts`.

This project actually dogfoods itself. If you look in the `package.json`, you'll
find scripts with `babel-node src {scriptName}`. This serves as an example of some
of the things you can do with `gd-scripts`.

### Overriding Config

Unlike `react-scripts`, `gd-scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `gd-scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`gd-scripts` will use that instead of it's own internal config. In addition,
`gd-scripts` exposes its configuration so you can use it and override only
the parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

So, if we were to do this for ESLint, you could create an `.eslintrc.js` with the
contents of:

```
module.exports = require("gd-scripts/eslint")
```

> Note: `gd-scripts` intentionally does not merge things for you when you start
> configuring things to make it less magical and more straightforward. Extending
> can take place on your terms. I think this is actually a great way to do this.

## Inspiration

This is inspired by `kcd-scripts`, which is heavy inspired by `react-scripts`. 🤷

## LICENSE

MIT
