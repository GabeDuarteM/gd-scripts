<div align="center">
  <h1>typescript-config</h1>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@gabrielduartem/typescript-config">
    <img src="https://img.shields.io/npm/v/@gabrielduartem/typescript-config.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/@gabrielduartem/typescript-config">
    <img src="https://img.shields.io/npm/dw/@gabrielduartem/typescript-config.svg" alt="npm downloads">
  </a>
</p>

## Introduction

The typescript config that I use for most of my projects.

## Installation

npm:

```
npm install --save-dev @gabrielduartem/typescript-config
```

yarn:

```
yarn add -D @gabrielduartem/typescript-config
```

## Usage

This package exposes 2 configs in different paths, choose the one that suits your project:

- For node projects: `@gabrielduartem/typescript-config/base.json`
- For web projects: `@gabrielduartem/typescript-config/web.json`

Create a `tsconfig.json` file on the root of your project, requiring one of the above configs:

```
{
  "extends": "@gabrielduartem/typescript-config/base.json"
}
```

## LICENSE

MIT


