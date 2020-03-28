<div align="center">
  <h1>eslint-config</h1>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@gabrielduartem/eslint-config">
    <img src="https://img.shields.io/npm/v/@gabrielduartem/eslint-config.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/@gabrielduartem/eslint-config">
    <img src="https://img.shields.io/npm/dw/@gabrielduartem/eslint-config.svg" alt="npm downloads">
  </a>
</p>

## Introduction

The eslint config that I use for most of my projects.

## Installation

npm:

```
npm install --save-dev @gabrielduartem/eslint-config
```

yarn:

```
yarn add -D @gabrielduartem/eslint-config
```

## Usage

This package exposes 4 configs in different paths, choose the one that suits your project:

- For node projects using javascript: `@gabrielduartem/eslint-config`
- For web projects using javascript: `@gabrielduartem/eslint-config/web`
- For node projects using typescript: `@gabrielduartem/eslint-config/ts`
- For web projects using typescript: `@gabrielduartem/eslint-config/ts/web`

Create a `.eslintrc.js` file on the root of your project, requiring one of the above configs:

```
module.exports = require('@gabrielduartem/eslint-config')
```

## LICENSE

MIT

