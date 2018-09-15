#!/usr/bin/env node
import get from 'lodash.get'
import { logMessage } from './utils'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err
})

const pkg = require(`${process.cwd()}/package.json`)

const babelCoreBridgeVersion = '^7.0.0-bridge.0'

const babelCoreDevDep = get(pkg, 'devDependencies.babel-core')
const babelCoreDep = get(pkg, 'dependencies.babel-core')
const babelCoreResolutions = get(pkg, 'resolutions.babel-core')

if (
  (!babelCoreDevDep && !babelCoreDep && !babelCoreResolutions) ||
  (babelCoreDevDep && babelCoreDevDep !== babelCoreBridgeVersion) ||
  (babelCoreDep && babelCoreDep !== babelCoreBridgeVersion) ||
  (babelCoreResolutions && babelCoreResolutions !== babelCoreBridgeVersion)
) {
  logMessage(
    "babel-core should be set to bridge mode to avoid errors. To do that run 'npm i -D babel-core@^7.0.0-bridge.0'",
  )
}

require('./run-script')
